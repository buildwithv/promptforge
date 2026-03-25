import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

const PLAN_LIMITS = {
  FREE: 50,   // per day
  PRO: -1,    // unlimited
  TEAM: -1,   // unlimited
}

export async function checkUsageLimit(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { plan: true },
    })

    if (!user) return res.status(404).json({ error: 'User not found' })

    const limit = PLAN_LIMITS[user.plan]
    if (limit === -1) return next() // Unlimited

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayUsage = await prisma.prompt.count({
      where: {
        userId: req.userId!,
        createdAt: { gte: today },
      },
    })

    if (todayUsage >= limit) {
      return res.status(429).json({
        error: 'Daily limit reached',
        message: `Free plan allows ${limit} prompts/day. Upgrade to Pro for unlimited access.`,
        limit,
        used: todayUsage,
      })
    }

    next()
  } catch (err) {
    next(err)
  }
}
