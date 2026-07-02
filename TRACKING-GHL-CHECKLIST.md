# GHL Tracking Checklist

The checkout/order pages appear to live in GoHighLevel, outside this static site bundle. Current site CTA tracking measures clicks leaving the site. Actual checkout abandonment requires tracking inside GHL.

Install or verify inside GHL:

- Google tag / GA4 on checkout, order form, booking, and thank-you pages.
- Meta Pixel on checkout, order form, booking, and thank-you pages.
- Microsoft/Bing UET if used for paid traffic.
- Checkout/order-form view events.
- Lead/booking events for consult form completion.
- Purchase events on thank-you pages with value, currency, product, and order ID where available.
- UTM passthrough from main-site CTA URLs into GHL checkout and booking URLs.
- Abandoned checkout tracking test plan: land on checkout with UTMs, start checkout, abandon, verify event capture and audience entry.
- Cross-domain/referral exclusion review so GHL traffic does not self-refer in GA4.

Suggested event names:

- dds_checkout_view
- fix_the_walk_checkout_view
- consult_booking_view
- consult_booking_submit
- purchase
- abandoned_checkout
