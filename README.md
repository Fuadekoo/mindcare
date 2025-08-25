<div align="center">

# MindCare — Student Mental Wellbeing Platform

Compassionate mental health workflows for schools and clinics. Streamline general cases, follow‑ups, and appointments while protecting privacy and measuring outcomes.

</div>

## Overview

MindCare helps staff identify, track, and support student mental wellbeing. It’s built for day‑to‑day clinical workflows: opening a General Case, adding follow‑up Cases (history/observation/treatment), scheduling appointments, and monitoring outcomes.

Key goals:
- Make it easy to open and manage a student’s General Case
- Keep structured follow‑ups (History, Diagnosis/Observation, Treatment)
- Coordinate and track Appointments
- Provide simple dashboards and filters to see progress
- Ensure privacy and access control with authentication

## Features

- Authentication (NextAuth Credentials)
- Students list with search, pagination, and actions
- General Case management per student (open/close, one open at a time)
- Case flows under a General Case (timeline of updates)
- Appointments (create, view, and confirm/reject)
- Dashboard: Patient Types CRUD (with custom confirmation modal)
- Track view: filter students with at least one General Case
- Debounced search inputs and flexible page size selectors

## Tech Stack

- Next.js App Router (TypeScript)
- Prisma ORM (+ migrations) with a relational database
- NextAuth for authentication
- UI: Tailwind CSS + HeroUI + Lucide Icons
- Zod + React Hook Form for validated forms

## Project Structure (high level)

```
app/
	[lang]/(guest)/signin
	[lang]/(guest)/about
	[lang]/(psycatrist)/students
	[lang]/(psycatrist)/generalCase
	[lang]/(psycatrist)/generalCase/[generalCaseId]
	[lang]/(psycatrist)/generalCase/[generalCaseId]/[caseId]
	[lang]/(psycatrist)/appointment
components/
	custom-table.tsx, custom-alert.tsx, loading.tsx
actions/
	common/authentication.ts
	psycatrist/* (students, generalCase, case, appointment, dashboard)
lib/
	auth.ts, db.ts, zodSchema.ts
prisma/
	schema.prisma, migrations/, seed.ts
```

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Configure environment variables

Create a `.env` at the project root. Typical variables:

```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DBNAME"
NEXTAUTH_SECRET="your-strong-secret"
NEXTAUTH_URL="http://localhost:3000"
```

3) Database and Prisma

- Review `prisma/schema.prisma`
- Apply migrations and generate client

```bash
npx prisma migrate dev
npx prisma generate
```

Optionally seed:

```bash
npx ts-node prisma/seed.ts
```

4) Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Authentication & Access

- Unauthenticated users can access `/en/about` (public About page) and `/en/signin` (login).
- All other `/en/*` routes require authentication (see `lib/auth.ts` callbacks and `middleware.ts`).
- After successful sign‑in, users are redirected to `/en/dashboard`.

## Notable UI Interactions

- Debounced search inputs to avoid spamming requests as you type
- Page size selectors (e.g., 10/20/30/100 per page)
- CustomAlert modal for destructive actions (delete/close)
- CustomTable with generic columns and row rendering

## Common Actions (where to look)

- Students list and actions: `actions/psycatrist/students.ts`, page in `app/[lang]/(psycatrist)/students`
- General Case CRUD: `actions/psycatrist/generalCase.ts`
- Case details & follow‑ups: `actions/psycatrist/case.ts`
- Appointments: `actions/psycatrist/appointment.ts`
- Dashboard Patient Types: `actions/psycatrist/dashboard.ts`

## Development Notes

- If MySQL is used, case‑insensitive queries via `mode: "insensitive"` may not be supported; rely on collation.
- For relations (e.g., Appointment → Case → Student), use nested Prisma filters/selects.
- Ensure `studentId` is an integer when creating a General Case (coerce on client/server before Prisma).

## Scripts

Common scripts (adjust if your `package.json` names differ):

```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run start       # Run production build
npm run lint        # Lint
```

## Troubleshooting

- Prisma validation errors: check input types (e.g., `studentId` must be Int) and relation filters.
- ENOENT package.json / install issues: ensure you’re in the project root; remove `node_modules` if locked and reinstall.
- Source map warnings from dependencies can usually be ignored in development.

## License

This project is proprietary to the organization operating MindCare.

