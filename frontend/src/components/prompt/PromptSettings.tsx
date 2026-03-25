'use client'

interface PromptSettingsProps {
  temperature: number
  maxTokens: number
  systemPrompt: string
  onTemperatureChange: (v: number) => void
  onMaxTokensChange: (v: number) => void
  onSystemPromptChange: (v: string) => void
}

export default function PromptSettings({
  temperature,
  maxTokens,
  systemPrompt,
  onTemperatureChange,
  onMaxTokensChange,
  onSystemPromptChange,
}: PromptSettingsProps) {
  return (
    <div className="rounded-2xl border border-forge-border bg-forge-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* System Prompt */}
      <div className="md:col-span-1">
        <label className="text-xs text-white/40 font-mono mb-2 block">SYSTEM PROMPT</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          placeholder="You are a helpful assistant..."
          className="w-full bg-forge-darker border border-forge-border rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/20 outline-none resize-none h-20 font-mono focus:border-forge-green/40 transition-colors"
        />
      </div>

      {/* Temperature */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-white/40 font-mono">TEMPERATURE</label>
          <span className="text-xs text-forge-green font-mono">{temperature}</span>
        </div>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
          className="w-full accent-forge-green"
        />
        <div className="flex justify-between text-xs text-white/20 mt-1">
          <span>Precise</span>
          <span>Creative</span>
        </div>
      </div>

      {/* Max Tokens */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-white/40 font-mono">MAX TOKENS</label>
          <span className="text-xs text-forge-green font-mono">{maxTokens}</span>
        </div>
        <input
          type="range"
          min="100"
          max="4000"
          step="100"
          value={maxTokens}
          onChange={(e) => onMaxTokensChange(parseInt(e.target.value))}
          className="w-full accent-forge-green"
        />
        <div className="flex justify-between text-xs text-white/20 mt-1">
          <span>100</span>
          <span>4000</span>
        </div>
      </div>
    </div>
  )
}
