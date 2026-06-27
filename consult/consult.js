(function () {
  "use strict";

  function trackEvent(name, params) {
    if (typeof fbq === "function") {
      fbq("trackCustom", name, params || {});
    }
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.log("[consult event]", name, params);
    }
  }

  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      if (!navToggle.contains(event.target) && !mobileNav.contains(event.target)) {
        mobileNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll("[data-event]").forEach(function (el) {
    el.addEventListener("click", function () {
      trackEvent(this.dataset.event, {
        location: this.dataset.location || "unknown",
        page: "consult"
      });
    });
  });

  document.querySelectorAll('a[href="#scheduler"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var scheduler = document.getElementById("scheduler");
      if (!scheduler) return;
      event.preventDefault();
      var top = scheduler.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: top, behavior: "smooth" });
      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", "#scheduler");
      }
    });
  });

  window.addEventListener("message", function (event) {
    var iframe = document.getElementById("consult-calendar-iframe");
    var height = null;

    if (event.data && typeof event.data === "object") {
      if (event.data.height) height = event.data.height;
      else if (event.data.iframeHeight) height = event.data.iframeHeight;
      else if (event.data.type === "height" && event.data.value) height = event.data.value;
      else if (event.data.type === "iframeHeight" && event.data.height) height = event.data.height;
    } else if (typeof event.data === "number" && event.data > 200) {
      height = event.data;
    } else if (typeof event.data === "string") {
      try {
        var msg = JSON.parse(event.data);
        if (msg.event === "booking_start") trackEvent("consult_booking_start", { page: "consult" });
        if (msg.event === "booking_complete") {
          trackEvent("consult_booking_complete", { page: "consult" });
          if (typeof fbq === "function") fbq("track", "Lead");
        }
      } catch (err) {
        return;
      }
    }

    if (iframe && height && height > 200) {
      iframe.style.height = (parseInt(height, 10) + 60) + "px";
      iframe.style.minHeight = (parseInt(height, 10) + 60) + "px";
    }
  });

  var calendar = document.getElementById("scheduler");
  if (calendar && "IntersectionObserver" in window) {
    var calendarObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          trackEvent("consult_calendar_view", { page: "consult" });
          calendarObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    calendarObserver.observe(calendar);
  }

  var lightbox = document.getElementById("proof-lightbox");
  var lightboxImg = document.getElementById("proof-lightbox-img");
  var lightboxClose = document.getElementById("proof-lightbox-close");

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImg) {
      lightboxImg.removeAttribute("src");
      lightboxImg.removeAttribute("alt");
    }
  }

  document.querySelectorAll("[data-lightbox-src]").forEach(function (img) {
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.addEventListener("click", function () {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = img.dataset.lightboxSrc;
      lightboxImg.alt = img.alt || "Client review";
      lightbox.hidden = false;
    });
    img.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        img.click();
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLightbox();
  });

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  trackEvent("consult_page_view", { page: "consult" });
}());
