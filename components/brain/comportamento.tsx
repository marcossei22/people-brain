'use client'

/**
 * Um comportamento da régua, aberto até a fonte.
 *
 * O princípio número um do produto é "nenhuma frase sem link clicável para a
 * fonte" (PLANO §2.1), e a régua era a única afirmação do dossiê que não levava
 * a lugar nenhum — justamente a informação mais importante da tela para quem é
 * avaliado. O que abre aqui é o caminho inteiro: a nota, as quatro parcelas que
 * a produziram, os episódios de cada parcela, os eventos de cada episódio e a
 * fonte de cada evento.
 *
 * VIVE FORA DE `graficos.tsx` porque não é gráfico: é o drill-down, e ele é o
 * mesmo em três telas — a régua do dossiê, a régua do fechamento que a gestora
 * assina e a régua fechada que a pessoa recebe. Um número que abre de um jeito
 * para quem julga e de outro para quem é julgado seria o arquivo secreto
 * voltando pela porta do detalhe.
 *
 * NADA AQUI RECALCULA. As parcelas e os episódios chegam prontos de
 * `lib/metricas.ts` — recontar na hora de exibir é a segunda contagem que
 * aquele arquivo existe para impedir, e ela apareceria primeiro aqui, no lugar
 * onde a pessoa avaliada confere o número.
 *
 * A LINGUAGEM VISUAL É A DE `fonte.tsx`: mesmo diálogo, mesma etiqueta
 * "Evidência", mesmo rodapé. É a mesma promessa em outro nível de zoom — lá é
 * um evento, aqui é o conjunto que produziu um número.
 */

import { useState } from 'react'
import { ArrowUpRight, Star } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Fonte } from '@/components/brain/fonte'
import { episodioPorId } from '@/data/episodios'
import type { EpisodioId } from '@/data/tipos'
import { dataCurta, nomeDe } from '@/lib/memoria'
import type { Parcela } from '@/lib/metricas'
import { useRegistro } from '@/lib/registro'

/**
 * O que o diálogo precisa saber, e nada além.
 *
 * `ComportamentoCoberto` de `lib/metricas.ts` satisfaz este formato inteiro; a
 * tela do ciclo fechado monta o objeto à mão, com a nota que foi ASSINADA e sem
 * parcelas — a conta de hoje pode já não ser a de quando alguém assinou, e
 * exibi-la ali faria o registro discordar do que está registrado.
 */
export interface ComportamentoAberto {
  rotulo: string
  texto: string
  observavel: string
  esperado: number
  /** Onde a pessoa está, 1–5. Ausente = sem evidência, que não é zero. */
  nivel?: number
  /** As quatro parcelas, inclusive as de valor zero. Ausente quando o número
   *  não é o de agora — ver o comentário do tipo. */
  parcelas?: Parcela[]
  soma?: number
  episodioIds: EpisodioId[]
}

/**
 * O gatilho: qualquer coisa vira o botão que abre o comportamento.
 *
 * Recebe `children` em vez de desenhar o próprio rótulo porque as três telas
 * mostram a linha de formas diferentes — na tira do dossiê ela é rótulo + nota,
 * no ciclo fechado é a nota assinada. O que não muda é o que abre.
 */
export function AbrirComportamento({
  comportamento,
  children,
  className = '',
  rotuloDeAcesso,
}: {
  comportamento: ComportamentoAberto
  children: React.ReactNode
  className?: string
  rotuloDeAcesso?: string
}) {
  const [aberto, setAberto] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label={rotuloDeAcesso ?? `Ver a evidência de ${comportamento.rotulo}`}
        /* Sem largura própria: quem chama decide se a linha inteira é o
         * gatilho (a tira da régua) ou só um chip (a tela do colaborador). */
        className={`group cursor-pointer text-left ${className}`}
      >
        {children}
      </button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="gap-0 p-0 sm:max-w-lg">
          <div className="px-6 pt-6">
            <DialogTitle className="etiqueta font-mono text-[0.7rem] font-normal">
              Evidência
            </DialogTitle>
            <DialogDescription className="sr-only">
              O que sustenta este comportamento: os episódios do registro e a fonte de cada evento.
            </DialogDescription>

            <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-wider text-comp">
              {comportamento.rotulo}
            </p>
            <p className="prosa mt-1 text-[1.05rem] leading-snug text-foreground">
              {comportamento.texto}
            </p>
            <p className="mt-3 text-[0.82rem] leading-snug text-muted-foreground">
              <span className="etiqueta mr-1.5">o nível pede</span>
              {comportamento.observavel}
            </p>
          </div>

          <div className="mt-5 max-h-[26rem] overflow-y-auto border-t border-border">
            {comportamento.nivel === undefined ? (
              <SemEvidencia />
            ) : (
              <>
                {comportamento.parcelas && comportamento.parcelas.length > 0 && (
                  <div className="border-b border-border/60 px-6 py-4">
                    <Parcelas
                      parcelas={comportamento.parcelas}
                      soma={comportamento.soma ?? comportamento.nivel}
                      nivel={comportamento.nivel}
                    />
                  </div>
                )}
                <ListaDeEpisodios episodioIds={comportamento.episodioIds} />
              </>
            )}
          </div>

          <div className="flex items-center justify-end border-t border-border px-6 py-3.5">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="h-7 text-[0.78rem]">
                Fechar
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * O que abre quando não abriu nada.
 *
 * A tela mais importante deste arquivo. "Sem evidência" lido como "a pessoa é
 * fraca nisso" e lido como "o registro não alcançou" levam a ações opostas: uma
 * vira conversa de desempenho, a outra vira pergunta na semana seguinte. O
 * comentário de `pontuar()` explica por que a ausência fica fora da escala; aqui
 * ela precisa dizer isso em português, no lugar onde a pessoa avaliada clica
 * esperando encontrar alguma coisa.
 *
 * O observável já está no topo do diálogo, e é ele que transforma a ausência em
 * pergunta: o que a régua pede está escrito, então dá para procurar.
 */
function SemEvidencia() {
  return (
    <div className="px-6 py-5">
      <p className="etiqueta">Sem evidência</p>
      <p className="prosa mt-2 text-[0.95rem] leading-snug">
        Nenhum episódio do registro sustenta este comportamento no semestre.
      </p>
      <p className="mt-2.5 text-[0.85rem] leading-snug text-muted-foreground">
        Não é nota 1. Ausência de registro fica fora da escala — o que ela diz é que o registro não
        alcançou, e o caminho dela é uma pergunta, não uma conclusão.
      </p>
    </div>
  )
}

/**
 * A conta aberta — as quatro parcelas, inclusive as que valem zero.
 *
 * A parcela de zero é a que responde a pergunta que de fato se faz, que nunca é
 * "por que 4" e sim "por que 4 e não 5". Mostrar só o que somou explicaria o
 * número pelo que ele tem, quando a dúvida é sempre sobre o que falta.
 *
 * As parcelas não abrem uma a uma aqui, ao contrário do painel do fechamento:
 * dentro de um diálogo isso seria diálogo em cima de diálogo, e os episódios de
 * todas elas já estão listados logo abaixo, com a fonte de cada evento. O texto
 * de cada parcela diz o que ela conta; a lista diz sobre o quê.
 */
export function Parcelas({
  parcelas,
  soma,
  nivel,
}: {
  parcelas: Parcela[]
  soma: number
  nivel: number
}) {
  return (
    <>
      <p className="etiqueta pb-2.5">Como chegou em {nivel}</p>
      <ul className="space-y-2">
        {parcelas.map((p) => (
          <li key={p.id} className="flex items-start gap-2.5">
            <span
              className={`mt-[1px] w-5 shrink-0 font-mono text-[0.72rem] tabular-nums ${
                p.valor > 0 ? 'text-comp' : 'text-foreground/30'
              }`}
            >
              {p.valor > 0 ? `+${p.valor}` : '0'}
            </span>
            <span
              className={`min-w-0 flex-1 text-[0.8rem] leading-snug ${
                p.valor > 0 ? 'text-foreground' : 'text-muted-foreground/70'
              }`}
            >
              {p.motivo}
            </span>
          </li>
        ))}
      </ul>
      {/* O teto dito quando ele morde. Sem isso as parcelas não fecham com o
          número acima delas, e uma conta publicada que não fecha é pior que
          conta nenhuma. */}
      {soma > nivel && (
        <p className="mt-3 border-t border-border pt-2.5 text-[0.76rem] leading-snug text-muted-foreground">
          A soma daria {soma}. A escala para em 5.
        </p>
      )}
    </>
  )
}

/**
 * Os episódios que sustentam a nota, com os eventos e a fonte de cada um.
 *
 * Lê estrela e evento do registro MESCLADO: o reconhecimento que a gestora
 * acabou de dar move a nota da linha logo acima, e um drill-down que fosse
 * buscar na semente mostraria a evidência de antes do clique ao lado do número
 * de depois dele.
 */
export function ListaDeEpisodios({ episodioIds }: { episodioIds: EpisodioId[] }) {
  const { eventoPorId, estrelaDe } = useRegistro()

  return (
    <>
      {episodioIds.map((id) => {
        const ep = episodioPorId(id)
        if (!ep) return null
        const estrela = estrelaDe(ep.id)
        return (
          <article key={id} className="border-b border-border/60 px-6 py-4 last:border-b-0">
            <p className="prosa text-[0.95rem] leading-snug">{ep.titulo}</p>
            <p className="mt-1 font-mono text-[0.68rem] text-muted-foreground/70">
              {dataCurta(ep.inicio)} → {dataCurta(ep.fim)}
              {ep.nivelObservado && ` · observado em nível ${ep.nivelObservado}`}
            </p>

            <ul className="mt-2.5 space-y-1.5">
              {ep.eventoIds.map((evId) => {
                const ev = eventoPorId(evId)
                if (!ev) return null
                return (
                  <li key={evId} className="flex items-start gap-2 leading-snug">
                    <span className="mt-[7px] size-1 shrink-0 rounded-full bg-foreground/25" />
                    <span className="text-[0.85rem] text-muted-foreground">
                      {ev.texto} <Fonte evento={ev} />
                    </span>
                  </li>
                )
              })}
            </ul>

            {estrela && (
              <p className="mt-2.5 flex items-center gap-1.5 font-mono text-[0.68rem] text-muted-foreground/70">
                <Star className="size-3 fill-comp text-comp" />
                reconhecido por {nomeDe(estrela.por)} · {dataCurta(estrela.em)}
              </p>
            )}
          </article>
        )
      })}
    </>
  )
}

/** A seta que diz que a linha abre. Some quando não há para onde ir. */
export function SetaDeAbertura({ className = '' }: { className?: string }) {
  return (
    <ArrowUpRight
      aria-hidden
      className={`size-3 shrink-0 text-muted-foreground/70 opacity-0 transition-opacity group-hover:opacity-100 ${className}`}
    />
  )
}
