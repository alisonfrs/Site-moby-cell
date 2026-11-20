// Gera as páginas HTML em /public. Uso: node scripts/build.mjs
// Todo o conteúdo do site está neste arquivo. Regras do dossiê da Moby Cell:
// sem preços de impressão/xerox, sem camisetas, formatação como único serviço de computador,
// sem promessas de prazo/garantia/horário que não foram confirmadas.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const SITE = "https://mobycell.com.br"; // domínio ainda a ser registrado/aprovado
const WA = "5541991332951";
const MAPS = "https://www.google.com/maps/place/Moby+Cell+Assistencia+t%C3%A9cnica+Celulares/@-25.5840198,-49.3230281,17z/data=!4m6!3m5!1s0x94dcfc2a0990a4cf:0x7839fd71f4723732!8m2!3d-25.5840247!4d-49.3204532!16s%2Fg%2F11q484tv8z";
const ADDR = { street: "Rua Ângelo Tozim, 239", hood: "Campo de Santana", city: "Curitiba", uf: "PR", cep: "81490-030" };
// Horários conforme o Perfil da Empresa no Google (conferido em 20/11/2026). Atualizar aqui se mudarem.
const HOURS = [["Segunda a sexta", "9h30 às 17h"], ["Sábado", "9h30 às 13h"], ["Domingo", "Fechado"]];
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

const I = {
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
  printer: '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><rect x="7" y="14" width="10" height="7"/>',
  mug: '<path d="M5 6h11v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M16 8h2a2 2 0 0 1 0 4h-2"/>',
  box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  plug: '<path d="M9 2v5M15 2v5M7 7h10v4a5 5 0 0 1-10 0zM12 16v6"/>',
  pin: '<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  check: '<path d="M4 12l5 5L20 6"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5.2A8.5 8.5 0 1 1 21 11.5z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
};
const ic = (n, cls = "ic") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

const NAV = [
  ["/conserto-de-celular", "Conserto de celular"],
  ["/formatacao-notebook-computador", "Formatação"],
  ["/impressao-xerox-plastificacao", "Impressões"],
  ["/personalizados", "Personalizados"],
  ["/sobre", "Sobre"],
  ["/contato", "Contato"],
];

const reviews = [
  ["Selene Domingues", "abr. de 2025", "Excelente trabalho, meu celular foi detonado e voltou brilhando. E o Alisson é um rapaz simpático, atento a todas as nossas perguntas."],
  ["Edina Oliveira", "abr. de 2025", "Ótimo atendimento, agilidade e qualidade!"],
  ["Jeverton", "abr. de 2025", "Extremamente atencioso."],
];

function localBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ElectronicsStore"],
    "@id": `${SITE}/#loja`,
    name: "Moby Cell",
    url: SITE,
    image: `${SITE}/assets/img/og.png`,
    logo: `${SITE}/assets/img/logo-512.png`,
    telephone: "+5541991332951",
    description: "Conserto de celular, formatação de notebook e computador, impressões, xerox, plastificação, produtos personalizados e ponto Shopee no Campo de Santana, Curitiba.",
    address: { "@type": "PostalAddress", streetAddress: ADDR.street, addressLocality: ADDR.city, addressRegion: ADDR.uf, postalCode: ADDR.cep, addressCountry: "BR" },
    geo: { "@type": "GeoCoordinates", latitude: -25.5840247, longitude: -49.3204532 },
    areaServed: ["Campo de Santana", "Curitiba"],
    paymentAccepted: "Dinheiro, cartão, Pix",
    sameAs: [MAPS],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:30", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:30", closes: "13:00" },
    ],
  };
}

const faqLD = (items) => ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

function faq(items) {
  return `<div class="faq">${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>`;
}

function form(service = "", id = "form", title = "Peça seu orçamento", sub = "Responda em 1 minuto. Depois abrimos o WhatsApp com a sua mensagem pronta.") {
  const o = (v, t) => `<option value="${v}"${v === service ? " selected" : ""}>${t}</option>`;
  return `<div class="formBox" id="${id}">
  <h2>${title}</h2><p class="muted">${sub}</p>
  <form class="lead" novalidate>
    <div class="row2">
      <div class="fld"><label for="${id}-n">Seu nome</label><input id="${id}-n" name="nome" autocomplete="name" required></div>
      <div class="fld"><label for="${id}-t">WhatsApp com DDD</label><input id="${id}-t" name="telefone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(41) 90000-0000" required></div>
    </div>
    <div class="fld"><label for="${id}-s">O que você precisa?</label>
      <select id="${id}-s" name="servico" required><option value="">Selecione</option>
      ${o("celular", "Conserto de celular")}${o("formatacao", "Formatação de notebook ou computador")}${o("impressao", "Impressão, xerox ou plastificação")}${o("personalizados", "Produtos personalizados")}${o("outro", "Outro assunto")}</select></div>
    <div class="fld dev"><label for="${id}-a">Modelo do aparelho</label><input id="${id}-a" name="aparelho" placeholder="Ex.: Galaxy A15, iPhone 11, Dell Inspiron"></div>
    <div class="fld"><label for="${id}-m">Conte o que está acontecendo</label><textarea id="${id}-m" name="mensagem" placeholder="Ex.: tela trincada, bateria descarregando rápido, não carrega…"></textarea></div>
    <div class="hp" aria-hidden="true"><label>Não preencha<input name="website" tabindex="-1" autocomplete="off"></label></div>
    <label class="chk"><input type="checkbox" name="consent" required><span>Concordo em enviar meus dados à Moby Cell para receber o orçamento. Veja a <a href="/privacidade">Política de Privacidade</a>.</span></label>
    <button class="btn btn-red" type="submit" style="width:100%">${ic("chat")} Enviar e continuar no WhatsApp</button>
    <p class="fmsg" role="status" aria-live="polite"></p>
  </form>
  <p class="small">O valor final é informado no orçamento, depois da avaliação. Nada é feito sem a sua autorização.</p>
</div>`;
}

function layout({ path, title, desc, body, ld = [], index = true, current }) {
  const url = SITE + (path === "/" ? "/" : path);
  const nav = NAV.map(([h, t]) => `<a href="${h}"${h === current ? ' aria-current="page"' : ""}>${t}</a>`).join("");
  const mnav = NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join("");
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
${index ? "" : '<meta name="robots" content="noindex,follow">'}
<meta name="theme-color" content="#D91F26">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/icon-192.png">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Moby Cell">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/assets/img/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/assets/css/style.css">
${ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
</head>
<body>
<a class="skip" href="#main">Ir para o conteúdo</a>
<header class="hd"><div class="wrap">
  <a class="brand" href="/"><img src="/assets/img/icon-192.png" width="40" height="40" alt=""><span>Moby <b>Cell</b></span></a>
  <nav class="nav" aria-label="Principal">${nav}<a class="btn btn-red btn-sm" href="/orcamento" style="color:#fff;margin-left:8px">Pedir orçamento</a></nav>
  <button class="burger" aria-label="Abrir menu" aria-expanded="false"><span></span></button>
</div><nav class="mnav" aria-label="Menu">${mnav}<a href="/orcamento" style="color:var(--red)">Pedir orçamento</a></nav></header>
<main id="main">
${body}
</main>
<footer class="ft"><div class="wrap">
  <div class="cols">
    <div><h4>Moby Cell</h4><p>Conserto de celulares, formatação de notebook e computador, impressões, personalizados e ponto Shopee no Campo de Santana, Curitiba.</p></div>
    <div><h4>Serviços</h4><ul>${NAV.slice(0, 4).map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul></div>
    <div><h4>Onde estamos</h4><p>${ADDR.street}<br>${ADDR.hood}, ${ADDR.city} – ${ADDR.uf}<br>CEP ${ADDR.cep}</p><p>Seg a sex 9h30–17h · Sáb 9h30–13h<br>Domingo fechado</p><p><a href="${MAPS}" target="_blank" rel="noopener">Ver no Google Maps</a></p></div>
    <div><h4>Contato</h4><p><a href="${wa("Olá! Gostaria de mais informações.")}" data-track="footer">WhatsApp (41) 99133-2951</a></p><p><a href="/privacidade">Política de Privacidade</a></p></div>
  </div>
  <p class="copy">© ${new Date().getFullYear()} Moby Cell · CNPJ 42.252.647/0001-50 · Pagamento em dinheiro, cartão e Pix.</p>
</div></footer>
<div class="mbar">
  <a class="btn btn-wa" href="${wa("Olá! Vim pelo site da Moby Cell.")}" data-track="barra-mobile">${ic("chat")} WhatsApp</a>
  <a class="btn btn-red" href="/orcamento">Orçamento</a>
</div>
<div class="ck" id="ck" role="dialog" aria-label="Cookies"><p>Usamos cookies para medir visitas e anúncios. Veja a <a href="/privacidade">Política de Privacidade</a>.</p><div class="b"><button class="btn btn-red btn-sm" data-ck="yes">Aceitar</button><button class="btn btn-line btn-sm" style="border-color:#fff;color:#fff" data-ck="no">Recusar</button></div></div>
<script src="/assets/js/config.js"></script>
<script src="/assets/js/main.js" defer></script>
</body>
</html>`;
}

const pages = [];
const add = (p) => pages.push(p);

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
  path: "/", file: "index.html", current: "",
  title: "Moby Cell | Conserto de celular e serviços rápidos no Campo de Santana, Curitiba",
  desc: "Conserto de celular, formatação de notebook, impressões, personalizados e ponto Shopee no Campo de Santana, em Curitiba. Peça seu orçamento pelo WhatsApp.",
  ld: [localBusiness(), faqLD(homeFaq)],
  body: `
<section class="hero"><div class="wrap grid">
  <div>
    <span class="eyebrow">Campo de Santana · Curitiba</span>
    <h1>Conserto de celular e serviços rápidos perto de você.</h1>
    <p class="lead">Troca de tela, bateria e conector de carga, formatação de notebook, impressões e personalizados. Peça seu orçamento sem sair de casa e traga o aparelho quando combinarmos.</p>
    <div class="btns">
      <a class="btn btn-red" href="/orcamento">Pedir orçamento</a>
      <a class="btn btn-wa" href="${wa("Olá! Vim pelo site da Moby Cell e quero um orçamento.")}" data-track="hero">${ic("chat")} Chamar no WhatsApp</a>
    </div>
    <ul class="chips">
      <li>${ic("check")} Orçamento antes do reparo</li>
      <li>${ic("pin")} Loja física no bairro</li>
      <li>${ic("card")} Dinheiro, cartão e Pix</li>
    </ul>
  </div>
  <div class="heroCard">
    <h2>Como funciona o conserto</h2>
    <ol>
      <li><span class="num">1</span><span><b>Você descreve o problema</b>Pelo site, pelo WhatsApp ou na loja.</span></li>
      <li><span class="num">2</span><span><b>Avaliamos e passamos o orçamento</b>Com o que dá para consertar no seu modelo.</span></li>
      <li><span class="num">3</span><span><b>Você autoriza</b>Nada é feito sem o seu "pode fazer".</span></li>
      <li><span class="num">4</span><span><b>Reparo, testes e entrega</b>Acompanhamos pela ordem de serviço.</span></li>
    </ol>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <span class="eyebrow">O que fazemos</span>
  <h2>Tudo o que o bairro precisa em um só lugar</h2>
  <div class="cards">
    <a class="card main" href="/conserto-de-celular"><span class="tag">Mais procurado</span><span class="ico">${ic("phone")}</span><h3>Conserto de celular</h3><p>Avaliação, orçamento e reparo de celulares. Troca de tela, bateria, conector de carga e mais, conforme o modelo.</p><span class="more">Ver como funciona →</span></a>
    <a class="card" href="/formatacao-notebook-computador"><span class="ico">${ic("laptop")}</span><h3>Formatação de notebook e PC</h3><p>Formatação de notebooks e computadores para deixar o equipamento pronto para uso.</p><span class="more">Saiba mais →</span></a>
    <a class="card" href="/impressao-xerox-plastificacao"><span class="ico">${ic("printer")}</span><h3>Impressões e serviços rápidos</h3><p>Documentos, xerox, digitalização, plastificação e foto 3×4. Envie o arquivo pelo WhatsApp.</p><span class="more">Saiba mais →</span></a>
    <a class="card" href="/personalizados"><span class="ico">${ic("mug")}</span><h3>Personalizados</h3><p>Canecas, azulejos, copos, chaveiros, adesivos, cartões e brindes, em unidade ou em quantidade.</p><span class="more">Ver produtos →</span></a>
  </div>
  <div class="cards" style="margin-top:18px">
    <div class="card"><span class="ico">${ic("box")}</span><h3>Ponto Shopee</h3><p>Coleta, envio e devolução de encomendas Shopee na loja.</p></div>
    <div class="card"><span class="ico">${ic("plug")}</span><h3>Acessórios</h3><p>Carregadores, cabos USB e para iPhone, e também películas e capinhas, conforme o estoque.</p></div>
  </div>
</div></section>

<section class="sec soft"><div class="wrap">
  <span class="eyebrow">Avaliações no Google</span>
  <h2>O que os clientes dizem</h2>
  <div class="revs">${reviews.map(([n, d, t]) => `<figure class="rev" style="margin:0"><div class="stars" aria-label="5 estrelas">★★★★★</div><p>${t}</p><small>${n} · ${d}</small></figure>`).join("")}</div>
  <p class="small" style="margin-top:18px"><a href="${MAPS}" target="_blank" rel="noopener">Ver todas as avaliações no Google Maps</a></p>
</div></section>

<section class="sec"><div class="wrap two">
  <div><span class="eyebrow">Orçamento</span><h2>Conte o que você precisa</h2><p class="lead">Quanto mais detalhes do aparelho e do defeito, mais rápido conseguimos orientar você.</p>
    <ul class="list"><li>${ic("check")}<span>Atendimento pelo WhatsApp ou na loja</span></li><li>${ic("check")}<span>Você aprova o orçamento antes de qualquer reparo</span></li><li>${ic("check")}<span>Loja no Campo de Santana, em Curitiba</span></li></ul></div>
  ${form("", "f-home")}
</div></section>

<section class="sec soft"><div class="wrap">
  <span class="eyebrow">Perguntas frequentes</span><h2>Dúvidas comuns</h2>
  ${faq(homeFaq)}
</div></section>`,
});

// ---------------------------------------------------------------- CELULAR
const celFaq = [
  ["Vocês consertam qualquer defeito de celular?", "Não prometemos todos os defeitos. Avaliamos o aparelho e informamos no orçamento se o reparo é viável, conforme o defeito, o modelo e a disponibilidade da peça."],
  ["Quais reparos vocês fazem com mais frequência?", "Troca de tela, troca de bateria e conserto de conector de carga. Para outros defeitos, envie o modelo e a descrição e avaliamos."],
  ["Quanto custa o conserto?", "O valor depende do modelo e do defeito, por isso informamos no orçamento, depois da avaliação. Você decide se autoriza."],
  ["Quanto tempo leva?", "O prazo depende do defeito e da peça. Informamos o prazo estimado junto com o orçamento, sem prometer antes da avaliação."],
  ["Preciso levar o celular à loja?", "Para avaliar com segurança, o aparelho precisa passar pela loja. Você pode adiantar tudo pelo WhatsApp e combinar a visita."],
  ["Vocês atendem a domicílio?", "Não. O atendimento é na loja, no Campo de Santana."],
  ["Como acompanho meu reparo?", "O aparelho fica registrado em uma ordem de serviço, e o andamento é informado a você durante o atendimento."],
];
add({
  path: "/conserto-de-celular", file: "conserto-de-celular.html", current: "/conserto-de-celular",
  title: "Conserto de celular em Curitiba – Campo de Santana | Moby Cell",
  desc: "Conserto de celular no Campo de Santana, Curitiba: troca de tela, bateria e conector de carga. Orçamento antes do reparo. Peça o seu pelo WhatsApp.",
  ld: [localBusiness(), faqLD(celFaq)],
  body: `
<section class="hero"><div class="wrap grid">
  <div>
    <span class="eyebrow">Campo de Santana · Curitiba</span>
    <h1>Conserto de celular com orçamento claro antes de começar.</h1>
    <p class="lead">Tela quebrada, bateria que não dura ou celular que não carrega? Descreva o problema e receba o orçamento. Você só autoriza o reparo se concordar.</p>
    <div class="btns">
      <a class="btn btn-red" href="#orcamento">Pedir orçamento</a>
      <a class="btn btn-wa" href="${wa("Olá! Quero um orçamento de conserto de celular. Modelo: ")}" data-track="celular-hero">${ic("chat")} Chamar no WhatsApp</a>
    </div>
    <ul class="chips"><li>${ic("check")} Avaliação e orçamento</li><li>${ic("check")} Você autoriza antes</li><li>${ic("pin")} Atendimento na loja</li></ul>
  </div>
  <div class="heroCard"><h2>Reparos mais comuns</h2>
    <ol><li><span class="num">✓</span><span><b>Troca de tela</b>Conforme o modelo e a peça.</span></li><li><span class="num">✓</span><span><b>Troca de bateria</b>Para o aparelho voltar a durar.</span></li><li><span class="num">✓</span><span><b>Conector de carga</b>Quando o celular não carrega direito.</span></li></ol>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <span class="eyebrow">Como funciona</span><h2>Do primeiro contato à entrega</h2>
  <div class="steps">
    <div class="step"><span class="num">1</span><h3>Contato</h3><p>Envie o modelo e o defeito pelo formulário ou WhatsApp.</p></div>
    <div class="step"><span class="num">2</span><h3>Avaliação</h3><p>O aparelho é recebido, identificado e avaliado na loja.</p></div>
    <div class="step"><span class="num">3</span><h3>Orçamento</h3><p>Você recebe o valor e as condições. Decide se autoriza.</p></div>
    <div class="step"><span class="num">4</span><h3>Reparo e testes</h3><p>Executamos o reparo viável e testamos o aparelho.</p></div>
    <div class="step"><span class="num">5</span><h3>Entrega</h3><p>Retirada na loja, com a ordem de serviço registrada.</p></div>
  </div>
  <div class="note"><b>Transparência:</b> nem todo defeito tem reparo viável. Se não valer a pena consertar o seu modelo, dizemos isso no orçamento.</div>
</div></section>

<section class="sec soft"><div class="wrap two">
  <div><span class="eyebrow">Orçamento</span><h2>Peça o orçamento do seu celular</h2>
    <p class="lead">Informe o modelo e o que está acontecendo. Se preferir, fale direto no WhatsApp.</p>
    <p><a class="btn btn-wa" href="${wa("Olá! Quero um orçamento de conserto de celular. Modelo: ")}" data-track="celular-meio">${ic("chat")} Falar no WhatsApp</a></p>
    <h3 style="margin-top:28px">Onde estamos</h3>
    <p>${ADDR.street}, ${ADDR.hood}, ${ADDR.city}–${ADDR.uf}. <a href="/contato">Ver mapa e contato</a></p>
  </div>
  ${form("celular", "orcamento", "Orçamento de conserto de celular")}
</div></section>

<section class="sec"><div class="wrap"><span class="eyebrow">Perguntas frequentes</span><h2>Antes de pedir seu orçamento</h2>${faq(celFaq)}</div></section>`,
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
  title: "Formatação de notebook e computador em Curitiba | Moby Cell",
  desc: "Formatação de notebook e computador no Campo de Santana, Curitiba. Peça seu orçamento de formatação pelo WhatsApp.",
  ld: [localBusiness(), faqLD(fmtFaq)],
  body: `
<section class="hero"><div class="wrap grid">
  <div>
    <span class="eyebrow">Campo de Santana · Curitiba</span>
    <h1>Formatação de notebook e computador.</h1>
    <p class="lead">Procurando onde formatar notebook perto de você? Fazemos a formatação do seu notebook ou computador na loja, no Campo de Santana.</p>
    <div class="btns">
      <a class="btn btn-red" href="#orcamento">Pedir orçamento</a>
      <a class="btn btn-wa" href="${wa("Olá! Quero um orçamento de formatação. Equipamento: ")}" data-track="formatacao-hero">${ic("chat")} Chamar no WhatsApp</a>
    </div>
  </div>
  <div class="heroCard"><h2>O que você precisa saber</h2>
    <ol><li><span class="num">✓</span><span><b>Serviço: formatação</b>Notebooks e computadores.</span></li><li><span class="num">!</span><span><b>Faça backup antes</b>Backup de arquivos não está incluído.</span></li><li><span class="num">!</span><span><b>Só formatação</b>Não fazemos reparo de hardware.</span></li></ol>
  </div>
</div></section>
<section class="sec soft"><div class="wrap two">
  <div><span class="eyebrow">Orçamento</span><h2>Peça o orçamento da formatação</h2>
    <p class="lead">Informe o modelo do equipamento e o que você espera do serviço.</p>
    <div class="note">Este serviço é exclusivamente <b>formatação</b>. Não realizamos troca de peças, reparo de placa, tela ou outros consertos em notebooks e computadores.</div></div>
  ${form("formatacao", "orcamento", "Orçamento de formatação")}
</div></section>
<section class="sec"><div class="wrap"><span class="eyebrow">Perguntas frequentes</span><h2>Sobre a formatação</h2>${faq(fmtFaq)}</div></section>`,
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
  title: "Impressão, xerox e plastificação no Campo de Santana, Curitiba | Moby Cell",
  desc: "Impressão de documentos, xerox, digitalização, plastificação e foto 3x4 no Campo de Santana, em Curitiba. Envie o arquivo pelo WhatsApp.",
  ld: [localBusiness(), faqLD(impFaq)],
  body: `
<section class="hero"><div class="wrap grid">
  <div>
    <span class="eyebrow">Campo de Santana · Curitiba</span>
    <h1>Impressão, xerox e plastificação perto de você.</h1>
    <p class="lead">Serviços rápidos para o dia a dia: documentos, trabalhos escolares, currículos e muito mais. Envie o arquivo pelo WhatsApp e consulte a disponibilidade.</p>
    <div class="btns">
      <a class="btn btn-wa" href="${wa("Olá! Quero imprimir um arquivo. Vou enviar aqui.")}" data-track="impressao-hero">${ic("chat")} Enviar arquivo no WhatsApp</a>
      <a class="btn btn-line" href="#orcamento">Pedir informações</a>
    </div>
  </div>
  <div class="heroCard"><h2>Serviços rápidos</h2>
    <ol><li><span class="num">✓</span><span><b>Impressão</b>Preto e branco e colorida.</span></li><li><span class="num">✓</span><span><b>Xerox e digitalização</b>Cópias e arquivos digitais.</span></li><li><span class="num">✓</span><span><b>Plastificação</b>Proteção para documentos.</span></li><li><span class="num">✓</span><span><b>Foto 3×4</b>Consulte a disponibilidade.</span></li></ol>
  </div>
</div></section>
<section class="sec soft"><div class="wrap two">
  <div><span class="eyebrow">Como pedir</span><h2>Simples e rápido</h2>
    <ul class="list"><li>${ic("check")}<span>Chame no WhatsApp e envie o arquivo</span></li><li>${ic("check")}<span>Confirmamos a disponibilidade e as condições</span></li><li>${ic("check")}<span>Você passa na loja para retirar</span></li></ul>
    <p>Realizamos impressões de documentos, xerox e plastificação no Campo de Santana. Consulte disponibilidade e informações pelo WhatsApp.</p></div>
  ${form("impressao", "orcamento", "Peça informações", "Diga o que precisa imprimir. Depois abrimos o WhatsApp para você enviar o arquivo.")}
</div></section>
<section class="sec"><div class="wrap"><span class="eyebrow">Perguntas frequentes</span><h2>Sobre impressões</h2>${faq(impFaq)}</div></section>`,
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
  title: "Canecas, azulejos e brindes personalizados em Curitiba | Moby Cell",
  desc: "Canecas, azulejos, copos, chaveiros, adesivos, cartões de visita e brindes personalizados no Campo de Santana, Curitiba. Peça seu orçamento.",
  ld: [localBusiness(), faqLD(perFaq)],
  body: `
<section class="hero"><div class="wrap grid">
  <div>
    <span class="eyebrow">Campo de Santana · Curitiba</span>
    <h1>Personalizados para presentear, divulgar e celebrar.</h1>
    <p class="lead">Canecas, azulejos, copos, chaveiros, cartões e brindes com a sua arte. Uma unidade ou muitas, para você, sua escola ou sua empresa.</p>
    <div class="btns">
      <a class="btn btn-red" href="#orcamento">Pedir orçamento</a>
      <a class="btn btn-wa" href="${wa("Olá! Quero um orçamento de produto personalizado. Produto e quantidade: ")}" data-track="personalizados-hero">${ic("chat")} Chamar no WhatsApp</a>
    </div>
  </div>
  <div class="heroCard"><h2>Para quem</h2>
    <ol><li><span class="num">✓</span><span><b>Presentes e lembrancinhas</b>Datas comemorativas e eventos.</span></li><li><span class="num">✓</span><span><b>Escolas</b>Pedidos em quantidade.</span></li><li><span class="num">✓</span><span><b>Empresas</b>Brindes e materiais gráficos.</span></li></ol>
  </div>
</div></section>
<section class="sec"><div class="wrap">
  <span class="eyebrow">Produtos</span><h2>O que produzimos</h2>
  <p class="lead">Os modelos disponíveis variam. Fale com a gente para confirmar o que está disponível para o seu pedido.</p>
  <ul class="cards" style="list-style:none;padding:0">${items.map((t) => `<li class="card" style="flex-direction:row;align-items:center;gap:12px">${ic("check")}<span>${t}</span></li>`).join("")}</ul>
</div></section>
<section class="sec soft"><div class="wrap two">
  <div><span class="eyebrow">Orçamento</span><h2>Conte a sua ideia</h2><p class="lead">Informe o produto, a quantidade e a data em que precisa. Se tiver a arte, envie pelo WhatsApp.</p>
    <div class="note">Em alguns pedidos solicitamos entrada antecipada. As condições são combinadas no orçamento.</div></div>
  ${form("personalizados", "orcamento", "Orçamento de personalizados")}
</div></section>
<section class="sec"><div class="wrap"><span class="eyebrow">Perguntas frequentes</span><h2>Sobre personalizados</h2>${faq(perFaq)}</div></section>`,
});

// ---------------------------------------------------------------- SOBRE
add({
  path: "/sobre", file: "sobre.html", current: "/sobre",
  title: "Sobre a Moby Cell | Assistência técnica de celulares e serviços rápidos em Curitiba",
  desc: "Conheça a Moby Cell, loja de bairro no Campo de Santana, em Curitiba: assistência técnica de celulares, formatação, impressões, personalizados e ponto Shopee.",
  ld: [localBusiness()],
  body: `
<section class="hero"><div class="wrap" style="max-width:820px">
  <span class="eyebrow">Sobre nós</span>
  <h1>Uma loja de bairro que resolve o seu dia a dia.</h1>
  <p class="lead">A Moby Cell é uma assistência técnica de celulares e loja de serviços rápidos no Campo de Santana, em Curitiba, conduzida por Alison e Júlia.</p>
</div></section>
<section class="sec"><div class="wrap" style="max-width:820px">
  <p>Aqui você encontra conserto de celular, formatação de notebooks e computadores, impressões, xerox e plastificação, produtos personalizados, acessórios e o ponto de coleta, envio e devolução da Shopee.</p>
  <p>Nosso jeito de trabalhar é simples: ouvir o problema, avaliar, passar o orçamento com clareza e só seguir com a sua autorização. Por ser uma equipe pequena, o atendimento é direto, feito por quem executa o serviço.</p>
  <h2 style="margin-top:1.4em">Nossos serviços</h2>
  <ul class="list">${NAV.slice(0, 4).map(([h, t]) => `<li>${ic("check")}<a href="${h}">${t}</a></li>`).join("")}</ul>
  <div class="btns"><a class="btn btn-red" href="/orcamento">Pedir orçamento</a><a class="btn btn-line" href="/contato">Como chegar</a></div>
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
  title: "Contato e localização | Moby Cell – Campo de Santana, Curitiba",
  desc: "Endereço, mapa e WhatsApp da Moby Cell, na Rua Ângelo Tozim, 239, Campo de Santana, Curitiba.",
  ld: [localBusiness(), faqLD(ctFaq)],
  body: `
<section class="sec"><div class="wrap two">
  <div>
    <span class="eyebrow">Contato</span><h1>Fale com a Moby Cell</h1>
    <ul class="info">
      <li>${ic("pin")}<span><b>${ADDR.street}</b><br>${ADDR.hood}, ${ADDR.city} – ${ADDR.uf}<br>CEP ${ADDR.cep}</span></li>
      <li>${ic("chat")}<span><b>WhatsApp</b><br><a href="${wa("Olá! Vim pelo site da Moby Cell.")}" data-track="contato">(41) 99133-2951</a></span></li>
      <li>${ic("clock")}<span><b>Horário de atendimento</b><br>${HOURS.map(([d, h]) => `${d}: ${h}`).join("<br>")}<br><span class="small">Em datas especiais os horários podem mudar. Confirme pelo WhatsApp.</span></span></li>
      <li>${ic("card")}<span><b>Pagamento</b><br>Dinheiro, cartão e Pix.</span></li>
    </ul>
    <div class="btns"><a class="btn btn-wa" href="${wa("Olá! Vim pelo site da Moby Cell.")}" data-track="contato-btn">${ic("chat")} Chamar no WhatsApp</a><a class="btn btn-line" href="${MAPS}" target="_blank" rel="noopener">Abrir no Google Maps</a></div>
  </div>
  <iframe class="map" title="Mapa da Moby Cell" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent("Rua Ângelo Tozim, 239, Curitiba")}&output=embed"></iframe>
</div></section>
<section class="sec soft"><div class="wrap"><h2>Perguntas rápidas</h2>${faq(ctFaq)}</div></section>`,
});

// ---------------------------------------------------------------- ORÇAMENTO
add({
  path: "/orcamento", file: "orcamento.html", current: "",
  title: "Pedir orçamento | Moby Cell – Campo de Santana, Curitiba",
  desc: "Peça seu orçamento de conserto de celular, formatação, impressões ou personalizados na Moby Cell, no Campo de Santana, em Curitiba.",
  ld: [localBusiness()],
  body: `
<section class="sec"><div class="wrap two">
  <div><span class="eyebrow">Orçamento</span><h1>Peça seu orçamento</h1>
    <p class="lead">Conte o que você precisa. Depois abrimos o WhatsApp com a sua mensagem pronta para continuar o atendimento.</p>
    <ul class="list"><li>${ic("check")}<span>Você aprova o orçamento antes de qualquer reparo</span></li><li>${ic("check")}<span>Atendimento na loja, no Campo de Santana</span></li><li>${ic("check")}<span>Pagamento em dinheiro, cartão e Pix</span></li></ul></div>
  ${form("", "orcamento", "Seus dados")}
</div></section>`,
});

// ---------------------------------------------------------------- PRIVACIDADE
add({
  path: "/privacidade", file: "privacidade.html", current: "",
  title: "Política de Privacidade | Moby Cell",
  desc: "Como a Moby Cell trata os dados enviados pelo site, conforme a LGPD.",
  index: false,
  body: `
<section class="sec"><div class="wrap" style="max-width:780px">
  <h1>Política de Privacidade</h1>
  <p class="muted">Moby Cell · ${ADDR.street}, ${ADDR.hood}, ${ADDR.city}–${ADDR.uf}, CEP ${ADDR.cep} · CNPJ 42.252.647/0001-50</p>
  <h2>1. Dados que coletamos</h2>
  <p>Quando você preenche o formulário de orçamento, coletamos o nome, o WhatsApp, o tipo de serviço, o modelo do aparelho e a descrição que você escrever. Também registramos a página em que você estava e, quando existirem, dados de origem da visita (como a campanha ou o site de onde você veio), para sabermos como você chegou até nós.</p>
  <h2>2. Para que usamos</h2>
  <p>Usamos esses dados para responder ao seu pedido, preparar o orçamento e manter contato sobre o atendimento. Também analisamos, de forma agregada, quais canais trazem clientes.</p>
  <h2>3. Onde ficam os dados</h2>
  <p>Os dados enviados pelo formulário ficam no sistema de gestão da loja, hospedado em provedor de nuvem. Não vendemos seus dados. A conversa pelo WhatsApp é tratada pela plataforma da Meta, conforme a política dela.</p>
  <h2>4. Cookies e medição</h2>
  <p>Se você aceitar, usamos cookies do Google (Analytics e Google Ads) para medir visitas e a eficácia dos anúncios. Se recusar, o site funciona normalmente, sem esses cookies.</p>
  <h2>5. Seus direitos</h2>
  <p>Pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir acesso, correção ou exclusão dos seus dados. Basta nos chamar pelo <a href="${wa("Olá! Quero exercer meus direitos sobre dados pessoais (LGPD).")}">WhatsApp (41) 99133-2951</a>.</p>
  <h2>6. Atualizações</h2>
  <p>Esta política pode ser atualizada. A versão em vigor é a publicada nesta página.</p>
</div></section>`,
});

// ---------------------------------------------------------------- 404
add({
  path: "/404", file: "404.html", current: "", index: false,
  title: "Página não encontrada | Moby Cell", desc: "Página não encontrada.",
  body: `<section class="sec"><div class="wrap" style="max-width:640px"><h1>Página não encontrada</h1><p class="lead">O endereço pode ter mudado. Volte ao início ou fale com a gente.</p><div class="btns"><a class="btn btn-red" href="/">Ir para o início</a><a class="btn btn-wa" href="${wa("Olá!")}">${ic("chat")} WhatsApp</a></div></div></section>`,
});

for (const p of pages) {
  const f = join(OUT, p.file);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, layout(p));
}

const today = new Date().toISOString().slice(0, 10);
const urls = pages.filter((p) => p.index !== false);
writeFileSync(join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((p) => `  <url><loc>${SITE}${p.path === "/" ? "/" : p.path}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
writeFileSync(join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`ok: ${pages.length} páginas`);
