'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/** Documento de doutrina renderizado como documento: serifa, medida de linha
 *  curta, hierarquia clara. É prosa que alguém escreveu para ser lida. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prosa max-w-[38rem] text-[0.98rem] leading-[1.7] text-foreground/85">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="display mt-9 mb-3 text-[1.25rem] leading-tight tracking-tight text-foreground first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="display mt-6 mb-2 text-[1.05rem] leading-tight text-foreground">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-4">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc space-y-1.5 pl-5 marker:text-muted-foreground/50">
              {children}
            </ul>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          table: ({ children }) => (
            <div className="mb-5 overflow-x-auto">
              <table className="w-full border-collapse text-[0.88rem]">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="etiqueta border-b border-border py-2 pr-4 text-left align-bottom">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/50 py-2.5 pr-4 align-top">{children}</td>
          ),
          hr: () => <hr className="my-8 border-border" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
