import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { prisma } from '../lib/prisma'

export const analyticsRoutes = Router()

analyticsRoutes.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [totalPrompts, usageRecords] = await Promise.all([
      prisma.prompt.count({ where: { userId } }),
      prisma.usage.findMany({
        where: { userId, date: { gte: thirtyDaysAgo } },
        orderBy: { date: 'asc' },
      }),
    ])

    const totalTokens = usageRecords.reduce((sum, u) => sum + u.tokens, 0)
    const totalCost = usageRecords.reduce((sum, u) => sum + u.cost, 0)

    // Model breakdown
    const modelMap = new Map<string, { prompts: number; tokens: number; cost: number }>()
    for (const record of usageRecords) {
      const existing = modelMap.get(record.modelId) || { prompts: 0, tokens: 0, cost: 0 }
      modelMap.set(record.modelId, {
        prompts: existing.prompts + 1,
        tokens: existing.tokens + record.tokens,
        cost: existing.cost + record.cost,
      })
    }

    // Daily usage
    const dailyMap = new Map<string, { prompts: number; tokens: number }>()
    for (const record of usageRecords) {
      const date = record.date.toISOString().split('T')[0]
      const existing = dailyMap.get(date) || { prompts: 0, tokens: 0 }
      dailyMap.set(date, {
        prompts: existing.prompts + 1,
        tokens: existing.tokens + record.tokens,
      })
    }

    res.json({
      totalPrompts,
      totalTokens,
      totalCost: parseFloat(totalCost.toFixed(4)),
      modelBreakdown: Array.from(modelMap.entries()).map(([modelId, data]) => ({
        modelId,
        ...data,
        cost: parseFloat(data.cost.toFixed(4)),
      })),
      dailyUsage: Array.from(dailyMap.entries()).map(([date, data]) => ({
        date,
        ...data,
      })),
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})
