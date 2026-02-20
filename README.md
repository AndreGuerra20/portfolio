This is a [Next.js](https://nextjs.org/) portfolio project.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Dashboard

A new admin area is available at `/admin` with:

- Email/password authentication.
- Signed, HTTP-only admin session cookie.
- Login attempt throttling (lock after repeated failures).
- Protected dashboard at `/admin/dashboard`.
- Two sensor charts built with **Chart.js**:
  - Temperature/humidity for the last 7 days.
  - Detailed temperature/humidity for the current day.
- Extra cards: active users, weekly visits, yearly visits and conversion rate.

### Required environment variables

Set these in `.env.local` for production-safe credentials:

```bash
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=very-strong-password
ADMIN_SESSION_SECRET=a-long-random-secret-value
```

If no env vars are set, fallback demo values are used (not secure for production).
