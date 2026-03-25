import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Zap, GitCompare, History, BookOpen, BarChart3, Settings, Store } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', icon: GitCompare, label: 'Compare' },
  { href: '/dashboard/history', icon: History, label: 'History' },
  { href: '/dashboard/collections', icon: BookOpen, label: 'Collections' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/marketplace', icon: Store, label: 'Marketplace' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/')

  return (
    <div className="flex h-screen bg-forge-darker overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 border-r border-forge-border flex flex-col bg-forge-card/50">
        {/* Logo */}
        <div className="p-5 border-b border-forge-border">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forge-green to-forge-cyan flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-display font-700 text-lg">PromptForge</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all duration-150 group"
            >
              <item.icon className="w-4 h-4 group-hover:text-forge-green transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-forge-border flex items-center gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-white/30 truncate">Signed in</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
