import axios from 'axios'
import { CompareRequest, CompareResponse, HistoryItem, AnalyticsData } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true,
})

// Intercept to add Clerk token
api.interceptors.request.use(async (config) => {
  // Clerk token is handled via cookie automatically in Next.js
  return config
})

// ─── Prompt ──────────────────────────────────────────────────────────────────

export async function comparePrompt(data: CompareRequest): Promise<CompareResponse> {
  const res = await api.post('/api/prompts/compare', data)
  return res.data
}

export async function savePrompt(data: Partial<HistoryItem>): Promise<HistoryItem> {
  const res = await api.post('/api/prompts/save', data)
  return res.data
}

// ─── History ─────────────────────────────────────────────────────────────────

export async function getHistory(page = 1, limit = 20): Promise<{ items: HistoryItem[]; total: number }> {
  const res = await api.get(`/api/history?page=${page}&limit=${limit}`)
  return res.data
}

export async function deleteHistory(id: string): Promise<void> {
  await api.delete(`/api/history/${id}`)
}

// ─── Collections ─────────────────────────────────────────────────────────────

export async function getCollections() {
  const res = await api.get('/api/collections')
  return res.data
}

export async function createCollection(name: string, description?: string) {
  const res = await api.post('/api/collections', { name, description })
  return res.data
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export async function getAnalytics(): Promise<AnalyticsData> {
  const res = await api.get('/api/analytics')
  return res.data
}

// ─── Billing ─────────────────────────────────────────────────────────────────

export async function createCheckoutSession(priceId: string): Promise<{ url: string }> {
  const res = await api.post('/api/billing/checkout', { priceId })
  return res.data
}

export async function createPortalSession(): Promise<{ url: string }> {
  const res = await api.post('/api/billing/portal')
  return res.data
}

export default api
