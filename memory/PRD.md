# Sentinel — PRD

## Original Problem Statement
Professional SaaS landing page for a developer-tool startup: monitoring/alerting for Indian payment, logistics, and communication APIs (Razorpay, PhonePe, Cashfree, Shiprocket, Delhivery, MSG91, Gupshup). Catches silent webhook failures, undocumented tier restrictions, SDK breaking changes, and RBI e-mandate (>₹15,000) recurring payment failures. Quality bar: Stripe/Linear/Vercel-level, Awwwards-worthy motion. Dark-mode-first with amber accent, terminal aesthetic. Working waitlist email capture with real backend persistence. Honest founder note, no fake social proof.

## User Choices (confirmed)
- Name: **Sentinel**
- Waitlist: real backend + MongoDB persistence
- Theme: dark-mode-first, alert-amber (#F59E0B), terminal aesthetic
- Hero: mock live alert dashboard card included
- Founder note near waitlist (20-year-old ops analyst, India, data science background)
- No fake testimonials/counts/logos; email capture is the single dominant CTA

## Architecture
- **Frontend**: React 19 + Tailwind, Outfit / DM Sans / JetBrains Mono, framer-motion (kinetic masked headline reveal, scroll reveals, parallax hero), lenis (momentum scrolling), canvas-confetti (signup success), sonner (toasts)
- **Backend**: FastAPI, routes prefixed `/api`
- **DB**: MongoDB via MONGO_URL/DB_NAME env, `waitlist` collection

## API Endpoints
- `POST /api/waitlist` — { email } → { status: joined|already_registered, position, batch }; dedupes by email; batch = 50 signups each
- `GET /api/waitlist/count` — total signup count
- `GET /api/` — health check

## Sections (all implemented, 2026-07)
1. Navbar — fixed glass, mono badge, Join Waitlist CTA, mobile drawer
2. Hero — masked line-by-line kinetic headline, email capture, live cycling alert telemetry card (parallax)
3. The Problem — 3 pain cards (silent webhooks, tier restrictions, SDK/RBI breaks)
4. How It Works — 4 numbered manifesto steps
5. Built for Indian Developers — 7 provider pills + slow editorial marquee
6. Waitlist + Founder Note — large form, queue position on success, honest founder letter
7. Footer — minimal, system status mono line, scroll-to-top

## Verified (2026-07)
- POST /api/waitlist join, duplicate handling, invalid email rejection, count — all via curl against production URL
- Hero form e2e via browser: submit → success card with real queue position (#2) → confetti
- Desktop (1920px) + mobile (390px) screenshots of all sections — no layout breakage
- MOCKED: the hero alert feed is a styled simulation (as briefed); "system_status" footer line is decorative

## Personas
- Backend developer at Indian D2C/e-commerce startup burned by Razorpay/Shiprocket failures
- Engineering lead / CTO evaluating monitoring for India-specific API stack

## Backlog
- P0: nothing blocking
- P1: email notification to founder on new signup (Resend), waitlist export/admin view
- P2: changelog/blog page, OpenGraph + favicon polish, OG preview image, real provider status page
