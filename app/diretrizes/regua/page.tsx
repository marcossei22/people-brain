'use client'

/**
 * `/diretrizes/regua` — o único documento estruturado do Setup.
 *
 * É o que produz veredito: os outros governam tom, contexto e processo. Por
 * isso tem tela própria, e por isso cada comportamento carrega o observável —
 * comportamento sem observável é adjetivo, e adjetivo não se verifica.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SemAcesso } from '@/components/brain/sem-acesso'
import { NOME_NIVEL, NOME_TRILHA, regua } from '@/data/regua'
import type { NivelRegua, Trilha } from '@/data/tipos'
import { podeAdministrar } from '@/lib/agente/permissoes'
import { nomeDe } from '@/lib/memoria'
import { useViewer } from '@/lib/viewer'

const ORDEM = ['pleno', 'senior', 'staff'] as const

export default function PaginaRegua() {
  const { viewer, geracao } = useViewer()
  const [trilha, setTrilha] = useState<Trilha>('eng')

  if (!podeAdministrar(viewer)) {
    return (
      <SemAcesso motivo="A régua de carreira é editada por quem responde por ela. Fale com o time de Pessoas." />
    )
  }

  const niveis = ORDEM.map((n) => regua.find((r) => r.trilha === trilha && r.nivel === n)).filter(
    (r): r is NivelRegua => Boolean(r),
  )

  return (
    <div key={geracao} className="mx-auto max-w-5xl px-10 py-12">
      <Link
        href="/diretrizes"
        className="etiqueta surgir inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3" />
        Diretrizes
      </Link>

      <header className="surgir mt-4">
        <h2 className="display text-[2.1rem] leading-[1.1] tracking-tight">Régua de carreira</h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          O que a Aurora espera em cada nível, comportamento a comportamento. Cada um traz o que
          conta como observável.
        </p>
      </header>

      <Tabs
        value={trilha}
        onValueChange={(v) => setTrilha(v as Trilha)}
        className="surgir mt-8"
        style={{ animationDelay: '80ms' }}
      >
        <TabsList>
          {(['eng', 'sales'] as const).map((t) => (
            <TabsTrigger key={t} value={t} className="text-[0.85rem]">
              {NOME_TRILHA[t]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-10 space-y-12">
        {niveis.map((nivel, i) => (
          <section
            key={nivel.nivel}
            className="surgir"
            style={{ animationDelay: `${120 + i * 60}ms` }}
          >
            <div className="flex items-baseline justify-between pb-2.5">
              <h3 className="display text-[1.35rem] leading-none tracking-tight">
                {NOME_NIVEL[nivel.nivel]}
              </h3>
              <p className="etiqueta">
                {nivel.comportamentos.length} comportamentos
              </p>
            </div>
            <Separator />

            <ul>
              {nivel.comportamentos.map((c) => (
                <li key={c.id} className="border-b border-border/60 py-4">
                  <div className="flex items-start gap-5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.98rem] leading-snug">{c.texto}</p>
                      <p className="prosa mt-1.5 text-[0.88rem] leading-snug text-muted-foreground">
                        <span className="etiqueta mr-1.5">observável</span>
                        {c.observavel}
                      </p>
                    </div>
                    <code className="hidden shrink-0 font-mono text-[0.68rem] text-muted-foreground/50 sm:block">
                      {c.id}
                    </code>
                  </div>
                </li>
              ))}
            </ul>

            {nivel.derivado && <ReguaViva nivel={nivel} />}
          </section>
        ))}
      </div>
    </div>
  )
}

/**
 * A régua viva — PLANO.md §3.1 e decisão #8.
 *
 * Uma sugestão que nasceu da evidência real e está esperando decisão humana.
 * É este aceite que fecha o loop de aprovação: o sistema propõe, o humano
 * decide, e a régua muda. Régua congelada morre.
 */
function ReguaViva({ nivel }: { nivel: NivelRegua }) {
  const [decisao, setDecisao] = useState<'aceita' | 'descartada' | null>(null)
  const d = nivel.derivado!

  if (decisao === 'descartada') return null

  if (decisao === 'aceita')
    return (
      <div className="mt-4 border-b border-border/60 py-4">
        <div className="flex items-start gap-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[0.98rem] leading-snug">
                Transforma dependência entre times em acordo com dono e prazo.
              </p>
              <Badge
                variant="outline"
                className="etiqueta gap-1 border-comp/35 bg-comp-suave/40 px-1.5 py-[3px] text-comp"
              >
                novo
              </Badge>
            </div>
            <p className="prosa mt-1.5 text-[0.88rem] leading-snug text-muted-foreground">
              <span className="etiqueta mr-1.5">observável</span>O bloqueio vira acordo com
              responsável e data, registrado onde os dois times veem.
            </p>
            <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground/70">
              derivado da evidência de {d.baseadoEm.map(nomeDe).join(' e ')}
            </p>
          </div>
        </div>
      </div>
    )

  return (
    <div className="mt-5 rounded-sm border border-comp/30 bg-comp-suave/25 px-5 py-4">
      <div className="flex items-center gap-1.5 pb-2">
        <Sparkles className="size-3 text-comp" />
        <p className="etiqueta text-comp">A régua não previu isto</p>
      </div>
      <p className="prosa max-w-2xl text-[0.95rem] leading-relaxed">{d.sugestao}</p>
      <p className="mt-2.5 font-mono text-[0.72rem] text-muted-foreground">
        evidência: {d.baseadoEm.map(nomeDe).join(' · ')}
      </p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" className="h-7 text-[0.78rem]" onClick={() => setDecisao('aceita')}>
          Adicionar à régua
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
