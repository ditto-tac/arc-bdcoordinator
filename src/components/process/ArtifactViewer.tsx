import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = {
  markdown: string
  compact?: boolean
}

export default function ArtifactViewer({ markdown, compact }: Props) {
  return (
    <div className={`prose-artifact ${compact ? 'text-xs' : 'text-sm'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-4 text-lg font-semibold text-rc-ink">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-4 text-base font-semibold text-rc-ink">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-3 text-sm font-semibold text-rc-slate uppercase tracking-wide">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-2 leading-relaxed text-rc-ink">{children}</p>
          ),
          ul: ({ children }) => <ul className="my-2 list-disc pl-5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal pl-5 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-rc-ink">{children}</li>,
          code: ({ children, ...props }) => {
            const inline = !(props as { inline?: boolean }).inline && String(children).includes('\n')
            if (inline) {
              return (
                <pre className="my-2 overflow-x-auto rounded bg-rc-mist border border-rc-stone p-3 text-[11px] font-mono">
                  <code>{children}</code>
                </pre>
              )
            }
            return (
              <code className="rounded bg-rc-mist px-1 py-0.5 text-[11px] font-mono text-rc-red">
                {children}
              </code>
            )
          },
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-rc-stone pl-3 text-rc-slate italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto">
              <table className="w-full border-collapse text-xs">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-rc-stone bg-rc-mist p-1.5 text-left font-semibold text-rc-ink">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-rc-stone p-1.5 text-rc-ink">{children}</td>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-rc-teal underline hover:text-rc-red"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-4 border-rc-stone" />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
