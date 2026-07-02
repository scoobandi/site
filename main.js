(function () {
  var year = document.querySelectorAll("[data-year]");
  year.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  function params(el) {
    return {
      location: el.getAttribute("data-location") || "",
      path: el.getAttribute("data-path") || "",
      href: el.getAttribute("href") || "",
      page: document.body.getAttribute("data-page") || ""
    };
  }

  function track(eventName, data) {
    if (!eventName) return;
    if (typeof window.gtag === "function") window.gtag("event", eventName, data || {});
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", eventName, data || {});
      if (eventName === "dds_checkout_click" || eventName === "fix_the_walk_checkout_click") {
        window.fbq("track", "InitiateCheckout", data || {});
      }
      if (eventName === "consult_booking_click" || eventName === "quiz_click") {
        window.fbq("track", "Lead", data || {});
      }
      if (eventName === "resource_offer_click" || eventName === "proof_click") {
        window.fbq("track", "ViewContent", data || {});
      }
    }
  }

  document.addEventListener("click", function (event) {
    var el = event.target.closest("[data-event]");
    if (!el) return;
    track(el.getAttribute("data-event"), params(el));
  });
})();
