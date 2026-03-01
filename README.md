 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
new file mode 100644
index 0000000000000000000000000000000000000000..6b5c68dbad0560e832be42be9b3dd35fde344117
--- /dev/null
+++ b/README.md
@@ -0,0 +1,45 @@
+# ChatGPT-like Website Starter
+
+This repository contains a minimal starter blueprint for building a ChatGPT-like web app with:
+
+- Next.js App Router
+- Prisma + Postgres
+- OpenAI chat completions with server-side streaming
+
+## 1) Install dependencies
+
+```bash
+npm install next react react-dom
+npm install openai zod @prisma/client
+npm install -D prisma typescript @types/node @types/react @types/react-dom
+```
+
+## 2) Environment variables
+
+Create a `.env` file:
+
+```env
+DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB"
+OPENAI_API_KEY="your_openai_api_key"
+```
+
+## 3) Prisma
+
+```bash
+npx prisma generate
+npx prisma migrate dev --name init
+```
+
+## 4) Run the app
+
+```bash
+npm run dev
+```
+
+Then open `http://localhost:3000/chat`.
+
+## Notes
+
+- The included `/api/chat` route validates input and streams assistant output.
+- The chat page demonstrates a simple streaming UI.
+- This is an MVP baseline; add auth and per-user authorization before production.
 
EOF
)
