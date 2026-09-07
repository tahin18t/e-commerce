# Ecommarch Storefront

The React frontend for **Ecommarch**. It provides a responsive shopping experience for browsing products, managing a cart and wish list, signing in, checking out, and reviewing order history.

The Express/MongoDB API is located one level up. See the [server README](../README.md) for backend setup, authentication, payments, and API details.

## Features

- Home page with product slider, categories, brands, and featured product groups.
- Product discovery by category, brand, keyword, remark, and filters.
- Product details, related products, and customer reviews.
- OTP, Google, and Facebook sign-in flows.
- Cookie-backed profile, cart, and wish-list management.
- Checkout, payment status pages, order confirmation, and purchase history.
- Toast notifications and client-side routes with a dedicated not-found page.

## Built with

- React 19 and React Router
- Vite with Fast Refresh
- Tailwind CSS and DaisyUI
- Axios for API requests
- Swiper for product sliders
- React Hot Toast and React Icons

## Prerequisites

- Node.js 18 or later
- The Ecommarch API running locally or deployed

## Install and run

From this directory:

```bash
npm install
npm run dev
```

Vite starts at `http://localhost:5173` by default. During local development, the Vite configuration proxies `/api/*` to `http://localhost:5020`, so start the server too:

```bash
cd ..
npm run dev
```

Or run both processes from the repository root:

```bash
npm run dev:all
```

## API configuration

The API client uses `/api/v1` by default. This is ideal for local development because Vite forwards the request to the Express server.

To point a deployed frontend at another API, create `client/.env.local`:

```dotenv
VITE_API_BASE_URL=https://api.example.com/api/v1
```

`VITE_*` values are embedded in the client build. Do not put passwords, private tokens, or other secrets in this file.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Serve the production build locally for verification. |
| `npm run lint` | Run ESLint over the frontend source. |

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Home and product discovery |
| `/login` | Sign in with OTP or social login |
| `/products` | Product listing and search results |
| `/product/:productID` | Product details and reviews |
| `/cart` | Shopping cart |
| `/wish` | Wish list |
| `/profile` | Customer and shipping profile |
| `/history` | Purchase history |
| `/payment-result/:status?/:trxID?` | Payment result |
| `/order-confirmed/:trxID` | Order confirmation |

## Source layout

```text
src/
├── APIRequest/       # Axios API functions and request de-duplication/cache
├── components/       # Reusable navigation, catalogue, slider, and footer UI
├── helper/           # Browser cookie helpers
├── layout/           # Shared page layout
├── pages/            # Route-level screens
├── App.jsx           # Route map
└── main.jsx          # React entry point
```

## Deployment

For a single-server deployment, run `npm run build` here and serve the resulting `client/dist` directory from the Express application at the repository root. The server is already configured to serve that directory and to fall back to `index.html` for React Router routes.

When frontend and API are deployed separately, configure `VITE_API_BASE_URL`, ensure the server allows the frontend origin with credentials, and set the backend `FRONTEND_URL` for payment redirects.

## Contributing

Keep UI changes accessible and responsive, run `npm run lint` before opening a pull request, and update this document whenever the development flow or route structure changes.
