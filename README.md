# ChatGPT-like Website Starter

This repository contains a minimal starter blueprint for building a ChatGPT-like web app with:

- Next.js App Router
- Prisma + Postgres
- OpenAI chat completions with server-side streaming

## 1) Install dependencies

```bash
npm install next react react-dom
npm install openai zod @prisma/client
npm install -D prisma typescript @types/node @types/react @types/react-dom
```

## 2) Environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB"
OPENAI_API_KEY="your_openai_api_key"
```

## 3) Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 4) Run the app

```bash
npm run dev
```

Then open `http://localhost:3000/chat`.

## 5) Publish your website (Vercel)

This starter is easiest to publish on Vercel.

1. Push this project to GitHub.
2. Create a Vercel account and click **Add New Project**.
3. Import the GitHub repository.
4. Set environment variables in Vercel project settings:
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
5. Provision a Postgres database (for example Neon/Supabase) and use that connection string as `DATABASE_URL`.
6. Run Prisma in production to create tables:

```bash
npx prisma migrate deploy
```

7. Redeploy and open your Vercel URL.

### Optional: production build checks before deploy

```bash
npm run build
npm run start
```

## Notes

- The included `/api/chat` route validates input and streams assistant output.
- The chat page demonstrates a simple streaming UI.
- This is an MVP baseline; add auth and per-user authorization before production.
