'use client'

/**
 * `/diretrizes` — o conteúdo fixo que a empresa define no Setup.
 *
 * Quatro documentos. A régua abre em tela própria porque é o único artefato
 * estruturado; os outros abrem num painel de leitura.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, FileUp, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Markdown } from '@/components/brain/markdown'
import { SemAcesso } from '@/components/brain/sem-acesso'
import { SubirDocumento } from './subir-documento'
import { diretrizes, NOME_ORIGEM, NOME_TIPO } from '@/data/diretrizes'
import type { Diretriz } from '@/data/diretrizes'
import { podeAdministrar } from '@/lib/agente/permissoes'
import { nomeDe } from '@/lib/memoria'
import { useViewer } from '@/lib/viewer'

export function IndiceDiretrizes({ textos }: { textos: Record<string, string> }) {
  const { viewer, geracao } = useViewer()
  const [lendo, setLendo] = useState<Diretriz | null>(null)
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
        <Button variant="outline" size="sm" className="mt-8 shrink-0 gap-2" onClick={() => setSubindo(true)}>
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
        {diretrizes.map((d, i) => {
          const conteudo = d.arquivo ? textos[d.arquivo] : undefined
          const Wrapper = d.tipo === 'regua' ? LinkRegua : BotaoLeitura
          return (
            <li key={d.id} className="surgir" style={{ animationDelay: `${60 + i * 45}ms` }}>
              <Wrapper onClick={() => setLendo({ ...d, ...(conteudo ? {} : {}) })}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="display text-[1.15rem] leading-none tracking-tight">
                      {d.titulo}
                    </h3>
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
              </Wrapper>
            </li>
          )
        })}
      </ul>

      <Sheet open={lendo !== null} onOpenChange={(o) => !o && setLendo(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {lendo && (
            <>
              <SheetHeader className="border-b border-border pb-5">
                <SheetTitle className="display text-[1.5rem] tracking-tight">
                  {lendo.titulo}
                </SheetTitle>
                <SheetDescription className="text-[0.8rem]">
                  {NOME_TIPO[lendo.tipo]} · atualizado por {nomeDe(lendo.autor)} em{' '}
                  {formatarData(lendo.atualizadoEm)}
                  {lendo.nomeDoArquivoOriginal && ` · de ${lendo.nomeDoArquivoOriginal}`}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 px-4 pb-10">
                <ComoOBrainUsa d={lendo} />
                {lendo.sugestaoPendente && <CardSugestao d={lendo} />}
                {lendo.arquivo && textos[lendo.arquivo] && (
                  <Markdown>{textos[lendo.arquivo]}</Markdown>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <SubirDocumento aberto={subindo} aoFechar={() => setSubindo(false)} />
    </div>
  )
}

function LinkRegua({ children }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href="/diretrizes/regua"
      className="group flex items-center gap-5 border-b border-border/70 py-5 transition-colors hover:bg-foreground/[0.025]"
    >
      {children}
    </Link>
  )
}

function BotaoLeitura({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-5 border-b border-border/70 py-5 text-left transition-colors hover:bg-foreground/[0.025]"
    >
      {children}
    </button>
  )
}

/** O campo que impede isto de ser um wiki. */
export function ComoOBrainUsa({ d }: { d: Diretriz }) {
  return (
    <div className="rounded-sm border border-border bg-card px-4 py-3.5">
      <p className="etiqueta pb-2">Como o Brain usa</p>
      <p className="text-[0.88rem] leading-snug">{d.usadoPara}</p>
      <p className="mt-2 text-[0.88rem] leading-snug text-muted-foreground">
        <span className="text-muted-foreground/70">Não usa para:</span> {d.naoUsadoPara}
      </p>
    </div>
  )
}

export function CardSugestao({ d }: { d: Diretriz }) {
  const [decisao, setDecisao] = useState<'aceita' | 'descartada' | null>(null)

  if (decisao === 'aceita')
    return (
      <div className="rounded-sm border border-comp/30 bg-comp-suave/30 px-4 py-3.5">
        <p className="etiqueta pb-1 text-comp">Adicionado à diretriz</p>
        <p className="text-[0.88rem] leading-snug">{d.sugestaoPendente?.texto}</p>
      </div>
    )

  if (decisao === 'descartada')
    return (
      <div className="rounded-sm border border-border bg-muted/40 px-4 py-3.5">
        <p className="etiqueta">Sugestão descartada</p>
      </div>
    )

  return (
    <div className="rounded-sm border border-comp/30 bg-comp-suave/25 px-4 py-3.5">
      <div className="flex items-center gap-1.5 pb-2">
        <Sparkles className="size-3 text-comp" />
        <p className="etiqueta text-comp">Sugestão do Brain</p>
      </div>
      <p className="prosa text-[0.92rem] leading-relaxed">{d.sugestaoPendente?.texto}</p>
      <p className="mt-2 font-mono text-[0.72rem] text-muted-foreground">
        baseado em {d.sugestaoPendente?.baseadoEm}
      </p>
      <div className="mt-3.5 flex gap-2">
        <Button size="sm" className="h-7 text-[0.78rem]" onClick={() => setDecisao('aceita')}>
          Adicionar à diretriz
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

export function formatarData(iso?: string) {
  if (!iso) return '—'
  const [ano, mes, dia] = iso.split('-')
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${Number(dia)} ${meses[Number(mes) - 1]} ${ano}`
}
