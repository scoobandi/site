/* =============================================================
   SCOOB & I - Homepage JS
   Navigation, tracking helpers, proof lightbox, footer year
============================================================= */

'use strict';

document.documentElement.setAttribute('data-theme', 'dark');

function getUTM() {
  var p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get('utm_source') || '',
    utm_medium: p.get('utm_medium') || '',
    utm_campaign: p.get('utm_campaign') || ''
  };
}

function track(eventName, params) {
  params = params || {};
  if (typeof gtag !== 'undefined') gtag('event', eventName, params);
  if (typeof fbq !== 'undefined') fbq('trackCustom', eventName, params);
}

track('homepage_view', getUTM());

(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var open = toggle.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('open', open);
  });

  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });
})();

document.querySelectorAll('[data-event]').forEach(function (el) {
  el.addEventListener('click', function () {
    var eventName = el.dataset.event;
    var params = Object.assign({
      location: el.dataset.location || '',
      path: el.dataset.path || ''
    }, getUTM());

    track(eventName, params);

    if (eventName === 'quiz_start' && typeof fbq !== 'undefined') {
      fbq('track', 'InitiateCheckout');
    }
  });
});

document.addEventListener('click', function (e) {
  var link = e.target.closest('a[href="#paths"]');
  if (!link) return;
  var target = document.getElementById('paths');
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, true);

document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var id = a.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

(function () {
  var lightbox = document.getElementById('proof-lightbox');
  if (!lightbox) return;

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('proof-lightbox-close')) {
      lightbox.hidden = true;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') lightbox.hidden = true;
  });
})();

(function () {
  var el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();
