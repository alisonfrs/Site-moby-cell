// Páginas internas: menu do celular e conversões de clique (WhatsApp / Ligar / Rota).
// O gtag só existe depois que o visitante aceita os cookies (main.js).
(function () {
  "use strict";
  var drawer = document.getElementById("drawer"), btn = document.querySelector(".menu-btn");
  function setMenu(open) {
    if (!drawer || !btn) return;
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (btn) btn.addEventListener("click", function () { setMenu(true); });
  if (drawer) Array.prototype.forEach.call(drawer.querySelectorAll("[data-close]"), function (el) {
    el.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  function track(kind, where) {
    if (!window.gtag) return;
    var C = window.MOBY || {};
    if (kind !== "whatsapp_conversion") window.gtag("event", kind, { link_location: where, page_path: location.pathname });
    var lbl = kind === "whatsapp_conversion" ? C.adsWhatsappLabel : kind === "call_click" ? C.adsCallLabel : "";
    if (C.adsId && lbl) window.gtag("event", "conversion", { send_to: C.adsId + "/" + lbl });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a) return;
    var h = a.getAttribute("href") || "";
    if (h.indexOf("tel:") === 0) track("call_click", "ligar");
    else if (a.classList.contains("js-route")) track("route_click", "rota");
    else if (h.indexOf("https://wa.me") === 0) track("whatsapp_conversion", a.getAttribute("data-track") || "link");
  });
})();

// ---- Visitas e cliques para o Moby Control (sem cookies e sem dados pessoais).
// A visita ganha um código aleatório que dura só enquanto a aba estiver aberta.
(function () {
  "use strict";
  var C = window.MOBY || {};
  function sid() {
    var k = "moby_sid", v = null;
    try { v = sessionStorage.getItem(k); } catch (e) {}
    if (!v) {
      v = (Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12));
      try { sessionStorage.setItem(k, v); } catch (e) {}
    }
    return v;
  }
  window.mobySession = sid;
  function attr() {
    var a = {};
    try { a = JSON.parse(sessionStorage.getItem("moby_attr") || "{}"); } catch (e) {}
    var q = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "gclid"].forEach(function (k) { if (q.get(k) && !a[k]) a[k] = q.get(k).slice(0, 200); });
    if (!a.referrer && document.referrer) { try { var h = new URL(document.referrer).hostname; if (h !== location.hostname) a.referrer = h; } catch (e) {} }
    try { sessionStorage.setItem("moby_attr", JSON.stringify(a)); } catch (e) {}
    return a;
  }
  var A = attr();
  var device = window.matchMedia("(max-width: 860px)").matches ? "mobile" : "desktop";
  function send(type, label) {
    if (!C.eventEndpoint) return;
    var body = JSON.stringify({ type: type, label: label || null, page: location.pathname, session_id: sid(), device: device,
      utm_source: A.utm_source, utm_medium: A.utm_medium, utm_campaign: A.utm_campaign, gclid: A.gclid, referrer: A.referrer });
    // text/plain: o navegador envia direto, sem pedido de permissão prévio (CORS).
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(C.eventEndpoint, new Blob([body], { type: "text/plain" }))) return;
    } catch (e) {}
    try { fetch(C.eventEndpoint, { method: "POST", body: body, headers: { "Content-Type": "text/plain" }, keepalive: true, mode: "cors" }).catch(function () {}); } catch (e) {}
  }
  window.mobyEvent = send;
  send("page_view");
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a) return;
    var h = a.getAttribute("href") || "";
    var where = a.getAttribute("data-track") || (a.textContent || "").trim().slice(0, 40);
    if (h.indexOf("https://wa.me") === 0) send("whatsapp_click", where);
    else if (h.indexOf("tel:") === 0) send("call_click", where);
    else if (a.classList.contains("js-route") || /google\.[a-z.]+\/maps/.test(h)) send("route_click", where);
  });
})();
