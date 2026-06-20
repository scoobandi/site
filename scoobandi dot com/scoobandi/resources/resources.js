/* =============================================================
   RESOURCES — nav toggle + FAQ accordion + dark mode toggle
============================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
     Dark mode toggle
  ------------------------------------------------------- */
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const html = document.documentElement;
    const stored = localStorage.getItem('scoobandi-theme');
    if (stored) html.setAttribute('data-theme', stored);

    toggle.addEventListener('click', function () {
      const current = html.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('scoobandi-theme', next);
    });
  }

  /* -------------------------------------------------------
     Mobile nav hamburger
  ------------------------------------------------------- */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      const isOpen = toggle.classList.contains('open');
      toggle.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.classList.toggle('open', !isOpen);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
      }
    });
  }

  /* -------------------------------------------------------
     Sticky header scroll shadow
  ------------------------------------------------------- */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const observer = new IntersectionObserver(
      function (entries) {
        header.classList.toggle('scrolled', !entries[0].isIntersecting);
      },
      { rootMargin: '-1px 0px 0px 0px', threshold: [1] }
    );

    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(sentinel);
    observer.observe(sentinel);
  }

  /* -------------------------------------------------------
     FAQ accordion
  ------------------------------------------------------- */
  function initFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      const trigger = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!trigger || !answer) return;

      trigger.addEventListener('click', function () {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Close all open items first
        items.forEach(function (other) {
          const otherTrigger = other.querySelector('.faq-question');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherTrigger && otherAnswer) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherAnswer.hidden = true;
          }
        });

        // Toggle this one
        if (!isOpen) {
          trigger.setAttribute('aria-expanded', 'true');
          answer.hidden = false;
        }
      });
    });
  }

  /* -------------------------------------------------------
     Footer year
  ------------------------------------------------------- */
  function setFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------
     Init
  ------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initMobileNav();
    initStickyHeader();
    initFaqAccordion();
    setFooterYear();
  });
})();
