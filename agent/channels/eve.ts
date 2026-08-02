import { type AuthFn, localDev, none } from 'eve/channels/auth'
import { eveChannel } from 'eve/channels/eve'
import { pessoas } from '../../data/pessoas'
import { PERSONA_PADRAO, PERSONAS } from '../../lib/personas'

/**
 * Resolve QUEM está olhando, na camada de canal — antes de qualquer chamada ao
 * modelo (ARQUITETURA §6.6, decisão #21).
 *
 * Isto é o que mantém a permissão em código. O `clientContext` do eve também
 * existe e é mais fácil, mas ele injeta uma mensagem de usuário no prompt: o
 * modelo poderia ser convencido a ignorá-la. Aqui não — quando a tool roda,
 * `ctx.session.auth.current.principalId` já foi decidido pelo servidor e o
 * modelo não participou dessa decisão.
 *
 * Não é autenticação de verdade: o header vem do seletor de persona, que é um
 * seletor e não um login (§4). O ponto é que o MODELO não forja, não o usuário.
 */
function personaDoHeader(): AuthFn<Request> {
  return async (request) => {
    const id = request.headers.get('x-people-brain-persona')?.trim()
    if (!id) return null

    const persona = PERSONAS.find((p) => p.pessoaId === id)
    const pessoa = pessoas.find((p) => p.id === id)
    if (!persona || !pessoa) return null

    return {
      attributes: { papel: persona.papel, nome: pessoa.nome },
      authenticator: 'persona',
      principalId: pessoa.id,
      principalType: 'user',
    }
  }
}

/** Sem header, cai na persona padrão. Protótipo público, sem login. */
function personaPadrao(): AuthFn<Request> {
  return async () => {
    const pessoa = pessoas.find((p) => p.id === PERSONA_PADRAO.pessoaId)!
    return {
      attributes: { papel: PERSONA_PADRAO.papel, nome: pessoa.nome },
      authenticator: 'persona-padrao',
      principalId: pessoa.id,
      principalType: 'user',
    }
  }
}

export default eveChannel({
  auth: [personaDoHeader(), personaPadrao(), none(), localDev()],
})
