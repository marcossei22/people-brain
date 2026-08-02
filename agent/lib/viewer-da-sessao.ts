import { pessoas } from '../../data/pessoas'
import { PERSONA_PADRAO, PERSONAS } from '../../lib/personas'
import type { Viewer } from '../../lib/personas'

/**
 * Traduz a identidade da sessão em um `Viewer`.
 *
 * `ctx.session.auth.current` foi resolvido pelo canal antes de o modelo entrar
 * no turno (ver `agent/channels/eve.ts`). O modelo não participou dessa
 * decisão e não tem como alterá-la — é o que sustenta a decisão #21.
 */
export function viewerDaSessao(ctx: {
  session: { auth: { current: { principalId: string } | null } }
}): Viewer {
  const id = ctx.session.auth.current?.principalId
  const persona = PERSONAS.find((p) => p.pessoaId === id)
  if (persona) return persona

  // Sem identidade resolvida, cai no padrão em vez de abrir tudo.
  return PERSONA_PADRAO
}

export const nomeDe = (id: string) => pessoas.find((p) => p.id === id)?.nome ?? id
