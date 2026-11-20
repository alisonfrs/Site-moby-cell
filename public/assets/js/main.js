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

  // ---- formulário de orçamento (campos mudam conforme o serviço)
  var LABEL = { celular: "conserto de celular", formatacao: "formatação de notebook/computador", impressao: "impressão/xerox/plastificação", personalizados: "produtos personalizados", outro: "outro assunto" };
  function val(f, n) {
    var l = f.querySelectorAll("[name=" + n + "]");
    for (var i = 0; i < l.length; i++) if (!l[i].disabled) return String(l[i].value || "").trim();
    return "";
  }
  function compose(f, k) {
    var l = [];
    if (k === "celular") { l.push("Modelo: " + val(f, "modelo")); l.push("Problema: " + val(f, "problema")); }
    else if (k === "formatacao") { l.push("Equipamento: " + val(f, "equipamento") + (val(f, "modelo") ? " (" + val(f, "modelo") + ")" : "")); }
    else if (k === "impressao") { l.push("Serviço: " + val(f, "tipo")); if (val(f, "quantidade")) l.push("Quantidade: " + val(f, "quantidade")); l.push("Vou enviar o arquivo por aqui."); }
    else if (k === "personalizados") { l.push("Produto: " + val(f, "produto")); l.push("Quantidade: " + val(f, "quantidade")); if (val(f, "data")) l.push("Data desejada: " + val(f, "data")); if (val(f, "descricao")) l.push("Personalização: " + val(f, "descricao")); }
    else { l.push(val(f, "mensagem")); }
    return l;
  }
  function device(f, k) {
    if (k === "celular") return val(f, "modelo");
    if (k === "formatacao") return [val(f, "equipamento"), val(f, "modelo")].filter(Boolean).join(" ");
    if (k === "impressao") return val(f, "tipo");
    if (k === "personalizados") return val(f, "produto");
    return "";
  }
  $$("form.lead").forEach(function (f) {
    var sel = f.elements.servico, msg = $(".fmsg", f), btn = $("button[type=submit]", f);
    function toggle() {
      $$(".grp", f).forEach(function (g) {
        var on = g.getAttribute("data-for") === sel.value;
        g.hidden = !on;
        $$("input,select,textarea", g).forEach(function (el) { el.disabled = !on; });
      });
    }
    sel.addEventListener("change", toggle); toggle();

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      msg.className = "fmsg"; msg.textContent = "";
      var bad = null;
      $$("[data-req]", f).forEach(function (el) {
        if (el.disabled) return;
        var ok = el.type === "checkbox" ? el.checked : el.value.trim().length >= (el.name === "nome" ? 2 : 1);
        var er = document.getElementById(el.id + "-e") || document.getElementById(el.id.replace(/-c$/, "") + "-c-e");
        if (el.type === "checkbox") er = document.getElementById(el.id + "-e");
        if (er) er.textContent = ok ? "" : el.getAttribute("data-err");
        if (ok) el.removeAttribute("aria-invalid"); else { el.setAttribute("aria-invalid", "true"); if (!bad) bad = el; }
      });
      var tel = val(f, "telefone"), telEl = f.elements.telefone, telErr = document.getElementById(telEl.id + "-e");
      var telOk = !tel || tel.replace(/\D/g, "").length >= 10;
      telErr.textContent = telOk ? "" : "Informe o WhatsApp com DDD ou deixe em branco.";
      if (telOk) telEl.removeAttribute("aria-invalid"); else { telEl.setAttribute("aria-invalid", "true"); if (!bad) bad = telEl; }
      if (bad) { bad.focus(); return; }
      if (f.elements.website.value) return; // honeypot

      var k = sel.value, nome = val(f, "nome"), linhas = compose(f, k);
      var lbl = btn.innerHTML; btn.disabled = true; btn.textContent = "Abrindo o WhatsApp…";
      var text = "Olá! Vim pelo site da Moby Cell e quero um orçamento de " + LABEL[k] + ".\n" + linhas.join("\n") + "\nNome: " + nome;
      var wa = "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text);
      var done = function () {
        track("generate_lead", { service: k, page_path: location.pathname });
        if (C.adsId && C.adsLeadLabel) track("conversion", { send_to: C.adsId + "/" + C.adsLeadLabel });
        setTimeout(function () { location.href = wa; }, 250);
      };
      // Com WhatsApp informado, o pedido também é registrado no sistema da loja.
      if (!tel || !C.leadEndpoint) return done();
      var body = Object.assign({}, { nome: nome, telefone: tel, servico: k, aparelho: device(f, k), mensagem: linhas.join(" | ").slice(0, 900) }, attr, { pagina: location.pathname, website: "", session_id: window.mobySession ? window.mobySession() : undefined, device: window.matchMedia("(max-width: 860px)").matches ? "mobile" : "desktop" });
      var ctl = window.AbortController ? new AbortController() : null;
      var t = setTimeout(function () { if (ctl) ctl.abort(); }, 6000);
      fetch(C.leadEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined })
        .catch(function () {})
        .then(function () { clearTimeout(t); done(); });
    });
  });
})();
