import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { prisma } from '../lib/prisma'

export const userRoutes = Router()

userRoutes.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: {
        id: true,
        email: true,
        plan: true,
        createdAt: true,
        _count: { select: { prompts: true, collections: true } },
      },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dailyUsage = await prisma.prompt.count({
      where: { userId: req.userId!, createdAt: { gte: today } },
    })

    res.json({ ...user, usage: { daily: dailyUsage } })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})
