'use client'

/**
 * Quem está OLHANDO — ARQUITETURA.md §4.
 *
 * Não confundir com quem está sendo olhado (isso é a URL, `/org/[id]`).
 * São dois eixos independentes, e é a separação deles que faz "sem arquivo
 * secreto" virar fato demonstrável: a Carla vendo o próprio dossiê e a Marina
 * vendo o dossiê da Carla renderizam a MESMA tela.
 *
 * As personas em si vivem em `lib/personas.ts`, sem React — o canal do agente
 * importa de lá.
 */

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { PessoaId } from '@/data/tipos'
import { PERSONA_PADRAO, PERSONAS } from '@/lib/personas'
import type { Viewer } from '@/lib/personas'

export { NOME_DO_PAPEL, PERSONAS, PERSONA_PADRAO } from '@/lib/personas'
export type { Papel, Persona, Viewer } from '@/lib/personas'

interface ContextoViewer {
  viewer: Viewer
  trocarPersona: (pessoaId: PessoaId) => void
  reset: () => void
  /** Muda a cada reset. Componentes com estado local usam como `key` para
   *  voltarem ao início — é o botão de reset do §10 funcionando de verdade,
   *  e não só recarregando a página. */
  geracao: number
}

const Ctx = createContext<ContextoViewer | null>(null)

export function ProvedorViewer({ children }: { children: React.ReactNode }) {
  const [viewer, setViewer] = useState<Viewer>(PERSONA_PADRAO)
  const [geracao, setGeracao] = useState(0)

  const trocarPersona = useCallback((pessoaId: PessoaId) => {
    const p = PERSONAS.find((x) => x.pessoaId === pessoaId)
    if (p) setViewer({ pessoaId: p.pessoaId, papel: p.papel })
  }, [])

  const reset = useCallback(() => {
    setViewer(PERSONA_PADRAO)
    setGeracao((g) => g + 1)
  }, [])

  const valor = useMemo(
    () => ({ viewer, trocarPersona, reset, geracao }),
    [viewer, trocarPersona, reset, geracao],
  )

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useViewer() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useViewer precisa estar dentro de <ProvedorViewer>')
  return ctx
}
