# Future Upgrades

This roadmap is based on the current Ecommarch backend, React client, MongoDB models, payment flow, and recent runtime/API-log review.

## Priority 0: Security And Secrets

- [ ] Rotate all credentials currently present in `.env` and remove them from shared history.
- [ ] Add `.env.example` containing variable names only.
- [ ] Move Google, Mailtrap, Gmail, database, and payment credentials into deployment secrets.
- [ ] Replace `JWT_SECRET_KEY=SecretKey123` with a strong generated secret.
- [ ] Add production CORS allow-listing instead of `origin: true`.
- [ ] Add request validation for route params, emails, prices, quantities, and MongoDB IDs.
- [ ] Rate-limit OTP requests per email and IP, and add OTP expiration plus attempt limits.
- [ ] Stop returning development OTP values outside an explicit demo/development environment.

## Priority 1: Payments And Orders

- [ ] Consolidate `PaymentSuccess`, `PaymentFail`, `PaymentCancel`, and `PaymentResultRedirect` into one callback strategy.
- [ ] Validate SSLCommerz callback signatures/IPN responses before changing invoice status.
- [ ] Make payment status transitions idempotent and reject invalid transitions.
- [ ] Add a real retry-payment flow for an existing pending/failed invoice instead of sending users only to the cart.
- [ ] Clear the cart only after verified successful payment.
- [ ] Add payment timeout handling for invoices that remain pending.
- [ ] Add automated tests for success, fail, cancel, IPN, invoice download authorization, and order confirmation by transaction ID.

## Priority 1: Product And Catalog Quality

- [ ] Make keyword search case-insensitive and show a clear search-term/zero-result state; the UI search for `Realme` returned no cards while the lowercase API query returned the product.
- [ ] Replace placeholder product-detail values (`Standard`, duplicated primary images) with curated detail content.
- [ ] Add a unique index on `ProductDetailModel.productID` and correct its model reference from `product` to `products`.
- [ ] Validate image URLs and add image fallback/loading/error states.
- [ ] Replace unreachable external slider media and resolve the current CloudFront image DNS failure seen in the browser console.
- [ ] Disable Swiper loop mode when there are too few slides to remove the repeated loop warnings.
- [ ] Add server-side pagination, sorting, and filtering instead of loading the full catalog into the browser.
- [ ] Add inventory checks when adding to cart and during checkout.
- [ ] Prevent duplicate product/review submissions and validate review ownership/rating ranges.
- [ ] Investigate the wishlist API response: live wishlist records still omit `star`, so the UI must currently fall back to `0.0` despite ratings existing on product records.

## Priority 1: Frontend Architecture

- [ ] Replace repeated page-level `checkToken` calls with an authentication context/provider.
- [x] Replace repeated category/brand/product fetches with a shared query/cache layer.
- [ ] Add route-level loading, error, and empty states consistently.
- [ ] Split large components such as `ProductList.jsx`, `ProductPage.jsx`, and `AppNav.jsx` into focused components.
- [ ] Centralize status labels, currency formatting, API error handling, and theme-aware button styles.
- [ ] Add an error boundary so one failed page request does not blank the whole application.

## Priority 2: Cart And Account Experience

- [ ] Implement the newsletter Subscribe action or remove the control until a subscription endpoint exists.
- [x] Add quantity controls with optimistic UI, server validation, and stock-aware disabled states.
- [ ] Add remove/undo behavior and persist cart state across sessions.
- [ ] Add profile form validation and clear save/error states.
- [ ] Add address management with multiple saved addresses.
- [ ] Add order filtering by status/date and invoice pagination.
- [ ] Add accessible keyboard/focus states to dialogs, menus, galleries, and custom controls.
- [ ] Add explicit accessible labels and focus states to the theme toggle, mobile menu, profile menu, and newsletter controls.

## Priority 2: Testing And Observability

- [ ] Add backend unit tests for services and controllers.
- [ ] Add API integration tests for authentication, catalog, cart, wishlist, and payment callbacks.
- [ ] Add frontend component and route tests for login, cart quantity changes, filters, checkout outcomes, and printing.
- [ ] Add automated browser smoke coverage for login, search, wishlist, cart, profile, theme, checkout, history, and print flows.
- [ ] Add a CI workflow that runs lint, build, syntax checks, and tests.
- [ ] Replace ad-hoc API logging with structured request IDs, duration, status code, and log rotation.
- [ ] Add error monitoring and health endpoints for the API, database, and payment provider.
- [ ] Add stable loading states so slow requests do not briefly render misleading empty states.

## Priority 3: Deployment And Maintainability

- [ ] Pin production dependency versions and run regular security audits.
- [ ] Separate development, staging, and production configuration.
- [ ] Serve the built client from a configured absolute path rather than relying on the process working directory.
- [ ] Add graceful shutdown handling for HTTP server and MongoDB connections.
- [ ] Document local setup, database setup, payment sandbox setup, and deployment steps.
- [ ] Replace the Vite starter README with project-specific documentation.

## Suggested Next Milestone

1. Rotate secrets and add environment validation.
2. Consolidate and test payment callbacks.
3. Add authentication context and API integration tests.
4. Implement server-side catalog pagination and stock-safe checkout.
5. Replace seeded placeholder product details with curated content.
