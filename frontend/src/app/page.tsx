'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, GitBranch, Users, BarChart3, Shield, Sparkles } from 'lucide-react'
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs'

const MODELS = ['GPT-4o', 'Claude 3.5', 'Gemini Pro']
const FEATURES = [
  {
    icon: Zap,
    title: 'Side-by-Side Comparison',
    desc: 'Run one prompt across multiple AI models simultaneously and compare outputs instantly.',
    color: 'text-forge-green',
  },
  {
    icon: GitBranch,
    title: 'Prompt Versioning',
    desc: 'Iterate on prompts like code. Track changes, diff versions, revert anytime.',
    color: 'text-forge-cyan',
  },
  {
    icon: Users,
    title: 'Team Workspaces',
    desc: 'Share prompt libraries, collaborate on workflows, and build together.',
    color: 'text-purple-400',
  },
  {
    icon: BarChart3,
    title: 'Usage Analytics',
    desc: 'Track token usage, cost per model, and performance metrics across your team.',
    color: 'text-amber-400',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your prompts and API keys are encrypted and never used for model training.',
    color: 'text-rose-400',
  },
  {
    icon: Sparkles,
    title: 'Prompt Marketplace',
    desc: 'Discover and share high-performing prompts with the community.',
    color: 'text-forge-green',
  },
]

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Perfect to get started',
    features: ['50 prompts/day', '2 models at once', 'Basic history (7 days)', 'Community access'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    desc: 'For power users',
    features: ['Unlimited prompts', 'All 3 models', 'Full history', 'Prompt versioning', 'Usage analytics', 'Priority support'],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    desc: 'For teams & companies',
    features: ['Everything in Pro', 'Up to 10 seats', 'Team workspaces', 'Shared prompt library', 'Admin dashboard', 'SSO (coming soon)'],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export default function HomePage() {
  const { isSignedIn } = useUser()

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-forge-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forge-green to-forge-cyan flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-display font-700 text-lg">PromptForge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-forge-green text-black font-600 text-sm hover:bg-forge-green/90 transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm text-white/60 hover:text-white transition-colors">Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 rounded-lg bg-forge-green text-black font-600 text-sm hover:bg-forge-green/90 transition-colors">
                    Get Started
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-forge-green/20 bg-forge-green/5 text-forge-green text-sm mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Now with Gemini 1.5 Pro support
            </div>

            <h1 className="font-display text-6xl md:text-8xl font-800 leading-none mb-6">
              Forge better
              <br />
              <span className="text-gradient">AI prompts</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
              Compare GPT-4, Claude 3.5, and Gemini side-by-side. Save, version, and share your best prompts. Built for developers who take AI seriously.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <SignUpButton mode="modal">
                <button className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-forge-green text-black font-600 text-base hover:bg-forge-green/90 transition-all duration-200 glow-green">
                  Start for free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignUpButton>
              <a href="#features" className="px-8 py-4 rounded-xl border border-forge-border text-white/70 hover:text-white hover:border-white/20 transition-all duration-200 text-base">
                See how it works
              </a>
            </div>
          </motion.div>

          {/* Model badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 flex items-center justify-center gap-3 flex-wrap"
          >
            <span className="text-sm text-white/30">Supports</span>
            {MODELS.map((m) => (
              <span key={m} className="px-3 py-1 rounded-full border border-forge-border text-sm text-white/50 bg-forge-card">
                {m}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="rounded-2xl border border-forge-border overflow-hidden glass"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-forge-border bg-forge-card">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="ml-4 flex-1 text-center text-xs text-white/30 font-mono">promptforge.app/compare</div>
            </div>
            {/* Mock UI */}
            <div className="p-6 bg-forge-darker">
              <div className="rounded-xl border border-forge-border bg-forge-card p-4 mb-4">
                <div className="text-xs text-white/30 mb-2 font-mono">PROMPT</div>
                <div className="font-mono text-sm text-white/80">
                  Explain quantum entanglement to a 10-year-old using a real-world analogy...
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {MODELS.map((model, i) => (
                  <div key={model} className="rounded-xl border border-forge-border bg-forge-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-white/50">{model}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${i === 0 ? 'bg-forge-green/10 text-forge-green' : i === 1 ? 'bg-forge-cyan/10 text-forge-cyan' : 'bg-purple-400/10 text-purple-400'}`}>
                        {i === 0 ? '1.2s' : i === 1 ? '0.9s' : '1.5s'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className={`h-2 rounded-full bg-white/5 ${j === 3 ? 'w-3/4' : 'w-full'}`} />
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-white/30 font-mono">
                      {i === 0 ? '284' : i === 1 ? '196' : '312'} tokens
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 border-t border-forge-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-700 mb-4">
              Everything you need to
              <br />
              <span className="text-gradient">master AI prompting</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Stop guessing which model is best. Start knowing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl border border-forge-border bg-forge-card card-hover"
              >
                <f.icon className={`w-6 h-6 ${f.color} mb-4`} />
                <h3 className="font-display font-600 text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24 border-t border-forge-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-700 mb-4">
              Simple, transparent <span className="text-gradient">pricing</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-2xl border ${plan.highlight ? 'border-forge-green/40 bg-forge-green/5 glow-green' : 'border-forge-border bg-forge-card'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-forge-green text-black text-xs font-700">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm text-white/40 mb-1">{plan.name}</div>
                  <div className="flex items-end gap-1">
                    <span className="font-display text-4xl font-700">{plan.price}</span>
                    <span className="text-white/40 mb-1">{plan.period}</span>
                  </div>
                  <div className="text-sm text-white/40 mt-1">{plan.desc}</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <span className="text-forge-green">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <SignUpButton mode="modal">
                  <button className={`w-full py-3 rounded-xl font-600 text-sm transition-all duration-200 ${plan.highlight ? 'bg-forge-green text-black hover:bg-forge-green/90' : 'border border-forge-border hover:border-white/20 text-white/70 hover:text-white'}`}>
                    {plan.cta}
                  </button>
                </SignUpButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-forge-border px-6 py-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-forge-green to-forge-cyan flex items-center justify-center">
              <Zap className="w-3 h-3 text-black" />
            </div>
            <span className="font-display font-700">PromptForge</span>
          </div>
          <div className="text-sm text-white/30">
            Built with ⚡ by vaishnavi1320
          </div>
        </div>
      </footer>
    </div>
  )
}