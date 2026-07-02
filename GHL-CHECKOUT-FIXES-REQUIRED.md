# GHL Checkout Fixes Required

Checkout and order pages appear to live in GoHighLevel, outside this static Scoob & I repo. Make these edits directly in GHL and test on mobile before sending traffic.

## Fix the Walk checkout

- Product/page name: use `Fix the Walk`, not `PLAYbook` or `Join the PLAYbook`.
- Browser tab/title: change any `Join the PLAYbook` title to `Fix the Walk | Scoob & I`.
- Typos: fix `Finaly` to `Finally` and `fill out he form` to `fill out the form` wherever they appear.
- Price display: show both options clearly as `$795 one payment` and `4 payments of $199`.
- Default payment option: make sure the selected/default option matches the visible total and label.
- Deadline/scarcity copy: use real scarcity only: `15 seats only`, `class starts Monday, July 27, 2026`, and `enrollment closes Thursday, July 23, 2026 because students need time to complete required prep before class starts`.
- Include guarantee near purchase:
  `The Do-The-Work Guarantee: complete the required prep, attend or watch the coaching sessions, submit your videos, ask for help when stuck, and do the weekly assignments. If you do the work and your walks are not meaningfully better by the end of the sprint, Joel will refund you.`
- Thank-you redirect: send successful purchases to `https://scoobandi.com/thank-you/fix-the-walk/`.
- Confirmation email: mention required prep opens immediately, class starts Monday, July 27, 2026, weekly lessons/resources are released or assigned on Sundays, and the first action is to complete prep.
- Mobile test: complete a checkout-path test on a phone-width screen and confirm labels, price, guarantee, redirect, and confirmation email are all correct.

## Digital Dog School checkout

- Product/page name: use `Digital Dog School`.
- Browser tab/title: remove any stale `PLAYbook` language.
- Payment option labels: do not label both payment options identically.
- Price display: remove confusing `per month after trial period` language unless there is a real trial and recurring monthly billing.
- Order total: make the immediate charge and future charges obvious before purchase.
- Include guarantee language if DDS has an approved guarantee. Do not invent a new guarantee if none exists.
- Thank-you redirect: confirm the DDS checkout redirects to the correct DDS thank-you/access page, not a Scoob & I Fix the Walk page.
- Confirmation email: include how to access DDS, where to start, and any real support/community instructions that already exist.
- Mobile test: verify payment labels, order total, guarantee/access copy, redirect, and confirmation email on a phone-width screen.

## Sitewide GHL QA

- Remove public-facing `Playbook` / `PLAYbook` language from current offers.
- Confirm checkout pages keep UTMs where possible.
- Confirm Meta/GA purchase or begin-checkout events are configured inside GHL.
- Confirm no fake countdown timers, fake booking counters, or fake `almost sold out` messages were added.
