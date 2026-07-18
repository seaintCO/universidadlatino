alter table public.mu_course_access
  add column if not exists accepted_terms boolean not null default false,
  add column if not exists accepted_refund_policy boolean not null default false,
  add column if not exists accepted_at timestamptz,
  add column if not exists policy_version text;

comment on column public.mu_course_access.accepted_terms is
  'Whether the customer accepted the terms before Stripe Checkout.';
comment on column public.mu_course_access.accepted_refund_policy is
  'Whether the customer accepted the refund policy before Stripe Checkout.';
comment on column public.mu_course_access.accepted_at is
  'UTC timestamp recorded immediately before Stripe Checkout creation.';
comment on column public.mu_course_access.policy_version is
  'Version of the accepted legal policies.';
