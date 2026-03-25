import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { promptRoutes } from './routes/promptRoutes'
import { historyRoutes } from './routes/historyRoutes'
import { collectionRoutes } from './routes/collectionRoutes'
import { analyticsRoutes } from './routes/analyticsRoutes'
import { billingRoutes } from './routes/billingRoutes'
import { userRoutes } from './routes/userRoutes'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ─── Stripe webhook needs raw body ───────────────────────────────────────────
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  (await import('./routes/billingRoutes')).stripeWebhook
)

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))
app.use(rateLimiter)

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/prompts', promptRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/users', userRoutes)

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 PromptForge API running on http://localhost:${PORT}`)
})

export default app
