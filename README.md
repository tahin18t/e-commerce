# Ecommarch API & Server

The backend for **Ecommarch**, a full-stack e-commerce application. It exposes a REST API for catalogue discovery, authentication, carts, wish lists, checkout, invoices, and product reviews, then serves the built React storefront in production.

The accompanying React application lives in [`client/`](./client) and has its own [frontend guide](./client/README.md).

## What it does

- Browse product sliders, brands, categories, product details, related items, and reviews.
- Search, filter, and browse products by brand, category, keyword, or remark.
- Sign in with an emailed one-time password or Google/Facebook OAuth.
- Maintain an authenticated profile, cart, and wish list.
- Create payments through SSLCommerz, track invoice history, and download PDF invoices with QR and barcode data.
- Protect the API with Helmet, rate limiting, HTML sanitisation, HTTP parameter-pollution protection, cookies, and JWT-based route verification.

## Stack

| Area | Technology |
| --- | --- |
| Runtime | Node.js with ES modules |
| HTTP API | Express 5 |
| Database | MongoDB and Mongoose |
| Authentication | JWT, Passport, Google OAuth, Facebook Login, OTP email |
| Payments & documents | SSLCommerz integration, PDFKit, bwip-js |
| Frontend | React 19, Vite, Tailwind CSS, DaisyUI |

## Project structure

```text
.
├── app.js                 # Express configuration, security, database, static client
├── index.js               # Server entry point
├── src/
│   ├── config/            # Passport configuration
│   ├── controllers/       # HTTP request handlers
│   ├── middleware/        # JWT verification
│   ├── models/            # Mongoose schemas
│   ├── routes/api.js      # /api/v1 route definitions
│   ├── services/          # Database and payment workflows
│   └── utility/           # Tokens and email delivery
├── scripts/               # Development/seed utilities
└── client/                # React storefront
```

## Prerequisites

- Node.js 18 or later
- A MongoDB Atlas database (or a compatible MongoDB deployment)
- An email provider: Mailtrap and/or a Gmail account with an app password
- Google and Facebook OAuth credentials if social sign-in is enabled
- SSLCommerz settings stored in the `paymentsettings` collection to test checkout

## Configuration

Create a `.env` file in the repository root. Never commit it.

```dotenv
PORT=5020

DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
CLUSTER_NAME=your_cluster_host
DB_NAME=ecommarch

JWT_SECRET_KEY=replace_with_a_long_random_secret

# Mailtrap and/or Gmail for OTP email
API_TOKEN=your_mailtrap_api_token
MAIL_TRAP_EMAIL=verified_sender@example.com
GMAIL_EMAIL=your_gmail_address@gmail.com
GMAIL_APP_PASS=your_gmail_app_password

# Optional social login
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5020/api/v1/auth/google/callback
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5020/api/v1/auth/facebook/callback

# Destination used after a payment callback
FRONTEND_URL=http://localhost:5173
```

For production, set `FRONTEND_URL` to the public storefront origin and configure the OAuth provider callback URLs to match the deployed API URL.

## Run locally

Install the server and client dependencies once:

```bash
npm install
npm run install-client
```

Then run both applications together:

```bash
npm run dev:all
```

- API server: `http://localhost:5020`
- Vite frontend: `http://localhost:5173`
- API base path: `http://localhost:5020/api/v1`

The Vite development server proxies `/api` requests to port `5020`, so the frontend works with its default `/api/v1` configuration.

## Production build

Build the React client, then start Express. Express serves `client/dist` and returns the frontend entry point for client-side routes.

```bash
npm run build-client
npm start
```

The combined build/install command is also available:

```bash
npm run build
```

## API overview

All routes below are prefixed with `/api/v1`. Routes marked **auth** require the JWT cookie created at login.

| Area | Endpoints |
| --- | --- |
| Products | `GET /ProductBrandList`, `/ProductCategoryList`, `/ProductSliderList`, `/ProductDetails/:ProductID`, `/ProductReviewList/:ProductID` |
| Product discovery | `GET /ProductListByBrand/:BrandID`, `/ProductListByCategory/:CategoryID`, `/ProductListBySimilar/:CategoryID`, `/ProductListByKeyword/:Keyword`, `/ProductListByRemark/:Remark`; `POST /ProductListByFilter` |
| Authentication | `GET /LoginRequest/:email`, `/VerifyLogin/:email/:otp`, `/auth/google`, `/auth/facebook`, `/UserLogout`, `/checkToken` |
| Profile & reviews | **auth** `GET /ReadProfile`, `POST /UpdateProfile`, `POST /CreateReview` |
| Wish list | **auth** `GET /WishList`, `POST /AddToWishList/:ProductID`, `GET /RemoveFromWishList/:ProductID` |
| Cart | **auth** `GET /CartList`, `POST /AddToCart`, `GET /RemoveFromCart/:ProductID` |
| Payments & invoices | **auth** `GET /CreateInvoice`, `/InvoiceList`, `/InvoiceDetail/:invoiceID`, `/InvoiceDetailByTrx/:trxID`, `/InvoiceDownload/:invoiceID`, `POST /InvoiceProductList`; payment callback routes are also provided |
| Store features | `GET /FeaturesList` |

## Authentication flow

1. Request an OTP with `GET /LoginRequest/:email`.
2. Verify it with `GET /VerifyLogin/:email/:otp`, or begin Google/Facebook authentication.
3. Successful authentication creates an HTTP-only `token` cookie.
4. Browser requests include that cookie (`withCredentials: true` is set in the frontend API client), granting access to protected routes.

## Notes for contributors

- Keep secrets in `.env`; do not add credentials, generated build output, logs, or dependency folders to Git.
- The API request log is written to `Log/APIlog.txt` during development.
- Keep endpoint changes in sync with `client/src/APIRequest/APIRequest.js` and update the frontend guide when setup changes.

## License

This project is released under the [ISC License](./package.json).
