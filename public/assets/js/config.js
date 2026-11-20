// Configuração pública do site. Nada aqui é segredo.
// Deixe em branco o que ainda não existe: o recurso fica desligado.
window.MOBY = {
  whatsapp: "5541991332951",
  // Endpoint que grava o orçamento como lead no Moby Control (Supabase Edge Function).
  leadEndpoint: "https://jnkqdavjvgmwplzzfldj.supabase.co/functions/v1/site-lead",
  // Google Analytics 4 (ex.: "G-XXXXXXXXXX") e Google Ads (ex.: "AW-1234567890")
  ga4: "",
  adsId: "",
  // Rótulo da conversão de lead no Google Ads (ex.: "AbCdEfGhIj")
  adsLeadLabel: "",
  // Rótulos das conversões de clique na página inicial (WhatsApp e Ligar)
  adsWhatsappLabel: "",
  adsCallLabel: ""
};
