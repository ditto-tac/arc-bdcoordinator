import { useState } from 'react'
import type { BriefContent } from '../types'
import { CANNED_BRIEF } from '../data/canned-llm'
import { generateBriefLive } from '../lib/api/llm'
import RegenerateLiveModal from './RegenerateLiveModal'

export default function AIMorningBrief() {
  const [brief, setBrief] = useState<BriefContent>(CANNED_BRIEF)
  const [modalOpen, setModalOpen] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const isLive = brief.source === 'live'

  const runLive = async (apiKey: string) => {
    setRegenerating(true)
    try {
      const text = await generateBriefLive(apiKey)
      setBrief({
        text,
        toneTags: ['live', 'direct'],
        source: 'live',
        generatedAt: new Date().toISOString(),
      })
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <>
      <div className="rounded-lg border border-rc-stone bg-white p-4 md:p-5">
        <div className="flex items-baseline justify-between mb-3">
          <div className="text-sm font-semibold text-rc-ink">AI Morning Brief</div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isLive ? 'bg-rc-emerald/10 text-rc-emerald' : 'bg-rc-mist text-rc-slate'
              }`}
              title={isLive ? 'Live Claude response' : 'Pre-computed Claude response'}
            >
              {isLive ? '● live' : '○ canned'}
            </span>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={regenerating}
              className="text-[11px] text-rc-teal hover:text-rc-red transition-colors font-medium disabled:opacity-40"
            >
              {regenerating ? 'regenerating...' : 'regenerate ⟳'}
            </button>
          </div>
        </div>
        <p
          className="text-sm text-rc-ink leading-relaxed"
          aria-live="polite"
        >
          {brief.text}
        </p>
        <div className="mt-3 flex gap-1.5">
          {brief.toneTags.map(t => (
            <span
              key={t}
              className="text-[10px] font-mono text-rc-slate uppercase tracking-wider"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
      {modalOpen && (
        <RegenerateLiveModal
          onClose={() => setModalOpen(false)}
          onKeyReady={runLive}
          target="the Morning Brief"
        />
      )}
    </>
  )
}
