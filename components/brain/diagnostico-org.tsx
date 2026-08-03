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
 *
 * Um achado que depende de pergunta tem prazo de validade, e por isso esta tela
 * consulta a sessão: "faltam duas perguntas" continuava escrito depois de as
 * duas terem sido respondidas na caixa desta semana, com o chip da pessoa logo
 * abaixo levando ao dossiê onde a resposta estava. A mesma tela afirmando que a
 * evidência falta e que ela existe.
 */

import { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { achadosOrg, NOME_TIPO_ACHADO } from '@/data/achados-org'
import { episodioPorId } from '@/data/episodios'
import { dataCurta, nomeDe } from '@/lib/memoria'
import { useRegistro } from '@/lib/registro'
import { estadoDoAchado } from '@/lib/sessao'

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
  const { sessao } = useRegistro()
  const estado = estadoDoAchado(sessao, achado)

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
            {estado.superado && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-comp-suave/45 px-1.5 py-[3px] font-mono text-[0.68rem] leading-none text-comp">
                <Check className="size-3 shrink-0" />
                evidência chegou
              </span>
            )}
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
          {/* A resposta vem antes da recomendação, e a recomendação passa a ser
              datada. O achado não é apagado — ele aconteceu —, mas quem lê
              precisa saber, na primeira linha, que a pergunta já tem resposta. */}
          {estado.respondidas.length > 0 && (
            <div className="mb-5 max-w-2xl border-l-2 border-comp/40 pl-3">
              <p className="etiqueta pb-1.5 text-comp">
                {estado.abertas.length === 0
                  ? 'A evidência que faltava chegou'
                  : `${estado.respondidas.length} de ${estado.lacunas.length} perguntas respondidas`}
              </p>
              <ul className="space-y-2.5">
                {estado.respondidas.map((l) => (
                  <li key={l.id}>
                    <p className="text-[0.85rem] leading-snug text-muted-foreground">
                      {l.pergunta}
                    </p>
                    <p className="prosa mt-1 text-[0.9rem] leading-snug">{l.resposta!.texto}</p>
                    <p className="mt-0.5 font-mono text-[0.68rem] text-muted-foreground/70">
                      {nomeDe(l.resposta!.por)} · {dataCurta(l.resposta!.em)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {estado.respondidas.length > 0 && (
            <p className="etiqueta pb-2">Leitura de quando o achado saiu</p>
          )}
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
