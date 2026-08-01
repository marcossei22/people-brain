'use client'

/**
 * `/diretrizes` — o conteúdo fixo que a empresa define no Setup.
 *
 * Todo documento abre em página própria, inclusive a régua. Nenhum painel
 * lateral: documento é documento, e a régua não é de outra categoria — é o
 * primeiro dos quatro.
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
import { diretrizes, NOME_ORIGEM, NOME_TIPO } from '@/data/diretrizes'
import { podeAdministrar } from '@/lib/agente/permissoes'
import { useViewer } from '@/lib/viewer'

export function IndiceDiretrizes() {
  const { viewer, geracao } = useViewer()
  const [subindo, setSubindo] = useState(false)

  if (!podeAdministrar(viewer)) {
    return (
      <SemAcesso motivo="As diretrizes da empresa são editadas por quem responde por elas. Fale com o time de Pessoas." />
    )
  }

  const pendentes = diretrizes.filter((d) => d.sugestaoPendente).length

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
                  {d.sugestaoPendente && (
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

      <SubirDocumento aberto={subindo} aoFechar={() => setSubindo(false)} />
    </div>
  )
}
