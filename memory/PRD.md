# Sentinel — PRD

## Original Problem Statement
Professional SaaS landing page for a developer-tool startup: monitoring/alerting for Indian payment, logistics, and communication APIs (Razorpay, PhonePe, Cashfree, Shiprocket, Delhivery, MSG91, Gupshup). Catches silent webhook failures, undocumented tier restrictions, SDK breaking changes, and RBI e-mandate (>₹15,000) recurring payment failures. Quality bar: Stripe/Linear/Vercel-level, Awwwards-worthy motion. Dark-mode-first with amber accent, terminal aesthetic. Working waitlist email capture with real backend persistence. Honest founder note, no fake social proof.

## User Choices (confirmed)
- Name: **Sentinel**
- Waitlist: real backend + MongoDB persistence
- Theme: pure black & white monochrome (user rejected amber as "too AI-looking" in iteration 2)
- Hero: mock live alert dashboard card included
- Founder note near waitlist (20-year-old ops analyst, India, data science background)
- No fake testimonials/counts/logos; email capture is the single dominant CTA

## Architecture
- **Frontend**: React 19 + Tailwind, Outfit / DM Sans / JetBrains Mono, framer-motion (kinetic masked headline reveal, scroll reveals, parallax hero), lenis (momentum scrolling), canvas-confetti (signup success), sonner (toasts), react-router (routes: /, /failures, /admin)
- **Backend**: FastAPI, routes prefixed `/api`; JWT auth (bcrypt, httpOnly cookies, 15-min access + 7-day refresh, 5-attempt/15-min lockout); Emergent managed Resend email
- **DB**: MongoDB via MONGO_URL/DB_NAME env — collections: `waitlist`, `users`, `login_attempts`

## API Endpoints
- `POST /api/waitlist` — { email } → { status, position, batch }; dedupes; fires founder alert email (async, non-blocking)
- `GET /api/waitlist/count` — total signup count
- `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` · `POST /api/auth/refresh`
- `GET /api/admin/waitlist` (auth) — full signup list · `GET /api/admin/waitlist/export` (auth) — CSV download
- `GET /api/` — health check

## Pages
1. `/` — landing: navbar, kinetic hero + live alert card, problem (3 pains), how-it-works (4 steps), built-for-India (7 provider pills + marquee), waitlist + founder note, footer
2. `/failures` — Failure Library: 11 documented failure patterns (Razorpay, PhonePe, Cashfree, Shiprocket, Delhivery, MSG91, Gupshup), each with what/detect/real source links (razorpay docs + GitHub issues, PhonePe developer docs, Cashfree docs + GitHub, MSG91 help, Gupshup docs), provider + severity filters, waitlist CTA, per-page title/meta
3. `/admin` — private waitlist admin: login, stats (total/batch/latest), full table, CSV export, logout

## Verified
- Iteration 1 (2026-07): waitlist join/dupe/invalid via curl; hero form e2e with real queue position; desktop + mobile screenshots clean. Hero alert feed is MOCKED (styled simulation, as briefed).
- Iteration 2 (2026-07): monochrome restyle (zero amber/emerald left); admin auth chain (wrong-password 401, login → cookies → /me → admin list + CSV export, 401 without auth); founder alert email verified live (202 Accepted, id=0efd5dc4); fixed axios refresh-interceptor infinite loop (_skipRefresh guard)
- Iteration 3 (2026-07): /failures renders 11 entries; provider filter (razorpay→3) + severity combine (critical→2) verified; library waitlist form submits (position #4, alert email fired); navbar + footer "Library" links navigate correctly

## Personas
- Backend developer at Indian D2C/e-commerce startup burned by Razorpay/Shiprocket failures
- Engineering lead / CTO evaluating monitoring for India-specific API stack

## Credentials
- Admin: gayanteshsoni@gmail.com / S3nt!nel-W4tch#7Qx9Lm (see /app/memory/test_credentials.md)

## Backlog
- P0: nothing blocking
- P1: clear 4 test signups (dev1@testcompany.in, ui-test@startup.in, alert-test@d2cbrand.in, library-reader@fintech.in) before launch
- P2: founder name/photo on founder note, OG image + favicon polish, grow Failure Library entries over time, real status page
