'use client'

/**
 * Densidade de evidência — três traços, preenchidos conforme o nível.
 *
 * Este componente É o trade-off #1 do PLANO.md na tela. O sistema sabe mais
 * sobre quem deixa rastro digital, e esconder isso transformaria legibilidade
 * digital em proxy silencioso de performance. Aqui vira informação declarada,
 * ao lado do nome, sem eufemismo.
 */

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const NIVEIS = { baixa: 1, media: 2, alta: 3 } as const

const LEGENDA: Record<keyof typeof NIVEIS, string> = {
  alta: 'Muito rastro registrado. O sistema observa e pergunta pouco.',
  media: 'Rastro parcial. O sistema observa e pergunta.',
  baixa:
    'Pouco rastro. O sistema pergunta mais — não sabe menos por preguiça, sabe menos porque este trabalho deixa menos marca.',
}

export function Densidade({
  nivel,
  className = '',
}: {
  nivel: 'alta' | 'media' | 'baixa'
  className?: string
}) {
  const cheios = NIVEIS[nivel]
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`inline-flex items-end gap-[3px] ${className}`}
          aria-label={`Densidade de evidência ${nivel}`}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={i < cheios ? 'block w-[3px] bg-foreground/70' : 'block w-[3px] bg-foreground/15'}
              style={{ height: `${6 + i * 3}px` }}
            />
          ))}
        </span>
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-[17rem]">
        <span className="etiqueta block text-current opacity-70">
          Densidade de evidência · {nivel}
        </span>
        <span className="mt-1 block leading-snug">{LEGENDA[nivel]}</span>
      </TooltipContent>
    </Tooltip>
  )
}
