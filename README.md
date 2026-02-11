# Political Intelligence Platform

Εσωτερική πλατφόρμα (demo) για διαχείριση επικοινωνίας και συμμετοχής κόμματος στην Κύπρο.

Tech stack
- Frontend: Next.js + Tailwind CSS
- Backend: Next.js API routes (Node)
- Database: PostgreSQL (lib/db.ts stub)
- Auth: SMS OTP (demo endpoints)

Getting started (development)

1. Copy env example:

```bash
cp .env.example .env
# edit .env and set DATABASE_URL and JWT_SECRET
```

2. Install:

```bash
npm install
```

3. Run dev server:

```bash
npm run dev
```

Demo notes
- OTP sending in `pages/api/auth/send-otp.ts` is a demo that logs codes to the server console.
- `pages/api/auth/verify-otp.ts` accepts OTP `000000` or `123456` for demo login. In production integrate Twilio (or SMS provider) and store OTPs in DB/cache with TTL.
- Replace in-memory OTP handling with a DB table or Redis in production.

What I generated
- Pages: `/login`, `/` (member dashboard), `/admin` (admin dashboard)
- Basic layout components in `components/`
- API routes for OTP send/verify in `pages/api/auth/`
- DB helper in `lib/db.ts`

Next steps you might want:
- Integrate Twilio and verify actual OTPs
- Implement persistent sessions and server-side auth checks
- Create DB migrations and models for members, announcements, votes, topics
- Add admin CRUD endpoints and authorization middleware

If you want, I can now:
- Add Twilio integration using `TWILIO_` env vars
- Add a PostgreSQL migration example and schema
- Implement server-side auth middleware and protect pages

Prisma & Auth
- This update adds Prisma models for `Member` and `OTP`, plus API routes that store hashed OTPs in the database and send SMS via Twilio when configured.

Setup notes
1. Install packages and generate Prisma client:

```bash
npm install
npx prisma generate
```

2. Create database and run migrations (dev):

```bash
npx prisma migrate dev --name init
```

3. Start dev server:

```bash
npm run dev
```

Environment variables
- `DATABASE_URL`, `JWT_SECRET`, `OTP_SECRET`, `TWILIO_SID`, `TWILIO_AUTH`, `TWILIO_PHONE`

Auth behavior
- `POST /api/auth/send-otp` stores a hashed OTP in the `OTP` table and sends SMS if Twilio is configured.
- `POST /api/auth/verify-otp` verifies the OTP, creates a `Member` if missing, and sets a JWT cookie `poli_token`.
- Protected pages: `/dashboard` requires a valid session; `/admin` requires role `ADMIN`.