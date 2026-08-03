'use client'

/**
 * O chat — ARQUITETURA.md §8.0. FLUXO 2.
 *
 * Painel, não rota: a pergunta quase sempre nasce olhando outra tela, e mandar
 * a pessoa pra outra página quebra o gesto.
 *
 * Única superfície com LLM. O viewer vai no header `x-people-brain-persona`,
 * que o canal do eve resolve ANTES do modelo entrar no turno — é assim que a
 * permissão continua sendo código (decisão #21). Junto com ele vai o delta da
 * sessão, pelo mesmo caminho e pelo mesmo motivo: sem ele o Brain responde pela
 * semente enquanto o dossiê atrás do painel já mostra o que a pessoa escreveu.
 */

import { useEffect, useRef, useState } from 'react'
import { useEveAgent } from 'eve/react'
import { Renderer } from '@openuidev/react-lang'
import { ArrowUp, Loader2, Square, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { biblioteca } from '@/components/brain/biblioteca'
import { PassosDaTool } from './passos-da-tool'
import type { PassoTool } from './passos-da-tool'
import { useChat } from '@/lib/chat'
import { nomeDe } from '@/lib/memoria'
import { useRegistro } from '@/lib/registro'
import { HEADER_REGISTRO, serializar } from '@/lib/sessao'
import { useViewer } from '@/lib/viewer'
import type { Viewer } from '@/lib/viewer'

/**
 * Chips por papel. Perguntar "quem no meu time..." para uma CHRO que não tem
 * reports faz o Brain (com razão) devolver uma pergunta em vez de resposta —
 * e na gravação isso lê como falha, não como cuidado.
 */
const CHIPS: Record<string, string[]> = {
  gestor: [
    'Prepara meu 1:1 com a Carla',
    'Onde a Carla está em relação à régua de Sênior?',
    'O que eu ainda não sei sobre o Bruno?',
    'O Rafael está infeliz?',
  ],
  colaborador: [
    'O que está registrado sobre mim neste semestre?',
    'O que falta para eu chegar em Sênior?',
    'Quem consegue ver o meu registro?',
    'Como eu estou em relação ao Rafael?',
  ],
  chro: [
    'Onde a Carla está em relação à régua de Sênior?',
    'Quem na empresa tem menos evidência registrada?',
    'Que padrões aparecem entre as entregas atrasadas?',
    'O Rafael está infeliz?',
  ],
}

interface PedidoDeInput {
  requestId: string
  prompt: string
  options?: { id: string; label: string; description?: string }[]
  allowFreeform?: boolean
}

interface Parte {
  type: string
  text?: string
  toolName?: string
  state?: string
  input?: unknown
  output?: unknown
  toolCallId?: string
  toolMetadata?: { eve?: { inputRequest?: PedidoDeInput } }
}

/**
 * Trocar de persona REMONTA o painel.
 *
 * `useEveAgent` lê `headers` uma vez, quando cria o store — a função fica
 * presa no `viewer` do primeiro render. Sem a `key`, o seletor de persona
 * mudava a tela e não mudava o header, e o chat inteiro respondia como a
 * persona padrão. Remontar também descarta a sessão do servidor, que é o
 * certo: o registro que o Brain alcança mudou, continuar a mesma thread
 * seria misturar dois escopos.
 */
export function PainelChat() {
  const { viewer } = useViewer()
  return <Painel key={viewer.pessoaId} viewer={viewer} />
}

function Painel({ viewer }: { viewer: Viewer }) {
  const { aberto, fechar, perguntaInicial, consumirPergunta, registrarConversa } = useChat()
  const { sessao } = useRegistro()
  const fim = useRef<HTMLDivElement>(null)
  const [rascunho, setRascunho] = useState('')

  /* Por que uma ref, e não `sessao` direto: o `useEveAgent` guarda a função de
   * headers uma vez, quando cria o store, mas a CHAMA antes de cada requisição.
   * Lida do closure, ela mandaria para sempre o registro do primeiro render — o
   * turno seguinte ao reconhecimento veria a régua de antes dele. A ref é a
   * mesma referência em todo render e carrega o delta atual; o efeito a atualiza
   * no commit, muito antes de qualquer clique poder disparar um envio. */
  const registro = useRef(sessao)
  useEffect(() => {
    registro.current = sessao
  }, [sessao])

  const agent = useEveAgent({
    headers: () => ({
      'x-people-brain-persona': viewer.pessoaId,
      [HEADER_REGISTRO]: serializar(registro.current),
    }),
  })

  const ocupado = agent.status === 'submitted' || agent.status === 'streaming'
  const mensagens = agent.data.messages

  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    ;(window as unknown as Record<string, unknown>).__pb = agent
  }

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens.length, agent.status])

  // Persona nova, painel remontado: a conversa da persona anterior não é desta.
  useEffect(() => {
    registrarConversa(null)
  }, [registrarConversa])

  // Pergunta vinda de outra tela — o dossiê passa a conversa adiante.
  useEffect(() => {
    if (!perguntaInicial || !aberto) return
    setRascunho(perguntaInicial)
    consumirPergunta()
  }, [perguntaInicial, aberto, consumirPergunta])

  if (!aberto) return null

  function enviar(texto: string) {
    const t = texto.trim()
    if (!t || ocupado) return
    setRascunho('')
    if (mensagens.length === 0) registrarConversa(t)
    void agent.send({ message: t })
  }

  function limpar() {
    agent.reset()
    registrarConversa(null)
  }

  return (
    /* A partir de `lg` o painel está docado — o `<Palco>` abriu espaço para
       ele, e sombra pesada faria um painel docado parecer sobreposto. */
    <aside className="fixed right-0 top-0 z-50 flex h-dvh w-full flex-col border-l border-border bg-background shadow-2xl sm:w-[26rem] lg:w-[30rem] lg:shadow-none xl:w-[34rem]">
      <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div>
          <p className="etiqueta">Conversa</p>
          <p className="mt-0.5 text-[0.78rem] text-muted-foreground">
            perguntando como {nomeDe(viewer.pessoaId)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 text-[0.78rem]" onClick={limpar}>
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
            {(CHIPS[viewer.papel] ?? CHIPS.gestor).map((c) => (
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
          <Mensagem
            key={m.id}
            papel={m.role}
            partes={(m.parts ?? []) as Parte[]}
            responder={(r) => void agent.send({ inputResponses: [r] })}
          />
        ))}

        {/* Os primeiros segundos de um turno não têm parte nenhuma para
            desenhar: o painel ficava em branco e lia como travado. */}
        {ocupado && semSinal(mensagens) && (
          <p className="flex items-center gap-2 font-mono text-[0.7rem] text-muted-foreground">
            <Loader2 className="size-2.5 animate-spin" />
            consultando a memória
          </p>
        )}

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

/**
 * A pergunta do Brain — o loop de elicitação dentro do chat.
 *
 * Quando o modelo chama `ask_question`, o turno PARA e fica esperando. Sem
 * este componente a conversa morre sem aviso: o Brain perguntou e a pessoa não
 * tem onde responder.
 */
function PerguntaDoBrain({
  pedido,
  responder,
}: {
  pedido: PedidoDeInput
  responder: (r: { requestId: string; optionId?: string; text?: string }) => void
}) {
  const [texto, setTexto] = useState('')

  return (
    <div className="my-3 rounded-sm border border-comp/30 bg-comp-suave/25 px-4 py-3.5">
      <p className="etiqueta pb-2 text-comp">O Brain está perguntando</p>
      <p className="prosa text-[0.95rem] leading-relaxed">{pedido.prompt}</p>

      {pedido.options && pedido.options.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {pedido.options.map((o) => (
            <Button
              key={o.id}
              size="sm"
              variant="outline"
              className="h-7 text-[0.78rem]"
              onClick={() => responder({ requestId: pedido.requestId, optionId: o.id })}
            >
              {o.label}
            </Button>
          ))}
        </div>
      )}

      {pedido.allowFreeform !== false && (
        <div className="mt-3 flex gap-2">
          <Textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && texto.trim()) {
                e.preventDefault()
                responder({ requestId: pedido.requestId, text: texto.trim() })
              }
            }}
            rows={1}
            placeholder="Uma frase basta."
            className="min-h-0 resize-none bg-background text-[0.85rem]"
          />
          <Button
            size="sm"
            className="h-8 shrink-0 text-[0.78rem]"
            disabled={!texto.trim()}
            onClick={() => responder({ requestId: pedido.requestId, text: texto.trim() })}
          >
            Responder
          </Button>
        </div>
      )}
    </div>
  )
}

function Mensagem({
  papel,
  partes,
  responder,
}: {
  papel: string
  partes: Parte[]
  responder: (r: { requestId: string; optionId?: string; text?: string }) => void
}) {
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

    const pedido = p.toolMetadata?.eve?.inputRequest
    if (pedido) {
      blocos.push(
        <PerguntaDoBrain key={`q${i}`} pedido={pedido} responder={responder} />,
      )
      return
    }

    const nome = p.toolName ?? (p.type.startsWith('tool-') ? p.type.slice(5) : undefined)
    if (!nome) return

    const saida = p.output as { renderizado?: boolean } | undefined
    const concluido = p.state === 'output-available' || saida !== undefined

    passos.push({
      id: p.toolCallId ?? `${nome}-${i}`,
      nome,
      argumento: resumirEntrada(p.input),
      resultado: resumirSaida(p.output),
      concluido,
    })

    /**
     * A resposta visual desenha a partir do ARGUMENTO da tool, não do retorno.
     *
     * O `programa` chega em pedaços enquanto o modelo o escreve, e o parser do
     * OpenUI é incremental: `root = Resposta([...])` sai na primeira linha, e a
     * estrutura já aparece na tela antes de o primeiro dado ter chegado. Esperar
     * o retorno da tool jogaria isso fora — a tela ficaria parada os mesmos 20s
     * de antes e a resposta apareceria de uma vez, pronta.
     *
     * Enquanto não há retorno, `isStreaming` mantém o parser tolerante a
     * referência ainda não definida. Se o retorno vier dizendo que não
     * renderizou, nada disso vai pra tela: o modelo já está respondendo em
     * prosa e desenhar um programa recusado mostraria a resposta duas vezes.
     */
    if (nome === 'renderizar' && saida?.renderizado !== false) {
      const programa = (p.input as { programa?: string } | undefined)?.programa
      if (programa) {
        blocos.push(
          <Renderer
            key={`c${i}`}
            response={programa}
            library={biblioteca}
            isStreaming={!concluido}
          />,
        )
      }
    }
  })

  return (
    <div className="mb-6">
      <PassosDaTool passos={passos} />
      {blocos}
    </div>
  )
}

/**
 * Havia aqui um aviso de "está demorando mais que o normal" depois de 45s.
 *
 * Saiu: numa demo ele é a única coisa na tela que fala mal do produto, e fala
 * exatamente no momento em que o avaliador está esperando. O turno longo já
 * tem o que mostrar — os passos de tool aparecem um a um, e a resposta se
 * monta de cima para baixo enquanto o modelo escreve. Isso é espera com
 * sinal; o aviso era espera com desculpa.
 *
 * O botão de parar continua no campo de texto, para quem quiser interromper.
 */

/** Ainda não há passo de tool nem texto: o turno começou e a tela está vazia. */
function semSinal(mensagens: readonly { role: string; parts?: readonly unknown[] }[]): boolean {
  const ultima = mensagens[mensagens.length - 1]
  if (!ultima || ultima.role === 'user') return true
  return (ultima.parts ?? []).length === 0
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
