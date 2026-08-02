'use client'

/**
 * Diagnóstico de organização — ARQUITETURA.md §8.1, decisão #10.
 *
 * Output de primeira classe, e não nota de rodapé do fechamento. É a diferença
 * entre "o Rafael é lento" e "a fila de Dados travou seis pessoas em quatro
 * times": a primeira frase produz um PDI inútil, a segunda produz uma decisão
 * de alocação.
 *
 * Nenhum achado nomeia culpado. A unidade de análise é o sistema.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { achadosOrg, NOME_TIPO_ACHADO } from '@/data/achados-org'
import { episodioPorId } from '@/data/episodios'
import { nomeDe } from '@/lib/memoria'

export function DiagnosticoOrg() {
  return (
    <section className="mt-16">
      <div className="flex items-baseline justify-between pb-2.5">
        <p className="etiqueta">Diagnóstico de organização</p>
        <p className="etiqueta">{achadosOrg.length} achados no semestre</p>
      </div>
      <Separator />

      <p className="prosa mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
        Padrões que atravessam pessoas e times. Cada achado aponta a evidência que o sustenta.
      </p>

      <ul className="mt-2">
        {achadosOrg.map((a, i) => (
          <Achado key={a.id} achado={a} atraso={i} />
        ))}
      </ul>
    </section>
  )
}

function Achado({
  achado,
  atraso,
}: {
  achado: (typeof achadosOrg)[number]
  atraso: number
}) {
  const [aberto, setAberto] = useState(false)

  return (
    <li className="surgir border-b border-border/70" style={{ animationDelay: `${120 + atraso * 50}ms` }}>
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-start gap-4 py-5 text-left transition-colors hover:bg-foreground/[0.02]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <Badge variant="outline" className="etiqueta px-1.5 py-[3px]">
              {NOME_TIPO_ACHADO[achado.tipo]}
            </Badge>
            <span className="font-mono text-[0.7rem] text-muted-foreground">
              {achado.evidencia.pessoaIds.length}{' '}
              {achado.evidencia.pessoaIds.length === 1 ? 'pessoa' : 'pessoas'}
            </span>
          </div>
          <h3 className="display mt-2 max-w-2xl text-[1.15rem] leading-snug tracking-tight">
            {achado.titulo}
          </h3>
        </div>
        <ChevronDown
          className={`mt-1 size-4 shrink-0 text-muted-foreground transition-transform ${
            aberto ? 'rotate-180' : ''
          }`}
        />
      </button>

      {aberto && (
        <div className="pb-6 pl-0 pr-10">
          <p className="prosa max-w-2xl text-[0.95rem] leading-relaxed">{achado.recomendacao}</p>

          <p className="etiqueta mt-5 pb-2">Quem aparece nisso</p>
          <div className="flex flex-wrap gap-1.5">
            {achado.evidencia.pessoaIds.map((id) => (
              <Link
                key={id}
                href={`/org/${id}`}
                className="rounded-sm border border-border bg-card px-2 py-1 text-[0.78rem] transition-colors hover:border-comp/40 hover:text-comp"
              >
                {nomeDe(id)}
              </Link>
            ))}
          </div>

          {achado.evidencia.episodioIds.length > 0 && (
            <>
              <p className="etiqueta mt-4 pb-2">Episódios que sustentam</p>
              <ul className="space-y-1">
                {achado.evidencia.episodioIds.map((id) => {
                  const ep = episodioPorId(id)
                  if (!ep) return null
                  return (
                    <li key={id} className="flex items-baseline gap-2 text-[0.82rem] leading-snug">
                      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-foreground/25" />
                      <Link
                        href={`/org/${ep.pessoaId}`}
                        className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        {ep.titulo}
                      </Link>
                      <span className="font-mono text-[0.68rem] text-foreground/35">
                        {nomeDe(ep.pessoaId)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </li>
  )
}
