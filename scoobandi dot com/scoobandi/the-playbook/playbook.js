/* =============================================================
   THE PLAYBOOK — Page JS
   FAQ accordion, mobile nav, scroll tracking, Meta Pixel events
============================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
     MOBILE NAV TOGGLE
  ------------------------------------------------------- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.contains('open');
      toggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* -------------------------------------------------------
     FAQ ACCORDION
  ------------------------------------------------------- */
  document.querySelectorAll('.faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-trigger').forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        const panel = document.getElementById(other.getAttribute('aria-controls'));
        if (panel) panel.hidden = true;
      });
      // Toggle clicked
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) panel.hidden = false;
      }
    });
  });


  /* -------------------------------------------------------
     SCROLL TRACKING — page view event
  ------------------------------------------------------- */
  function fireEvent(name, params) {
    if (typeof gtag === 'function') {
      gtag('event', name, params || {});
    }
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({ event: name, ...params });
    }
  }

  fireEvent('playbook_page_view', {
    page_path: window.location.pathname,
    utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
    utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
    utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || '',
  });


  /* -------------------------------------------------------
     CTA CLICK TRACKING
  ------------------------------------------------------- */
  document.querySelectorAll('[data-event]').forEach(el => {
    el.addEventListener('click', () => {
      const eventName = el.dataset.event;
      const location = el.dataset.location || '';
      fireEvent(eventName, { location, page_path: window.location.pathname });

      // Meta Pixel events
      if (typeof fbq === 'function') {
        if (eventName.includes('primary')) {
          fbq('track', 'InitiateCheckout', { content_name: 'The Playbook', content_category: 'coaching' });
        }
      }
    });
  });


  /* -------------------------------------------------------
     SMOOTH SCROLL for hash links
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
