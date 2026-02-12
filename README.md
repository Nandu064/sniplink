<div align="center">

# Sniplink

### Modern URL Shortener with Real-Time Analytics

A production-ready, SEO-optimized URL shortener built with Next.js 16, MongoDB, and TypeScript. Shorten URLs, track clicks globally, and gain insights with detailed analytics dashboards.

[Live Demo](https://sniplink-green.vercel.app) &middot; [Report Bug](https://github.com/Nandu064/sniplink/issues) &middot; [Request Feature](https://github.com/Nandu064/sniplink/issues)

</div>

---

## Features

- **Instant URL Shortening** &mdash; Generate 7-character short links or use custom aliases
- **Real-Time Click Analytics** &mdash; Track every click with detailed breakdowns
- **Geographic Insights** &mdash; Country and city-level visitor tracking
- **Device & Browser Analytics** &mdash; Know your audience across desktop, mobile, and tablet
- **Referrer Tracking** &mdash; See where your traffic comes from
- **Link Management** &mdash; Create, edit, expire, and delete links from a clean dashboard
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
├──────────────────────┬──────────────────────────────────┤
│    Authentication    │         Services                 │
│  NextAuth v5 (JWT)   │  Analytics · Email · Hashing    │
├──────────────────────┴──────────────────────────────────┤
│                    Data Layer                           │
│  MongoDB Atlas  ·  Mongoose ODM  ·  Aggregation Pipes  │
└─────────────────────────────────────────────────────────┘
```

### How Short Links Work

```
User creates link → MongoDB stores slug + URL
                         │
Visitor hits /abc123 → Edge Middleware intercepts
                         │
          ┌──────────────┴──────────────┐
          │                             │
   Resolve slug → URL            Fire-and-forget
          │                      click tracking
   301 Redirect                        │
   (instant)               Store: IP hash, UA,
                           geo, referrer, device
                                       │
                           Dashboard aggregates
                           via MongoDB pipelines
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **MongoDB Atlas** account ([free tier](https://www.mongodb.com/cloud/atlas))
- **Gmail account** with App Password (for password reset emails)

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
```

<details>
<summary><strong>How to get a Gmail App Password</strong></summary>

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create a new app password and copy the 16-character code
5. Use it as `SMTP_PASS` in your `.env.local`

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
│   ├── (marketing)/              # Public pages (about, features, pricing)
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── links/[id]/           # Link analytics page
│   │   ├── new/                  # Create new link
│   │   └── settings/             # User profile & settings
│   ├── api/                      # REST API routes
│   │   ├── auth/                 # Auth endpoints (signup, forgot/reset password)
│   │   ├── links/                # CRUD + resolve endpoints
│   │   ├── analytics/            # Analytics aggregation
│   │   ├── track/                # Click tracking
│   │   └── user/                 # User profile management
│   └── [slug]/                   # Dynamic short link handler
├── components/
│   ├── features/                 # Business logic (ShortenForm, LinkTable, Charts)
│   ├── layout/                   # Header, Footer, Sidebar, Nav
│   ├── ui/                       # Reusable primitives (Button, Input, Card, Table)
│   ├── providers/                # Context providers (Session)
│   └── seo/                      # JSON-LD structured data
├── lib/                          # Utilities & configuration
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # MongoDB connection singleton
│   ├── rate-limit.ts             # IP-based rate limiter
│   ├── email.ts                  # Nodemailer email service
│   ├── analytics.ts              # UA parsing, IP hashing
│   ├── validations.ts            # Zod schemas
│   ├── seo.ts                    # SEO metadata builders
│   ├── toast.ts                  # SweetAlert2 notifications
│   ├── constants.ts              # App-wide constants
│   └── utils.ts                  # Helper functions
├── models/                       # Mongoose schemas
│   ├── User.ts                   # User model
│   ├── Link.ts                   # Link model with click counter
│   ├── Click.ts                  # Click analytics model
│   └── PasswordReset.ts          # Reset token with TTL
└── types/                        # TypeScript definitions
    └── next-auth.d.ts            # NextAuth type augmentation
```

---

## API Reference

### Authentication

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| POST | `/api/auth/signup` | Create new account | 5/min |
| POST | `/api/auth/[...nextauth]` | Sign in (NextAuth) | — |
| POST | `/api/auth/forgot-password` | Request password reset | 3/5min |
| POST | `/api/auth/reset-password` | Reset password with token | 5/min |

### Links

| Method | Endpoint | Description | Rate Limit |
|--------|----------|-------------|------------|
| GET | `/api/links` | List user's links (paginated) | — |
| POST | `/api/links` | Create short link | 30/min |
| GET | `/api/links/[id]` | Get link details | — |
| PATCH | `/api/links/[id]` | Update link | — |
| DELETE | `/api/links/[id]` | Delete link + clicks | — |
| GET | `/api/links/resolve?slug=abc` | Resolve slug to URL | — |

### Analytics & Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/[linkId]?period=30d` | Get link analytics |
| POST | `/api/track` | Record click event |

### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user` | Get user profile |
| PATCH | `/api/user` | Update profile/password |
| DELETE | `/api/user` | Delete account + all data |

---

## Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Users     │     │    Links     │     │    Clicks    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ _id          │◄────│ userId       │     │ _id          │
│ name         │     │ _id          │◄────│ linkId       │
│ email (uniq) │     │ originalUrl  │     │ timestamp    │
│ password     │     │ slug (uniq)  │     │ ip (hashed)  │
│ createdAt    │     │ customAlias  │     │ userAgent    │
│ updatedAt    │     │ title        │     │ country      │
└──────────────┘     │ totalClicks  │     │ city         │
                     │ isActive     │     │ device       │
┌──────────────┐     │ expiresAt    │     │ browser      │
│ PasswordReset│     │ createdAt    │     │ os           │
├──────────────┤     │ updatedAt    │     │ referer      │
│ email        │     └──────────────┘     │ refererDomain│
│ token (uniq) │                          └──────────────┘
│ expiresAt    │
│ used         │
└──────────────┘
```

**Key indexes:** Composite indexes on `Click` model for efficient aggregation by linkId + country/device/browser/referrer/timestamp.

---

## Security

- **Password Hashing** &mdash; bcrypt with 12 salt rounds
- **IP Privacy** &mdash; SHA-256 hashing with secret salt (never stored raw)
- **Rate Limiting** &mdash; Per-IP fixed-window counters with `429` + `Retry-After` headers
- **Email Enumeration Prevention** &mdash; Forgot-password always returns the same response
- **CSRF Protection** &mdash; NextAuth built-in CSRF tokens
- **JWT Sessions** &mdash; Stateless, signed tokens
- **Input Validation** &mdash; Zod schemas on all API inputs
- **Reserved Slugs** &mdash; 24 protected paths prevent slug collisions
- **TTL Indexes** &mdash; Password reset tokens auto-expire after 1 hour

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXT_PUBLIC_APP_URL` (same as above)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
4. Deploy

> Vercel automatically provides `x-vercel-ip-country` and `x-vercel-ip-city` headers for geographic analytics.

---

## Performance

- **Edge Middleware** for instant slug resolution and redirect
- **Denormalized click counter** (`totalClicks`) avoids expensive `COUNT()` queries
- **Compound MongoDB indexes** for O(log n) analytics aggregation
- **Fire-and-forget tracking** &mdash; redirects happen instantly, analytics recorded async
- **Static page generation** for marketing pages
- **Connection pooling** with MongoDB singleton pattern

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with Next.js, MongoDB, and TypeScript

</div>
