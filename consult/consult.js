/* =============================================================
   CONSULT PAGE — JavaScript
   - FAQ accordion
   - Calendar iframe height auto-resize
   - CTA event tracking (Meta Pixel + custom events)
   - Scroll depth tracking
============================================================= */

(function () {
  'use strict';

  // -------------------------------------------------------
  // FAQ ACCORDION
  // -------------------------------------------------------
  document.querySelectorAll('.faq-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var answerId = this.getAttribute('aria-controls');
      var answer = document.getElementById(answerId);

      // Close all others
      document.querySelectorAll('.faq-trigger').forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
        var a = document.getElementById(t.getAttribute('aria-controls'));
        if (a) a.hidden = true;
      });

      // Toggle this one
      if (!expanded) {
        this.setAttribute('aria-expanded', 'true');
        if (answer) answer.hidden = false;
      }
    });
  });


  // -------------------------------------------------------
  // MOBILE NAV TOGGLE
  // -------------------------------------------------------
  var navToggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        navToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }


  // -------------------------------------------------------
  // CTA CLICK TRACKING
  // -------------------------------------------------------
  function trackEvent(name, params) {
    // Meta Pixel
    if (typeof fbq === 'function') {
      fbq('trackCustom', name, params || {});
    }
    // Console in dev
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[consult event]', name, params);
    }
  }

  document.querySelectorAll('[data-event]').forEach(function (el) {
    el.addEventListener('click', function () {
      trackEvent(this.dataset.event, {
        location: this.dataset.location || 'unknown',
        page: 'consult'
      });
    });
  });


  // -------------------------------------------------------
  // SCROLL DEPTH TRACKING
  // -------------------------------------------------------
  var scrollMilestones = { 25: false, 50: false, 75: false, 90: false };

  function onScroll() {
    var scrolled = window.scrollY + window.innerHeight;
    var total = document.documentElement.scrollHeight;
    var pct = Math.round((scrolled / total) * 100);

    Object.keys(scrollMilestones).forEach(function (milestone) {
      if (!scrollMilestones[milestone] && pct >= milestone) {
        scrollMilestones[milestone] = true;
        trackEvent('consult_scroll_depth', { depth: milestone + '%' });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  // -------------------------------------------------------
  // CALENDAR IFRAME — auto-resize via postMessage
  // -------------------------------------------------------
  // iframe resize handled by inline script in index.html — no duplicate listener needed
  window.addEventListener('message', function (e) {
    if (false) { // disabled — handled inline
      var iframe = document.getElementById('consult-calendar-iframe');
      if (iframe && e.data.height) {
        iframe.style.height = (e.data.height + 40) + 'px';
      }
    }

    // Track booking events from GHL widget
    if (e.data && typeof e.data === 'string') {
      try {
        var msg = JSON.parse(e.data);
        if (msg.event === 'booking_start') {
          trackEvent('consult_booking_start', { page: 'consult' });
        }
        if (msg.event === 'booking_complete') {
          trackEvent('consult_booking_complete', { page: 'consult' });
          if (typeof fbq === 'function') {
            fbq('track', 'Lead');
          }
        }
      } catch (err) { /* not JSON, ignore */ }
    }
  });


  // -------------------------------------------------------
  // TRACK PAGE VIEW
  // -------------------------------------------------------
  trackEvent('consult_page_view', { page: 'consult' });

  // Track calendar visible
  var calendarWrap = document.querySelector('.consult-calendar-wrap');
  if (calendarWrap && 'IntersectionObserver' in window) {
    var calObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          trackEvent('consult_calendar_view', { page: 'consult' });
          calObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    calObserver.observe(calendarWrap);
  }

}());
