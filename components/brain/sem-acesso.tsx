'use client'

import { Lock } from 'lucide-react'

/** Recusa de acesso renderizada como tela, não como erro. A negação vem de
 *  `permissoes.ts` e é relatada, não inventada (§6.6). */
export function SemAcesso({ motivo }: { motivo: string }) {
  return (
    <div className="mx-auto max-w-2xl px-10 py-24">
      <div className="surgir flex items-start gap-4">
        <Lock className="mt-1 size-5 shrink-0 text-muted-foreground/60" />
        <div>
          <h2 className="display text-[1.5rem] leading-tight tracking-tight">
            Você não tem acesso a esta página
          </h2>
          <p className="prosa mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
            {motivo}
          </p>
        </div>
      </div>
    </div>
  )
}
