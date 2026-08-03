import { pessoas } from '../../data/pessoas'
import { PERSONA_PADRAO, PERSONAS } from '../../lib/personas'
import type { Viewer } from '../../lib/personas'
import { desserializar, HEADER_REGISTRO } from '../../lib/sessao'
import type { Registro } from '../../lib/sessao'

/**
 * O que o canal resolveu antes de o modelo entrar no turno — quem pergunta, e o
 * que a sessão dessa pessoa já escreveu.
 *
 * `ctx.session.auth.current` foi decidido pelo servidor (ver
 * `agent/channels/eve.ts`). O modelo não participou dessa decisão e não tem como
 * alterá-la — é o que sustenta a decisão #21.
 */
type ContextoDaTool = {
  session: {
    auth: {
      current: {
        principalId: string
        attributes?: Readonly<Record<string, string | readonly string[]>>
      } | null
    }
  }
}

/** Traduz a identidade da sessão em um `Viewer`. */
export function viewerDaSessao(ctx: ContextoDaTool): Viewer {
  const id = ctx.session.auth.current?.principalId
  const persona = PERSONAS.find((p) => p.pessoaId === id)
  if (persona) return persona

  // Sem identidade resolvida, cai no padrão em vez de abrir tudo.
  return PERSONA_PADRAO
}

/**
 * O que a sessão do navegador escreveu e ainda não existe em `data/`.
 *
 * Toda tool que conta alguma coisa passa por aqui e entrega o resultado às
 * funções de `lib/sessao.ts`, que são as mesmas que o dossiê usa. Sem isso o
 * chat responde pela semente enquanto a tela atrás do painel mostra o que a
 * pessoa acabou de escrever — as duas superfícies visíveis ao mesmo tempo,
 * discordando sobre a mesma pessoa.
 *
 * Registro vazio quando não veio nada é o comportamento certo: é exatamente a
 * semente, que é o que o agente sempre respondeu.
 */
export function registroDaSessao(ctx: ContextoDaTool): Registro {
  const bruto = ctx.session.auth.current?.attributes?.[HEADER_REGISTRO]
  return desserializar(typeof bruto === 'string' ? bruto : null)
}

export const nomeDe = (id: string) => pessoas.find((p) => p.id === id)?.nome ?? id
