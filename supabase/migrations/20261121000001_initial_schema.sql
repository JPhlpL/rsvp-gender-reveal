-- Gender Reveal & Baby Shower RSVP: initial schema.
-- Guests never touch these tables directly: guest pages go through server code
-- using the service role. Only authenticated admins have table access.

-- Enums ---------------------------------------------------------------------
create type attendance_status as enum ('pending', 'attending', 'not_attending');
create type rsvp_guess as enum ('girl', 'boy');
create type plus_one_status as enum ('none', 'pending', 'approved', 'declined');

-- Shared trigger: keep updated_at current ------------------------------------
create or replace function update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Guests (one row per invitation link) ---------------------------------------
create table guests (
  id uuid primary key default gen_random_uuid(),
  uuid uuid not null unique default gen_random_uuid(), -- code in the guest's link
  name text not null,
  email text,
  phone text,
  notes text, -- admin note, shown to this guest only
  attendance_status attendance_status not null default 'pending',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger guests_set_updated_at
  before update on guests
  for each row execute function update_updated_at_column();

-- Responses (one per guest) ---------------------------------------------------
create table responses (
  guest_id uuid primary key references guests (id) on delete cascade,
  name text not null,
  is_attending boolean not null,
  guess rsvp_guess,
  plus_one_count integer not null default 0
    constraint plus_one_count_range check (plus_one_count between 0 and 5),
  plus_one_names text,
  plus_one_status plus_one_status not null default 'none',
  plus_one_approved_count integer
    constraint plus_one_approved_range check (
      plus_one_approved_count is null
      or plus_one_approved_count between 0 and plus_one_count
    ),
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger responses_set_updated_at
  before update on responses
  for each row execute function update_updated_at_column();

-- Keep guests.attendance_status / submitted_at in step with responses.
-- SECURITY DEFINER so the update applies regardless of the caller's RLS.
create or replace function sync_guest_from_response()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update guests
  set
    attendance_status = case
      when new.is_attending then 'attending'::attendance_status
      else 'not_attending'::attendance_status
    end,
    submitted_at = coalesce(submitted_at, now())
  where id = new.guest_id;

  return new;
end;
$$;

create trigger responses_sync_guest
  after insert or update of is_attending on responses
  for each row execute function sync_guest_from_response();

-- Settings (single row) -------------------------------------------------------
create table settings (
  id smallint primary key default 1
    constraint settings_singleton check (id = 1),
  rsvp_deadline timestamptz, -- null = no deadline
  rsvp_closed boolean not null default false,
  updated_at timestamptz not null default now()
);

create trigger settings_set_updated_at
  before update on settings
  for each row execute function update_updated_at_column();

insert into settings (id, rsvp_deadline, rsvp_closed)
values (1, '2026-12-01T23:59:59+08:00', false);

-- Row Level Security ----------------------------------------------------------
alter table guests enable row level security;
alter table responses enable row level security;
alter table settings enable row level security;

-- The anon key gets nothing at all.
revoke all on table guests, responses, settings from anon;

create policy "Admins manage guests"
  on guests for all to authenticated
  using (true) with check (true);

create policy "Admins manage responses"
  on responses for all to authenticated
  using (true) with check (true);

create policy "Admins manage settings"
  on settings for all to authenticated
  using (true) with check (true);
