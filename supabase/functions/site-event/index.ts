// Edge Function: recebe visitas e cliques do site da loja e grava em public.site_events.
// Sem dados pessoais: só página, tipo do evento, origem (Google Ads, Meu Negócio...) e um
// identificador aleatório da visita (gerado no navegador e guardado só durante a visita).
// Deploy público (sem JWT): supabase functions deploy site-event --no-verify-jwt
// Secrets opcionais: SITE_COMPANY_ID, ALLOWED_ORIGINS (separados por vírgula).
import { createClient } from "jsr:@supabase/supabase-js@2";

const COMPANY_ID = Deno.env.get("SITE_COMPANY_ID") ?? "a9f9f8e3-6cae-47d1-ad5d-91840e503e94"; // Moby Cell
const ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ??
  "https://mobycell.com.br,https://www.mobycell.com.br").split(",").map((s) => s.trim());
const TYPES = ["page_view", "whatsapp_click", "call_click", "route_click"];
const BOT = /bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|whatsapp/i;
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

const allowed = (o: string | null) => !!o && (ORIGINS.includes(o) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(o));
const cors = (o: string | null) => ({
  "Access-Control-Allow-Origin": allowed(o) ? o! : ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Vary": "Origin",
});
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "") || null;

// De onde veio a visita, em linguagem de lojista.
export function sourceOf(b: Record<string, unknown>): string {
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
  const origin = req.headers.get("origin");
  const h = cors(origin);
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...h, "content-type": "application/json" } });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!allowed(origin) || BOT.test(req.headers.get("user-agent") ?? "")) return json({ ok: true });

  let b: Record<string, unknown>;
  try { b = JSON.parse(await req.text()); } catch { return json({ error: "json" }, 400); }

  const type = String(b.type ?? "");
  const session = clip(b.session_id, 40);
  if (!TYPES.includes(type) || !session || !/^[a-z0-9-]{8,40}$/i.test(session)) return json({ error: "invalid" }, 400);

  // Limite simples contra abuso: até 120 eventos por visita em 1 hora.
  const { count } = await sb.from("site_events").select("id", { count: "exact", head: true })
    .eq("company_id", COMPANY_ID).eq("session_id", session).gte("created_at", new Date(Date.now() - 3600_000).toISOString());
  if ((count ?? 0) >= 120) return json({ ok: true });

  const { error } = await sb.from("site_events").insert({
    company_id: COMPANY_ID, type, session_id: session,
    page: clip(b.page, 200), label: clip(b.label, 80),
    source: sourceOf(b),
    utm_source: clip(b.utm_source, 120), utm_medium: clip(b.utm_medium, 120), utm_campaign: clip(b.utm_campaign, 200),
    has_gclid: !!b.gclid, referrer: clip(b.referrer, 200),
    device: b.device === "mobile" ? "mobile" : "desktop",
  });
  if (error) { console.error(error.message); return json({ error: "db" }, 500); }
  return json({ ok: true });
});
