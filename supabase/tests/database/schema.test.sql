begin;
create extension if not exists pgtap with schema extensions;
set search_path = public, extensions;

select plan(12);

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
set local role authenticated;

select lives_ok($$ select * from guests $$, 'authenticated can read guests');

reset role;

select * from finish();
rollback;
