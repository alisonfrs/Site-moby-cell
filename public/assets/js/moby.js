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
