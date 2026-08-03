'use client'

/**
 * `/diretrizes/regua` — o único documento estruturado do Setup.
 *
 * É o que produz veredito: os outros governam tom, contexto e processo. Por
 * isso tem tela própria, e por isso cada comportamento carrega o observável —
 * comportamento sem observável é adjetivo, e adjetivo não se verifica.
 *
 * Cada linha mostra também QUANTO o nível pede. O número é a régua propriamente
 * dita (é ele que a teia do dossiê desenha tracejado), e a tela que o edita era
 * a única que não o mostrava — a régua aparecia aqui como texto e como número
 * lá, sem nunca se encontrarem. É também onde uma recalibração aceita pousa.
 */

import { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SemAcesso } from '@/components/brain/sem-acesso'
import { CabecalhoDiretriz, ComoOBrainUsa } from '@/components/brain/diretriz'
import { diretrizes } from '@/data/diretrizes'
import { NOME_NIVEL, NOME_TRILHA, regua } from '@/data/regua'
import type { NivelRegua, Trilha } from '@/data/tipos'
import { podeAdministrar } from '@/lib/agente/permissoes'
import { nomeDe } from '@/lib/memoria'
import { useRegistro } from '@/lib/registro'
import { sugestoesDe, type SugestaoRegua } from '@/lib/regua-viva'
import { useViewer } from '@/lib/viewer'

const ORDEM = ['pleno', 'senior', 'staff'] as const

/** Derivada dos dados, não escrita à mão: a trilha de Design existe em
 *  `regua.ts` desde o dataset completo e ficou meio dia fora da tela porque
 *  esta lista era `['eng', 'sales']`. */
const TRILHAS = [...new Set(regua.map((r) => r.trilha))]

export default function PaginaRegua() {
  const { viewer, geracao } = useViewer()
  const { sessao } = useRegistro()
  const [trilha, setTrilha] = useState<Trilha>(TRILHAS[0])

  if (!podeAdministrar(viewer)) {
    return (
      <SemAcesso motivo="A régua de carreira é editada por quem responde por ela. Fale com o time de Pessoas." />
    )
  }

  const meta = diretrizes.find((d) => d.id === 'regua')!
  const niveis = ORDEM.map((n) => regua.find((r) => r.trilha === trilha && r.nivel === n)).filter(
    (r): r is NivelRegua => Boolean(r),
  )

  return (
    <div key={geracao} className="mx-auto max-w-5xl px-10 py-12">
      <CabecalhoDiretriz
        d={meta}
        descricao="O que a Aurora espera em cada nível, comportamento a comportamento. Cada um traz o que conta como observável."
      />
      <ComoOBrainUsa d={meta} />

      <Tabs
        value={trilha}
        onValueChange={(v) => setTrilha(v as Trilha)}
        className="surgir mt-9"
        style={{ animationDelay: '80ms' }}
      >
        <TabsList>
          {TRILHAS.map((t) => (
            <TabsTrigger key={t} value={t} className="text-[0.85rem]">
              {NOME_TRILHA[t]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-10 space-y-12">
        {niveis.map((nivel, i) => (
          <NivelDaRegua
            key={nivel.nivel}
            nivel={nivel}
            atraso={120 + i * 60}
            sugestoes={sugestoesDe(nivel.trilha, nivel.nivel, sessao)}
          />
        ))}
      </div>
    </div>
  )
}

function NivelDaRegua({
  nivel,
  atraso,
  sugestoes,
}: {
  nivel: NivelRegua
  atraso: number
  sugestoes: SugestaoRegua[]
}) {
  /* A recalibração aceita vive aqui, e não no dado: aceitar é gesto de sessão,
   * como todo o resto (#15). Guarda o comportamento e o número novo porque é a
   * linha acima que precisa mudar — uma sugestão aceita que não move nada na
   * régua é um botão que finge. */
  const [aceitos, setAceitos] = useState<Record<string, number>>({})

  return (
    <section className="surgir" style={{ animationDelay: `${atraso}ms` }}>
      <div className="flex items-baseline justify-between pb-2.5">
        <h3 className="display text-[1.35rem] leading-none tracking-tight">
          {NOME_NIVEL[nivel.nivel]}
        </h3>
        <p className="etiqueta">{nivel.comportamentos.length} comportamentos</p>
      </div>
      <Separator />

      <ul>
        {nivel.comportamentos.map((c) => {
          const novo = aceitos[c.id]
          return (
            <li key={c.id} className="border-b border-border/60 py-4">
              <div className="flex items-start gap-5">
                <div className="min-w-0 flex-1">
                  <p className="text-[0.98rem] leading-snug">{c.texto}</p>
                  <p className="prosa mt-1.5 text-[0.88rem] leading-snug text-muted-foreground">
                    <span className="etiqueta mr-1.5">observável</span>
                    {c.observavel}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-[0.72rem] tabular-nums text-muted-foreground">
                    {novo ? (
                      <>
                        <span className="line-through opacity-50">pede {c.esperado}</span>{' '}
                        <span className="text-comp">pede {novo}</span>
                      </>
                    ) : (
                      `pede ${c.esperado}`
                    )}
                  </p>
                  <code className="hidden font-mono text-[0.68rem] text-muted-foreground/50 sm:block">
                    {c.id}
                  </code>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {sugestoes.map((s) => (
        <CardReguaViva
          key={s.id}
          s={s}
          aoAceitar={() =>
            s.novoEsperado
              ? setAceitos((a) => ({ ...a, [s.comportamentos[0].id]: s.novoEsperado! }))
              : undefined
          }
        />
      ))}
    </section>
  )
}

/**
 * A régua viva — PLANO.md §3.1 e decisão #8.
 *
 * A sugestão sai de `lib/regua-viva.ts`, que a calcula do registro com a MESMA
 * contagem do dossiê. O que esta tela faz é o loop de aprovação: o sistema
 * propõe, o humano decide, e a régua muda. Régua congelada morre — e régua que
 * se recalibra sozinha é o produto se avaliando, que é pior.
 *
 * "Ver a conta" abre a contagem em vez de abrir episódios porque a afirmação é
 * de AUSÊNCIA: não há evidência para clicar quando o achado é que ela não
 * existe. O que se mostra é quem foi olhado, quantos episódios cada linha tem e
 * o que o mesmo nível sustenta — que é o que torna a ausência conferível.
 */
function CardReguaViva({ s, aoAceitar }: { s: SugestaoRegua; aoAceitar: () => void }) {
  const [decisao, setDecisao] = useState<'aceita' | 'descartada' | null>(null)
  const [aberta, setAberta] = useState(false)

  if (decisao === 'descartada') return null

  if (decisao === 'aceita')
    return (
      <div className="mt-5 rounded-sm border border-comp/30 bg-comp-suave/30 px-5 py-4">
        <p className="etiqueta pb-1.5 text-comp">
          {s.tipo === 'barra-subiu' ? 'Régua atualizada' : 'Marcado para revisão'}
        </p>
        <p className="prosa max-w-2xl text-[0.92rem] leading-relaxed">{s.texto}</p>
        <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground/70">
          decidido por quem responde pela régua · {s.comportamentos.map((c) => c.id).join(' · ')}
        </p>
      </div>
    )

  return (
    <div className="mt-5 rounded-sm border border-comp/30 bg-comp-suave/25 px-5 py-4">
      <div className="flex items-center gap-1.5 pb-2">
        <Sparkles className="size-3 text-comp" />
        <p className="etiqueta text-comp">{s.rotulo}</p>
      </div>
      <p className="prosa max-w-2xl text-[0.95rem] leading-relaxed">{s.texto}</p>
      <p className="mt-2.5 font-mono text-[0.72rem] text-muted-foreground">
        derivado do registro de {s.coorte.map(nomeDe).join(' · ')}
      </p>

      {aberta && (
        <ul className="mt-3 border-t border-comp/20 pt-3">
          {s.conta.map((linha) => (
            <li key={linha} className="font-mono text-[0.72rem] leading-relaxed text-muted-foreground">
              {linha}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          className="h-7 text-[0.78rem]"
          onClick={() => {
            aoAceitar()
            setDecisao('aceita')
          }}
        >
          {s.tipo === 'barra-subiu' ? `Passar a pedir ${s.novoEsperado}` : 'Marcar para revisão'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 text-[0.78rem]"
          onClick={() => setAberta((a) => !a)}
        >
          Ver a conta
          <ChevronDown className={`size-3 transition-transform ${aberta ? 'rotate-180' : ''}`} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-[0.78rem] text-muted-foreground"
          onClick={() => setDecisao('descartada')}
        >
          Descartar
        </Button>
      </div>
    </div>
  )
}
