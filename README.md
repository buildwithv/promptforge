# ⚡ PromptForge — AI SaaS Platform

> Compare GPT-4, Claude, and Gemini side-by-side. Save prompts. Track history. Built for developers and teams.

<img width="1350" height="627" alt="image" src="https://github.com/user-attachments/assets/f9e3aca5-9ac3-4359-9ab0-2561af9bf81a" />
<img width="1360" height="623" alt="image" src="https://github.com/user-attachments/assets/d1c0176d-503e-4a83-8608-e5b6cb41f832" />



## 🚀 Features

- **Multi-Model Comparison** — Run prompts across OpenAI, Anthropic, and Google simultaneously
- **Prompt History** — Save, tag, and search all your past prompts
- **Prompt Versioning** — Iterate on prompts and track changes like Git
- **Team Workspaces** — Collaborate with your team on prompt libraries
- **Subscription Billing** — Free / Pro / Team tiers via Stripe
- **Usage Analytics** — Token usage, cost tracking per model
- **Public Prompt Marketplace** — Share and discover prompts

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | Clerk |
| Payments | Stripe |
| AI APIs | OpenAI, Anthropic, Google Gemini |
| Cache | Redis |
| Deploy | Vercel (frontend) + Railway (backend) |

## 📁 Project Structure

```
promptforge/
├── frontend/          # Next.js 14 App
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   └── package.json
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── models/
│   ├── prisma/
│   └── package.json
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis instance
- Clerk account
- Stripe account
- OpenAI, Anthropic, Google API keys

### 1. Clone & Install

```bash
git clone https://github.com/vaishnavi1320/promptforge.git
cd promptforge

# Install frontend deps
cd frontend && npm install

# Install backend deps
cd ../backend && npm install
```

### 2. Environment Variables

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/promptforge
REDIS_URL=redis://localhost:6379
CLERK_SECRET_KEY=sk_...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
PORT=5000
```

### 3. Database Setup

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run Development

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Visit `http://localhost:3000`

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
vercel --prod
```

### Backend → Railway
```bash
# Connect GitHub repo to Railway
# Add environment variables in Railway dashboard
# Deploy automatically on push
```

## 💳 Stripe Setup

1. Create products in Stripe dashboard:
   - **Free**: $0/month — 50 prompts/day
   - **Pro**: $19/month — Unlimited prompts, history
   - **Team**: $49/month — Team workspaces, analytics

2. Add webhook endpoint: `https://your-api.railway.app/api/stripe/webhook`

## 📸 Screenshots

| Compare View | History | Analytics |
|---|---|---|
| ![compare](https://via.placeholder.com/300x200) | ![history](https://via.placeholder.com/300x200) | ![analytics](https://via.placeholder.com/300x200) |

## 🤝 Contributing

Pull requests are welcome! Please open an issue first.

## 📄 License

MIT License — feel free to use for commercial projects.
