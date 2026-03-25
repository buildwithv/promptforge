import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'PromptForge — AI Prompt Comparison Platform',
  description: 'Compare GPT-4, Claude, and Gemini side-by-side. Save prompts, track history, and build better AI workflows.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en">
        <body style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#111118',
                color: '#fff',
                border: '1px solid #1e1e2e',
                borderRadius: '12px',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}