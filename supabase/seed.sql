-- Local development sample guests (applied by `supabase db reset`).
insert into guests (uuid, name, notes)
values
  ('11111111-1111-4111-8111-111111111111', 'Sample Guest One', null),
  ('22222222-2222-4222-8222-222222222222', 'Sample Guest Two', null),
  ('33333333-3333-4333-8333-333333333333', 'Sample Guest Three', 'Bring a towel for the pool!');
