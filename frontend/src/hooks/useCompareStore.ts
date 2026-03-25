import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { HistoryItem, ModelConfig, PromptResult } from '@/types'

interface CompareStore {
  history: HistoryItem[]
  saveToHistory: (item: Omit<HistoryItem, 'id' | 'createdAt'>) => void
  removeFromHistory: (id: string) => void
  clearHistory: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      history: [],
      saveToHistory: (item) =>
        set((state) => ({
          history: [
            {
              ...item,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...state.history.slice(0, 99), // Keep last 100 locally
          ],
        })),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    { name: 'promptforge-history' }
  )
)
