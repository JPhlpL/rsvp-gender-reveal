-- "Reset answer" on the dashboard deletes a guest's response. Put the guest back to
-- "no answer yet" so the status, the stats and "Answered at" stay correct.
-- SECURITY DEFINER for the same reason as sync_guest_from_response: the update must
-- apply regardless of the caller's RLS.
create or replace function reset_guest_after_response_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update guests
  set
    attendance_status = 'pending'::attendance_status,
    submitted_at = null
  where id = old.guest_id;

  return old;
end;
$$;

create trigger responses_reset_guest
  after delete on responses
  for each row execute function reset_guest_after_response_delete();
