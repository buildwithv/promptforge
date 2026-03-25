import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { prisma } from '../lib/prisma'

export const collectionRoutes = Router()

collectionRoutes.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const collections = await prisma.collection.findMany({
      where: { userId: req.userId! },
      include: {
        items: {
          include: { prompt: { select: { id: true, content: true, createdAt: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })
    res.json(collections)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch collections' })
  }
})

collectionRoutes.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body
    const collection = await prisma.collection.create({
      data: { userId: req.userId!, name, description },
    })
    res.status(201).json(collection)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create collection' })
  }
})

collectionRoutes.post('/:id/prompts', requireAuth, async (req: Request, res: Response) => {
  try {
    const { promptId } = req.body
    const item = await prisma.collectionItem.create({
      data: { collectionId: req.params.id, promptId },
    })
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to collection' })
  }
})

collectionRoutes.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await prisma.collection.deleteMany({
      where: { id: req.params.id, userId: req.userId! },
    })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete collection' })
  }
})
