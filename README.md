<div align="center">

# Sniplink

### Modern URL Shortener with Real-Time Analytics & AI

A production-ready, full-stack URL shortener built with Next.js 16, MongoDB, and TypeScript. Shorten URLs, protect them with passwords, generate QR codes, get AI-powered slug suggestions, publish a Link-in-Bio page, and gain insights with detailed analytics dashboards.

[Live Demo](https://sniplink-green.vercel.app) &middot; [Report Bug](https://github.com/Nandu064/sniplink/issues) &middot; [Request Feature](https://github.com/Nandu064/sniplink/issues)

</div>

---

## Features

### Core
- **Instant URL Shortening** &mdash; Generate 7-character short links or use custom aliases
- **Link Expiration** &mdash; Set an expiry date; links auto-deactivate after the deadline
- **Password-Protected Links** &mdash; Visitors must enter a password before being redirected
- **QR Code Generation** &mdash; Download violet-branded QR codes as PNG or SVG for any link

### AI
- **✨ AI Slug Suggestions** &mdash; One click generates 3 smart, descriptive slugs via Claude AI (Haiku)

### Analytics
- **Real-Time Click Analytics** &mdash; Track every click with timeline charts
- **Geographic Insights** &mdash; Country and city-level visitor tracking via Vercel geo headers
- **Device & Browser Analytics** &mdash; Desktop, mobile, and tablet breakdowns
- **Referrer Tracking** &mdash; See exactly where your traffic comes from

### Link-in-Bio
- **Public Profile Page** &mdash; Share all your pinned links at `/u/yourusername`
- **Pin Links** &mdash; Toggle any link to appear on your bio page
- **Custom Username & Bio** &mdash; Set a display name, handle, and bio from Settings

### Monetization
- **Stripe Billing** &mdash; Free and Pro plans with Stripe Checkout and Customer Portal
- **Webhook Sync** &mdash; Plan upgrades/downgrades sync automatically via Stripe webhooks
- **Real-time Plan Status** &mdash; Sidebar and settings reflect Pro status immediately after upgrade

### Platform
- **Authentication System** &mdash; Email/password auth with secure password reset via email
- **Rate Limiting** &mdash; IP-based rate limiting on all API endpoints
- **SEO Optimized** &mdash; Dynamic OG images, JSON-LD schemas, sitemap, robots.txt
- **Fully Responsive** &mdash; Works seamlessly on desktop, tablet, and mobile

---

## Screenshots

<!-- Add your screenshots here -->
<!-- ![Dashboard](screenshots/dashboard.png) -->
<!-- ![Analytics](screenshots/analytics.png) -->
<!-- ![Landing Page](screenshots/landing.png) -->
<!-- ![Link-in-Bio](screenshots/bio.png) -->
<!-- ![QR Code Modal](screenshots/qr.png) -->

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Database** | MongoDB Atlas + Mongoose 8 |
| **Authentication** | NextAuth.js v5 (JWT + Credentials) |
| **Styling** | Tailwind CSS 4 |
| **Charts** | Recharts |
| **Validation** | Zod 4 |
| **Email** | Nodemailer (Gmail SMTP) |
| **AI** | Anthropic Claude (Haiku) |
| **Payments** | Stripe (Checkout + Webhooks) |
| **QR Codes** | qrcode (Node.js) |
| **Password Hashing** | bcryptjs |
| **Notifications** | SweetAlert2 |
| **Deployment** | Vercel |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│  Next.js App Router  ·  React 19  ·  Tailwind CSS 4    │
├─────────────────────────────────────────────────────────┤
│                      Middleware                         │
│  Edge Runtime  ·  Slug Resolution  ·  301 Redirects    │
├─────────────────────────────────────────────────────────┤
│                     API Routes                          │
│  REST APIs  ·  Rate Limiting  ·  Zod Validation        │
├───────────────┬──────────────────┬──────────────────────┤
│ Authentication│    Services      │    Integrations      │
│ NextAuth v5   │ Analytics · Email│ Stripe · Claude AI   │
│ (JWT + plan)  │ QR · Hashing     │ Webhooks · Billing   │
├───────────────┴──────────────────┴──────────────────────┤
│                    Data Layer                           │
│  MongoDB Atlas  ·  Mongoose ODM  ·  Aggregation Pipes  │
└─────────────────────────────────────────────────────────┘
```

### How Short Links Work

```
User creates link → MongoDB stores slug + URL + options
                         │
Visitor hits /abc123 → Slug route intercepts
                         │
          ┌──────────────┴──────────────────┐
          │                                 │
   Password protected?              Fire-and-forget
     │          │                   click tracking
    Yes         No                       │
     │          │              Store: IP hash, UA,
     ▼          ▼              geo, referrer, device
  /protected  Link expired?               │
  entry page    │                Dashboard aggregates
                No                via MongoDB pipelines
                │
          301 Redirect (instant)
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **MongoDB Atlas** account ([free tier](https://www.mongodb.com/cloud/atlas))
- **Gmail account** with App Password (for password reset emails)
- **Anthropic account** (for AI slug suggestions — free credits on signup)
- **Stripe account** (for billing — test mode is free)

### Installation

```bash
# Clone the repository
git clone https://github.com/Nandu064/sniplink.git
cd sniplink

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local` with your values:

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sniplink

# Authentication
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (SMTP) — for password reset
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=your-email@gmail.com

# AI Slug Suggestions — console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-api03-...

# Stripe Billing — dashboard.stripe.com
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
```

<details>
<summary><strong>How to get a Gmail App Password</strong></summary>

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create a new app password and copy the 16-character code
5. Use it as `SMTP_PASS` in your `.env.local`

</details>

<details>
<summary><strong>How to set up Stripe</strong></summary>

1. Create a free account at [dashboard.stripe.com](https://dashboard.stripe.com)
2. Stay in **Test mode**
3. Go to **Developers → API keys** → copy `sk_test_...` and `pk_test_...`
4. Go to **Product catalog → Add product** → set $9/month recurring → copy the `price_...` ID
5. Go to **Developers → Webhooks → Add destination** → paste your URL + select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
6. Copy the `whsec_...` signing secret

> For local webhook testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

</details>

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (signin, signup, forgot/reset password)
│   ├── (marketing)/              # Public pages (about, features, pricing, privacy, terms)
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── links/[id]/           # Link analytics + QR code
│   │   ├── new/                  # Create new link (with AI slugs + password option)
│   │   └── settings/             # Profile, Link-in-Bio, billing, password
│   ├── api/
│   │   ├── ai/suggest-slug/      # Claude AI slug suggestions
│   │   ├── analytics/            # Analytics aggregation
│   │   ├── auth/                 # Signup, forgot/reset password
│   │   ├── billing/              # Stripe checkout, portal, verify
│   │   ├── links/                # CRUD, QR, pin, check-password
│   │   ├── track/                # Click tracking
│   │   ├── user/                 # Profile, public username routes
│   │   └── webhooks/stripe/      # Stripe event handler
│   ├── protected/[slug]/         # Password entry page
│   ├── u/[username]/             # Public Link-in-Bio page
│   └── [slug]/                   # Short link redirect handler
├── components/
│   ├── features/                 # ShortenForm, LinkTable, Charts, QRCodeModal
│   ├── layout/                   # Header, Footer, Sidebar (with plan badge), Nav
│   ├── ui/                       # Button, Input, PasswordInput, Card, Table, etc.
│   ├── providers/                # Session provider
│   └── seo/                      # JSON-LD structured data
├── lib/
│   ├── auth.ts                   # NextAuth config (JWT with plan field)
│   ├── db.ts                     # MongoDB connection singleton
│   ├── stripe.ts                 # Stripe client singleton
│   ├── rate-limit.ts             # IP-based rate limiter
│   ├── email.ts                  # Nodemailer email service
│   ├── analytics.ts              # UA parsing, IP hashing
│   ├── validations.ts            # Zod schemas
│   ├── seo.ts                    # SEO metadata builders
│   ├── toast.ts                  # SweetAlert2 notifications
│   ├── constants.ts              # App-wide constants
│   └── utils.ts                  # Helper functions
├── models/
│   ├── User.ts                   # User (name, email, plan, username, bio, stripeId)
│   ├── Link.ts                   # Link (slug, password, expiry, pinnedToBio, clicks)
│   ├── Click.ts                  # Click (geo, device, browser, referrer)
│   └── PasswordReset.ts          # Reset token with TTL index
└── types/
    ├── index.ts                  # Shared TypeScript types
    └── next-auth.d.ts            # NextAuth session augmentation (id + plan)
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Create new account | Public |
| POST | `/api/auth/forgot-password` | Request password reset email | Public |
| POST | `/api/auth/reset-password` | Reset password with token | Public |

### Links

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/links` | List user's links (paginated, searchable) | Required |
| POST | `/api/links` | Create short link (with optional password/expiry) | Required |
| GET | `/api/links/[id]` | Get link details | Required |
| PATCH | `/api/links/[id]` | Update link | Required |
| DELETE | `/api/links/[id]` | Delete link + all clicks | Required |
| GET | `/api/links/[id]/qr` | Get QR code PNG (or SVG with `?format=svg`) | Required |
| POST | `/api/links/[id]/pin` | Toggle link pinned to bio | Required |
| POST | `/api/links/check-password` | Verify link password → returns destination URL | Public |

### Analytics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/analytics/[linkId]?period=7d\|30d\|90d\|all` | Full analytics breakdown | Required |
| POST | `/api/track` | Record click event | Public |

### AI

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/suggest-slug` | Generate 3 AI slug suggestions for a URL | Required |

### User & Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/user` | Get current user profile + plan | Required |
| PATCH | `/api/user` | Update name or password | Required |
| DELETE | `/api/user` | Delete account + all data | Required |
| GET | `/api/user/profile` | Get bio profile (username, bio, displayName) | Required |
| PATCH | `/api/user/profile` | Update bio profile | Required |
| GET | `/api/user/[username]` | Get public user info | Public |
| GET | `/api/user/[username]/links` | Get user's pinned links | Public |

### Billing

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/billing/checkout` | Create Stripe Checkout session | Required |
| POST | `/api/billing/portal` | Open Stripe Customer Portal | Required |
| POST | `/api/billing/verify` | Sync plan from Stripe to DB | Required |
| POST | `/api/webhooks/stripe` | Handle Stripe events | Stripe sig |

---

## Database Schema

```
┌───────────────┐     ┌─────────────────┐     ┌──────────────┐
│     Users     │     │      Links      │     │    Clicks    │
├───────────────┤     ├─────────────────┤     ├──────────────┤
│ _id           │◄────│ userId          │     │ _id          │
│ name          │     │ _id             │◄────│ linkId       │
│ email (uniq)  │     │ originalUrl     │     │ timestamp    │
│ password      │     │ slug (uniq)     │     │ ip (hashed)  │
│ username      │     │ customAlias     │     │ userAgent    │
│ displayName   │     │ title           │     │ country      │
│ bio           │     │ totalClicks     │     │ city         │
│ plan          │     │ isActive        │     │ device       │
│ stripeId      │     │ expiresAt       │     │ browser      │
│ createdAt     │     │ passwordHash    │     │ os           │
│ updatedAt     │     │ passwordProtect │     │ referer      │
└───────────────┘     │ pinnedToBio     │     │ refererDomain│
                      │ createdAt       │     └──────────────┘
┌───────────────┐     │ updatedAt       │
│ PasswordReset │     └─────────────────┘
├───────────────┤
│ email         │
│ token (uniq)  │
│ expiresAt     │
│ used          │
└───────────────┘
```

**Key indexes:** Compound indexes on `Click` for efficient aggregation by linkId + country/device/browser/referrer/timestamp. Sparse unique index on `User.username`.

---

## Security

- **Password Hashing** &mdash; bcrypt with 12 salt rounds for accounts, 10 for link passwords
- **IP Privacy** &mdash; SHA-256 hashing with secret salt (never stored raw)
- **Rate Limiting** &mdash; Per-IP fixed-window counters with `429` + `Retry-After` headers
- **Email Enumeration Prevention** &mdash; Forgot-password always returns identical response
- **CSRF Protection** &mdash; NextAuth built-in CSRF tokens
- **JWT Sessions** &mdash; Stateless, signed tokens including plan claim
- **Input Validation** &mdash; Zod schemas on every API endpoint
- **Reserved Slugs** &mdash; 24 protected paths prevent slug collisions
- **TTL Indexes** &mdash; Password reset tokens auto-expire after 1 hour
- **Stripe Webhook Signature** &mdash; All webhook events verified with signing secret

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository
3. Add all environment variables in **Vercel → Settings → Environment Variables**:

```
MONGODB_URI
NEXTAUTH_SECRET
NEXTAUTH_URL              # https://your-app.vercel.app
NEXT_PUBLIC_APP_URL       # https://your-app.vercel.app
SMTP_HOST / SMTP_PORT / SMTP_SECURE / SMTP_USER / SMTP_PASS / SMTP_FROM
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRO_PRICE_ID
```

4. Deploy

> **Note:** Use `sk_test_` Stripe keys for development. Switch to `sk_live_` keys (requires Stripe account activation) when ready to charge real customers.

> **Vercel geo headers:** `x-vercel-ip-country` and `x-vercel-ip-city` are provided automatically for geographic analytics.

---

## Performance

- **Edge Middleware** for instant slug resolution and redirect
- **Denormalized click counter** (`totalClicks`) avoids expensive `COUNT()` queries
- **Compound MongoDB indexes** for O(log n) analytics aggregation
- **Fire-and-forget tracking** &mdash; redirects happen instantly, analytics recorded async
- **Static generation** for all marketing pages
- **Connection pooling** with MongoDB singleton pattern
- **QR code caching** &mdash; 1-hour `Cache-Control` on QR endpoints
- **AI rate limiting** &mdash; Claude API calls rate-limited per IP

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with Next.js, MongoDB, TypeScript, and Claude AI

</div>
