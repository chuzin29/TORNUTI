-- ═══════════════════════════════════════════════════════════════════════════
-- Tornuti — esquema de Supabase (público + RLS)
--
-- Cómo usarlo: Supabase Studio → SQL Editor → New query → pegar y RUN.
-- Diseñado para las claves anon (la web lee con RLS activado). No incluye
-- service_role. Idempotente: puedes volver a ejecutarlo sin romper datos.
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Perfiles: espejo público de auth.users ──────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '',
  handle      text not null unique,
  aura        integer not null default 0 check (aura >= 0),
  role        text not null default 'player' check (role in ('player', 'organizer', 'admin')),
  created_at  timestamptz not null default now()
);

-- ── Equipos ────────────────────────────────────────────────────────────────
create table if not exists public.teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  tag         text not null default '',
  created_at  timestamptz not null default now()
);

create table if not exists public.team_members (
  team_id     uuid not null references public.teams (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  role        text not null default 'member' check (role in ('captain', 'member')),
  joined_at   timestamptz not null default now(),
  primary key (team_id, user_id)
);

-- ── Torneos ────────────────────────────────────────────────────────────────
create table if not exists public.tournaments (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  name               text not null,
  summary            text not null default '',
  sport              text not null default '',
  category           text not null default 'deportes',
  city               text not null default '',
  status             text not null default 'abierto'
                     check (status in ('abierto', 'ultimos-cupos', 'en-curso', 'finalizado')),
  starts_at          timestamptz,
  max_participants   integer not null default 16 check (max_participants > 1),
  aura_prize         integer not null default 0 check (aura_prize >= 0),
  created_by         uuid references public.profiles (id) on delete set null,
  created_at         timestamptz not null default now()
);

-- ── Inscripciones (una por torneo y correo) ────────────────────────────────
create table if not exists public.registrations (
  id              uuid primary key default gen_random_uuid(),
  tournament_id   uuid not null references public.tournaments (id) on delete cascade,
  user_id         uuid references public.profiles (id) on delete set null,
  team_id         uuid references public.teams (id) on delete set null,
  name            text not null,
  email           text not null,
  created_at      timestamptz not null default now(),
  unique (tournament_id, lower(email))
);

-- ── Partidos del cuadro ────────────────────────────────────────────────────
create table if not exists public.matches (
  id             uuid primary key default gen_random_uuid(),
  tournament_id  uuid not null references public.tournaments (id) on delete cascade,
  round          integer not null default 1,
  bracket_slot   integer not null default 0,
  home_team      uuid references public.teams (id) on delete set null,
  away_team      uuid references public.teams (id) on delete set null,
  home_score     integer not null default 0 check (home_score >= 0),
  away_score     integer not null default 0 check (away_score >= 0),
  status         text not null default 'programado'
                 check (status in ('programado', 'en-juego', 'finalizado')),
  scheduled_at   timestamptz,
  created_at     timestamptz not null default now()
);

-- ── Aura: asientos contables que alimentan el ranking ──────────────────────
create table if not exists public.aura_entries (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  tournament_id  uuid references public.tournaments (id) on delete set null,
  delta          integer not null,
  reason         text not null default '',
  created_at     timestamptz not null default now()
);

-- ── Logros ─────────────────────────────────────────────────────────────────
create table if not exists public.achievements (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  code           text not null,
  label          text not null default '',
  tournament_id  uuid references public.tournaments (id) on delete set null,
  earned_at      timestamptz not null default now(),
  unique (user_id, code)
);

-- ═══════════════════════════════════════════════════════════════════════════
-- Catálogo de torneos de demostración (marcados como demo en el resumen)
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.tournaments (id, slug, name, summary, sport, category, city, status, starts_at, max_participants, aura_prize)
values
  ('11111111-1111-1111-1111-111111111111', 'liga-empresas-q3', 'Liga interna de empresas Q3', 'Demostración: ocho equipos, eliminatoria directa y marcador en vivo.', 'Deportes', 'empresas', 'San Salvador', 'abierto', now() + interval '9 days', 16, 2400),
  ('22222222-2222-2222-2222-222222222222', 'copa-basquet-3x3', 'Copa de Basquet 3x3', 'Demostración: cancha abierta, el cuadro se arma solo al inscibir.', 'Basquetbol', 'deportes', 'Santa Ana', 'abierto', now() + interval '14 days', 12, 1800),
  ('33333333-3333-3333-3333-333333333333', 'texto-de-valorant', 'Copa de Valorant', 'Demostración: torneo de gaming con acta limpia y fases por rondas.', 'Valorant', 'gaming', 'San Miguel', 'en-curso', now() - interval '2 days', 8, 3200)
on conflict (id) do nothing;

-- ═══════════════════════════════════════════════════════════════════════════
-- Disparadores: crear perfil al registrarse y mantener el Aura al día
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, handle)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'u-' || split_part(new.email, '@', 1) || substr(new.id::text, 1, 4)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.sync_aura()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles p
     set aura = (select coalesce(sum(delta), 0) from public.aura_entries where user_id = p.id)
   where p.id = new.user_id;
  return new;
end;
$$;

drop trigger if exists aura_after_insert on public.aura_entries;
create trigger aura_after_insert
  after insert on public.aura_entries
  for each row execute function public.sync_aura();

-- ═══════════════════════════════════════════════════════════════════════════
-- RLS: lectura pública de catálogo, escritura solo del dueño o de sí mismo
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.profiles      enable row level security;
alter table public.teams         enable row level security;
alter table public.team_members  enable row level security;
alter table public.tournaments   enable row level security;
alter table public.registrations enable row level security;
alter table public.matches       enable row level security;
alter table public.aura_entries  enable row level security;
alter table public.achievements  enable row level security;

-- perfiles: cualquiera puede ver (el ranking es público); se edita a sí
drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read" on public.profiles
  for select using (true);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

-- equipos: lectura pública, alta a cualquier autenticado, edición del fundador
drop policy if exists "teams_public_read" on public.teams;
create policy "teams_public_read" on public.teams
  for select using (true);

drop policy if exists "teams_auth_create" on public.teams;
create policy "teams_auth_create" on public.teams
  for insert to authenticated with check (true);

drop policy if exists "teams_member_edit" on public.teams;
create policy "teams_member_edit" on public.teams
  for update using (
    exists (select 1 from public.team_members m where m.team_id = id and m.user_id = auth.uid() and m.role = 'captain')
  );

drop policy if exists "team_members_public_read" on public.team_members;
create policy "team_members_public_read" on public.team_members
  for select using (true);

drop policy if exists "team_members_self_join" on public.team_members;
create policy "team_members_self_join" on public.team_members
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "team_members_self_leave" on public.team_members;
create policy "team_members_self_leave" on public.team_members
  for delete using (user_id = auth.uid());

-- torneos: catálogo legible por todos; cada organizador gestiona lo suyo
drop policy if exists "tournaments_public_read" on public.tournaments;
create policy "tournaments_public_read" on public.tournaments
  for select using (true);

drop policy if exists "tournaments_owner_write" on public.tournaments;
create policy "tournaments_owner_write" on public.tournaments
  for insert to authenticated with check (created_by = auth.uid());

drop policy if exists "tournaments_owner_update" on public.tournaments;
create policy "tournaments_owner_update" on public.tournaments
  for update using (created_by = auth.uid());

drop policy if exists "tournaments_owner_delete" on public.tournaments;
create policy "tournaments_owner_delete" on public.tournaments
  for delete using (created_by = auth.uid());

-- inscripciones: lista pública para llenar cupos; cada uno inscribe al correo
-- con el que está autenticado (o anónimo con cupo libre, para demo).
drop policy if exists "registrations_public_read" on public.registrations;
create policy "registrations_public_read" on public.registrations
  for select using (true);

drop policy if exists "registrations_anyone_insert" on public.registrations;
create policy "registrations_anyone_insert" on public.registrations
  for insert with check (
    user_id is null or user_id = auth.uid()
  );

drop policy if exists "registrations_owner_delete" on public.registrations;
create policy "registrations_owner_delete" on public.registrations
  for delete using (user_id = auth.uid());

-- partidos: lectura pública; escribe el organizador del torneo
drop policy if exists "matches_public_read" on public.matches;
create policy "matches_public_read" on public.matches
  for select using (true);

drop policy if exists "matches_owner_write" on public.matches;
create policy "matches_owner_write" on public.matches
  for all using (
    exists (select 1 from public.tournaments t where t.id = tournament_id and t.created_by = auth.uid())
  );

-- aura y logros: lectura pública (el ranking hila con la portada); nadie
-- escribe directo: los alimenta el backend (`service_role`) vía integrales.
drop policy if exists "aura_public_read" on public.aura_entries;
create policy "aura_public_read" on public.aura_entries
  for select using (true);

drop policy if exists "achievements_public_read" on public.achievements;
create policy "achievements_public_read" on public.achievements
  for select using (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- Índices de servicio
-- ═══════════════════════════════════════════════════════════════════════════

create index if not exists tournaments_status_starts  on public.tournaments (status, starts_at);
create index if not exists registrations_tournament   on public.registrations (tournament_id);
create index if not exists matches_tournament_round   on public.matches (tournament_id, round);
create index if not exists aura_entries_user_created  on public.aura_entries (user_id, created_at desc);
