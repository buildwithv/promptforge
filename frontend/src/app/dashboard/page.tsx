'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Settings2, Save, Copy, RefreshCw, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCompareStore } from '@/hooks/useCompareStore'
import ModelResponse from '@/components/prompt/ModelResponse'
import PromptSettings from '@/components/prompt/PromptSettings'
import { ModelConfig, PromptResult } from '@/types'
import { comparePrompt } from '@/lib/api'

const AVAILABLE_MODELS: ModelConfig[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', color: '#10a37f', enabled: true },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', color: '#10a37f', enabled: false },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', color: '#d97706', enabled: true },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic', color: '#d97706', enabled: false },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google', color: '#4285f4', enabled: true },
]

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [results, setResults] = useState<PromptResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [models, setModels] = useState(AVAILABLE_MODELS)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const { saveToHistory } = useCompareStore()

  const enabledModels = models.filter((m) => m.enabled)

  const handleCompare = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }
    if (enabledModels.length === 0) {
      toast.error('Select at least one model')
      return
    }

    setLoading(true)
    setResults([])

    try {
      const data = await comparePrompt({
        prompt,
        systemPrompt,
        models: enabledModels.map((m) => m.id),
        temperature,
        maxTokens,
      })
      setResults(data.results)
      saveToHistory({ prompt, systemPrompt, results: data.results, models: enabledModels })
      toast.success('Comparison complete!')
    } catch (err) {
      toast.error('Something went wrong. Check your API keys.')
    } finally {
      setLoading(false)
    }
  }

  const handleSavePrompt = () => {
    // Save to collections
    toast.success('Prompt saved to collections!')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-5 border-b border-forge-border flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-700">Compare</h1>
          <p className="text-sm text-white/40 mt-0.5">Run your prompt across multiple AI models</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-forge-border text-sm text-white/60 hover:text-white hover:border-white/20 transition-all"
          >
            <Settings2 className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 space-y-6">
        {/* Model Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => setModels(models.map((m) => m.id === model.id ? { ...m, enabled: !m.enabled } : m))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all duration-150 ${
                model.enabled
                  ? 'border-transparent text-black font-500'
                  : 'border-forge-border text-white/40 hover:text-white/70'
              }`}
              style={model.enabled ? { backgroundColor: model.color } : {}}
            >
              {model.name}
            </button>
          ))}
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <PromptSettings
                temperature={temperature}
                maxTokens={maxTokens}
                systemPrompt={systemPrompt}
                onTemperatureChange={setTemperature}
                onMaxTokensChange={setMaxTokens}
                onSystemPromptChange={setSystemPrompt}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompt Input */}
        <div className="rounded-2xl border border-forge-border bg-forge-card overflow-hidden">
          <div className="p-4">
            <div className="text-xs text-white/30 font-mono mb-3">PROMPT</div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here... Try: 'Explain quantum computing to a 10-year-old'"
              className="w-full bg-transparent text-white/90 placeholder:text-white/20 resize-none outline-none text-sm leading-relaxed min-h-[120px] font-mono"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCompare()
              }}
            />
          </div>
          <div className="px-4 py-3 border-t border-forge-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/30 font-mono">
                {prompt.length} chars · {enabledModels.length} model{enabledModels.length !== 1 ? 's' : ''}
              </span>
              <span className="text-xs text-white/20 font-mono">⌘↵ to run</span>
            </div>
            <div className="flex items-center gap-2">
              {results.length > 0 && (
                <button onClick={handleSavePrompt} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-forge-border text-xs text-white/50 hover:text-white transition-colors">
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
              )}
              <button
                onClick={handleCompare}
                disabled={loading || !prompt.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-forge-green text-black text-sm font-600 hover:bg-forge-green/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {loading ? 'Running...' : 'Compare'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {(loading || results.length > 0) && (
          <div className={`grid gap-6 ${enabledModels.length === 1 ? 'grid-cols-1' : enabledModels.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {loading
              ? enabledModels.map((model) => (
                  <ModelResponse key={model.id} model={model} loading={true} result={null} />
                ))
              : results.map((result) => {
                  const model = models.find((m) => m.id === result.modelId)!
                  return <ModelResponse key={result.modelId} model={model} loading={false} result={result} />
                })}
          </div>
        )}

        {/* Empty state */}
        {!loading && results.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-forge-green/10 flex items-center justify-center mx-auto mb-4">
              <Send className="w-7 h-7 text-forge-green" />
            </div>
            <h3 className="font-display text-lg font-600 mb-2">Ready to compare</h3>
            <p className="text-sm text-white/30 max-w-xs mx-auto">
              Enter a prompt above and hit Compare to see how different models respond
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
