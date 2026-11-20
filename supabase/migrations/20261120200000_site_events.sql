-- Visitas e cliques do site da loja (ex.: mobycell.com.br), sem dados pessoais.
-- Gravação: somente pela Edge Function `site-event` (service role).
-- Leitura: usuários da própria empresa (tela /v3/site).
create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  company_id uuid not null references public.companies(id) on delete cascade,
  type text not null check (type in ('page_view','whatsapp_click','call_click','route_click','lead')),
  session_id text not null,
  page text,
  label text,
  source text not null default 'direto',
  utm_source text, utm_medium text, utm_campaign text,
  has_gclid boolean not null default false,
  referrer text,
  device text check (device in ('mobile','desktop')),
  created_at timestamptz not null default now()
);
create index if not exists site_events_company_created_idx on public.site_events (company_id, created_at desc);
create index if not exists site_events_company_type_idx on public.site_events (company_id, type, created_at desc);

alter table public.site_events enable row level security;
drop policy if exists site_events_company_read on public.site_events;
create policy site_events_company_read on public.site_events
  for select
  using (company_id = (select profiles.company_id from public.profiles where profiles.id = auth.uid()));

-- Origem também no lead, para o mesmo filtro da tela.
alter table public.site_leads add column if not exists session_id text;
