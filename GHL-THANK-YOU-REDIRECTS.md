# GHL Thank-You Redirects

## Scoob & I redirects

Fix the Walk successful purchase redirect:

https://scoobandi.com/thank-you/fix-the-walk/

Consult successful booking redirect:

https://scoobandi.com/thank-you/consult/

## Notes

- DDS thank-you is already handled separately in the DDS project.
- GHL checkout/order pages should fire `begin_checkout` / `InitiateCheckout`.
- These Scoob & I thank-you pages fire `Purchase` or `Lead`.
- Do not send multiple products/bookings to the same thank-you page.
- Test each redirect after deployment.
- The consult calendar is embedded on `scoobandi.com/consult`, so only the successful booking redirect needs to be set inside GHL.
