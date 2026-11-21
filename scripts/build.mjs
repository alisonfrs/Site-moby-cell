// Gera as páginas HTML em /public. Uso: node scripts/build.mjs
// Todo o conteúdo do site está neste arquivo. Regras do dossiê da Moby Cell:
// sem preços de impressão/xerox/plastificação, sem camisetas, formatação como único serviço de computador,
// sem promessas de prazo/horário que não foram confirmados, sem dados financeiros internos.
// Garantia confirmada pelo dono em 20/11/2026: de até 1 ano, conforme a peça e o serviço (sempre com essa ressalva).
// Direção visual: Swiss (ver public/assets/css/style.css).
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const V = Date.now().toString(36);
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const SITE = "https://www.mobycell.com.br";
const WA = "5541991332951";
const MAPS = "https://www.google.com/maps/place/Moby+Cell+Assistencia+t%C3%A9cnica+Celulares/@-25.5840198,-49.3230281,17z/data=!4m6!3m5!1s0x94dcfc2a0990a4cf:0x7839fd71f4723732!8m2!3d-25.5840247!4d-49.3204532!16s%2Fg%2F11q484tv8z";
const ADDR = { street: "Rua Ângelo Tozim, 239", hood: "Campo de Santana", city: "Curitiba", uf: "PR", cep: "81490-030" };
// Horários conforme o Perfil da Empresa no Google (conferido em 20/11/2026). Atualizar aqui se mudarem.
const HOURS = [["Segunda a sexta", "9h30 às 17h"], ["Sábado", "9h30 às 13h"], ["Domingo", "Fechado"]];
const NB = (s) => s.replace(/(\d)h(\d*) às (\d)/g, "$1h$2&nbsp;às&nbsp;$3");
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const IMG = "/assets/img/slots/";
const TEL = "+5541991332951";
const INSTAGRAM = "https://www.instagram.com/mobycell_/";
// Bairros vizinhos citados no site e nos dados estruturados (SEO local).
const HOODS = ["Campo de Santana", "Tatuquara", "Caximba", "Umbará"];
const placeLD = () => [...HOODS.map((n) => ({ "@type": "Place", name: `${n}, Curitiba – PR` })), { "@type": "City", name: "Curitiba" }];
const pad = (n) => String(n).padStart(2, "0");

const I = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  pin: '<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/>',
  shield: '<path d="M12 3 4 6v5c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-3z"/><path d="m9 12 2 2 4-4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5.2A8.5 8.5 0 1 1 21 11.5z"/>',
};
const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false">${I[n]}</svg>`;

const TNAV = [
  ["/", "Início"],
  ["/conserto-de-celular", "Assistência Técnica"],
  ["/formatacao-notebook-computador", "Formatação"],
  ["/impressao-xerox-plastificacao", "Impressões"],
  ["/personalizados", "Personalizados"],
  ["/#servicos", "Acessórios"],
  ["/contato", "Contato"],
];
const WAI = (n) => `<svg width="${n}" height="${n}" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C8.86 3 3.04 8.82 3.04 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A12.94 12.94 0 0 0 16.04 29C23.22 29 29 23.18 29 16S23.22 3 16.04 3zm0 23.62c-1.98 0-3.92-.53-5.61-1.54l-.4-.24-3.97 1.04 1.06-3.87-.26-.4a10.6 10.6 0 0 1-1.63-5.6c0-5.86 4.77-10.63 10.64-10.63 5.86 0 10.6 4.77 10.6 10.63 0 5.86-4.77 10.61-10.43 10.61zm5.83-7.95c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37z"/></svg>`;
// Fotos das aberturas: recortes da arte nova (public/assets/img/home). "contain" = foto de produto sobre fundo escuro.
const HERO_ALT = {
  "hero-celular.jpg": "Celular aberto na bancada da Moby Cell durante conserto, no Campo de Santana, Curitiba",
  "hero-loja.jpg": "Bancada de assistência técnica de celulares da Moby Cell",
  "hero-formatacao.jpg": "Notebook formatado e pronto para uso na Moby Cell",
  "hero-impressao.jpg": "Impressora colorida para impressões, xerox e fotos na Moby Cell",
  "hero-personalizados.jpg": "Canecas personalizadas com foto, logomarca e frase feitas na Moby Cell",
};
const HERO_IMG = {
  "hero-celular.jpg": ["hero.webp", 1198, 864, false],
  "hero-loja.jpg": ["hero.webp", 1198, 864, false],
  "hero-formatacao.jpg": ["notebook.webp", 416, 242, true],
  "hero-impressao.jpg": ["impressora.webp", 402, 242, true],
  "hero-personalizados.jpg": ["canecas.webp", 1100, 376, true],
};
const NAV = [
  ["/conserto-de-celular", "Conserto de celular"],
  ["/formatacao-notebook-computador", "Formatação"],
  ["/impressao-xerox-plastificacao", "Impressões"],
  ["/personalizados", "Personalizados"],
  ["/sobre", "Sobre"],
  ["/contato", "Contato"],
];
const SERV_EXTRA = [
  { path: "/troca-de-tela-celular", name: "Troca de tela de celular", type: "Troca de tela de celular" },
  { path: "/troca-de-bateria-celular", name: "Troca de bateria de celular", type: "Troca de bateria de celular" },
  { path: "/conector-de-carga-celular", name: "Conserto do conector de carga", type: "Troca de conector de carga de celular" },
];
const SERV = [
  { path: "/conserto-de-celular", name: "Conserto de celular", type: "Conserto de celular" },
  { path: "/formatacao-notebook-computador", name: "Formatação de notebook e computador", type: "Formatação de notebook e computador" },
  { path: "/impressao-xerox-plastificacao", name: "Impressões e serviços rápidos", type: "Impressão, xerox, digitalização e plastificação" },
  { path: "/personalizados", name: "Personalizados", type: "Produtos personalizados" },
];

const reviews = [
  ["Selene Domingues", "abr. de 2025", "Excelente trabalho, meu celular foi detonado e voltou brilhando. E o Alisson é um rapaz simpático, atento a todas as nossas perguntas."],
  ["Edina Oliveira", "abr. de 2025", "Ótimo atendimento, agilidade e qualidade!"],
  ["Jeverton", "abr. de 2025", "Extremamente atencioso."],
];

function localBusiness(full = false) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ElectronicsStore"],
    "@id": `${SITE}/#loja`,
    name: "Moby Cell",
    ...(full ? { alternateName: "Moby Cell Assistência técnica Celulares" } : {}),
    url: SITE,
    image: `${SITE}/assets/img/og.png`,
    logo: `${SITE}/assets/img/logo-512.png`,
    telephone: "+5541991332951",
    description: "Conserto de celular, formatação de notebook e computador, impressões, xerox, plastificação, produtos personalizados e ponto de atendimento Shopee no Campo de Santana, Curitiba.",
    address: { "@type": "PostalAddress", streetAddress: ADDR.street, addressLocality: ADDR.city, addressRegion: ADDR.uf, postalCode: ADDR.cep, addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: -25.5840247, longitude: -49.3204532 },
    areaServed: placeLD(),
    hasMap: MAPS,
    priceRange: "$$",
    currenciesAccepted: "BRL",
    knowsAbout: ["Conserto de celular", "Troca de tela de celular", "Troca de bateria de celular", "Troca de conector de carga", "Formatação de notebook e computador", "Impressão e xerox", "Canecas e brindes personalizados"],
    paymentAccepted: "Dinheiro, cartão, Pix",
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:30", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:30", closes: "13:00" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog", name: "Serviços da Moby Cell",
      itemListElement: [...SERV, ...SERV_EXTRA].map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.type } })),
    },
    sameAs: [MAPS, INSTAGRAM],
  };
}
const faqLD = (items) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
const crumbLD = (items) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([n, p], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE + p })) });
const serviceLD = (name, type, description = "") => ({ "@context": "https://schema.org", "@type": "Service", name, serviceType: type, ...(description ? { description } : {}), provider: { "@id": `${SITE}/#loja` }, areaServed: placeLD() });

const faq = (items) => `<div class="faq">${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>`;
const rows = (items) => `<ol class="rows">${items.map(([t, d], i) => `<li><span class="n">${pad(i + 1)}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join("")}</ol>`;
const folio = (n, label, right = "Moby Cell · Campo de Santana, Curitiba") => `<div class="folio"><span><b>${pad(n)}</b>&ensp;${label}</span><span>${right}</span></div>`;
const crumbs = (name) => `<nav class="crumbs wrap" aria-label="Trilha"><a href="/">Início</a> / ${name}</nav>`;
const hoursHtml = () => HOURS.map(([d, h]) => `${d}: ${NB(h)}`).join("<br>");
const facts = () => `<dl class="facts">
  <div><dt>Endereço</dt><dd>${ADDR.street}<br>${ADDR.hood}, ${ADDR.city}–${ADDR.uf}</dd></div>
  <div><dt>Horário</dt><dd>${hoursHtml()}</dd></div>
  <div><dt>WhatsApp</dt><dd><a href="${wa("Olá! Vim pelo site da Moby Cell.")}" data-track="faixa-info">(41)&nbsp;99133-2951</a></dd></div>
  <div><dt>Pagamento</dt><dd>Dinheiro, cartão e&nbsp;Pix</dd></div>
</dl>`;
const more = (current) => `<p class="more">${SERV.filter((s) => s.path !== current).map((s) => `<a href="${s.path}">${s.name}</a>`).join("")}</p>`;

function fld(id, label, control, hint = "") {
  return `<div class="fld"><label for="${id}">${label}${hint ? `<span class="hint">${hint}</span>` : ""}</label>${control}<p class="ferr" id="${id}-e" role="alert"></p></div>`;
}
const SEL = (id, name, opts, req = true) => `<select id="${id}" name="${name}"${req ? " data-req data-err=\"Escolha uma opção.\"" : ""} aria-describedby="${id}-e"><option value="">Selecione</option>${opts.map((o) => `<option>${o}</option>`).join("")}</select>`;
function form(service = "", id = "form", title = "Peça seu orçamento", sub = "Responda em 1 minuto. Depois abrimos o WhatsApp com a sua mensagem pronta.") {
  const o = (v, t) => `<option value="${v}"${v === service ? " selected" : ""}>${t}</option>`;
  const g = (k, inner) => `<div class="grp" data-for="${k}" hidden>${inner}</div>`;
  return `<div class="formBox" id="${id}">
  <h2>${title}</h2><p class="muted">${sub}</p>
  <form class="lead" novalidate>
    ${fld(`${id}-n`, "Seu nome", `<input id="${id}-n" name="nome" autocomplete="name" data-req data-err="Informe seu nome." aria-describedby="${id}-n-e">`)}
    ${fld(`${id}-s`, "O que você precisa?", `<select id="${id}-s" name="servico" data-req data-err="Escolha o serviço." aria-describedby="${id}-s-e"><option value="">Selecione</option>${o("celular", "Conserto de celular")}${o("formatacao", "Formatação de notebook ou computador")}${o("impressao", "Impressão, xerox ou plastificação")}${o("personalizados", "Produtos personalizados")}${o("outro", "Outro assunto")}</select>`)}
    ${g("celular", fld(`${id}-cm`, "Modelo do celular", `<input id="${id}-cm" name="modelo" autocomplete="off" data-req data-err="Informe o modelo do celular." placeholder="Ex.: Galaxy A15, iPhone 11…" aria-describedby="${id}-cm-e">`) + fld(`${id}-cp`, "Qual é o problema?", `<textarea id="${id}-cp" name="problema" data-req data-err="Descreva o problema." placeholder="Ex.: tela trincada, bateria não dura, não carrega…" aria-describedby="${id}-cp-e"></textarea>`))}
    ${g("formatacao", fld(`${id}-ft`, "Equipamento", SEL(`${id}-ft`, "equipamento", ["Notebook", "Computador (desktop)"])) + fld(`${id}-fm`, "Marca e modelo", `<input id="${id}-fm" name="modelo" autocomplete="off" placeholder="Ex.: Dell Inspiron 15…" aria-describedby="${id}-fm-e">`, "opcional") + `<p class="note">Fazemos somente <b>formatação</b>. Faça o backup dos seus arquivos antes: ele não está incluído.</p>`)}
    ${g("impressao", fld(`${id}-it`, "O que você precisa?", SEL(`${id}-it`, "tipo", ["Impressão de documento", "Impressão de foto", "Xerox ou digitalização", "Plastificação", "Foto 3×4", "Outro"])) + fld(`${id}-iq`, "Quantidade aproximada", `<input id="${id}-iq" name="quantidade" autocomplete="off" inputmode="numeric" placeholder="Ex.: 10 folhas…" aria-describedby="${id}-iq-e">`, "opcional") + `<p class="note">Depois do envio, abrimos o WhatsApp para você <b>mandar o arquivo</b>. Os valores são informados no atendimento.</p>`)}
    ${g("personalizados", fld(`${id}-pp`, "Produto", SEL(`${id}-pp`, "produto", ["Caneca", "Azulejo", "Copo ou taça", "Chaveiro", "Adesivo ou etiqueta", "Cartão de visita ou panfleto", "Brinde ou lembrança", "Outro"])) + `<div class="row2">${fld(`${id}-pq`, "Quantidade", `<input id="${id}-pq" name="quantidade" autocomplete="off" inputmode="numeric" data-req data-err="Informe a quantidade." placeholder="Ex.: 1, 20, 100…" aria-describedby="${id}-pq-e">`)}${fld(`${id}-pd`, "Data desejada", `<input id="${id}-pd" name="data" autocomplete="off" placeholder="Ex.: dia 15…" aria-describedby="${id}-pd-e">`, "opcional")}</div>` + fld(`${id}-pm`, "Descreva a personalização", `<textarea id="${id}-pm" name="descricao" placeholder="Ex.: foto da família, nome e data, logomarca da empresa…" aria-describedby="${id}-pm-e"></textarea>`))}
    ${g("outro", fld(`${id}-om`, "Como podemos ajudar?", `<textarea id="${id}-om" name="mensagem" data-req data-err="Conte o que você precisa." aria-describedby="${id}-om-e"></textarea>`))}
    ${fld(`${id}-t`, "Seu WhatsApp", `<input id="${id}-t" name="telefone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(41) 90000-0000…" aria-describedby="${id}-t-e">`, "opcional, para registrarmos seu pedido")}
    <div class="hp" aria-hidden="true"><label>Não preencha<input name="website" tabindex="-1" autocomplete="off"></label></div>
    <label class="chk"><input type="checkbox" id="${id}-c" name="consent" data-req data-err="Aceite o uso dos dados para receber o orçamento." aria-describedby="${id}-c-e"><span>Concordo em enviar estes dados à Moby Cell para receber o orçamento. Veja a <a href="/privacidade">Política de Privacidade</a>.</span></label>
    <p class="ferr" id="${id}-c-e" role="alert"></p>
    <button class="btn btn-red" type="submit" style="width:100%">${ic("chat")} Continuar no WhatsApp</button>
    <p class="fmsg" role="status" aria-live="polite"></p>
  </form>
  <p class="small">O valor final é informado no orçamento. Nada é feito sem a sua autorização.</p>
</div>`;
}

function layout({ path, title, desc, body, ld = [], index = true, current }) {
  const url = SITE + (path === "/" ? "/" : path);
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
${index ? "" : '<meta name="robots" content="noindex,follow">'}
<meta name="theme-color" content="#0b0b0d">
<meta name="color-scheme" content="light">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/icon-192.png">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Moby Cell">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/style.css?v=${V}">
<link rel="stylesheet" href="/assets/css/moby.css?v=${V}">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
</head>
<body>
<a class="skip" href="#main">Ir para o conteúdo</a>
<header class="top"><div class="wrap">
  <a class="brand" href="/" translate="no" aria-label="Moby Cell — início"><img src="/assets/img/home/logo-icon.svg" width="48" height="48" alt=""><span><b>Moby <span>Cell</span></b><small>Assistência Técnica e Serviços</small></span></a>
  <nav class="tnav" aria-label="Principal">${TNAV.map(([h, t]) => `<a href="${h}"${h === current ? ' class="on" aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
  <a class="wa-pill" href="${wa("Olá! Vim pelo site da Moby Cell e gostaria de um orçamento.")}" data-track="header">${WAI(30)}<span><small>WhatsApp</small><strong>(41) 99133-2951</strong></span></a>
  <button class="menu-btn" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="drawer"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg></button>
</div></header>
<div class="drawer" id="drawer" aria-hidden="true"><div class="bg" data-close></div><nav aria-label="Menu">
  <button class="close" type="button" aria-label="Fechar menu" data-close><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M6 6l12 12M18 6L6 18"/></svg></button>
  ${TNAV.map(([h, t]) => `<a href="${h}" data-close>${t}</a>`).join("")}<a href="/orcamento" data-close>Pedir orçamento</a><a href="/sobre" data-close>Sobre a loja</a>
  <a class="btn btn-wa" href="${wa("Olá! Vim pelo site da Moby Cell e gostaria de um orçamento.")}" data-track="menu">${WAI(24)} Chamar no WhatsApp</a>
</nav></div>
<main id="main">
${body}
</main>
<footer class="ft"><div class="wrap">
  <div class="cols">
    <div><h2 translate="no">Moby Cell</h2><p>Conserto de celulares, formatação de notebook e computador, impressões, personalizados e ponto de atendimento Shopee no Campo de Santana, Curitiba.</p></div>
    <div><h2>Serviços</h2><ul>${[SERV[0], ...SERV_EXTRA, ...SERV.slice(1)].map((s) => `<li><a href="${s.path}">${s.name}</a></li>`).join("")}</ul></div>
    <div><h2>Onde estamos</h2><p>${ADDR.street}<br>${ADDR.hood}, ${ADDR.city}–${ADDR.uf}<br>CEP&nbsp;${ADDR.cep}</p><p>${hoursHtml()}</p><p><a href="${MAPS}" target="_blank" rel="noopener">Ver no Google Maps</a></p></div>
    <div><h2>Contato</h2><p><a href="${wa("Olá! Gostaria de mais informações.")}" data-track="rodape">WhatsApp (41)&nbsp;99133-2951</a></p><p><a href="/privacidade">Política de Privacidade</a></p></div>
  </div>
  <p class="copy"><span translate="no">Moby Cell</span> · CNPJ 42.252.647/0001-50 · © ${new Date().getFullYear()}</p>
</div></footer>
<a class="fab" href="${wa("Olá! Vim pelo site da Moby Cell e gostaria de um orçamento.")}" data-track="flutuante" aria-label="Falar no WhatsApp">${WAI(34)}</a>
<nav class="dock" aria-label="Contato rápido">
  <a class="dw" href="${wa("Olá! Vim pelo site da Moby Cell e gostaria de um orçamento.")}" data-track="barra-mobile">${WAI(30)}<span><small>WhatsApp</small><strong>(41) 99133-2951</strong></span></a>
  <a href="tel:${TEL}">${ic("phone")} Ligar</a>
  <a class="js-route" href="${MAPS}" target="_blank" rel="noopener">${ic("pin")} Rota</a>
</nav>
<div class="ck" id="ck" role="dialog" aria-label="Cookies"><p>Usamos cookies para medir visitas e anúncios. Veja a <a href="/privacidade">Política de Privacidade</a>.</p><div class="b"><button class="btn btn-red" type="button" data-ck="yes">Aceitar</button><button class="btn" type="button" data-ck="no">Recusar</button></div></div>
<script src="/assets/js/config.js?v=${V}"></script>
<script src="/assets/js/main.js?v=${V}" defer></script>
<script src="/assets/js/moby.js?v=${V}" defer></script>
</body>
</html>`;
}

// Nota do Perfil da Empresa no Google (conferida em 20/11/2026). Atualizar quando mudar.
const GRATING = `<a class="g-rating" href="https://www.google.com/maps/place/Moby+Cell+Assistencia+t%C3%A9cnica+Celulares/@-25.5840198,-49.3230281,17z/data=!4m6!3m5!1s0x94dcfc2a0990a4cf:0x7839fd71f4723732!8m2!3d-25.5840247!4d-49.3204532!16s%2Fg%2F11q484tv8z" target="_blank" rel="noopener" aria-label="Nota 4,8 de 5 com 44 avaliações no Google"><b>4,8</b><span class="st" aria-hidden="true">★★★★★</span><span>44 avaliações no Google</span></a>`;
const TICKS = ["Garantia de até 1 ano, conforme a peça e o serviço", "Orçamento antes do reparo", "Loja física no bairro, atendimento também pelo WhatsApp"];
function hero({ h1, lead, btns, img, alt = "", badge = "Orçamento antes do reparo" }) {
  return `<section class="hero"><div class="wrap hero-grid"><div class="hero-txt">${GRATING}<h1>${h1}</h1><p class="lead">${lead}</p><div class="btns">${btns}</div><ul class="ticks">${TICKS.map((t) => `<li>${ic("check")}${t}</li>`).join("")}</ul></div><div class="hero-vis${(HERO_IMG[img] || [])[3] ? " contain" : ""}"><img src="${HERO_IMG[img] ? "/assets/img/home/" + HERO_IMG[img][0] : IMG + img}" alt="${alt || HERO_ALT[img] || ""}" width="${HERO_IMG[img] ? HERO_IMG[img][1] : 1200}" height="${HERO_IMG[img] ? HERO_IMG[img][2] : 900}" fetchpriority="high"><span class="badge">${ic("shield")} ${badge}</span></div></div></section>`;
}
const sh = (t, sub = "") => `<div class="shead"><h2>${t}</h2>${sub ? `<p>${sub}</p>` : ""}</div>`;
const rowsSec = (title, items, alt = "") => `<section class="sec ${alt}"><div class="wrap">${sh(title)}${rows(items)}</div></section>`;
const SHOPEE = "Ponto de atendimento Shopee. Consulte no WhatsApp as modalidades disponíveis.";
const infobar = () => `<section class="infobar"><div class="wrap"><div class="ib">
  <div>${ic("pin")}<div><h3>Nossa localização</h3><p>${ADDR.street}<br>${ADDR.hood}, ${ADDR.city}–${ADDR.uf}</p><a href="${MAPS}" target="_blank" rel="noopener">Ver no Google Maps</a></div></div>
  <div>${ic("clock")}<div><h3>Horário de atendimento</h3><p>${HOURS.slice(0, 2).map(([d, h]) => `${d}: ${NB(h)}`).join("<br>")}<br>Domingo: fechado</p></div></div>
  <div>${ic("box")}<div><h3>Ponto Shopee</h3><p>${SHOPEE}</p></div></div>
</div></div></section>`;
const bairros = () => `<section class="sec alt"><div class="wrap"><div class="shead"><h2>Atendimento no <em>Campo de Santana</em> e região</h2><p>A Moby Cell fica na ${ADDR.street}, no Campo de Santana, região sul de Curitiba. Atendemos na loja moradores do Campo de Santana e dos bairros vizinhos, como Tatuquara, Caximba e Umbará.</p></div><ul class="index">${HOODS.map((h, i) => `<li class="plain"><div><span class="n">${pad(i + 1)}</span><h3>${h}</h3></div></li>`).join("")}</ul><p class="small" style="margin-top:16px">Atendimento presencial na loja. Não fazemos atendimento a domicílio. <a href="${MAPS}" target="_blank" rel="noopener">Ver rota no Google Maps</a></p></div></section>`;
const waBtn = (t, tr, label = "Chamar no WhatsApp") => `<a class="btn btn-wa" href="${wa(t)}" data-track="${tr}">${ic("chat")} ${label}</a>`;
const bento = () => `<div class="bento">
  <a class="bx main" href="/conserto-de-celular"><h3>Assistência técnica de celulares</h3><p>Avaliamos o aparelho, passamos o orçamento e só reparamos com a sua autorização.</p><ul class="chips2"><li>Troca de tela</li><li>Bateria</li><li>Conector de carga</li></ul><span class="more-l">Conheça o serviço ${ic("arrow")}</span><img src="${IMG}card-celular.png" alt="" width="600" height="600" loading="lazy"></a>
  <a class="bx f row" href="/formatacao-notebook-computador"><div><h3>Formatação de computadores e notebooks</h3><p>Somente formatação, para deixar o equipamento pronto para uso.</p><span class="more-l">Saiba mais ${ic("arrow")}</span></div><img src="${IMG}card-notebook.png" alt="" width="600" height="600" loading="lazy"></a>
  <a class="bx i" href="/impressao-xerox-plastificacao"><h3>Impressões e serviços rápidos</h3><p>Documentos, xerox, digitalização, plastificação e foto 3×4.</p><span class="more-l">Saiba mais ${ic("arrow")}</span></a>
  <a class="bx a" href="${wa("Olá! Vim pelo site e quero saber sobre acessórios.")}" target="_blank" rel="noopener" data-track="card-acessorios"><h3>Acessórios</h3><p>Carregadores, cabos, películas e capinhas, conforme o estoque.</p><span class="more-l">Perguntar no WhatsApp ${ic("arrow")}</span></a>
</div>
<p class="alsol"><span>${ic("box")}<b>Ponto Shopee:</b> consulte no WhatsApp as modalidades disponíveis.</span><a href="#personalizados">Veja também os personalizados ↓</a></p>`;
const vitrine = () => `<section class="sec alt" id="personalizados"><div class="wrap vit"><div class="vit-t"><div class="eyebrow">Personalizados</div><h2>Presentes e brindes com a <em style="font-style:normal;color:var(--red)">sua arte</em></h2><p class="lead" style="margin-top:12px">Para você, para a escola ou para a empresa: uma unidade ou em quantidade, com orçamento combinado antes.</p><ul>${["Canecas personalizadas", "Azulejos", "Copos e taças", "Chaveiros", "Brindes e lembranças"].map((t) => `<li>${ic("check")}${t}</li>`).join("")}</ul><a class="btn btn-red" href="/personalizados">Ver personalizados</a></div><div class="mosaic"><figure class="tall"><img src="${IMG}vitrine-caneca.jpg" alt="" width="800" height="1000" loading="lazy"><figcaption>Canecas</figcaption></figure><figure class="sm"><img src="${IMG}vitrine-azulejo.jpg" alt="" width="800" height="480" loading="lazy"><figcaption>Azulejos</figcaption></figure><figure class="sm"><img src="${IMG}vitrine-copos.jpg" alt="" width="800" height="480" loading="lazy"><figcaption>Copos e taças</figcaption></figure></div></div></section>`;
const DIFF = ["Loja física no bairro", "Atendimento presencial", "Orçamento antes de executar reparos", "Comunicação direta pelo WhatsApp", "Serviços e produtos variados num só lugar"];
const confianca = () => `<section class="sec"><div class="wrap trustg"><div><div class="eyebrow">Por que a Moby Cell</div><h2>Atendimento de quem mora e trabalha no&nbsp;bairro</h2><ul class="diff" style="margin-top:20px">${DIFF.map((t) => `<li>${ic("check")}<span>${t}</span></li>`).join("")}</ul></div><div><p class="small" style="margin:0 0 10px">Avaliações de clientes no Google, no texto original.</p><div class="revs">${reviews.map(([n, d, t]) => `<figure class="rev"><p>${t}</p><figcaption><span class="score">5/5</span> · ${n} · ${d}</figcaption></figure>`).join("")}</div><p class="small" style="margin-top:12px"><a href="${MAPS}" target="_blank" rel="noopener">Ver todas as avaliações no Google Maps</a></p></div></div></section>`;
const localizacao = () => `<section class="sec alt"><div class="wrap locg"><div class="loc-card"><div class="eyebrow">Localização</div><h2>Venha até a loja</h2><dl><div><dt>Endereço</dt><dd>${ADDR.street}<br>${ADDR.hood}, ${ADDR.city}–${ADDR.uf} · CEP ${ADDR.cep}</dd></div><div><dt>Horário</dt><dd>${hoursHtml()}<br><span class="small" style="font-weight:400">Em datas especiais os horários podem mudar. Confirme pelo WhatsApp.</span></dd></div><div><dt>Contato</dt><dd><a href="${wa("Olá! Vim pelo site da Moby Cell.")}" data-track="localizacao">WhatsApp (41)&nbsp;99133-2951</a></dd></div></dl><div class="btns"><a class="btn btn-red" href="${MAPS}" target="_blank" rel="noopener">${ic("pin")} Como chegar</a>${waBtn("Olá! Vim pelo site da Moby Cell.", "localizacao-btn")}</div></div><iframe class="map" title="Mapa da Moby Cell" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent("Rua Ângelo Tozim, 239, Curitiba")}&output=embed"></iframe></div></section>`;
const ctaBand = () => `<section class="cta-band"><div class="wrap cta-in"><div><h2>Precisa de um orçamento?</h2><p>Conte o que você precisa e respondemos pelo WhatsApp.</p></div><a class="btn btn-w" href="${wa("Olá! Vim pelo site da Moby Cell e quero um orçamento.")}" data-track="faixa-final">${ic("chat")} Solicitar orçamento pelo WhatsApp</a></div></section>`;

const pages = [];
const add = (p) => pages.push(p);
const WAG = (t, tr) => `<a class="btn btn-wa" href="${wa(t)}" data-track="${tr}">${ic("chat")} Chamar no WhatsApp</a>`;

// ---------------------------------------------------------------- HOME
const homeFaq = [
  ["Onde fica a Moby Cell?", `Na ${ADDR.street}, ${ADDR.hood}, ${ADDR.city}–${ADDR.uf}. É uma loja física de bairro, com atendimento presencial e pelo WhatsApp.`],
  ["Qual o horário de atendimento?", "Segunda a sexta, das 9h30 às 17h, e sábado, das 9h30 às 13h. Domingo fechado. Em datas especiais os horários podem mudar, então confirme pelo WhatsApp."],
  ["Vocês fazem conserto de celular?", "Sim. Avaliamos o aparelho, passamos o orçamento e só começamos o reparo depois da sua autorização. Os reparos mais comuns são troca de tela, bateria e conector de carga, conforme o modelo e a disponibilidade da peça. Nem todo defeito tem reparo viável, e avisamos isso no orçamento."],
  ["Vocês formatam notebook e computador?", "Sim, fazemos formatação de notebooks e computadores. Esse é o único serviço que realizamos nesses equipamentos: não fazemos reparo de peças ou de hardware."],
  ["Fazem impressão de documentos, xerox e plastificação?", "Sim, conforme a disponibilidade do dia. Consulte pelo WhatsApp e, se quiser, envie o arquivo antes de vir à loja."],
  ["Vocês fazem canecas e brindes personalizados?", "Sim. Trabalhamos com canecas, azulejos, copos, taças, squeezes, chaveiros, adesivos, cartões de visita e outros itens, para uma unidade ou em quantidade. Os modelos disponíveis e as condições são combinados no orçamento."],
  ["Como peço um orçamento?", "Preencha o formulário do site ou chame no WhatsApp com o modelo do aparelho e o defeito. Respondemos com as informações do atendimento."],
  ["Quais as formas de pagamento?", "Dinheiro, cartão e Pix."],
];
add({
  // A página inicial é feita à mão em public/index.html (visual novo). Aqui fica só
  // para o sitemap; o build não sobrescreve o arquivo.
  path: "/", file: "index.html", current: "", static: true,
  title: "Moby Cell | Assistência Técnica de Celulares em Curitiba",
  desc: "Assistência técnica de celulares, formatação de computadores, impressões e personalizados no Campo de Santana, em Curitiba. Peça seu orçamento pelo WhatsApp.",
  ld: [localBusiness(), faqLD(homeFaq)],
  body: `
${hero({ img: "hero-home.jpg",
  h1: "Assistência técnica de celulares no <em>Campo de Santana</em>",
  lead: "Conserto de celulares, formatação de computadores, impressões e personalizados. Atendimento presencial em Curitiba.",
  btns: `<a class="btn btn-red" href="${wa("Olá! Vim pelo site da Moby Cell e quero um orçamento.")}" data-track="hero">${ic("chat")} Solicitar orçamento pelo WhatsApp</a><a class="btn btn-o" href="${MAPS}" target="_blank" rel="noopener">Como chegar à loja</a>` })}
<section class="sec" id="servicos"><div class="wrap">${sh("O que fazemos na <em>Moby Cell</em>", "Assistência técnica em destaque e os demais serviços logo ao lado.")}${bento()}</div></section>
${vitrine()}
${confianca()}
<section class="sec alt" id="orcamento"><div class="wrap two">
  <div><div class="eyebrow">Orçamento</div><h2>Conte o que você&nbsp;precisa</h2><p class="lead" style="margin-top:12px">Os campos mudam conforme o serviço. Depois abrimos o WhatsApp com a sua mensagem pronta.</p>
    <ul class="list"><li>Você aprova o orçamento antes de qualquer reparo</li><li>Atendimento pelo WhatsApp ou na loja</li><li>Loja no Campo de Santana, em Curitiba</li></ul></div>
  ${form("", "f-home")}
</div></section>
${localizacao()}
<section class="sec"><div class="wrap">${sh("Perguntas frequentes")}${faq(homeFaq)}</div></section>
${ctaBand()}`,
});

// ---------------------------------------------------------------- CELULAR
const celFaq = [
  ["Vocês consertam qualquer defeito de celular?", "Não prometemos todos os defeitos. Avaliamos o aparelho e informamos no orçamento se o reparo é viável, conforme o defeito, o modelo e a disponibilidade da peça."],
  ["Quais reparos vocês fazem com mais frequência?", "Troca de tela, troca de bateria e conserto de conector de carga. Para outros defeitos, envie o modelo e a descrição e avaliamos."],
  ["Quanto custa o conserto?", "O valor depende do modelo e do defeito, por isso informamos no orçamento, depois da avaliação. Você decide se autoriza."],
  ["Quanto tempo leva?", "O prazo depende do defeito e da peça. Informamos o prazo estimado junto com o orçamento, sem prometer antes da avaliação."],
  ["Preciso levar o celular à loja?", "Para avaliar com segurança, o aparelho precisa passar pela loja. Você pode adiantar tudo pelo WhatsApp e combinar a visita."],
  ["Vocês atendem a domicílio?", "Não. O atendimento é na loja, no Campo de Santana."],
  ["O conserto tem garantia?", "Sim. A garantia é de até 1 ano e varia conforme a peça e o serviço. O prazo de garantia do seu conserto é informado no orçamento."],
  ["Como acompanho meu reparo?", "O aparelho fica registrado em uma ordem de serviço, e o andamento é informado a você durante o atendimento."],
];
add({
  path: "/conserto-de-celular", file: "conserto-de-celular.html", current: "/conserto-de-celular",
  title: "Conserto de Celular em Curitiba – Campo de Santana | Moby Cell",
  desc: "Conserto de celular no Campo de Santana, Curitiba: troca de tela, bateria e conector de carga. Orçamento antes do reparo. Peça o seu pelo WhatsApp.",
  ld: [localBusiness(), serviceLD("Conserto de celular", "Conserto de celular"), crumbLD([["Início", "/"], ["Conserto de celular", "/conserto-de-celular"]]), faqLD(celFaq)],
  body: `
${crumbs("Conserto de celular")}
${hero({ img: "hero-celular.jpg",
  h1: "Conserto de celular com orçamento claro <em>antes de começar</em>",
  lead: "Tela quebrada, bateria que não dura ou celular que não carrega? Descreva o problema e receba o orçamento. Você só autoriza o reparo se concordar.",
  btns: `<a class="btn btn-red" href="#orcamento">Pedir orçamento</a>${waBtn("Olá! Quero um orçamento de conserto de celular. Modelo: ", "celular-hero")}` })}
${rowsSec("Reparos mais comuns", [["Troca de tela", `Tela quebrada, trincada ou touch sem resposta. <a href="/troca-de-tela-celular" style="color:#fff;text-decoration:underline">Saiba mais</a>`], ["Troca de bateria", `Bateria que descarrega rápido ou está estufada. <a href="/troca-de-bateria-celular" style="color:#fff;text-decoration:underline">Saiba mais</a>`], ["Conector de carga", `Quando o celular não carrega direito. <a href="/conector-de-carga-celular" style="color:#fff;text-decoration:underline">Saiba mais</a>`]])}

<section class="sec"><div class="wrap">
  ${folio(1, "Como funciona")}
  <h2 style="margin-bottom:clamp(24px,4vw,48px)">Do primeiro contato à&nbsp;entrega.</h2>
  ${rows([["Contato", "Envie o modelo e o defeito pelo formulário ou WhatsApp."], ["Avaliação", "O aparelho é recebido, identificado e avaliado na loja."], ["Orçamento", "Você recebe o valor e as condições e decide se autoriza."], ["Reparo e testes", "Executamos o reparo viável e testamos o aparelho."], ["Entrega", "Retirada na loja, com a ordem de serviço registrada."]])}
  <p class="note"><b>Transparência:</b> nem todo defeito tem reparo viável. Se não valer a pena consertar o seu modelo, dizemos isso no orçamento.</p>
</div></section>

<section class="sec alt"><div class="wrap two">
  <div>${folio(2, "Orçamento", "")}<h2>Peça o orçamento do seu&nbsp;celular.</h2>
    <p class="lead" style="margin-top:20px">Informe o modelo e o que está acontecendo. Se preferir, fale direto no WhatsApp.</p>
    <div class="btns">${WAG("Olá! Quero um orçamento de conserto de celular. Modelo: ", "celular-meio")}</div>
    <p style="margin-top:28px" class="small">${ADDR.street}, ${ADDR.hood}, ${ADDR.city}–${ADDR.uf}. <a href="/contato">Ver mapa e contato</a></p>
  </div>
  ${form("celular", "orcamento", "Orçamento de conserto de celular")}
</div></section>

${infobar()}
${bairros()}
<section class="sec"><div class="wrap">${folio(3, "Perguntas frequentes", "")}${faq(celFaq)}${more("/conserto-de-celular")}</div></section>`,
});

// ---------------------------------------------------------------- REPAROS ESPECÍFICOS (SEO)
// Uma página por busca comum ("troca de tela", "troca de bateria", "conector de carga"),
// todas com as mesmas regras: sem preço, sem prazo prometido, garantia "de até 1 ano, conforme a peça e o serviço".
const GAR = "A garantia é de até 1 ano e varia conforme a peça e o serviço. O prazo de garantia do seu conserto é informado no orçamento.";
function repairPage({ path, name, title, desc, h1, lead, about, signs, steps, faqItems, wa: waText }) {
  const fq = [...faqItems,
    ["Quanto custa?", "O valor depende do modelo do celular e da peça. Envie o modelo pelo WhatsApp ou pelo formulário e passamos o orçamento. Você só autoriza se concordar."],
    ["Tem garantia?", GAR],
    ["Onde fica a loja?", `Na ${ADDR.street}, ${ADDR.hood}, ${ADDR.city}–${ADDR.uf}, CEP ${ADDR.cep}. Atendemos moradores do Campo de Santana e de bairros vizinhos, como Tatuquara, Caximba e Umbará.`],
    ["Qual o horário de atendimento?", "Segunda a sexta, das 9h30 às 17h, e sábado, das 9h30 às 13h. Domingo fechado."],
  ];
  add({
    path, file: path.slice(1) + ".html", current: "/conserto-de-celular",
    title, desc,
    ld: [localBusiness(), serviceLD(name, name, desc), crumbLD([["Início", "/"], ["Conserto de celular", "/conserto-de-celular"], [name, path]]), faqLD(fq)],
    body: `
<nav class="crumbs wrap" aria-label="Trilha"><a href="/">Início</a> / <a href="/conserto-de-celular">Conserto de celular</a> / ${name}</nav>
${hero({ img: "hero-celular.jpg", h1, lead,
  btns: `<a class="btn btn-red" href="#orcamento">Pedir orçamento</a>${waBtn(waText, path.slice(1) + "-hero")}` })}
<section class="sec"><div class="wrap two">
  <div>${folio(1, "O serviço")}<h2>${name} na Moby Cell</h2>${about.map((t) => `<p class="lead" style="margin-top:16px">${t}</p>`).join("")}</div>
  <div class="formBox" style="border-top-color:var(--red)"><h3>Resumo</h3><ul class="list">
    <li>Orçamento antes do reparo: você só autoriza se concordar</li>
    <li>Garantia de até 1 ano, conforme a peça e o serviço</li>
    <li>Loja física no Campo de Santana, Curitiba</li>
    <li>Pagamento em dinheiro, cartão ou Pix</li>
  </ul></div>
</div></section>
${rowsSec("Sinais de que você precisa do serviço", signs.map((t) => [t[0], t[1]]), "alt")}
<section class="sec"><div class="wrap">${folio(2, "Como funciona")}<h2 style="margin-bottom:clamp(24px,4vw,40px)">Do contato à&nbsp;entrega.</h2>${rows(steps)}</div></section>
<section class="sec alt"><div class="wrap two">
  <div>${folio(3, "Orçamento", "")}<h2>Peça o orçamento.</h2>
    <p class="lead" style="margin-top:20px">Informe o modelo do celular e o que está acontecendo. Se preferir, fale direto no WhatsApp.</p>
    <div class="btns">${WAG(waText, path.slice(1) + "-meio")}</div>
  </div>
  ${form("celular", "orcamento", "Orçamento de " + name.toLowerCase())}
</div></section>
${infobar()}
${bairros()}
<section class="sec"><div class="wrap">${folio(4, "Perguntas frequentes", "")}${faq(fq)}
<p class="more"><a href="/conserto-de-celular">Conserto de celular</a>${SERV_EXTRA.filter((x) => x.path !== path).map((x) => `<a href="${x.path}">${x.name}</a>`).join("")}<a href="/formatacao-notebook-computador">Formatação de notebook</a></p></div></section>`,
  });
}
const STEPS = [["Contato", "Envie o modelo e o defeito pelo WhatsApp ou pelo formulário."], ["Avaliação", "O aparelho é avaliado na loja para confirmar o defeito."], ["Orçamento", "Você recebe o valor, o prazo estimado e a garantia, e decide se autoriza."], ["Reparo e testes", "Fazemos o reparo e testamos o aparelho antes da entrega."], ["Retirada", "Você retira na loja, com a ordem de serviço registrada."]];

repairPage({
  path: "/troca-de-tela-celular", name: "Troca de tela de celular",
  title: "Troca de Tela de Celular no Campo de Santana, Curitiba | Moby Cell",
  desc: "Troca de tela de celular no Campo de Santana, em Curitiba: tela quebrada, trincada, touch sem resposta ou manchas. Orçamento antes do reparo e garantia de até 1 ano.",
  h1: "Troca de tela de celular no <em>Campo de Santana</em>",
  lead: "Tela quebrada, trincada ou com o touch falhando? Fazemos a troca da tela do seu celular na loja, com orçamento antes do reparo.",
  about: ["Trocamos a tela (display e touch) de celulares das marcas mais comuns, como Samsung, Motorola, Xiaomi e iPhone, conforme o modelo e a disponibilidade da peça.", "Antes de começar, avaliamos o aparelho e informamos o valor, o prazo estimado e a garantia. Recomendamos fazer o backup dos seus dados antes de qualquer reparo."],
  signs: [["Tela trincada ou quebrada", "Vidro rachado, com pontas soltas ou estilhaçado."], ["Touch que não responde", "Partes da tela não funcionam ou o celular clica sozinho."], ["Manchas, linhas ou tela preta", "A imagem falha, aparece com listras ou some com o celular ligado."]],
  steps: STEPS,
  faqItems: [["Vale a pena trocar a tela?", "Depende do modelo e do estado do aparelho. Na avaliação dizemos se compensa e, se não compensar, avisamos no orçamento."], ["Vou perder meus dados na troca de tela?", "Normalmente a troca de tela não apaga os dados, mas recomendamos fazer o backup antes de qualquer reparo."]],
  wa: "Olá! Quero um orçamento de troca de tela. Modelo do celular: ",
});
repairPage({
  path: "/troca-de-bateria-celular", name: "Troca de bateria de celular",
  title: "Troca de Bateria de Celular no Campo de Santana, Curitiba | Moby Cell",
  desc: "Troca de bateria de celular no Campo de Santana, em Curitiba: bateria que descarrega rápido, celular desligando sozinho ou bateria estufada. Orçamento antes e garantia de até 1 ano.",
  h1: "Troca de bateria de celular no <em>Campo de Santana</em>",
  lead: "Bateria que não dura, celular desligando com carga ou bateria estufada? Trocamos a bateria do seu celular na loja, com orçamento antes.",
  about: ["Fazemos a troca de bateria de celulares das marcas mais comuns, como Samsung, Motorola, Xiaomi e iPhone, conforme o modelo e a disponibilidade da peça.", "Se a bateria estiver estufada (tampa levantando ou tela saindo do lugar), pare de usar e de carregar o aparelho e traga à loja o quanto antes."],
  signs: [["Descarrega muito rápido", "A carga não dura o dia, mesmo com uso leve."], ["Desliga sozinho", "O celular apaga com carga sobrando ou só funciona na tomada."], ["Bateria estufada", "A tampa levanta, a tela descola ou o aparelho esquenta demais."]],
  steps: STEPS,
  faqItems: [["Como sei se o problema é a bateria?", "Os sinais mais comuns são a carga que acaba rápido e o celular desligando sozinho. Na avaliação confirmamos se é a bateria, o conector ou outro defeito."], ["Bateria estufada é perigoso?", "Sim, pode ser. Pare de usar e de carregar o aparelho e traga à loja para avaliação."]],
  wa: "Olá! Quero um orçamento de troca de bateria. Modelo do celular: ",
});
repairPage({
  path: "/conector-de-carga-celular", name: "Conserto do conector de carga",
  title: "Celular Não Carrega? Conector de Carga no Campo de Santana | Moby Cell",
  desc: "Conserto e troca do conector de carga de celular no Campo de Santana, em Curitiba: celular que não carrega, carrega devagar ou só na posição certa. Orçamento antes do reparo.",
  h1: "Celular não carrega? Conserto do <em>conector de carga</em>",
  lead: "Celular que não carrega, carrega devagar ou só com o cabo numa posição? Avaliamos o conector de carga e passamos o orçamento antes.",
  about: ["Avaliamos e trocamos o conector de carga (entrada do carregador) de celulares das marcas mais comuns, conforme o modelo e a disponibilidade da peça.", "Às vezes o problema é sujeira na entrada, o cabo ou o carregador. Por isso avaliamos antes de trocar qualquer peça."],
  signs: [["Não carrega", "O celular não mostra carregando com nenhum cabo."], ["Só carrega numa posição", "O cabo fica frouxo ou precisa ser segurado para carregar."], ["Carrega devagar", "A carga sobe muito devagar ou para no meio."]],
  steps: STEPS,
  faqItems: [["Pode ser só o cabo ou o carregador?", "Pode. Antes de trocar o conector, testamos com outros cabos e carregadores e verificamos se há sujeira na entrada."], ["O celular também não aparece no computador. É o conector?", "Pode ser. O conector de carga também é usado para dados. Avaliamos e informamos no orçamento."]],
  wa: "Olá! Meu celular não está carregando. Quero um orçamento. Modelo do celular: ",
});

// ---------------------------------------------------------------- FORMATAÇÃO
const fmtFaq = [
  ["Vocês formatam notebook?", "Sim, fazemos formatação de notebooks e computadores."],
  ["Vocês consertam notebook ou computador?", "Não. Nosso serviço para notebooks e computadores é a formatação. Não fazemos reparo de peças, tela, placa ou outros defeitos de hardware."],
  ["A formatação inclui backup dos meus arquivos?", "Não. Faça o backup dos seus arquivos antes de trazer o equipamento. O backup de dados não está incluído no serviço."],
  ["Vocês instalam programas?", "A instalação de programas não está incluída no serviço de formatação."],
  ["Como peço o orçamento da formatação?", "Informe o modelo do equipamento pelo formulário ou WhatsApp. Respondemos com as condições do serviço."],
];
add({
  path: "/formatacao-notebook-computador", file: "formatacao-notebook-computador.html", current: "/formatacao-notebook-computador",
  title: "Formatação de Notebook e Computador em Curitiba | Moby Cell",
  desc: "Formatação de notebook e computador no Campo de Santana, Curitiba. Peça seu orçamento de formatação pelo WhatsApp.",
  ld: [localBusiness(), serviceLD("Formatação de notebook e computador", "Formatação de notebook e computador"), crumbLD([["Início", "/"], ["Formatação de notebook e computador", "/formatacao-notebook-computador"]]), faqLD(fmtFaq)],
  body: `
${crumbs("Formatação de notebook e computador")}
${hero({ img: "hero-formatacao.jpg",
  h1: "Formatação de <em>notebook e computador</em>",
  lead: "Procurando onde formatar notebook perto de você? Fazemos a formatação do seu notebook ou computador na loja, no Campo de Santana.",
  btns: `<a class="btn btn-red" href="#orcamento">Pedir orçamento</a>${waBtn("Olá! Quero um orçamento de formatação. Equipamento: ", "formatacao-hero")}` })}
${rowsSec("O que você precisa saber", [["Serviço: formatação", "Notebooks e computadores."], ["Faça backup antes", "Backup de arquivos não está incluído."], ["Só formatação", "Não fazemos reparo de hardware."]])}
<section class="sec alt"><div class="wrap two">
  <div>${folio(1, "Orçamento", "")}<h2>Peça o orçamento da formatação.</h2>
    <p class="lead" style="margin-top:20px">Informe o modelo do equipamento e o que você espera do serviço.</p>
    <p class="note">Este serviço é exclusivamente <b>formatação</b>. Não realizamos troca de peças, reparo de placa, tela ou outros consertos em notebooks e computadores.</p></div>
  ${form("formatacao", "orcamento", "Orçamento de formatação")}
</div></section>
${infobar()}
<section class="sec"><div class="wrap">${folio(2, "Perguntas frequentes", "")}${faq(fmtFaq)}${more("/formatacao-notebook-computador")}</div></section>`,
});

// ---------------------------------------------------------------- IMPRESSÕES
const impFaq = [
  ["Vocês fazem impressão de documentos?", "Sim, impressão em preto e branco e colorida, conforme a disponibilidade do dia."],
  ["Posso enviar o arquivo pelo WhatsApp?", "Pode. Envie o arquivo e a quantidade de cópias, e confirmamos a disponibilidade antes de você vir à loja."],
  ["Vocês fazem xerox, digitalização e plastificação?", "Sim, esses serviços fazem parte do nosso atendimento rápido. Consulte a disponibilidade pelo WhatsApp."],
  ["Fazem foto 3×4?", "Sim, consulte a disponibilidade pelo WhatsApp."],
  ["Quais os valores?", "Os valores são informados no atendimento, pelo WhatsApp ou na loja."],
];
add({
  path: "/impressao-xerox-plastificacao", file: "impressao-xerox-plastificacao.html", current: "/impressao-xerox-plastificacao",
  title: "Impressão, Xerox e Plastificação no Campo de Santana, Curitiba | Moby Cell",
  desc: "Impressão de documentos, xerox, digitalização, plastificação e foto 3x4 no Campo de Santana, em Curitiba. Envie o arquivo pelo WhatsApp.",
  ld: [localBusiness(), serviceLD("Impressão, xerox e plastificação", "Impressão, xerox, digitalização e plastificação"), crumbLD([["Início", "/"], ["Impressões e serviços rápidos", "/impressao-xerox-plastificacao"]]), faqLD(impFaq)],
  body: `
${crumbs("Impressões e serviços rápidos")}
${hero({ img: "hero-impressao.jpg",
  h1: "Impressão, xerox e <em>plastificação</em> perto de você",
  lead: "Serviços rápidos para o dia a dia: documentos, trabalhos escolares, currículos e muito mais. Envie o arquivo pelo WhatsApp e consulte a disponibilidade.",
  btns: `${waBtn("Olá! Quero imprimir um arquivo. Vou enviar aqui.", "impressao-hero", "Enviar arquivo no WhatsApp")}<a class="btn btn-o" href="#orcamento">Pedir informações</a>` })}
${rowsSec("Serviços rápidos", [["Impressão", "Preto e branco e colorida."], ["Xerox e digitalização", "Cópias e arquivos digitais."], ["Plastificação", "Proteção para documentos."], ["Foto 3×4", "Consulte a disponibilidade."]])}
<section class="sec alt"><div class="wrap two">
  <div>${folio(1, "Como pedir", "")}<h2>Simples e&nbsp;rápido.</h2>
    <ul class="list"><li>Chame no WhatsApp e envie o arquivo</li><li>Confirmamos a disponibilidade e as condições</li><li>Você passa na loja para retirar</li></ul>
    <p>Realizamos impressões de documentos, xerox e plastificação no Campo de Santana. Consulte disponibilidade e informações pelo WhatsApp.</p></div>
  ${form("impressao", "orcamento", "Peça informações", "Diga o que precisa imprimir. Depois abrimos o WhatsApp para você enviar o arquivo.")}
</div></section>
${infobar()}
<section class="sec"><div class="wrap">${folio(2, "Perguntas frequentes", "")}${faq(impFaq)}${more("/impressao-xerox-plastificacao")}</div></section>`,
});

// ---------------------------------------------------------------- PERSONALIZADOS
const perFaq = [
  ["Vocês fazem canecas personalizadas?", "Sim: canecas de porcelana, canecas com interior e alça coloridos, canecas de acrílico e canecas de chope de acrílico, conforme a disponibilidade."],
  ["Fazem pedidos em quantidade?", "Sim. Trabalhamos com encomendas em quantidade para festas, escolas e empresas, de acordo com a nossa capacidade de produção."],
  ["Como funciona o pagamento?", "Em alguns produtos personalizados pedimos entrada antecipada. As condições são combinadas no orçamento de cada pedido."],
  ["Qual o prazo de uma encomenda?", "Depende do produto e da quantidade. O prazo é combinado no orçamento."],
];
const items = ["Canecas de porcelana", "Canecas com interior e alça coloridos", "Canecas de acrílico e chope de acrílico", "Azulejos personalizados", "Copos long drink e taças", "Squeezes e chaveiros", "Adesivos e etiquetas", "Cartões de visita e panfletos", "Topos de bolo", "Brindes empresariais", "Kits para presentes e eventos"];
add({
  path: "/personalizados", file: "personalizados.html", current: "/personalizados",
  title: "Canecas, Azulejos e Brindes Personalizados em Curitiba | Moby Cell",
  desc: "Canecas, azulejos, copos, chaveiros, adesivos, cartões de visita e brindes personalizados no Campo de Santana, Curitiba. Peça seu orçamento.",
  ld: [localBusiness(), serviceLD("Produtos personalizados", "Produtos personalizados"), crumbLD([["Início", "/"], ["Personalizados", "/personalizados"]]), faqLD(perFaq)],
  body: `
${crumbs("Personalizados")}
${hero({ img: "hero-personalizados.jpg",
  h1: "Personalizados para <em>presentear e celebrar</em>",
  lead: "Canecas, azulejos, copos, chaveiros, cartões e brindes com a sua arte. Uma unidade ou muitas, para você, sua escola ou sua empresa.",
  btns: `<a class="btn btn-red" href="#orcamento">Pedir orçamento</a>${waBtn("Olá! Quero um orçamento de produto personalizado. Produto e quantidade: ", "personalizados-hero")}` })}
${rowsSec("Para quem", [["Presentes e lembrancinhas", "Datas comemorativas e eventos."], ["Escolas", "Pedidos em quantidade."], ["Empresas", "Brindes e materiais gráficos."]])}
<section class="sec"><div class="wrap">
  ${folio(1, "Produtos")}
  <h2>O que produzimos.</h2>
  <p class="lead" style="margin:20px 0 clamp(24px,4vw,40px)">Os modelos disponíveis variam. Fale com a gente para confirmar o que está disponível para o seu pedido.</p>
  <ul class="index">${items.map((t, i) => `<li class="plain"><div><span class="n">${pad(i + 1)}</span><h3>${t}</h3></div></li>`).join("")}</ul>
</div></section>
<section class="sec alt"><div class="wrap two">
  <div>${folio(2, "Orçamento", "")}<h2>Conte a sua&nbsp;ideia.</h2><p class="lead" style="margin-top:20px">Informe o produto, a quantidade e a data em que precisa. Se tiver a arte, envie pelo WhatsApp.</p>
    <p class="note">Em alguns pedidos solicitamos entrada antecipada. As condições são combinadas no orçamento.</p></div>
  ${form("personalizados", "orcamento", "Orçamento de personalizados")}
</div></section>
${infobar()}
<section class="sec"><div class="wrap">${folio(3, "Perguntas frequentes", "")}${faq(perFaq)}${more("/personalizados")}</div></section>`,
});

// ---------------------------------------------------------------- SOBRE
add({
  path: "/sobre", file: "sobre.html", current: "/sobre",
  title: "Sobre a Moby Cell | Celulares e serviços no Campo de Santana",
  desc: "Conheça a Moby Cell, loja de bairro no Campo de Santana, em Curitiba: assistência técnica de celulares, formatação, impressões, personalizados e ponto Shopee.",
  ld: [localBusiness(true), crumbLD([["Início", "/"], ["Sobre", "/sobre"]])],
  body: `
${crumbs("Sobre")}
${hero({ img: "hero-loja.jpg",
  h1: "Uma loja de bairro que resolve o seu <em>dia a dia</em>",
  lead: "A Moby Cell é uma assistência técnica de celulares e loja de serviços rápidos no Campo de Santana, em Curitiba, conduzida por Alison e Júlia.",
  btns: `<a class="btn btn-red" href="/orcamento">Pedir orçamento</a><a class="btn btn-o" href="/contato">${ic("pin")} Como chegar</a>` })}
<section class="sec"><div class="wrap two">
  <div>${folio(1, "Quem somos", "")}
    <p>Aqui você encontra conserto de celular, formatação de notebooks e computadores, impressões, xerox e plastificação, produtos personalizados, acessórios e o ponto de atendimento Shopee (consulte as modalidades disponíveis).</p>
    <p>Nosso jeito de trabalhar é simples: ouvir o problema, avaliar, passar o orçamento com clareza e só seguir com a sua autorização. Por ser uma equipe pequena, o atendimento é direto, feito por quem executa o serviço.</p>
    <div class="btns"><a class="btn btn-red" href="/orcamento">Pedir orçamento</a><a class="btn" href="/contato">Como chegar</a></div></div>
  <div>${folio(2, "Nossos serviços", "")}<ul class="index" style="border-top:0">${SERV.map((s, i) => `<li><a href="${s.path}"><span class="n">${pad(i + 1)}</span><h3>${s.name}</h3></a></li>`).join("")}</ul></div>
</div></section>`,
});

// ---------------------------------------------------------------- CONTATO
const ctFaq = [
  ["Qual o endereço da Moby Cell?", `${ADDR.street}, ${ADDR.hood}, ${ADDR.city}–${ADDR.uf}, CEP ${ADDR.cep}.`],
  ["Qual o horário de funcionamento?", "Segunda a sexta, das 9h30 às 17h. Sábado, das 9h30 às 13h. Domingo fechado. Em datas especiais os horários podem mudar, então confirme pelo WhatsApp."],
  ["Qual o WhatsApp da Moby Cell?", "(41) 99133-2951."],
];
add({
  path: "/contato", file: "contato.html", current: "/contato",
  title: "Contato e Localização | Moby Cell – Campo de Santana, Curitiba",
  desc: "Endereço, horários, mapa e WhatsApp da Moby Cell, na Rua Ângelo Tozim, 239, Campo de Santana, Curitiba.",
  ld: [localBusiness(true), crumbLD([["Início", "/"], ["Contato", "/contato"]]), faqLD(ctFaq)],
  body: `
${crumbs("Contato")}
<section class="sec" style="padding-top:clamp(24px,4vw,48px)"><div class="wrap two">
  <div>
    <h1 style="margin-bottom:clamp(20px,3vw,32px)">Fale com a <em style="font-style:normal;color:var(--red)">Moby&nbsp;Cell</em>.</h1>
    <dl class="info">
      <div><dt>Endereço</dt><dd>${ADDR.street}<br>${ADDR.hood}, ${ADDR.city} – ${ADDR.uf}<br>CEP&nbsp;${ADDR.cep}</dd></div>
      <div><dt>WhatsApp</dt><dd><a href="${wa("Olá! Vim pelo site da Moby Cell.")}" data-track="contato">(41)&nbsp;99133-2951</a></dd></div>
      <div><dt>Horário</dt><dd>${hoursHtml()}<br><span class="small">Em datas especiais os horários podem mudar. Confirme pelo WhatsApp.</span></dd></div>
      <div><dt>Pagamento</dt><dd>Dinheiro, cartão e&nbsp;Pix</dd></div>
    </dl>
    <div class="btns">${WAG("Olá! Vim pelo site da Moby Cell.", "contato-btn")}<a class="btn" href="${MAPS}" target="_blank" rel="noopener">Abrir no Google Maps</a></div>
  </div>
  <iframe class="map" title="Mapa da Moby Cell" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent("Rua Ângelo Tozim, 239, Curitiba")}&output=embed"></iframe>
</div></section>
<section class="sec alt"><div class="wrap">${folio(1, "Perguntas rápidas", "")}${faq(ctFaq)}</div></section>`,
});

// ---------------------------------------------------------------- ORÇAMENTO
add({
  path: "/orcamento", file: "orcamento.html", current: "",
  title: "Pedir Orçamento | Moby Cell – Campo de Santana, Curitiba",
  desc: "Peça seu orçamento de conserto de celular, formatação, impressões ou personalizados na Moby Cell, no Campo de Santana, em Curitiba.",
  ld: [localBusiness()],
  body: `
<section class="sec" style="padding-top:clamp(24px,4vw,56px)"><div class="wrap two">
  <div><h1>Peça seu <em style="font-style:normal;color:var(--red)">orçamento</em>.</h1>
    <p class="lead" style="margin-top:24px">Conte o que você precisa. Depois abrimos o WhatsApp com a sua mensagem pronta para continuar o atendimento.</p>
    <ul class="list"><li>Você aprova o orçamento antes de qualquer reparo</li><li>Atendimento na loja, no Campo de Santana</li><li>Pagamento em dinheiro, cartão e Pix</li></ul></div>
  ${form("", "orcamento", "Seus dados")}
</div></section>`,
});

// ---------------------------------------------------------------- PRIVACIDADE
const h2p = 'style="font-size:1.4rem;margin:2em 0 .5em"';
add({
  path: "/privacidade", file: "privacidade.html", current: "",
  title: "Política de Privacidade | Moby Cell",
  desc: "Como a Moby Cell trata os dados enviados pelo site, conforme a LGPD.",
  index: false,
  body: `
<section class="sec" style="padding-top:clamp(24px,4vw,56px)"><div class="wrap" style="max-width:780px">
  <h1 style="font-size:clamp(2rem,5vw,3.4rem);margin-bottom:16px">Política de Privacidade</h1>
  <p class="muted">Moby Cell · ${ADDR.street}, ${ADDR.hood}, ${ADDR.city}–${ADDR.uf}, CEP ${ADDR.cep} · CNPJ 42.252.647/0001-50</p>
  <h2 ${h2p}>1. Dados que coletamos</h2>
  <p>Quando você preenche o formulário de orçamento, coletamos o nome, o WhatsApp, o tipo de serviço, o modelo do aparelho e a descrição que você escrever. Também registramos a página em que você estava e, quando existirem, dados de origem da visita (como a campanha ou o site de onde você veio), para sabermos como você chegou até nós.</p>
  <h2 ${h2p}>2. Para que usamos</h2>
  <p>Usamos esses dados para responder ao seu pedido, preparar o orçamento e manter contato sobre o atendimento. Também analisamos, de forma agregada, quais canais trazem clientes.</p>
  <h2 ${h2p}>3. Onde ficam os dados</h2>
  <p>Os dados enviados pelo formulário ficam no sistema de gestão da loja, hospedado em provedor de nuvem. Não vendemos seus dados. A conversa pelo WhatsApp é tratada pela plataforma da Meta, conforme a política dela.</p>
  <h2 ${h2p}>4. Cookies e medição</h2>
  <p>Se você aceitar, usamos cookies do Google (Analytics e Google Ads) para medir visitas e a eficácia dos anúncios. Se recusar, o site funciona normalmente, sem esses cookies.</p>
  <p>Independentemente dos cookies, contamos as visitas e os cliques nos botões (WhatsApp, Ligar, Rota) de forma anônima: guardamos só a página, o tipo de clique, a origem da visita (por exemplo, Google ou Instagram) e um código aleatório que dura enquanto a aba estiver aberta. Não guardamos nome, telefone, endereço de IP nem cookies para isso.</p>
  <h2 ${h2p}>5. Seus direitos</h2>
  <p>Pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir acesso, correção ou exclusão dos seus dados. Basta nos chamar pelo <a href="${wa("Olá! Quero exercer meus direitos sobre dados pessoais (LGPD).")}">WhatsApp (41)&nbsp;99133-2951</a>.</p>
  <h2 ${h2p}>6. Atualizações</h2>
  <p>Esta política pode ser atualizada. A versão em vigor é a publicada nesta página.</p>
</div></section>`,
});

// ---------------------------------------------------------------- 404
add({
  path: "/404", file: "404.html", current: "", index: false,
  title: "Página não encontrada | Moby Cell", desc: "Página não encontrada.",
  body: `<section class="sec"><div class="wrap" style="max-width:720px"><h1>Página não encontrada.</h1><p class="lead" style="margin-top:24px">O endereço pode ter mudado. Volte ao início ou fale com a gente.</p><div class="btns"><a class="btn btn-red" href="/">Ir para o início</a>${WAG("Olá!", "404")}</div></div></section>`,
});

for (const p of pages) {
  if (p.static) continue;
  const f = join(OUT, p.file);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, layout(p));
}
const today = new Date().toISOString().slice(0, 10);
const urls = pages.filter((p) => p.index !== false);
writeFileSync(join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((p) => `  <url><loc>${SITE}${p.path === "/" ? "/" : p.path}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
writeFileSync(join(OUT, "robots.txt"), `# Buscadores e assistentes de IA podem ler o site inteiro.\nUser-agent: *\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: Bingbot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`ok: ${pages.length} páginas`);
