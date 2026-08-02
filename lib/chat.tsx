'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

/**
 * Abre e fecha o painel de chat. O chat não é rota (decisão #29).
 *
 * `abrirCom` deixa uma pergunta pronta no painel: é como o dossiê passa a
 * conversa adiante sem que a pessoa precise redigitar de quem está falando.
 */
interface ContextoChat {
  aberto: boolean
  perguntaInicial: string | null
  /** A conversa em curso, pelo que foi perguntado primeiro. Sem persistência
   *  (#15) existe uma de cada vez — a sidebar mostra essa, e não uma lista
   *  vazia que nunca enche. */
  conversa: string | null
  abrir: () => void
  abrirCom: (pergunta: string) => void
  consumirPergunta: () => void
  registrarConversa: (pergunta: string | null) => void
  fechar: () => void
}

const Ctx = createContext<ContextoChat | null>(null)

export function ProvedorChat({ children }: { children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false)
  const [perguntaInicial, setPergunta] = useState<string | null>(null)
  const [conversa, setConversa] = useState<string | null>(null)

  const abrir = useCallback(() => setAberto(true), [])
  const abrirCom = useCallback((p: string) => {
    setPergunta(p)
    setAberto(true)
  }, [])
  const consumirPergunta = useCallback(() => setPergunta(null), [])
  const registrarConversa = useCallback((p: string | null) => setConversa(p), [])
  const fechar = useCallback(() => setAberto(false), [])

  const valor = useMemo(
    () => ({
      aberto,
      perguntaInicial,
      conversa,
      abrir,
      abrirCom,
      consumirPergunta,
      registrarConversa,
      fechar,
    }),
    [aberto, perguntaInicial, conversa, abrir, abrirCom, consumirPergunta, registrarConversa, fechar],
  )
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useChat() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useChat precisa estar dentro de <ProvedorChat>')
  return ctx
}
