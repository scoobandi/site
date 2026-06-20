/* =============================================================
   SCOOB & I — Homepage JS v2
   Quiz engine, FAQ accordion, nav, tracking
============================================================= */

'use strict';

// -------------------------------------------------------
// THEME — respect system preference, force dark by default
// -------------------------------------------------------
(function () {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
})();

// -------------------------------------------------------
// TRACKING — GA4 + Meta Pixel dual-fire
// -------------------------------------------------------
function track(eventName, params) {
  params = params || {};
  if (typeof gtag !== 'undefined') gtag('event', eventName, params);
  if (typeof fbq !== 'undefined') fbq('trackCustom', eventName, params);
  // Debug logging — remove in production if preferred
  console.log('[track]', eventName, params);
}

// -------------------------------------------------------
// UTM CAPTURE
// -------------------------------------------------------
function getUTM() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source:   p.get('utm_source')   || '',
    utm_medium:   p.get('utm_medium')   || '',
    utm_campaign: p.get('utm_campaign') || '',
  };
}

// -------------------------------------------------------
// HOMEPAGE VIEW — fires on load
// -------------------------------------------------------
track('homepage_view', getUTM());

// -------------------------------------------------------
// STICKY HEADER
// -------------------------------------------------------
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

// -------------------------------------------------------
// MOBILE NAV TOGGLE
// -------------------------------------------------------
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    const open = toggle.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
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

// -------------------------------------------------------
// FAQ ACCORDION
// -------------------------------------------------------
(function () {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      document.querySelectorAll('.faq-question').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        const ans = document.getElementById(other.getAttribute('aria-controls'));
        if (ans) ans.setAttribute('hidden', '');
      });

      // Toggle this one
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        const ans = document.getElementById(btn.getAttribute('aria-controls'));
        if (ans) ans.removeAttribute('hidden');
      }
    });
  });
})();

// -------------------------------------------------------
// PATH CTA TRACKING — for the three-path cards
// -------------------------------------------------------
document.querySelectorAll('[data-event="path_cta_click"]').forEach(function (el) {
  el.addEventListener('click', function () {
    track('path_cta_click', Object.assign({ path: el.dataset.path || '' }, getUTM()));
  });
});

// -------------------------------------------------------
// QUIZ ENGINE
// -------------------------------------------------------
(function () {
  const SCREENS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q-email'];
  const RESULTS = ['result-dds', 'result-playbook', 'result-consult'];
  const TOTAL_Q = 7;

  const shell = document.getElementById('quiz-shell');
  if (!shell) return;

  let quizStarted = false;
  let scores = { dds: 0, playbook: 0, consult: 0 };
  let answers = {};

  // --- Progress ---
  function setProgress(qNum) {
    const pct = Math.min(100, Math.round((qNum / TOTAL_Q) * 100));
    const bar   = document.getElementById('quiz-progress-bar');
    const label = document.getElementById('quiz-progress-label');
    if (bar) bar.style.width = pct + '%';
    if (label) {
      if (qNum <= TOTAL_Q) label.textContent = 'Question ' + qNum + ' of ' + TOTAL_Q;
      else label.textContent = 'Almost there';
    }
    const progressEl = shell.querySelector('.quiz-progress');
    if (progressEl) progressEl.setAttribute('aria-valuenow', pct);
  }

  // --- Show screen ---
  function show(id, skipScroll) {
    SCREENS.concat(RESULTS).forEach(function (sid) {
      const el = document.getElementById(sid);
      if (el) el.setAttribute('hidden', '');
    });

    const target = document.getElementById(id);
    if (!target) return;
    target.removeAttribute('hidden');

    const qNum = parseInt(id.replace('q', ''), 10);
    if (!isNaN(qNum) && qNum >= 1 && qNum <= TOTAL_Q) setProgress(qNum);
    else if (id === 'q8' || id === 'q-email') setProgress(TOTAL_Q + 1);

    // Scroll quiz section into view on mobile if it's off-screen (skip on init)
    if (!skipScroll) {
      const quizSection = document.getElementById('quiz');
      if (quizSection) {
        const rect = quizSection.getBoundingClientRect();
        if (rect.top < -10 || rect.top > 120) {
          quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }

  // --- Score ---
  function applyScore(json) {
    try {
      const delta = JSON.parse(json);
      Object.keys(delta).forEach(function (k) {
        if (scores[k] !== undefined) scores[k] += delta[k];
      });
    } catch (e) { /* ignore */ }
  }

  function getResult() {
    if (scores.consult >= scores.playbook && scores.consult >= scores.dds) return 'consult';
    if (scores.playbook >= scores.dds) return 'playbook';
    return 'dds';
  }

  // --- Answer click delegation ---
  shell.addEventListener('click', function (e) {

    // Answer card
    const card = e.target.closest('.answer-card');
    if (card) {
      if (!quizStarted) {
        quizStarted = true;
        // Track quiz_start — also fires for quiz_start buttons via data-event below
        track('quiz_start', getUTM());
        if (typeof fbq !== 'undefined') fbq('track', 'InitiateCheckout');
      }

      const q = card.dataset.q;
      const value = card.dataset.value;

      // Visual selection
      const grid = card.closest('.answer-grid');
      if (grid) grid.querySelectorAll('.answer-card').forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');

      answers['q' + q] = value;
      applyScore(card.dataset.score);

      track('quiz_question_advance', Object.assign({ question: q, answer: value }, getUTM()));

      setTimeout(function () {
        const next = { '1':'q2','2':'q3','3':'q4','4':'q5','5':'q6','6':'q7','7':'q8' };
        if (next[q]) show(next[q]);
      }, 200);
      return;
    }

    // Back button
    const back = e.target.closest('.btn-back');
    if (back && back.dataset.prev) { show(back.dataset.prev); return; }
  });

  // --- Q8 continue ---
  const q8Continue = document.getElementById('q8-continue');
  if (q8Continue) {
    q8Continue.addEventListener('click', function () {
      const notes = document.getElementById('quiz-notes');
      if (notes && notes.value.trim().length > 3) {
        track('quiz_optional_note_used', getUTM());
      }
      show('q-email');
    });
  }

  // --- Email form ---
  const emailForm = document.getElementById('email-form');
  if (emailForm) {
    emailForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const nameEl  = document.getElementById('user-firstname');
      const emailEl = document.getElementById('user-email');
      const errorEl = document.getElementById('form-error');
      const btn     = document.getElementById('submit-btn');

      const name  = nameEl  ? nameEl.value.trim()  : '';
      const email = emailEl ? emailEl.value.trim() : '';

      if (!name || !email) {
        if (errorEl) { errorEl.textContent = 'Please enter your name and email.'; errorEl.removeAttribute('hidden'); }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errorEl) { errorEl.textContent = 'Please enter a valid email address.'; errorEl.removeAttribute('hidden'); }
        return;
      }
      if (errorEl) errorEl.setAttribute('hidden', '');
      if (btn) { btn.textContent = 'Loading your result…'; btn.disabled = true; }

      const result = getResult();
      const utm    = getUTM();
      const notes  = (document.getElementById('quiz-notes') || {}).value || '';

      // Tracking
      track('quiz_complete',      Object.assign({ quiz_result: result }, utm));
      track('quiz_email_submit',  Object.assign({ quiz_result: result, first_name: name }, utm));
      if (typeof fbq !== 'undefined') fbq('track', 'Lead', { quiz_result: result });

      // GHL Webhook — ⚠️ REPLACE URL before going live
      const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/ILH4tVyH5NKhdoMewJqZ/webhook-trigger/YwsHepg0mFYjhz4LrFYS';

      const payload = {
        first_name:         name,
        email:              email,
        quiz_result:        result,
        quiz_notes:         notes,
        issue_type:         answers.q1 || '',
        severity:           answers.q2 || '',
        support_preference: answers.q5 || '',
        source:             utm.utm_source,
        utm_medium:         utm.utm_medium,
        utm_campaign:       utm.utm_campaign,
        page_path:          window.location.pathname,
      };

      try {
        await fetch(GHL_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn('[GHL webhook]', err.message);
      }

      showResult(result);
    });
  }

  // --- Show result ---
  function showResult(result) {
    SCREENS.forEach(function (sid) {
      const el = document.getElementById(sid);
      if (el) el.setAttribute('hidden', '');
    });

    const el = document.getElementById('result-' + result);
    if (el) {
      el.removeAttribute('hidden');
      const bar = document.getElementById('quiz-progress-bar');
      if (bar) bar.style.width = '100%';
      const label = document.getElementById('quiz-progress-label');
      if (label) label.textContent = 'Your result';

      track('quiz_result_shown', Object.assign({
        quiz_result:    result,
        dds_score:      scores.dds,
        playbook_score: scores.playbook,
        consult_score:  scores.consult,
      }, getUTM()));

      const quizSection = document.getElementById('quiz');
      if (quizSection) quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --- Result CTA tracking ---
  document.querySelectorAll('[data-event="quiz_result_cta_click"]').forEach(function (el) {
    el.addEventListener('click', function () {
      track('quiz_result_cta_click', Object.assign({ quiz_result: el.dataset.result || '' }, getUTM()));
    });
  });

  // --- Quiz start button tracking (non-card buttons with data-event="quiz_start") ---
  document.querySelectorAll('[data-event="quiz_start"]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (!quizStarted) {
        quizStarted = true;
        track('quiz_start', Object.assign({ location: el.dataset.location || '' }, getUTM()));
        if (typeof fbq !== 'undefined') fbq('track', 'InitiateCheckout');
      }
    });
  });

  // Init — skipScroll=true so page loads at top
  show('q1', true);
  setProgress(1);

})();

// -------------------------------------------------------
// SMOOTH SCROLL for anchor links
// -------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// -------------------------------------------------------
// FOOTER YEAR
// -------------------------------------------------------
(function () {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();
