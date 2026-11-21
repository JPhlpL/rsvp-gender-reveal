begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

select plan(16);

-- Fixtures (run as the test owner, bypassing RLS)
insert into guests (id, uuid, name)
values
  ('aaaaaaaa-0000-4000-8000-000000000001', 'bbbbbbbb-0000-4000-8000-000000000001', 'Test Guest A'),
  ('aaaaaaaa-0000-4000-8000-000000000002', 'bbbbbbbb-0000-4000-8000-000000000002', 'Test Guest B');

insert into responses (guest_id, name, is_attending, guess)
values ('aaaaaaaa-0000-4000-8000-000000000001', 'Test Guest A', true, 'girl');

select results_eq(
  $$ select attendance_status::text, submitted_at is not null
     from guests where id = 'aaaaaaaa-0000-4000-8000-000000000001' $$,
  $$ values ('attending', true) $$,
  'response insert syncs guest'
);

update responses set is_attending = false, guess = null
where guest_id = 'aaaaaaaa-0000-4000-8000-000000000001';

select results_eq(
  $$ select attendance_status::text
     from guests where id = 'aaaaaaaa-0000-4000-8000-000000000001' $$,
  $$ values ('not_attending') $$,
  'response update syncs guest'
);

select throws_ok(
  $$ insert into responses (guest_id, name, is_attending)
     values ('aaaaaaaa-0000-4000-8000-000000000001', 'Again', true) $$,
  '23505', null,
  'second response insert for same guest fails 23505'
);

select throws_ok(
  $$ insert into responses (guest_id, name, is_attending, guess, plus_one_count, plus_one_names)
     values ('aaaaaaaa-0000-4000-8000-000000000002', 'B', true, 'boy', 6, 'x') $$,
  '23514', null,
  'plus_one_count above 5 rejected'
);

select throws_ok(
  $$ insert into responses (guest_id, name, is_attending, guess, plus_one_count, plus_one_names, plus_one_status, plus_one_approved_count)
     values ('aaaaaaaa-0000-4000-8000-000000000002', 'B', true, 'boy', 2, 'x, y', 'approved', 3) $$,
  '23514', null,
  'approved plus-ones above requested rejected'
);

select throws_ok(
  $$ insert into settings (id) values (2) $$,
  '23514', null,
  'settings is a singleton'
);

select results_eq(
  $$ select rsvp_deadline = '2026-12-01T23:59:59+08:00'::timestamptz, rsvp_closed
     from settings where id = 1 $$,
  $$ values (true, false) $$,
  'settings seeded'
);

set local role anon;

select throws_ok($$ select * from guests $$, '42501', null, 'anon cannot read guests');
select throws_ok($$ select * from responses $$, '42501', null, 'anon cannot read responses');
select throws_ok($$ select * from settings $$, '42501', null, 'anon cannot read settings');
select throws_ok(
  $$ insert into responses (guest_id, name, is_attending)
     values ('aaaaaaaa-0000-4000-8000-000000000002', 'Sneaky', true) $$,
  '42501', null,
  'anon cannot insert responses'
);

reset role;

-- A signed-in user who is NOT an admin (e.g. someone who signed up on their own
-- because sign-ups were left on in a cloud project) gets nothing.
select set_config(
  'request.jwt.claims',
  '{"sub":"cccccccc-0000-4000-8000-000000000001","role":"authenticated","email":"stranger@example.com"}',
  true
);
set local role authenticated;

select is((select count(*) from guests), 0::bigint, 'signed-in non-admin sees no guests');
select is((select count(*) from responses), 0::bigint, 'signed-in non-admin sees no responses');
select throws_ok(
  $$ insert into guests (name) values ('Sneaky') $$,
  '42501', null,
  'signed-in non-admin cannot add guests'
);
select results_eq(
  $$ with changed as (update settings set rsvp_closed = true returning 1)
     select count(*) from changed $$,
  $$ values (0::bigint) $$,
  'signed-in non-admin cannot change settings'
);

reset role;

-- An admin created by scripts/create-admin.mjs carries app_metadata.role = 'admin'.
select set_config(
  'request.jwt.claims',
  '{"sub":"cccccccc-0000-4000-8000-000000000002","role":"authenticated","email":"admin@example.com","app_metadata":{"role":"admin"}}',
  true
);
set local role authenticated;

select ok((select count(*) from guests) >= 2, 'admin can read guests');

reset role;

select * from finish();
rollback;
