'use client'

import { useState } from 'react'
import { Search, Trash2, ExternalLink, Clock } from 'lucide-react'
import { useCompareStore } from '@/hooks/useCompareStore'
import { formatDistanceToNow } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useCompareStore()
  const [search, setSearch] = useState('')

  const filtered = history.filter((h) =>
    h.prompt.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-5 border-b border-forge-border flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-700">History</h1>
          <p className="text-sm text-white/40 mt-0.5">{history.length} prompts saved</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => { clearHistory(); toast.success('History cleared') }}
            className="text-xs text-white/30 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="p-8 space-y-4 flex-1 overflow-auto">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forge-card border border-forge-border text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-forge-green/40 transition-colors"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Clock className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No history yet. Run your first comparison!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.id} className="group p-5 rounded-2xl border border-forge-border bg-forge-card card-hover">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 line-clamp-2 font-mono leading-relaxed">
                      {item.prompt}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1.5">
                        {item.models.map((m) => (
                          <span
                            key={m.id}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${m.color}20`, color: m.color }}
                          >
                            {m.name}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-white/30">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { removeFromHistory(item.id); toast.success('Removed') }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
