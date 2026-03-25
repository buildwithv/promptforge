import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth'
import { compareModels } from '../services/aiService'
import { prisma } from '../lib/prisma'
import { checkUsageLimit } from '../middleware/usageLimit'

export const promptRoutes = Router()

const compareSchema = z.object({
  prompt: z.string().min(1).max(10000),
  systemPrompt: z.string().max(2000).optional().default(''),
  models: z.array(z.string()).min(1).max(5),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(100).max(4000).default(1000),
})

// POST /api/prompts/compare
promptRoutes.post('/compare', requireAuth, checkUsageLimit, async (req: Request, res: Response) => {
  try {
    const body = compareSchema.parse(req.body)
    const userId = req.userId!

    // Run all models in parallel
    const results = await compareModels(
      body.models,
      body.prompt,
      body.systemPrompt,
      body.temperature,
      body.maxTokens
    )

    // Save to DB
    const saved = await prisma.prompt.create({
      data: {
        userId,
        content: body.prompt,
        systemPrompt: body.systemPrompt || null,
        results: {
          create: results.map((r) => ({
            modelId: r.modelId,
            content: r.content,
            tokens: r.tokens,
            latency: r.latency,
            cost: r.cost,
            error: r.error || null,
          })),
        },
      },
      include: { results: true },
    })

    // Track usage
    await Promise.all(
      results
        .filter((r) => !r.error)
        .map((r) =>
          prisma.usage.create({
            data: {
              userId,
              modelId: r.modelId,
              tokens: r.tokens,
              cost: r.cost,
            },
          })
        )
    )

    res.json({
      id: saved.id,
      results: results,
      createdAt: saved.createdAt,
    })
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request', details: err.errors })
    }
    console.error('Compare error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/prompts/save
promptRoutes.post('/save', requireAuth, async (req: Request, res: Response) => {
  try {
    const { promptId, title, tags } = req.body
    const userId = req.userId!

    const prompt = await prisma.prompt.update({
      where: { id: promptId, userId },
      data: { title, tags: tags || [] },
    })

    res.json(prompt)
  } catch (err) {
    res.status(500).json({ error: 'Failed to save prompt' })
  }
})

// GET /api/prompts/:id
promptRoutes.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const prompt = await prisma.prompt.findFirst({
      where: { id: req.params.id, userId: req.userId! },
      include: { results: true, versions: { orderBy: { version: 'desc' } } },
    })

    if (!prompt) return res.status(404).json({ error: 'Not found' })
    res.json(prompt)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/prompts/:id
promptRoutes.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.prompt.deleteMany({
      where: { id: req.params.id, userId: req.userId! },
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' })
  }
})
