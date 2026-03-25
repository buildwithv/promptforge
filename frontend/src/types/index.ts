export interface ModelConfig {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google'
  color: string
  enabled: boolean
}

export interface PromptResult {
  modelId: string
  content: string
  tokens: number
  latency: number
  cost?: number
  error?: string
}

export interface CompareRequest {
  prompt: string
  systemPrompt?: string
  models: string[]
  temperature: number
  maxTokens: number
}

export interface CompareResponse {
  id: string
  results: PromptResult[]
  createdAt: string
}

export interface HistoryItem {
  id: string
  prompt: string
  systemPrompt?: string
  results: PromptResult[]
  models: ModelConfig[]
  createdAt: string
  tags?: string[]
  title?: string
}

export interface Collection {
  id: string
  name: string
  description?: string
  prompts: HistoryItem[]
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  clerkId: string
  email: string
  plan: 'free' | 'pro' | 'team'
  usage: {
    daily: number
    monthly: number
  }
}

export interface AnalyticsData {
  totalPrompts: number
  totalTokens: number
  totalCost: number
  modelBreakdown: {
    modelId: string
    prompts: number
    tokens: number
    cost: number
  }[]
  dailyUsage: {
    date: string
    prompts: number
    tokens: number
  }[]
}
