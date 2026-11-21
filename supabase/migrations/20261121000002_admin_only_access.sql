-- Only admins can read or change data, enforced by the database itself.
--
-- An admin is a user whose app_metadata.role is 'admin'. Only the service role can
-- set app_metadata (scripts/create-admin.mjs does), so a user who signs up on their
-- own — e.g. because sign-ups were left on in a cloud project — gets nothing.
-- The app additionally checks the ADMIN_EMAILS allowlist (src/lib/auth/admin-emails.ts).

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

drop policy "Admins manage guests" on public.guests;
drop policy "Admins manage responses" on public.responses;
drop policy "Admins manage settings" on public.settings;

create policy "Admins manage guests"
  on public.guests for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins manage responses"
  on public.responses for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins manage settings"
  on public.settings for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
