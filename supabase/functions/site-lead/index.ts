// Edge Function: recebe o orçamento do site e grava em public.site_leads.
// Opcional (supabase secrets set): SITE_COMPANY_ID, ALLOWED_ORIGINS (separados por vírgula).
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já existem no ambiente das Edge Functions.
// Deploy público (sem JWT): supabase functions deploy site-lead --no-verify-jwt
import { createClient } from "jsr:@supabase/supabase-js@2";

// Tenant da loja Moby Cell no Moby Control (pode ser sobrescrito pelo secret SITE_COMPANY_ID).
const COMPANY_ID = Deno.env.get("SITE_COMPANY_ID") ?? "a9f9f8e3-6cae-47d1-ad5d-91840e503e94";
const ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ??
  "https://mobycell.com.br,https://www.mobycell.com.br").split(",").map((s) => s.trim());
const SERVICES = ["celular", "formatacao", "impressao", "personalizados", "outro"];
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && (ORIGINS.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) ? origin : ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Vary": "Origin",
});
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "") || null;

// De onde veio a visita, em linguagem de lojista.
function sourceOf(b: Record<string, unknown>): string {
  const src = String(b.utm_source ?? "").toLowerCase();
  const med = String(b.utm_medium ?? "").toLowerCase();
  const camp = String(b.utm_campaign ?? "").toLowerCase();
  const ref = String(b.referrer ?? "").toLowerCase();
  if (b.gclid || /cpc|ppc|paid|ads/.test(med)) return "google_ads";
  if (/gmn|gmb|gbp|meu.?negocio|perfil/.test(camp + " " + src)) return "google_meu_negocio";
  if (src) return /insta|face|fb|tiktok|whats/.test(src) ? "redes_sociais" : "outros";
  if (/google\./.test(ref)) return "google_busca";
  if (/instagram|facebook|fb\.|tiktok|whatsapp|wa\.me|linktr/.test(ref)) return "redes_sociais";
  if (ref) return "outros";
  return "direto";
}

Deno.serve(async (req) => {
  const h = cors(req.headers.get("origin"));
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...h, "content-type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST") return json({ error: "method" }, 405);

  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "json" }, 400); }

  if (b.website) return json({ ok: true }); // honeypot: finge sucesso

  const name = clip(b.nome, 120);
  const digits = String(b.telefone ?? "").replace(/\D/g, "");
  const phone = digits.startsWith("55") && digits.length >= 12 ? digits.slice(2) : digits;
  const service = String(b.servico ?? "");
  const session = typeof b.session_id === "string" && /^[a-z0-9-]{8,40}$/i.test(b.session_id) ? b.session_id : null;
  if (!name || name.length < 2 || phone.length < 10 || phone.length > 11 || !SERVICES.includes(service)) {
    return json({ error: "invalid" }, 400);
  }

  // limites simples contra abuso
  const since = new Date(Date.now() - 10 * 60_000).toISOString();
  const { count: samePhone } = await sb.from("site_leads").select("id", { count: "exact", head: true })
    .eq("company_id", COMPANY_ID).eq("phone", phone).gte("created_at", since);
  if ((samePhone ?? 0) >= 3) return json({ ok: true });
  const { count: hour } = await sb.from("site_leads").select("id", { count: "exact", head: true })
    .eq("company_id", COMPANY_ID).gte("created_at", new Date(Date.now() - 3600_000).toISOString());
  if ((hour ?? 0) >= 60) return json({ error: "busy" }, 429);

  const { error } = await sb.from("site_leads").insert({
    company_id: COMPANY_ID, name, phone, service,
    device: clip(b.aparelho, 120), message: clip(b.mensagem, 1000),
    landing_page: clip(b.pagina, 200), referrer: clip(b.referrer, 200),
    utm_source: clip(b.utm_source, 120), utm_medium: clip(b.utm_medium, 120),
    utm_campaign: clip(b.utm_campaign, 200), utm_term: clip(b.utm_term, 200),
    utm_content: clip(b.utm_content, 200), gclid: clip(b.gclid, 200),
    session_id: session,
  });
  if (error) { console.error(error.message); return json({ error: "db" }, 500); }
  // Conta o pedido de orçamento junto com as visitas (tela Site do Moby Control).
  if (session) {
    await sb.from("site_events").insert({
      company_id: COMPANY_ID, type: "lead", session_id: session, page: clip(b.pagina, 200), label: service,
      source: sourceOf(b), utm_source: clip(b.utm_source, 120), utm_medium: clip(b.utm_medium, 120),
      utm_campaign: clip(b.utm_campaign, 200), has_gclid: !!b.gclid, referrer: clip(b.referrer, 200),
      device: b.device === "mobile" ? "mobile" : "desktop",
    }).then(() => undefined, () => undefined);
  }
  return json({ ok: true });
});
