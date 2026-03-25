'use client'

import { useState } from 'react'
import { Copy, ThumbsUp, ThumbsDown, Clock, Zap, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { ModelConfig, PromptResult } from '@/types'

interface ModelResponseProps {
  model: ModelConfig
  loading: boolean
  result: PromptResult | null
}

export default function ModelResponse({ model, loading, result }: ModelResponseProps) {
  const [expanded, setExpanded] = useState(true)

  const handleCopy = () => {
    if (result?.content) {
      navigator.clipboard.writeText(result.content)
      toast.success('Copied to clipboard!')
    }
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-200"
      style={{ borderColor: loading ? '#1e1e2e' : `${model.color}30` }}
    >
      {/* Model Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: `${model.color}10` }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: model.color }} />
          <span className="font-mono text-sm font-500">{model.name}</span>
        </div>
        {result && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-white/40">
              <Clock className="w-3 h-3" />
              {result.latency}ms
            </div>
            <div className="flex items-center gap-1 text-xs text-white/40">
              <Zap className="w-3 h-3" />
              {result.tokens} tok
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-forge-card">
        {loading ? (
          <div className="p-5 space-y-3">
            {[100, 90, 95, 80, 70].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded-full shimmer"
                style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        ) : result ? (
          <>
            <div className="p-5 response-content">
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans">
                {result.content}
              </p>
            </div>
            {/* Cost estimate */}
            {result.cost && (
              <div className="px-5 py-2 border-t border-forge-border">
                <span className="text-xs text-white/30 font-mono">
                  ~${result.cost.toFixed(4)} estimated cost
                </span>
              </div>
            )}
            {/* Actions */}
            <div className="px-4 py-3 border-t border-forge-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-forge-green transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-red-400 transition-colors">
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
