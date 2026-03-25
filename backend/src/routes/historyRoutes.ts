import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { prisma } from '../lib/prisma'

export const historyRoutes = Router()

// GET /api/history
historyRoutes.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      prisma.prompt.findMany({
        where: { userId: req.userId! },
        include: {
          results: {
            select: { modelId: true, tokens: true, latency: true, cost: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.prompt.count({ where: { userId: req.userId! } }),
    ])

    res.json({ items, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' })
  }
})

// DELETE /api/history/:id
historyRoutes.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.prompt.deleteMany({
      where: { id: req.params.id, userId: req.userId! },
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' })
  }
})
