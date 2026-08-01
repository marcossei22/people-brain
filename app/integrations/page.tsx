'use client'

/**
 * `/integrations` — ARQUITETURA.md §8.5.
 *
 * Duas metades. Em cima, as fontes: é aqui que o Slack aparece, como o que ele
 * é — uma fonte que alimenta o registro, e não uma superfície que o produto
 * imita. Embaixo, o que nunca é capturado.
 *
 * A metade de baixo é a mais barata do protótipo em relação ao que entrega: o
 * modelo de confiança deixa de ser parágrafo e vira coisa que o avaliador vê.
 */

import { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LOGOS } from '@/components/logos'
import { conectadas, disponiveis } from '@/data/fontes'
import type { Integracao } from '@/data/fontes'
import { nomeDe } from '@/lib/memoria'
import { useViewer } from '@/lib/viewer'

export default function PaginaIntegracoes() {
  const { geracao } = useViewer()
  const [aberta, setAberta] = useState<Integracao | null>(null)
  const ligadas = conectadas()
  const oferta = disponiveis()

  return (
    <div key={geracao} className="mx-auto max-w-5xl px-10 py-12">
      <header className="surgir">
        <p className="etiqueta">Integrações</p>
        <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">
          De onde vem a evidência
        </h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          As ferramentas conectadas alimentam o registro de trabalho da sua organização.
        </p>
      </header>

      <section className="mt-10">
        <div className="flex items-baseline justify-between pb-2.5">
          <p className="etiqueta">Conectadas · {ligadas.length}</p>
          <p className="etiqueta">Sincronização</p>
        </div>
        <Separator />

        <ul>
          {ligadas.map((f, i) => (
            <li key={f.id} className="surgir" style={{ animationDelay: `${60 + i * 40}ms` }}>
              <button
                onClick={() => setAberta(f)}
                className="flex w-full items-center gap-5 border-b border-border/70 py-4 text-left transition-colors hover:bg-foreground/[0.025]"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border bg-card p-[7px]">
                  <Logo id={f.id} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="display block text-[1.05rem] leading-none tracking-tight">
                    {f.nome}
                  </span>
                  <span className="mt-1.5 block text-[0.78rem] text-muted-foreground">
                    {f.categoria} · conectada por {nomeDe(f.conectadaPor ?? '')} em{' '}
                    {formatarData(f.conectadaEm)}
                  </span>
                </span>
                <span className="hidden shrink-0 text-right sm:block">
                  {f.volume?.map((v) => (
                    <span key={v.rotulo} className="block font-mono text-[0.72rem] text-muted-foreground">
                      {v.rotulo}: {v.valor}
                    </span>
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <p className="etiqueta pb-2.5">Disponíveis</p>
        <Separator />
        <ul className="mt-4 flex flex-wrap gap-2">
          {oferta.map((f) => (
            <li key={f.id}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAberta(f)}
                className="group h-9 gap-2 pl-2.5 text-[0.82rem] font-normal"
              >
                <span className="flex size-4 shrink-0 items-center justify-center opacity-55 grayscale transition group-hover:opacity-100 group-hover:grayscale-0">
                  <Logo id={f.id} />
                </span>
                {f.nome}
                <Plus className="size-3.5 text-muted-foreground/60" />
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <Dialog open={aberta !== null} onOpenChange={(o) => !o && setAberta(null)}>
        <DialogContent className="max-h-[85dvh] max-w-lg overflow-y-auto">
          {aberta && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-border bg-card p-1.5">
                    <Logo id={aberta.id} />
                  </span>
                  <DialogTitle className="display text-[1.3rem] tracking-tight">
                    {aberta.nome}
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className={
                      aberta.estado === 'conectada'
                        ? 'etiqueta border-comp/35 bg-comp-suave/40 px-1.5 py-[3px] text-comp'
                        : 'etiqueta px-1.5 py-[3px]'
                    }
                  >
                    {aberta.estado === 'conectada' ? 'conectada' : 'disponível'}
                  </Badge>
                </div>
                <DialogDescription className="prosa text-[0.9rem]">
                  {aberta.categoria}
                  {aberta.conectadaEm && ` · desde ${formatarData(aberta.conectadaEm)}`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <div>
                  <p className="etiqueta pb-2">O que entra no registro</p>
                  <ul className="space-y-1.5">
                    {aberta.captura.map((c) => (
                      <li key={c} className="flex items-baseline gap-2.5 text-[0.86rem]">
                        <Check className="size-3.5 shrink-0 translate-y-[2px] text-comp" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="etiqueta pb-2">O que fica de fora</p>
                  <ul className="space-y-1.5">
                    {aberta.ignora.map((c) => (
                      <li
                        key={c}
                        className="flex items-baseline gap-2.5 text-[0.86rem] text-muted-foreground"
                      >
                        <Minus className="size-3.5 shrink-0 translate-y-[2px] text-muted-foreground/40" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {aberta.escopos && (
                  <div>
                    <p className="etiqueta pb-2">Permissões concedidas</p>
                    <p className="font-mono text-[0.75rem] text-muted-foreground">
                      {aberta.escopos.join(' · ')}
                    </p>
                  </div>
                )}

                {aberta.estado === 'disponivel' && (
                  <Button className="w-full" size="sm">
                    Conectar {aberta.nome}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Logo({ id, className }: { id: string; className?: string }) {
  const Marca = LOGOS[id]
  if (!Marca) return <span className="block size-full rounded-[2px] bg-foreground/10" />
  return <Marca className={className} />
}

function formatarData(iso?: string) {
  if (!iso) return '—'
  const [ano, mes, dia] = iso.split('-')
  const meses = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez',
  ]
  return `${Number(dia)} ${meses[Number(mes) - 1]} ${ano}`
}
