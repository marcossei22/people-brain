'use client'

/**
 * Quem está OLHANDO — ARQUITETURA.md §4.
 *
 * Não confundir com quem está sendo olhado (isso é a URL, `/org/[id]`).
 * São dois eixos independentes, e é a separação deles que faz "sem arquivo
 * secreto" virar fato demonstrável: a Carla vendo o próprio dossiê e a Marina
 * vendo o dossiê da Carla renderizam a MESMA tela.
 *
 * Não há login. Há um seletor exposto de propósito, que também orienta o
 * avaliador sobre de que ângulo ele está olhando.
 */

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { PessoaId } from '@/data/tipos'

export type Papel = 'gestor' | 'colaborador' | 'chro'

export interface Viewer {
  pessoaId: PessoaId
  papel: Papel
}

export type Persona = Viewer

export const PERSONAS: Persona[] = [
  { pessoaId: 'marina', papel: 'gestor' },
  { pessoaId: 'carla', papel: 'colaborador' },
  { pessoaId: 'helena', papel: 'chro' },
]

/** Helena é o padrão: é a única persona com acesso de admin, então o produto
 *  abre já mostrando a organização inteira e as telas de Setup. */
export const PERSONA_PADRAO =
  PERSONAS.find((p) => p.pessoaId === 'helena') ?? PERSONAS[0]

export const NOME_DO_PAPEL: Record<Papel, string> = {
  gestor: 'Gestora',
  colaborador: 'Colaboradora',
  chro: 'CHRO',
}

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
