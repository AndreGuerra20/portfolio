This is a [Next.js](https://nextjs.org/) portfolio project.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Dashboard

The admin area is available at `/admin` (or `/portfolio/admin` when deployed with basePath) and includes:

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

For deployments with basePath (this repo uses `/portfolio`), set:

```bash
NEXT_PUBLIC_BASE_PATH=/portfolio
```

### Supabase sensor source

Sensor chart data is fetched from Supabase table `SensorReadings` via REST.

You can override defaults with:

```bash
SUPABASE_SENSOR_URL=https://snfmmqbhnhhpsxikeprn.supabase.co/rest/v1/SensorReadings?select=*
SUPABASE_SENSOR_API_KEY=your-key
```
