# Security Notice - Static Admin on GitHub Pages

This project is configured for **static deployment** (GitHub Pages), with no backend.

## Quick Summary

The current `/admin` area is **not secure for real production use**.

It exists only for visual dashboard demonstration purposes, because in a 100% static app there is no way to hide secrets or validate sessions on the server.

## Why It Is Insecure

1. **Client-Side Authentication**
   - Login validation happens in the browser (frontend), not on a server.
   - Anyone can inspect or bypass the logic using DevTools.

2. **Session Stored in localStorage**
   - The authenticated state is stored in `localStorage`.
   - An attacker can forge this value and directly access the dashboard.

3. **`NEXT_PUBLIC_*` Variables Are Public**
   - Anything defined as `NEXT_PUBLIC_*` is included in the JavaScript bundle.
   - This includes values used in the "admin" and the Supabase public key.

4. **No Backend = No Real Secrets**
   - On GitHub Pages there is no server-side code to store passwords, private tokens, or validate HttpOnly cookies.

5. **Hashing on the Frontend Does Not Solve It**
   - Even if the password is hashed, the hash is still exposed in the client.
   - Authentication remains bypassable without server-side validation.

## What Is Acceptable in This Architecture

- Use only **public data**.
- Use only the Supabase **publishable/anon key**.
- Enforce strict **RLS policies** in Supabase.
- Treat `/admin` as a UI demo, not a secure control panel.

## If You Need a Truly Secure Admin Panel

### Deploy on Vercel

You must move authentication to a backend with runtime support (e.g. Vercel, Render, Fly, Railway), including:

- Server-side credential validation,
- Session management using HttpOnly cookies,
- Rate limiting / brute-force protection,
- Secrets stored outside the frontend,
- Protected server-side endpoints.

You can try the `Feature-Admin-Dashboard` branch for these purpose.

## Current Deployment

```bash
bun run deploy
```
This command publishes only static content to GitHub Pages.