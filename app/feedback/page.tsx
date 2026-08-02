'use client'

/**
 * `/feedback` — FLUXO 1 · Captura (ARQUITETURA.md §8.3).
 *
 * Passo 5: layout. As ações ainda não fazem nada — entram depois que o agente
 * existir, no passo 6. O que está congelado aqui é a forma: três tipos de
 * item, motivo declarado em cada um, e o orçamento de pergunta no rodapé.
 *
 * A caixa é pessoal e curta por desenho. Silêncio é saída válida: sem item, a
 * tela diz isso em vez de inventar pendência.
 */

import Link from 'next/link'
import { CalendarPlus, MessageSquareQuote, PenLine, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { NOME_TIPO, ORCAMENTO, pendenciasDe } from '@/data/pendencias'
import type { Pendencia, TipoPendencia } from '@/data/pendencias'
import { episodioPorId } from '@/data/episodios'
import { nomeDe } from '@/lib/memoria'
import { useViewer } from '@/lib/viewer'

const ICONE: Record<TipoPendencia, LucideIcon> = {
  pergunta: MessageSquareQuote,
  reconhecimento: Star,
  feedback: CalendarPlus,
}

export default function PaginaFeedback() {
  const { viewer, geracao } = useViewer()
  const itens = pendenciasDe(viewer.pessoaId)
  const orcamento = ORCAMENTO[viewer.papel] ?? 0
  const usadas = itens.filter((i) => i.tipo === 'pergunta').length

  return (
    <div key={geracao} className="mx-auto max-w-3xl px-10 py-12">
      <header className="surgir">
        <p className="etiqueta">Pendências</p>
        <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">
          Sua atenção desta semana
        </h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          {itens.length > 0
            ? 'O que o Brain achou que vale seu tempo, com o motivo de cada item.'
            : 'Nada aqui esta semana.'}
        </p>
      </header>

      {itens.length === 0 ? (
        <Silencio />
      ) : (
        <>
          <div className="mt-10">
            <div className="flex items-baseline justify-between pb-2.5">
              <p className="etiqueta">
                {itens.length} {itens.length === 1 ? 'item' : 'itens'}
              </p>
              <p className="etiqueta">Semana de 27 jul</p>
            </div>
            <Separator />
          </div>

          <ul className="space-y-px">
            {itens.map((p, i) => (
              <li key={p.id} className="surgir" style={{ animationDelay: `${60 + i * 60}ms` }}>
                <ItemPendencia p={p} />
              </li>
            ))}
          </ul>

          <Orcamento usadas={usadas} total={orcamento} />
        </>
      )}
    </div>
  )
}

function ItemPendencia({ p }: { p: Pendencia }) {
  const Icone = ICONE[p.tipo]
  const episodio = p.episodioId ? episodioPorId(p.episodioId) : undefined

  return (
    <article className="border-b border-border/70 py-7">
      <div className="flex items-center gap-2.5">
        <Icone className="size-3.5 text-comp" />
        <Badge variant="outline" className="etiqueta px-1.5 py-[3px]">
          {NOME_TIPO[p.tipo]}
        </Badge>
        <Link
          href={`/org/${p.sobre}`}
          className="text-[0.78rem] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {nomeDe(p.sobre)}
        </Link>
      </div>

      <h3 className="prosa mt-3 max-w-[38rem] text-[1.12rem] leading-snug">{p.titulo}</h3>

      <p className="mt-3 max-w-[38rem] border-l-2 border-border pl-3.5 text-[0.85rem] leading-relaxed text-muted-foreground">
        <span className="etiqueta mr-1.5">por quê</span>
        {p.motivo}
      </p>

      {episodio && (
        <Link
          href={`/org/${p.sobre}`}
          className="mt-3 inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 transition-colors hover:bg-foreground/[0.03]"
        >
          <span className="etiqueta">episódio</span>
          <span className="text-[0.82rem]">{episodio.titulo}</span>
          <span className="font-mono text-[0.7rem] text-muted-foreground">
            {episodio.eventoIds.length} eventos
          </span>
        </Link>
      )}

      {p.tipo === 'pergunta' && (
        <div className="mt-4 max-w-[38rem]">
          <Textarea
            rows={2}
            placeholder="Uma frase basta."
            className="resize-none bg-card text-[0.9rem]"
          />
          <div className="mt-2.5 flex items-center gap-2">
            <Button size="sm" className="h-7 text-[0.78rem]">
              {p.acao}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-[0.78rem] text-muted-foreground"
            >
              Não sei responder
            </Button>
          </div>
        </div>
      )}

      {p.tipo === 'reconhecimento' && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" className="h-7 gap-1.5 text-[0.78rem]">
            <PenLine className="size-3" />
            {p.acao}
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-[0.78rem]">
            Ver a evidência
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-[0.78rem] text-muted-foreground">
            Depois
          </Button>
        </div>
      )}

      {p.tipo === 'feedback' && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" className="h-7 gap-1.5 text-[0.78rem]">
            <CalendarPlus className="size-3" />
            {p.acao}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-[0.78rem] text-muted-foreground">
            Depois
          </Button>
        </div>
      )}
    </article>
  )
}

/** O orçamento de pergunta virando pixel — decisão #11. */
function Orcamento({ usadas, total }: { usadas: number; total: number }) {
  return (
    <div className="surgir mt-8 flex items-center gap-3" style={{ animationDelay: '260ms' }}>
      <span className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`block h-1 w-6 rounded-full ${i < usadas ? 'bg-comp' : 'bg-foreground/15'}`}
          />
        ))}
      </span>
      <p className="text-[0.78rem] text-muted-foreground">
        {usadas} de {total} {total === 1 ? 'pergunta' : 'perguntas'} desta semana. A próxima chega
        segunda.
      </p>
    </div>
  )
}

function Silencio() {
  return (
    <div className="surgir mt-12 max-w-xl rounded-sm border border-dashed border-border px-6 py-10">
      <p className="prosa text-[0.98rem] leading-relaxed text-muted-foreground">
        O Brain não encontrou nada que valha sua atenção esta semana. Quando encontrar, aparece
        aqui — no máximo três itens.
      </p>
    </div>
  )
}
