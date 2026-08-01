'use client'

/**
 * O seletor de "quem eu sou" — ARQUITETURA.md §4.
 *
 * Fica sempre visível, no rodapé da sidebar, e é instrumento de avaliação do
 * case: é ele que permite trocar de ângulo SEM SAIR DA PÁGINA. É esse gesto
 * que transforma "sem arquivo secreto" de promessa em fato apontável.
 *
 * Por isso cada opção declara o que prova. O avaliador não deveria ter que
 * adivinhar por que trocaria de persona.
 */

import { Check, ChevronsUpDown, RotateCcw } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NOME_DO_PAPEL, PERSONAS, useViewer } from '@/lib/viewer'
import { pessoa } from '@/lib/memoria'

export function SeletorPersona() {
  const { viewer, trocarPersona, reset } = useViewer()
  const atual = pessoa(viewer.pessoaId)

  return (
    <div className="border-t border-sidebar-border">
      <DropdownMenu>
        <DropdownMenuTrigger className="group flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-sidebar-accent focus-visible:bg-sidebar-accent focus-visible:outline-none">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="bg-foreground/[0.07] text-[0.7rem] font-medium tracking-wide text-foreground/70">
              {iniciais(atual?.nome)}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1">
            <span className="etiqueta block">Vendo como</span>
            <span className="display mt-1 block truncate text-[0.95rem] leading-none">
              {atual?.nome ?? viewer.pessoaId}
            </span>
            <span className="mt-1 block truncate text-[0.7rem] text-muted-foreground">
              {legenda(NOME_DO_PAPEL[viewer.papel], atual?.cargo)}
            </span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-[19rem] p-0">
          <DropdownMenuLabel className="etiqueta px-3 pb-1.5 pt-3">
            Ver o mesmo produto de outro ângulo
          </DropdownMenuLabel>

          {PERSONAS.map((p) => {
            const alvo = pessoa(p.pessoaId)
            const ativa = p.pessoaId === viewer.pessoaId
            return (
              <DropdownMenuItem
                key={p.pessoaId}
                onSelect={() => trocarPersona(p.pessoaId)}
                className="flex cursor-pointer items-start gap-3 px-3 py-2.5"
              >
                <Check className={`mt-1 size-3.5 shrink-0 ${ativa ? 'text-comp' : 'invisible'}`} />
                <span className="min-w-0 flex-1">
                  <span className="display block text-[0.95rem] leading-tight">{alvo?.nome}</span>
                  <span className="mt-0.5 block text-[0.72rem] text-muted-foreground">
                    {alvo?.cargo} · <span className="italic">{p.prova}</span>
                  </span>
                </span>
              </DropdownMenuItem>
            )
          })}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => reset()}
            className="flex cursor-pointer items-center gap-2.5 px-3 py-2.5 text-[0.8rem]"
          >
            <RotateCcw className="size-3.5 text-muted-foreground" />
            Recomeçar a demonstração
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/** A CHRO tem papel e cargo com o mesmo nome. Repetir soa a bug. */
function legenda(papel: string, cargo?: string) {
  if (!cargo) return papel
  return papel.toLowerCase() === cargo.toLowerCase() ? cargo : `${papel} · ${cargo}`
}

function iniciais(nome?: string) {
  if (!nome) return '—'
  const [a, b] = nome.split(' ')
  return `${a?.[0] ?? ''}${b?.[0] ?? ''}`.toUpperCase()
}
