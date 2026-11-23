-- Personalized links switch (design §12).
-- On (default): guests are added by the couple and answer from their personal link.
-- Off: /invitation takes answers from anyone; each answer adds a guest labelled 'general_link'.
alter table settings
  add column personalized_links boolean not null default true;

create type guest_source as enum ('admin', 'general_link');

alter table guests
  add column added_via guest_source not null default 'admin';
