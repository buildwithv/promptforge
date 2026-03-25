import { Router, Request, Response } from 'express'
import Stripe from 'stripe'
import { requireAuth } from '../middleware/requireAuth'
import { prisma } from '../lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export const billingRoutes = Router()

const PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  team: process.env.STRIPE_TEAM_PRICE_ID!,
}

// POST /api/billing/checkout
billingRoutes.post('/checkout', requireAuth, async (req: Request, res: Response) => {
  try {
    const { plan } = req.body
    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS]
    if (!priceId) return res.status(400).json({ error: 'Invalid plan' })

    const user = await prisma.user.findUnique({ where: { id: req.userId! } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email })
      customerId = customer.id
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/settings`,
      metadata: { userId: user.id },
    })

    res.json({ url: session.url })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

// POST /api/billing/portal
billingRoutes.post('/portal', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } })
    if (!user?.stripeCustomerId) return res.status(400).json({ error: 'No subscription found' })

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard/settings`,
    })

    res.json({ url: session.url })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create portal session' })
  }
})

// Stripe Webhook (raw body required - registered separately in index.ts)
export async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature']!
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const priceId = subscription.items.data[0]?.price.id
        const status = subscription.status

        let plan: 'FREE' | 'PRO' | 'TEAM' = 'FREE'
        if (status === 'active') {
          if (priceId === PRICE_IDS.team) plan = 'TEAM'
          else if (priceId === PRICE_IDS.pro) plan = 'PRO'
        }

        await prisma.user.update({
          where: { stripeCustomerId: customerId },
          data: { plan },
        })
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer as string },
          data: { plan: 'FREE' },
        })
        break
      }
    }

    res.json({ received: true })
  } catch (err) {
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}
