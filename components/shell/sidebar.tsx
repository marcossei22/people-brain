'use client'

/**
 * Sidebar do shell — ARQUITETURA.md §8.0.
 *
 * Navegação + conversas + seletor de persona. O painel de chat em si entra no
 * passo 5; aqui já existe o botão que o abre e a lista que vai guardá-las,
 * para o layout não mudar depois.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookMarked, Building2, Inbox, MessageSquarePlus, Plug } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SeletorPersona } from './seletor-persona'
import { podeAdministrar } from '@/lib/agente/permissoes'
import { useChat } from '@/lib/chat'
import { useViewer } from '@/lib/viewer'

interface Item {
  href: string
  rotulo: string
  icone: LucideIcon
  nota: string
  soAdmin?: boolean
}

const ITENS: Item[] = [
  { href: '/org', rotulo: 'Organização', icone: Building2, nota: 'Quem você alcança' },
  { href: '/feedback', rotulo: 'Pendências', icone: Inbox, nota: 'Sua atenção da semana' },
  {
    href: '/diretrizes',
    rotulo: 'Diretrizes',
    icone: BookMarked,
    nota: 'O que a empresa espera',
    soAdmin: true,
  },
  { href: '/integrations', rotulo: 'Integrações', icone: Plug, nota: 'De onde vem a evidência' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { viewer } = useViewer()
  const { abrir: abrirChat, conversa } = useChat()
  const admin = podeAdministrar(viewer)

  return (
    <aside className="sticky top-0 z-10 flex h-dvh w-[16.5rem] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="px-5 pb-4 pt-6">
        <Link href="/org" className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          <h1 className="display text-[1.4rem] leading-none tracking-tight">People Brain</h1>
        </Link>
      </div>

      <nav className="px-2.5">
        <ul className="space-y-0.5">
          {ITENS.filter((i) => !i.soAdmin || admin).map((item) => {
            const ativo = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icone = item.icone
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={ativo ? 'page' : undefined}
                  className={`group relative flex items-start gap-2.5 rounded-sm px-2.5 py-2 transition-colors ${
                    ativo
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-foreground/75 hover:bg-sidebar-accent/60 hover:text-foreground'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-comp transition-opacity ${
                      ativo ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <Icone
                    className={`mt-[3px] size-[0.95rem] shrink-0 ${ativo ? 'text-comp' : 'opacity-70'}`}
                  />
                  <span className="min-w-0">
                    <span className="block text-[0.86rem] leading-tight">{item.rotulo}</span>
                    <span className="mt-0.5 block text-[0.7rem] leading-tight text-muted-foreground">
                      {item.nota}
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-7 flex min-h-0 flex-1 flex-col px-2.5">
        <div className="flex items-center justify-between gap-2 px-2.5 pb-2">
          <p className="etiqueta">Conversas</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={abrirChat}
            className="-mr-1.5 h-6 gap-1.5 px-1.5 text-[0.72rem] text-muted-foreground hover:text-comp"
          >
            <MessageSquarePlus className="size-3.5" />
            Nova
          </Button>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          {conversa ? (
            <button
              onClick={abrirChat}
              className="flex w-full items-start gap-2 rounded-sm px-2.5 py-1.5 text-left transition-colors hover:bg-sidebar-accent/60"
            >
              <span
                aria-hidden
                className="mt-[7px] size-1 shrink-0 rounded-full bg-comp"
              />
              <span className="line-clamp-2 text-[0.78rem] leading-snug">{conversa}</span>
            </button>
          ) : (
            <button
              onClick={abrirChat}
              className="w-full rounded-sm px-2.5 py-1.5 text-left text-[0.78rem] leading-snug text-muted-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
            >
              Nenhuma conversa ainda.
            </button>
          )}
        </ScrollArea>
      </div>

      <SeletorPersona />
    </aside>
  )
}
