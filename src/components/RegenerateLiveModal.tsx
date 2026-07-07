import { useEffect, useState } from 'react'
import { getStoredKey, setStoredKey, clearStoredKey } from '../lib/api/llm'

type Props = {
  onClose: () => void
  onKeyReady: (apiKey: string) => Promise<void> | void
  target: string // "the Morning Brief" or "Sarah T.'s SMS draft"
}

export default function RegenerateLiveModal({ onClose, onKeyReady, target }: Props) {
  const [key, setKey] = useState(() => getStoredKey() ?? '')
  const [remember, setRemember] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [onClose, submitting])

  const submit = async () => {
    if (!key.trim().startsWith('sk-ant-')) {
      setError('Keys begin with sk-ant-. Double-check what you pasted.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      if (remember) setStoredKey(key)
      await onKeyReady(key)
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="byok-title"
    >
      <button
        type="button"
        onClick={() => !submitting && onClose()}
        className="absolute inset-0 bg-rc-ink/50"
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-2xl">
        <div className="border-b border-rc-stone px-5 py-3">
          <h3 id="byok-title" className="text-sm font-semibold text-rc-ink">
            Regenerate with your Anthropic key
          </h3>
          <p className="mt-1 text-xs text-rc-slate">
            Regenerating {target} using live Claude Sonnet 4.5.
          </p>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-rc-slate leading-relaxed">
            The key is stored in localStorage on <em>this device only</em>. It is
            never sent anywhere except the Anthropic API. You can revoke it at
            any time by clearing your browser data or clicking "Forget key" below.
          </p>

          <label className="block">
            <span className="text-[11px] uppercase tracking-wide text-rc-slate">
              Anthropic API key
            </span>
            <input
              type="password"
              value={key}
              onChange={e => {
                setKey(e.target.value)
                setError(null)
              }}
              placeholder="sk-ant-..."
              autoFocus
              className="mt-1 w-full rounded border border-rc-stone bg-white px-3 py-2 text-sm font-mono text-rc-ink placeholder:text-rc-slate/50 focus:border-rc-red focus:outline-none focus:ring-1 focus:ring-rc-red"
            />
          </label>

          <label className="flex items-center gap-2 text-xs text-rc-slate">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            Remember for this session
          </label>

          {error && (
            <div className="rounded-md border border-rc-red/30 bg-rc-red/5 px-3 py-2 text-xs text-rc-red">
              {error}
            </div>
          )}

          <p className="text-[11px] text-rc-slate">
            No key?{' '}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noreferrer noopener"
              className="text-rc-teal underline"
            >
              Get one at console.anthropic.com →
            </a>
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-rc-stone bg-rc-mist px-5 py-3">
          <button
            type="button"
            onClick={() => {
              clearStoredKey()
              setKey('')
            }}
            className="text-[11px] text-rc-slate hover:text-rc-red"
            disabled={submitting}
          >
            Forget stored key
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded px-3 py-1.5 text-xs text-rc-slate hover:text-rc-ink disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!key.trim() || submitting}
              className="rounded bg-rc-red px-3 py-1.5 text-xs font-medium text-white hover:bg-rc-red-dark disabled:opacity-40"
            >
              {submitting ? 'Regenerating...' : 'Save & regenerate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
