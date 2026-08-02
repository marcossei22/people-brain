'use client'

/**
 * O chat — ARQUITETURA.md §8.0. FLUXO 2.
 *
 * Painel, não rota: a pergunta quase sempre nasce olhando outra tela, e mandar
 * a pessoa pra outra página quebra o gesto.
 *
 * Única superfície com LLM. O viewer vai no header `x-people-brain-persona`,
 * que o canal do eve resolve ANTES do modelo entrar no turno — é assim que a
 * permissão continua sendo código (decisão #21).
 */

import { useEffect, useRef, useState } from 'react'
import { useEveAgent } from 'eve/react'
import { ArrowUp, Square, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Componente } from '@/components/brain/componentes'
import { PassosDaTool } from './passos-da-tool'
import type { PassoTool } from './passos-da-tool'
import { useChat } from '@/lib/chat'
import { useViewer } from '@/lib/viewer'

const CHIPS = [
  'Prepara meu 1:1 com a Carla',
  'Onde a Carla está em relação à régua de Sênior?',
  'Quem no meu time está sem feedback há mais tempo?',
  'O Rafael está infeliz?',
]

interface Parte {
  type: string
  text?: string
  toolName?: string
  state?: string
  input?: unknown
  output?: unknown
  toolCallId?: string
}

export function PainelChat() {
  const { aberto, fechar } = useChat()
  const { viewer } = useViewer()
  const fim = useRef<HTMLDivElement>(null)
  const [rascunho, setRascunho] = useState('')

  const agent = useEveAgent({
    headers: () => ({ 'x-people-brain-persona': viewer.pessoaId }),
  })

  const ocupado = agent.status === 'submitted' || agent.status === 'streaming'
  const mensagens = agent.data.messages

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens.length, agent.status])

  // Trocar de persona começa uma conversa nova: o registro que o Brain alcança
  // mudou, então continuar a mesma thread seria misturar dois escopos.
  useEffect(() => {
    agent.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer.pessoaId])

  if (!aberto) return null

  function enviar(texto: string) {
    const t = texto.trim()
    if (!t || ocupado) return
    setRascunho('')
    void agent.send({ message: t })
  }

  return (
    <aside className="fixed right-0 top-0 z-50 flex h-dvh w-full flex-col border-l border-border bg-background shadow-2xl sm:w-[34rem]">
      <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <p className="etiqueta">Conversa</p>
          <p className="mt-0.5 text-[0.78rem] text-muted-foreground">
            perguntando como {viewer.pessoaId}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 text-[0.78rem]" onClick={() => agent.reset()}>
            Limpar
          </Button>
          <Button variant="ghost" size="icon" className="size-7" onClick={fechar} aria-label="Fechar">
            <X className="size-4" />
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        {mensagens.length === 0 && (
          <div className="space-y-2">
            <p className="etiqueta pb-1">Perguntas frequentes</p>
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => enviar(c)}
                className="block w-full rounded-sm border border-border bg-card px-3.5 py-2.5 text-left text-[0.88rem] leading-snug transition-colors hover:border-comp/40 hover:bg-comp-suave/20"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {mensagens.map((m) => (
          <Mensagem key={m.id} papel={m.role} partes={(m.parts ?? []) as Parte[]} />
        ))}

        {agent.status === 'error' && (
          <p className="mt-3 rounded-sm border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-[0.85rem] text-destructive">
            {agent.error?.message ?? 'Algo falhou. Tente de novo.'}
          </p>
        )}

        <div ref={fim} />
      </div>

      <form
        className="border-t border-border p-3.5"
        onSubmit={(e) => {
          e.preventDefault()
          enviar(rascunho)
        }}
      >
        <div className="relative">
          <Textarea
            value={rascunho}
            onChange={(e) => setRascunho(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                enviar(rascunho)
              }
            }}
            rows={2}
            placeholder="Pergunte sobre o trabalho de alguém."
            className="resize-none bg-card pr-11 text-[0.9rem]"
          />
          <Button
            type={ocupado ? 'button' : 'submit'}
            onClick={ocupado ? () => agent.stop() : undefined}
            size="icon"
            className="absolute bottom-2 right-2 size-7"
            aria-label={ocupado ? 'Parar' : 'Enviar'}
          >
            {ocupado ? <Square className="size-3" /> : <ArrowUp className="size-3.5" />}
          </Button>
        </div>
      </form>
    </aside>
  )
}

function Mensagem({ papel, partes }: { papel: string; partes: Parte[] }) {
  if (papel === 'user') {
    const texto = partes
      .filter((p) => p.type === 'text')
      .map((p) => p.text)
      .join('')
    if (!texto) return null
    return (
      <div className="mb-5 flex justify-end">
        <p className="max-w-[85%] rounded-sm bg-foreground/[0.06] px-3.5 py-2.5 text-[0.9rem] leading-snug">
          {texto}
        </p>
      </div>
    )
  }

  const passos: PassoTool[] = []
  const blocos: React.JSX.Element[] = []

  partes.forEach((p, i) => {
    if (p.type === 'text' && p.text) {
      blocos.push(
        <p key={`t${i}`} className="prosa mb-3 whitespace-pre-wrap text-[0.95rem] leading-relaxed">
          {p.text}
        </p>,
      )
      return
    }

    const nome = p.toolName ?? (p.type.startsWith('tool-') ? p.type.slice(5) : undefined)
    if (!nome) return

    const saida = p.output as { renderizado?: boolean; tipo?: string; payload?: unknown } | undefined
    const concluido = p.state === 'output-available' || saida !== undefined

    passos.push({
      id: p.toolCallId ?? `${nome}-${i}`,
      nome,
      argumento: resumirEntrada(p.input),
      resultado: resumirSaida(p.output),
      concluido,
    })

    if (nome === 'renderizar' && saida?.renderizado && saida.tipo) {
      blocos.push(<Componente key={`c${i}`} tipo={saida.tipo} payload={saida.payload} />)
    }
  })

  return (
    <div className="mb-6">
      <PassosDaTool passos={passos} />
      {blocos}
    </div>
  )
}

function resumirEntrada(input: unknown): string | undefined {
  if (!input || typeof input !== 'object') return undefined
  const o = input as Record<string, unknown>
  const chave = o.pessoaId ?? o.nome ?? o.nivel ?? o.tipo ?? o.skill
  return typeof chave === 'string' ? chave : undefined
}

function resumirSaida(output: unknown): string | undefined {
  if (!output || typeof output !== 'object') return undefined
  const o = output as Record<string, unknown>
  if (o.negado) return 'acesso negado'
  if (typeof o.total === 'number') return `${o.total}`
  if (Array.isArray(o.pessoas)) return `${o.pessoas.length}`
  return undefined
}
