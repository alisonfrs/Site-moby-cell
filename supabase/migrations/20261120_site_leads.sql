-- Leads vindos do site da Moby Cell (formulário de orçamento).
-- Gravação: somente pela Edge Function `site-lead` (service role).
-- Leitura/edição: usuários da própria empresa no Moby Control (mesmo padrão de isolamento das outras tabelas).
create table if not exists public.site_leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  phone text not null,
  service text not null check (service in ('celular','formatacao','impressao','personalizados','outro')),
  device text,
  message text,
  status text not null default 'novo' check (status in ('novo','contatado','orcamento_enviado','convertido','perdido')),
  source text not null default 'site',
  landing_page text,
  utm_source text, utm_medium text, utm_campaign text, utm_term text, utm_content text,
  gclid text,
  referrer text,
  client_id uuid references public.clients(id) on delete set null,
  notes text,
  contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists site_leads_company_created_idx on public.site_leads (company_id, created_at desc);
create index if not exists site_leads_company_phone_idx on public.site_leads (company_id, phone);

alter table public.site_leads enable row level security;
create policy site_leads_company_isolation on public.site_leads
  for all
  using (company_id = (select profiles.company_id from public.profiles where profiles.id = auth.uid()))
  with check (company_id = (select profiles.company_id from public.profiles where profiles.id = auth.uid()));
