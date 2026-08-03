'use client'

/**
 * `/diretrizes` — o conteúdo fixo que a empresa define no Setup.
 *
 * Todo documento abre em página própria, inclusive a régua. Nenhum painel
 * lateral: documento é documento, e a régua não é de outra categoria — é o
 * primeiro dos quatro.
 *
 * AS SKILLS FICAM EMBAIXO, E FORA DA LISTA. Elas não são diretriz: a Aurora não
 * escreveu `preparar-1a1`, e um quinto item na mesma lista diria que escreveu —
 * `usadoPara`/`naoUsadoPara`, que é o campo que impede a página de ser um wiki,
 * não faz sentido nenhum para um procedimento do agente. O que justifica as
 * duas metades na mesma tela é a coluna da direita: cada skill declara **qual
 * documento de cima ela abre**. É o contexto que a empresa escreveu chegando no
 * procedimento do Brain, apontável em vez de afirmado.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, FileUp, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SemAcesso } from '@/components/brain/sem-acesso'
import { formatarData } from '@/components/brain/diretriz'
import { SubirDocumento } from './subir-documento'
import type { Diretriz } from '@/data/diretrizes'
import { diretrizes, NOME_ORIGEM, NOME_TIPO } from '@/data/diretrizes'
import { podeAdministrar } from '@/lib/agente/permissoes'
import { useRegistro } from '@/lib/registro'
import { sugestoesDaRegua } from '@/lib/regua-viva'
import type { Registro } from '@/lib/sessao'
import type { SkillDoBrain } from '@/lib/skills'
import { useViewer } from '@/lib/viewer'

/* A régua não guarda sugestão escrita: as dela nascem do registro, e o índice
 * pergunta ao cálculo em vez de ao dado. Sem isto, o selo aqui e o card lá
 * dentro discordariam no instante em que a evidência mudasse — que é o único
 * instante em que alguém está olhando. */
const temSugestao = (d: Diretriz, registro: Registro) =>
  d.tipo === 'regua' ? sugestoesDaRegua(registro).length > 0 : Boolean(d.sugestaoPendente)

export function IndiceDiretrizes({ skills }: { skills: SkillDoBrain[] }) {
  const { viewer, geracao } = useViewer()
  const { sessao } = useRegistro()
  const [subindo, setSubindo] = useState(false)

  if (!podeAdministrar(viewer)) {
    return (
      <SemAcesso motivo="As diretrizes da empresa são editadas por quem responde por elas. Fale com o time de Pessoas." />
    )
  }

  const pendentes = diretrizes.filter((d) => temSugestao(d, sessao)).length

  return (
    <div key={geracao} className="mx-auto max-w-5xl px-10 py-12">
      <header className="surgir flex items-start justify-between gap-8">
        <div>
          <p className="etiqueta">Diretrizes</p>
          <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">
            O que a Aurora definiu
          </h2>
          <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
            Os documentos que o Brain consulta antes de responder qualquer coisa sobre trabalho.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-8 shrink-0 gap-2"
          onClick={() => setSubindo(true)}
        >
          <FileUp className="size-3.5" />
          Subir documento
        </Button>
      </header>

      <div className="mt-10">
        <div className="flex items-baseline justify-between pb-2.5">
          <p className="etiqueta">{diretrizes.length} documentos</p>
          {pendentes > 0 && (
            <p className="etiqueta text-comp">
              {pendentes} {pendentes === 1 ? 'sugestão pendente' : 'sugestões pendentes'}
            </p>
          )}
        </div>
        <Separator />
      </div>

      <ul>
        {diretrizes.map((d, i) => (
          <li key={d.id} className="surgir" style={{ animationDelay: `${60 + i * 45}ms` }}>
            <Link
              href={d.tipo === 'regua' ? '/diretrizes/regua' : `/diretrizes/${d.id}`}
              className="group flex items-center gap-5 border-b border-border/70 py-5 transition-colors hover:bg-foreground/[0.025]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="display text-[1.15rem] leading-none tracking-tight">{d.titulo}</h3>
                  <Badge variant="outline" className="etiqueta px-1.5 py-[3px]">
                    {NOME_TIPO[d.tipo]}
                  </Badge>
                  {temSugestao(d, sessao) && (
                    <Badge
                      variant="outline"
                      className="etiqueta gap-1 border-comp/35 bg-comp-suave/40 px-1.5 py-[3px] text-comp"
                    >
                      <Sparkles className="size-2.5" />
                      sugestão
                    </Badge>
                  )}
                  <ArrowUpRight className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
                <p className="prosa mt-1.5 max-w-2xl text-[0.88rem] leading-snug text-muted-foreground">
                  {d.resumo}
                </p>
              </div>

              <div className="hidden w-[13rem] shrink-0 text-right sm:block">
                <p className="font-mono text-[0.72rem] tabular-nums text-muted-foreground">
                  {formatarData(d.atualizadoEm)}
                </p>
                <p className="mt-1 text-[0.72rem] text-muted-foreground/80">
                  {NOME_ORIGEM[d.origem]}
                  {d.validoAte && ` · vale até ${formatarData(d.validoAte)}`}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <SkillsDoBrain skills={skills} />

      <SubirDocumento aberto={subindo} aoFechar={() => setSubindo(false)} />
    </div>
  )
}

/**
 * O que o Brain faz com os documentos de cima.
 *
 * Sem esta seção, a página promete que a doutrina é consultada e não mostra por
 * quem. Com ela, a promessa vira uma tabela: sete procedimentos, cada um
 * dizendo quando é carregado e qual documento abre antes de responder. O
 * `quando` é literalmente o `description` do arquivo — é o texto que faz o
 * modelo escolher a skill, então é ele que explica o comportamento, e não uma
 * paráfrase escrita para a tela.
 */
function SkillsDoBrain({ skills }: { skills: SkillDoBrain[] }) {
  if (skills.length === 0) return null

  return (
    <section className="mt-16">
      <header className="surgir">
        <p className="etiqueta">O Brain</p>
        <h3 className="display mt-2.5 text-[1.35rem] leading-tight tracking-tight">
          Como ele usa isto
        </h3>
        <p className="prosa mt-2 max-w-xl text-[0.9rem] leading-relaxed text-muted-foreground">
          Os procedimentos do Brain não são diretrizes — a Aurora não os escreveu. Estão aqui
          porque cada um declara qual documento acima ele abre antes de responder.
        </p>
      </header>

      <div className="mt-7">
        <div className="flex items-baseline justify-between pb-2.5">
          <p className="etiqueta">{skills.length} procedimentos</p>
          <p className="etiqueta">lê</p>
        </div>
        <Separator />
      </div>

      <ul>
        {skills.map((s, i) => (
          <li key={s.id} className="surgir" style={{ animationDelay: `${60 + i * 40}ms` }}>
            <Link
              href={`/diretrizes/skills/${s.id}`}
              className="group flex items-start gap-5 border-b border-border/70 py-4 transition-colors hover:bg-foreground/[0.025]"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[0.95rem] leading-tight">{s.titulo}</h4>
                  <ArrowUpRight className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
                <p className="prosa mt-1 max-w-2xl text-[0.84rem] leading-snug text-muted-foreground">
                  {s.quando}
                </p>
              </div>

              <div className="flex w-[13rem] shrink-0 flex-wrap justify-end gap-1.5">
                {s.le.length > 0 ? (
                  s.le.map((tipo) => (
                    <Badge key={tipo} variant="outline" className="etiqueta px-1.5 py-[3px]">
                      {NOME_TIPO[tipo]}
                    </Badge>
                  ))
                ) : (
                  /* Nenhuma diretriz é resposta legítima e vale ser dita: o
                   * diagnóstico de organização lê o registro agregado, não
                   * doutrina. Um traço aqui pareceria dado faltando. */
                  <span className="text-[0.75rem] text-muted-foreground/70">só o registro</span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
