import { type AuthFn, localDev, none } from 'eve/channels/auth'
import { eveChannel } from 'eve/channels/eve'
import { pessoas } from '../../data/pessoas'
import { PERSONA_PADRAO, PERSONAS } from '../../lib/personas'
import { HEADER_REGISTRO } from '../../lib/sessao'

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
      attributes: { papel: persona.papel, nome: pessoa.nome, ...registroDoHeader(request) },
      authenticator: 'persona',
      principalId: pessoa.id,
      principalType: 'user',
    }
  }
}

/** Sem header, cai na persona padrão. Protótipo público, sem login. */
function personaPadrao(): AuthFn<Request> {
  return async (request) => {
    const pessoa = pessoas.find((p) => p.id === PERSONA_PADRAO.pessoaId)!
    return {
      attributes: {
        papel: PERSONA_PADRAO.papel,
        nome: pessoa.nome,
        ...registroDoHeader(request),
      },
      authenticator: 'persona-padrao',
      principalId: pessoa.id,
      principalType: 'user',
    }
  }
}

/**
 * O que a sessão ESCREVEU, chegando junto com quem escreveu.
 *
 * A camada de escrita vive no React do cliente e não tem banco atrás (§14), então
 * o servidor não tem como descobrir sozinho que a Marina acabou de reconhecer um
 * episódio. Enquanto o delta não viajava, as tools liam a semente e o chat
 * respondia "14 eventos" com o dossiê atrás do painel mostrando 15 — a
 * divergência que `lib/metricas.ts` existe para impedir, entrando por outra
 * porta.
 *
 * Ele anda pelo mesmo caminho da persona, e é por isso que este arquivo é o
 * lugar: os dois são resolvidos na camada de canal, antes de o modelo entrar no
 * turno, e nenhum dos dois passa pelo prompt. Pelo `clientContext` seria mais
 * fácil e daria uma contagem que o modelo pode reinterpretar — contagem em prosa
 * de novo (decisão #35).
 *
 * Fica em `attributes` porque é o único envelope por requisição que o eve entrega
 * às tools intacto. Não é identidade e não decide acesso: `podeConsultar` roda
 * exatamente como rodava, sobre o `principalId` que o canal resolveu.
 */
function registroDoHeader(request: Request): Record<string, string> {
  const bruto = request.headers.get(HEADER_REGISTRO)
  return bruto ? { [HEADER_REGISTRO]: bruto } : {}
}

export default eveChannel({
  auth: [personaDoHeader(), personaPadrao(), none(), localDev()],
})
