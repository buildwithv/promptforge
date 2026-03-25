import { Request, Response, NextFunction } from 'express'
import { clerkClient, verifyToken } from '@clerk/clerk-sdk-node'
import { prisma } from '../lib/prisma'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      clerkUserId?: string
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    const sessionToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    // Also check cookies (Next.js Clerk sends session cookie)
    const sessionCookie = req.cookies?.__session

    const token = sessionToken || sessionCookie

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    })

    const clerkUserId = payload.sub

    // Find or create user in our DB
    let user = await prisma.user.findUnique({ where: { clerkId: clerkUserId } })

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId)
      user = await prisma.user.create({
        data: {
          clerkId: clerkUserId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
        },
      })
    }

    req.userId = user.id
    req.clerkUserId = clerkUserId
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
