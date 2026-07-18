-- CursoCapital purchase identity, idempotency, and ownership boundary.
create extension if not exists pgcrypto;

alter table public.mu_profiles
  add column if not exists stripe_customer_id text;
create unique index if not exists mu_profiles_stripe_customer_id_key
  on public.mu_profiles (stripe_customer_id) where stripe_customer_id is not null;

alter table public.mu_course_access
  add column if not exists course_slug text,
  add column if not exists stripe_checkout_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists stripe_customer_id text,
  add column if not exists amount_total bigint,
  add column if not exists currency text,
  add column if not exists purchased_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

create unique index if not exists mu_course_access_user_access_key_key
  on public.mu_course_access (user_id, access_key);
create unique index if not exists mu_course_access_checkout_session_key
  on public.mu_course_access (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;
create index if not exists mu_course_access_active_user_idx
  on public.mu_course_access (user_id) where status = 'active';

create or replace function public.handle_mu_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.mu_profiles (id, email, first_name, last_name, display_name, updated_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    now()
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = coalesce(public.mu_profiles.first_name, excluded.first_name),
    last_name = coalesce(public.mu_profiles.last_name, excluded.last_name),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_mu_profile on auth.users;
create trigger on_auth_user_created_mu_profile
  after insert or update of email, raw_user_meta_data on auth.users
  for each row execute procedure public.handle_mu_new_user();

alter table public.mu_profiles enable row level security;
alter table public.mu_course_access enable row level security;

drop policy if exists "profiles_select_own" on public.mu_profiles;
create policy "profiles_select_own" on public.mu_profiles
  for select to authenticated using (id = (select auth.uid()));
drop policy if exists "profiles_update_own" on public.mu_profiles;
create policy "profiles_update_own" on public.mu_profiles
  for update to authenticated using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
drop policy if exists "course_access_select_own" on public.mu_course_access;
create policy "course_access_select_own" on public.mu_course_access
  for select to authenticated using (user_id = (select auth.uid()));

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'mu_lesson_progress', 'mu_progress', 'mu_lesson_notes',
    'mu_notes', 'mu_lesson_bookmarks'
  ] loop
    if to_regclass('public.' || table_name) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      execute format('drop policy if exists %I on public.%I', table_name || '_own_all', table_name);
      execute format(
        'create policy %I on public.%I for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))',
        table_name || '_own_all', table_name
      );
    end if;
  end loop;
end $$;

-- Content is readable only to admins or owners of the corresponding product.
-- Mutation endpoints additionally re-check lesson ownership server-side.
