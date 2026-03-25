import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export interface ModelResult {
  modelId: string
  content: string
  tokens: number
  latency: number
  cost: number
  error?: string
}

const TOKEN_COSTS: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 0.000005, output: 0.000015 },
  'gpt-4-turbo': { input: 0.00001, output: 0.00003 },
  'claude-3-5-sonnet': { input: 0.000003, output: 0.000015 },
  'claude-3-opus': { input: 0.000015, output: 0.000075 },
  'gemini-1.5-pro': { input: 0.00000125, output: 0.000005 },
}

async function runOpenAI(
  modelId: string,
  prompt: string,
  systemPrompt: string,
  temperature: number,
  maxTokens: number
): Promise<ModelResult> {
  const start = Date.now()
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = []
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
    messages.push({ role: 'user', content: prompt })

    const res = await openai.chat.completions.create({
      model: modelId === 'gpt-4o' ? 'gpt-4o' : 'gpt-4-turbo',
      messages,
      temperature,
      max_tokens: maxTokens,
    })

    const latency = Date.now() - start
    const inputTokens = res.usage?.prompt_tokens || 0
    const outputTokens = res.usage?.completion_tokens || 0
    const rates = TOKEN_COSTS[modelId]
    const cost = (inputTokens * rates.input) + (outputTokens * rates.output)

    return {
      modelId,
      content: res.choices[0]?.message?.content || '',
      tokens: inputTokens + outputTokens,
      latency,
      cost,
    }
  } catch (err: any) {
    return { modelId, content: '', tokens: 0, latency: Date.now() - start, cost: 0, error: err.message }
  }
}

async function runAnthropic(
  modelId: string,
  prompt: string,
  systemPrompt: string,
  temperature: number,
  maxTokens: number
): Promise<ModelResult> {
  const start = Date.now()
  try {
    const res = await anthropic.messages.create({
      model: modelId === 'claude-3-5-sonnet' ? 'claude-3-5-sonnet-20241022' : 'claude-3-opus-20240229',
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt || undefined,
      messages: [{ role: 'user', content: prompt }],
    })

    const latency = Date.now() - start
    const inputTokens = res.usage.input_tokens
    const outputTokens = res.usage.output_tokens
    const rates = TOKEN_COSTS[modelId]
    const cost = (inputTokens * rates.input) + (outputTokens * rates.output)

    return {
      modelId,
      content: res.content[0].type === 'text' ? res.content[0].text : '',
      tokens: inputTokens + outputTokens,
      latency,
      cost,
    }
  } catch (err: any) {
    return { modelId, content: '', tokens: 0, latency: Date.now() - start, cost: 0, error: err.message }
  }
}

async function runGemini(
  modelId: string,
  prompt: string,
  systemPrompt: string,
  temperature: number,
  maxTokens: number
): Promise<ModelResult> {
  const start = Date.now()
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: { temperature, maxOutputTokens: maxTokens },
      systemInstruction: systemPrompt || undefined,
    })

    const result = await model.generateContent(prompt)
    const response = result.response
    const latency = Date.now() - start
    const tokens = response.usageMetadata?.totalTokenCount || 0
    const rates = TOKEN_COSTS[modelId]
    const cost = tokens * rates.input

    return {
      modelId,
      content: response.text(),
      tokens,
      latency,
      cost,
    }
  } catch (err: any) {
    return { modelId, content: '', tokens: 0, latency: Date.now() - start, cost: 0, error: err.message }
  }
}

export async function compareModels(
  models: string[],
  prompt: string,
  systemPrompt: string,
  temperature: number,
  maxTokens: number
): Promise<ModelResult[]> {
  const tasks = models.map((modelId) => {
    if (modelId.startsWith('gpt')) {
      return runOpenAI(modelId, prompt, systemPrompt, temperature, maxTokens)
    } else if (modelId.startsWith('claude')) {
      return runAnthropic(modelId, prompt, systemPrompt, temperature, maxTokens)
    } else if (modelId.startsWith('gemini')) {
      return runGemini(modelId, prompt, systemPrompt, temperature, maxTokens)
    }
    return Promise.resolve({ modelId, content: '', tokens: 0, latency: 0, cost: 0, error: 'Unknown model' })
  })

  return Promise.all(tasks)
}
