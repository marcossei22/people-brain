'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

/** Abre e fecha o painel de chat. O chat não é rota (decisão #29). */
const Ctx = createContext<{ aberto: boolean; abrir: () => void; fechar: () => void } | null>(null)

export function ProvedorChat({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false)
  const abrir = useCallback(() => setAberto(true), [])
  const fechar = useCallback(() => setAberto(false), [])
  const valor = useMemo(() => ({ aberto, abrir, fechar }), [aberto, abrir, fechar])
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useChat() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useChat precisa estar dentro de <ProvedorChat>')
  return ctx
}
