'use client'

/**
 * Peças compartilhadas pelas telas de diretriz. Todo documento abre em página
 * própria, com o mesmo cabeçalho — inclusive a régua. Painel lateral fazia a
 * régua parecer um documento de outra categoria, e ela não é: é o primeiro
 * dos quatro.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Diretriz } from '@/data/diretrizes'
import { NOME_ORIGEM, NOME_TIPO } from '@/data/diretrizes'
import { nomeDe } from '@/lib/memoria'

export function CabecalhoDiretriz({ d, descricao }: { d: Diretriz; descricao: string }) {
  return (
    <>
      <Link
        href="/diretrizes"
        className="etiqueta surgir inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3" />
        Diretrizes
      </Link>

      <header className="surgir mt-4">
        <h2 className="display text-[2.1rem] leading-[1.1] tracking-tight">{d.titulo}</h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          {descricao}
        </p>
        <p className="mt-4 font-mono text-[0.72rem] text-muted-foreground/80">
          {NOME_TIPO[d.tipo]} · {NOME_ORIGEM[d.origem]}
          {d.nomeDoArquivoOriginal && ` · ${d.nomeDoArquivoOriginal}`} · atualizado por{' '}
          {nomeDe(d.autor)} em {formatarData(d.atualizadoEm)}
          {d.validoAte && ` · vale até ${formatarData(d.validoAte)}`}
        </p>
      </header>
    </>
  )
}

/** O campo que impede isto de ser um wiki. */
export function ComoOBrainUsa({ d }: { d: Diretriz }) {
  return (
    <div className="surgir mt-8 max-w-2xl rounded-sm border border-border bg-card px-4 py-3.5">
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
  if (!d.sugestaoPendente) return null

  if (decisao === 'descartada')
    return (
      <div className="mt-5 max-w-2xl rounded-sm border border-border bg-muted/40 px-5 py-3.5">
        <p className="etiqueta">Sugestão descartada</p>
      </div>
    )

  if (decisao === 'aceita')
    return (
      <div className="mt-5 max-w-2xl rounded-sm border border-comp/30 bg-comp-suave/30 px-5 py-4">
        <p className="etiqueta pb-1.5 text-comp">Incorporado ao documento</p>
        <p className="prosa text-[0.92rem] leading-relaxed">{d.sugestaoPendente.texto}</p>
      </div>
    )

  return (
    <div className="mt-5 max-w-2xl rounded-sm border border-comp/30 bg-comp-suave/25 px-5 py-4">
      <div className="flex items-center gap-1.5 pb-2">
        <Sparkles className="size-3 text-comp" />
        <p className="etiqueta text-comp">Sugestão do Brain</p>
      </div>
      <p className="prosa text-[0.95rem] leading-relaxed">{d.sugestaoPendente.texto}</p>
      <p className="mt-2.5 font-mono text-[0.72rem] text-muted-foreground">
        baseado em {d.sugestaoPendente.baseadoEm}
      </p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" className="h-7 text-[0.78rem]" onClick={() => setDecisao('aceita')}>
          Adicionar ao documento
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-[0.78rem]">
          Ver as evidências
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
