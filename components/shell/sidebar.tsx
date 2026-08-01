'use client'

/**
 * Sidebar do shell — ARQUITETURA.md §8.0.
 *
 * Navegação + histórico de conversas + seletor de persona. O histórico e o
 * botão de chat entram de verdade no passo 5; aqui a estrutura já existe para
 * o layout não mudar depois.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Inbox, Plug, Ruler } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SeletorPersona } from './seletor-persona'
import { podeAdministrar } from '@/lib/agente/permissoes'
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
  { href: '/regua', rotulo: 'Régua', icone: Ruler, nota: 'O que a empresa espera', soAdmin: true },
  { href: '/integrations', rotulo: 'Integrações', icone: Plug, nota: 'De onde vem a evidência' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { viewer } = useViewer()
  const admin = podeAdministrar(viewer)

  return (
    <aside className="sticky top-0 z-10 flex h-dvh w-[16.5rem] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="px-5 pb-5 pt-6">
        <Link href="/org" className="block">
          <h1 className="display text-[1.4rem] leading-none tracking-tight">People Brain</h1>
          <p className="prosa mt-2 text-[0.78rem] italic leading-snug text-muted-foreground">
            O Brain lembra.<br />As pessoas decidem.
          </p>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2.5">
        <p className="etiqueta px-2.5 pb-2">Navegação</p>
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
                    className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full transition-all ${
                      ativo ? 'bg-ocre opacity-100' : 'opacity-0'
                    }`}
                  />
                  <Icone className="mt-[3px] size-[0.95rem] shrink-0 opacity-70" />
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

        <div className="mt-7 px-2.5">
          <p className="etiqueta pb-2">Conversas</p>
          <p className="prosa text-[0.78rem] leading-snug text-muted-foreground/70">
            Nenhuma conversa ainda. O chat abre por cima de qualquer tela — a
            pergunta nasce olhando outra coisa.
          </p>
        </div>
      </nav>

      <SeletorPersona />
    </aside>
  )
}
