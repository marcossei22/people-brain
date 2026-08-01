/**
 * Densidade de evidência — três traços, preenchidos conforme o nível.
 *
 * Este componente É o trade-off #1 do PLANO.md na tela. O sistema sabe mais
 * sobre quem deixa rastro digital, e esconder isso transformaria legibilidade
 * digital em proxy silencioso de performance. Aqui vira informação declarada,
 * ao lado do nome, sem eufemismo.
 */

const NIVEIS = { baixa: 1, media: 2, alta: 3 } as const

const LEGENDA: Record<keyof typeof NIVEIS, string> = {
  alta: 'Muito rastro registrado. O sistema observa; pergunta pouco.',
  media: 'Rastro parcial. O sistema observa e pergunta.',
  baixa: 'Pouco rastro. O sistema pergunta mais — não sabe menos por preguiça, sabe menos porque este trabalho deixa menos marca.',
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
    <span
      className={`inline-flex items-end gap-[3px] ${className}`}
      title={`Densidade de evidência ${nivel} — ${LEGENDA[nivel]}`}
      aria-label={`Densidade de evidência ${nivel}`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={
            i < cheios
              ? 'block w-[3px] bg-foreground/70'
              : 'block w-[3px] bg-foreground/15'
          }
          style={{ height: `${6 + i * 3}px` }}
        />
      ))}
    </span>
  )
}
