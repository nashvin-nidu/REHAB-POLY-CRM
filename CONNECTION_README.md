# NeuroPath — Auth Connection Guide

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** database (local or hosted, e.g. Neon)

## Environment Variables

Create a `.env` file in the project root with:

```env
DATABASE_URL='postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require'
BETTER_AUTH_SECRET='<random-32-char-string>'
BETTER_AUTH_URL='http://localhost:3000'
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `BETTER_AUTH_SECRET` | Secret key for signing auth tokens (generate with `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Base URL of your app (used by better-auth client) |

## Setup Steps

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Run migrations (creates User, Session, Account, Verification tables)
npx prisma migrate dev

# 4. Start dev server
npm run dev
```

## Usage

- **Login / Sign Up page**: [http://localhost:3000/login](http://localhost:3000/login)
- **Auth API** (handled automatically): `http://localhost:3000/api/auth/*`

## Key Files

| File | Purpose |
|---|---|
| `src/lib/auth.ts` | Server-side better-auth config with Prisma adapter |
| `src/lib/auth-client.ts` | Client-side auth helper (`signIn`, `signUp`, `useSession`) |
| `src/app/api/auth/[...all]/route.ts` | Next.js API route that forwards requests to better-auth |
| `src/app/(auth)/login/page.tsx` | Login / Sign Up UI |
| `prisma/schema.prisma` | Database schema (User, Session, Account, Verification) |

## Authentication Flow

1. User visits `/login` and fills in email + password.
2. Client calls `authClient.signIn.email()` or `authClient.signUp.email()`.
3. Request hits `/api/auth/*` → better-auth processes it using the Prisma adapter.
4. On success, a session cookie is set and the user is redirected to `/`.
