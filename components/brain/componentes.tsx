'use client'

/**
 * A biblioteca FIXA de componentes que o agente pode escolher — §7.3.
 *
 * O modelo nunca escreve layout. Ele escreve um programa em OpenUI Lang
 * usando SÓ o que está registrado aqui (`components/brain/biblioteca.tsx`), o
 * parser valida contra as props de `lib/agente/biblioteca.ts`, e o que sobra é
 * este arquivo desenhando. Todos com fonte visível: nenhuma frase sem link pra
 * origem (PLANO.md §2.1).
 *
 * Cada componente é exportado sozinho porque tem DOIS chamadores: a biblioteca
 * do agente, no chat, e as telas — que os usam direto, com dado fixo. Mesma
 * forma, dois autores. É o que deixa o dossiê ganhar a camada visual sem
 * ganhar junto um LLM no meio de uma tela que precisa ser idêntica em toda
 * tomada (ARQUITETURA §1, princípio 2).
 */

import { AlertCircle, Lock, Minus, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Fonte } from '@/components/brain/fonte'
import { Caixa, TiraDeCobertura } from '@/components/brain/graficos'
import { eventoPorId } from '@/data/eventos'
import type { PropsDe } from '@/lib/agente/biblioteca'

export { Barras, Cobertura, Distribuicao, Indicadores, Serie } from '@/components/brain/graficos'

/**
 * A evidência de um card sai do registro, não do payload.
 *
 * O modelo manda só o `eventoId`; a frase, o canal e o dia vêm de
 * `data/eventos.ts`. É o mesmo componente de fonte do dossiê, então o drill
 * down até a mensagem original é o mesmo nos dois lugares — e o modelo não
 * tem como citar uma frase que o registro não tem.
 */
function Fontes({ fontes }: { fontes: { eventoId: string }[] }) {
  if (!fontes?.length) return null
  return (
    <ul className="mt-1.5 space-y-1 border-l-2 border-border pl-3">
      {fontes.map((f) => {
        const ev = eventoPorId(f.eventoId)
        return (
          <li key={f.eventoId} className="text-[0.78rem] leading-snug text-muted-foreground">
            {ev ? (
              <>
                {ev.texto} <Fonte evento={ev} />
              </>
            ) : (
              <span className="font-mono text-[0.68rem] text-foreground/35">{f.eventoId}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Composição — o que o OpenUI acrescentou.
   ───────────────────────────────────────────────────────────────────────── */

/** A raiz. Empilha os blocos; quem decide a ordem é o programa do modelo. */
export function Resposta({ blocos }: { blocos: React.ReactNode }) {
  return <div>{blocos}</div>
}

export function Texto({ texto }: PropsDe<'Texto'>) {
  return (
    <p className="prosa mb-3 whitespace-pre-wrap text-[0.95rem] leading-relaxed">{texto}</p>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Os cards do registro.
   ───────────────────────────────────────────────────────────────────────── */

export function Briefing(p: PropsDe<'Briefing'>) {
  return (
    <Caixa>
      <p className="etiqueta">1:1 · {p.pessoa}</p>
      <p className="prosa mt-2 text-[0.9rem] leading-snug text-muted-foreground">{p.contexto}</p>

      <p className="etiqueta mt-4 pb-1.5">Pauta</p>
      <ol className="space-y-2.5">
        {p.pauta?.map((item, i) => (
          <li key={i} className="text-[0.9rem] leading-snug">
            <span className="font-mono text-[0.7rem] text-foreground/35">{i + 1}</span> {item.item}
            <p className="mt-0.5 text-[0.8rem] text-muted-foreground">{item.porque}</p>
          </li>
        ))}
      </ol>

      {p.evidencias?.length > 0 && (
        <>
          <p className="etiqueta mt-4 pb-1.5">Evidência</p>
          {p.evidencias.map((e, i) => (
            <div key={i} className="mb-2.5">
              <p className="text-[0.88rem] leading-snug">{e.afirmacao}</p>
              <Fontes fontes={e.fontes} />
            </div>
          ))}
        </>
      )}

      {p.lacunas?.length > 0 && (
        <>
          <p className="etiqueta mt-4 pb-1.5">O que ainda não sei</p>
          <ul className="space-y-1.5">
            {p.lacunas.map((l, i) => (
              <li key={i} className="text-[0.85rem] leading-snug text-muted-foreground">
                {l.pergunta}
                <span className="block text-[0.78rem] text-muted-foreground/70">{l.motivo}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Caixa>
  )
}

const SITUACAO = {
  sustentado: 'sustentado',
  parcial: 'parcial',
  'sem-evidencia': 'sem evidência',
} as const

export function Gap(p: PropsDe<'Gap'>) {
  const comportamentos = p.comportamentos ?? []
  return (
    <Caixa>
      <p className="etiqueta">
        {p.pessoa} · {p.nivelAtual} → {p.nivelAlvo}
      </p>

      {/* A leitura de conjunto antes do detalhe. Sem a tira, a resposta a
          "onde ela está?" só existe depois de ler sete parágrafos — e a
          pergunta é justamente sobre o conjunto. */}
      {comportamentos.length > 1 && (
        <div className="mt-3">
          <TiraDeCobertura itens={comportamentos} />
        </div>
      )}

      <ul className="mt-4 space-y-4">
        {comportamentos.map((c, i) => (
          <li key={i} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[0.9rem] leading-snug">{c.texto}</p>
              <span className="etiqueta shrink-0">{SITUACAO[c.situacao] ?? c.situacao}</span>
            </div>
            <Fontes fontes={c.evidencias} />
            {c.observacao && (
              <p className="mt-1.5 text-[0.8rem] leading-snug text-muted-foreground">
                {c.observacao}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Caixa>
  )
}

export function Lacunas(p: PropsDe<'Lacunas'>) {
  return (
    <Caixa>
      <p className="etiqueta">O que o Brain sabe que não sabe{p.pessoa ? ` · ${p.pessoa}` : ''}</p>
      <ul className="mt-3 space-y-3">
        {p.itens?.map((l, i) => (
          <li key={i}>
            <p className="text-[0.9rem] leading-snug">{l.pergunta}</p>
            <p className="mt-1 text-[0.8rem] leading-snug text-muted-foreground">{l.motivo}</p>
            <p className="mt-1 font-mono text-[0.7rem] text-foreground/40">
              perguntar a {l.perguntarA} · valor {l.valor}
            </p>
          </li>
        ))}
      </ul>
    </Caixa>
  )
}

export function Dossie(p: PropsDe<'Dossie'>) {
  return (
    <Caixa>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="display text-[1.1rem] leading-none tracking-tight">{p.pessoa}</p>
          <p className="mt-1 text-[0.8rem] text-muted-foreground">{p.cargo}</p>
        </div>
        <span className="etiqueta">densidade {p.densidadeEvidencia}</span>
      </div>

      {p.temas?.length > 0 && (
        <>
          <p className="etiqueta mt-4 pb-1.5">Padrões</p>
          <ul className="space-y-1.5">
            {p.temas.map((t, i) => (
              <li key={i} className="text-[0.88rem] leading-snug">
                {t.padrao}
                <span className="ml-1.5 font-mono text-[0.68rem] text-foreground/40">
                  confiança {t.confianca}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="etiqueta mt-4 pb-1.5">Episódios</p>
      <ul className="space-y-2.5">
        {p.episodios?.map((e, i) => (
          <li key={i}>
            <p className="flex items-center gap-1.5 text-[0.88rem] leading-snug">
              {e.comEstrela && <Star className="size-3 shrink-0 fill-comp text-comp" />}
              {e.titulo}
              <span className="font-mono text-[0.68rem] text-foreground/35">{e.periodo}</span>
            </p>
            <p className="mt-0.5 text-[0.8rem] leading-snug text-muted-foreground">{e.resumo}</p>
          </li>
        ))}
      </ul>
    </Caixa>
  )
}

export function Timeline(p: PropsDe<'Timeline'>) {
  return (
    <Caixa>
      <p className="etiqueta">Linha do tempo · {p.pessoa}</p>
      <ul className="mt-3 space-y-4">
        {p.episodios?.map((e, i) => (
          <li key={i}>
            <p className="text-[0.9rem] leading-snug">{e.titulo}</p>
            <p className="font-mono text-[0.7rem] text-foreground/40">
              {e.inicio} → {e.fim}
            </p>
            <Fontes fontes={e.eventos} />
          </li>
        ))}
      </ul>
    </Caixa>
  )
}

export function Pessoas(p: PropsDe<'Pessoas'>) {
  return (
    <Caixa>
      <p className="etiqueta">{p.titulo}</p>
      <ul className="mt-2.5 space-y-2">
        {p.itens?.map((i, k) => (
          <li key={k} className="text-[0.9rem] leading-snug">
            {i.nome} <span className="text-muted-foreground">· {i.cargo}</span>
            {i.nota && <span className="block text-[0.8rem] text-muted-foreground">{i.nota}</span>}
          </li>
        ))}
      </ul>
    </Caixa>
  )
}

export function Diagnostico(p: PropsDe<'Diagnostico'>) {
  return (
    <Caixa>
      <div className="flex items-center gap-1.5">
        <AlertCircle className="size-3.5 text-comp" />
        <p className="etiqueta text-comp">Achado de organização</p>
      </div>
      <p className="display mt-2 text-[1.05rem] leading-tight tracking-tight">{p.titulo}</p>
      <p className="prosa mt-2 text-[0.9rem] leading-relaxed">{p.achado}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.pessoasAfetadas?.map((n) => (
          <Badge key={n} variant="outline" className="etiqueta px-1.5 py-[3px]">
            {n}
          </Badge>
        ))}
      </div>
      <p className="mt-3 border-t border-border pt-2.5 text-[0.85rem] leading-snug text-muted-foreground">
        {p.recomendacao}
      </p>
    </Caixa>
  )
}

/** A recusa tem componente próprio. Ela merece design. */
export function Recusa(p: PropsDe<'Recusa'>) {
  const Icone = p.camada === 'acesso' ? Lock : Minus
  return (
    <div className="my-3 rounded-sm border border-dashed border-border bg-muted/30 px-4 py-3.5">
      <div className="flex items-center gap-1.5">
        <Icone className="size-3.5 text-muted-foreground" />
        <p className="etiqueta">{p.camada === 'acesso' ? 'Sem acesso' : 'Fora de escopo'}</p>
      </div>
      <p className="prosa mt-2 text-[0.92rem] leading-relaxed">{p.motivo}</p>
      <p className="mt-2.5 border-t border-border/60 pt-2.5 text-[0.85rem] leading-snug text-muted-foreground">
        {p.ofereco}
      </p>
    </div>
  )
}
