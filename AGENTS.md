# Skyward — Project-Wide Agent Rules

## What this project is

A B2B showcase site for **Skyward**, a structural canopy fabricator serving petrol stations and oil companies. Two separate processes:

- `frontend/` — Next.js (App Router, TypeScript, Vanilla CSS + CSS Modules, Framer Motion)
- `backend/` — Express + TypeScript, Prisma ORM, PostgreSQL

Both folders have their own `package.json` and must be started separately.

---

## Backend Rules

- **ORM**: Prisma only. Never write raw SQL unless Prisma cannot express the query.
- **Auth**: JWT stored in an `httpOnly` cookie. Never in `localStorage`. Never in a response body for storage on the client.
- **Passwords**: bcrypt only. Never plaintext. Never MD5/SHA1.
- **Secrets**: All secrets (`JWT_SECRET`, `DATABASE_URL`) live in `backend/.env` which is gitignored. Never hardcode secrets in source.
- **Image storage**: Files stored on disk under `/uploads/installations/{installation_id}/`. Only the file path/URL is stored in the database — never the binary data.
- **Route structure**: Public routes under `/api/*`, admin-protected routes under `/api/admin/*`. All `/api/admin/*` routes use the `requireAdmin` middleware from `src/middleware/auth.ts`.
- **Error handling**: All route handlers catch errors and return structured JSON: `{ error: "..." }`. Never let unhandled errors bubble up to Express's default HTML error page.

---

## Frontend Design Rules (MANDATORY — read before writing any UI)

See `frontend/AGENTS.md` for the complete and enforceable design rules.

### Summary (full rules are in frontend/AGENTS.md):

- **Colors**: 6 locked CSS variables. Use by variable name only. Never hardcode a hex value.
- **Fonts**: Barlow Condensed (headings), Inter (body), IBM Plex Mono (data/spec labels).
- **Border radius**: `2px` on images and content cards, `4px` on interactive elements. Structural containers stay sharp (`0`). **Banned**: large radius (8px+) combined with drop shadow and shadow-grows-on-hover — that combination is the generic template look.
- **Shadows**: None on static content. Hairline borders only.
- **Signature element**: The spec plate on every installation detail page is mandatory.
- **Anti-patterns**: No rounded shadow cards, no gradient hero blobs, no SaaS icon cards, no colors outside the locked palette.
- **CSS**: Vanilla CSS and CSS Modules only. No Tailwind CSS.
- **Animation**: Framer Motion only by default. GSAP is conditional — do not install it unless a specific sequence genuinely requires it.

---

## Build Order (do not skip ahead)

1. ✅ Scaffold frontend + backend
2. ✅ Prisma schema from `data_model`
3. ✅ Seed script
4. ✅ Express API routes (installations, leads, auth, admin CRUD)
5. ▶️ Gallery page (Next.js) — first public page, styled to design spec
6. Build outward: Home → Installation detail → About → Contact
7. Admin panel (reuse same design tokens)
8. Framer Motion animations (after static pages are approved)
