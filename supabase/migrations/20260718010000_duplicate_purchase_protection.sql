-- Canonical entitlement identity: one row per user and course slug forever.
update public.mu_course_access
set course_slug = access_key
where course_slug is null;

alter table public.mu_course_access
  alter column course_slug set not null;

create unique index if not exists mu_course_access_user_course_slug_uidx
  on public.mu_course_access (user_id, course_slug);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'mu_course_access_user_course_slug_key'
      and conrelid = 'public.mu_course_access'::regclass
  ) then
    alter table public.mu_course_access
      add constraint mu_course_access_user_course_slug_key
      unique using index mu_course_access_user_course_slug_uidx;
  end if;
end $$;
