(function () {
  "use strict";
  var C = window.MOBY || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---- menu mobile
  var b = $(".burger"), m = $(".mnav");
  if (b && m) b.addEventListener("click", function () {
    var o = m.classList.toggle("open"); b.setAttribute("aria-expanded", o);
  });

  // ---- origem do visitante (UTM / gclid) guardada na sessão
  var KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];
  var attr = {};
  try { attr = JSON.parse(sessionStorage.getItem("moby_attr") || "{}"); } catch (e) {}
  var q = new URLSearchParams(location.search), changed = false;
  KEYS.forEach(function (k) { if (q.get(k)) { attr[k] = q.get(k).slice(0, 200); changed = true; } });
  if (!attr.referrer && document.referrer) { try { attr.referrer = new URL(document.referrer).hostname; changed = true; } catch (e) {} }
  if (changed) { try { sessionStorage.setItem("moby_attr", JSON.stringify(attr)); } catch (e) {} }

  // ---- medição (só após aceitar cookies)
  function track(name, params) {
    if (window.gtag) window.gtag("event", name, params || {});
  }
  function loadTags() {
    var id = C.ga4 || C.adsId;
    if (!id || window.gtag) return;
    var s = document.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    if (C.ga4) window.gtag("config", C.ga4);
    if (C.adsId) window.gtag("config", C.adsId);
  }
  var ck = $("#ck"), consent = null;
  try { consent = localStorage.getItem("moby_consent"); } catch (e) {}
  if (C.ga4 || C.adsId) {
    if (consent === "yes") loadTags();
    else if (consent === null && ck) ck.classList.add("show");
  }
  $$("[data-ck]", document).forEach(function (btn) {
    btn.addEventListener("click", function () {
      var yes = btn.getAttribute("data-ck") === "yes";
      try { localStorage.setItem("moby_consent", yes ? "yes" : "no"); } catch (e) {}
      if (ck) ck.classList.remove("show");
      if (yes) loadTags();
    });
  });

  // ---- cliques de WhatsApp / telefone
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href^='https://wa.me'],a[data-track]");
    if (!a) return;
    track("whatsapp_click", { link_location: a.getAttribute("data-track") || "link", page_path: location.pathname });
  });

  // ---- formulário de orçamento
  var LABEL = { celular: "conserto de celular", formatacao: "formatação de notebook/computador", impressao: "impressão/xerox/plastificação", personalizados: "produtos personalizados", outro: "outro assunto" };
  $$("form.lead").forEach(function (f) {
    var sel = f.elements.servico, dev = $(".dev", f);
    function toggle() { if (dev) dev.style.display = (sel.value === "celular" || sel.value === "formatacao") ? "" : "none"; }
    if (sel) { sel.addEventListener("change", toggle); toggle(); }
    var msg = $(".fmsg", f), btn = $("button[type=submit]", f);

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.className = "fmsg"; msg.textContent = "";
      var d = {
        nome: f.elements.nome.value.trim(),
        telefone: f.elements.telefone.value.trim(),
        servico: sel.value,
        aparelho: f.elements.aparelho ? f.elements.aparelho.value.trim() : "",
        mensagem: f.elements.mensagem.value.trim()
      };
      var bad = null;
      function chk(el, ok, t) {
        var id = el.id, e = document.getElementById(id + "-e");
        if (e) e.textContent = ok ? "" : t;
        if (ok) el.removeAttribute("aria-invalid"); else { el.setAttribute("aria-invalid", "true"); if (!bad) bad = el; }
      }
      chk(f.elements.nome, d.nome.length >= 2, "Informe seu nome.");
      chk(f.elements.telefone, d.telefone.replace(/\D/g, "").length >= 10, "Informe um WhatsApp com DDD.");
      chk(sel, !!d.servico, "Escolha o serviço.");
      chk(f.elements.consent, f.elements.consent.checked, "Aceite o uso dos dados para receber o orçamento.");
      if (bad) { bad.focus(); return; }
      if (f.elements.website.value) return; // honeypot

      var lbl = btn.innerHTML; btn.disabled = true; btn.textContent = "Enviando…";
      var body = Object.assign({}, d, attr, { pagina: location.pathname, website: "" });
      var text = "Olá! Vim pelo site da Moby Cell e quero um orçamento de " + LABEL[d.servico] + "." +
        (d.aparelho ? "\nAparelho: " + d.aparelho : "") +
        (d.mensagem ? "\n" + d.mensagem : "") + "\nNome: " + d.nome;
      var wa = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text);

      var done = function () {
        track("generate_lead", { service: d.servico, page_path: location.pathname });
        if (C.adsId && C.adsLeadLabel) track("conversion", { send_to: C.adsId + "/" + C.adsLeadLabel });
        // pequeno atraso para o evento sair antes da navegação
        setTimeout(function () { location.href = wa; }, 250);
      };
      var ctl = window.AbortController ? new AbortController() : null;
      var t = setTimeout(function () { if (ctl) ctl.abort(); }, 6000);
      if (!C.leadEndpoint) { clearTimeout(t); return done(); }
      fetch(C.leadEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined })
        .catch(function () {}) // se falhar, o cliente ainda é atendido pelo WhatsApp
        .then(function () { clearTimeout(t); done(); });
    });
    function err(t) { msg.className = "fmsg err"; msg.textContent = t; }
  });
})();
