import { defineDynamic, defineInstructions } from 'eve/instructions'
import { pessoas } from '../../data/pessoas'
import { PERSONA_PADRAO, PERSONAS } from '../../lib/personas'
import { reportsDe } from '../../lib/memoria'

/**
 * QUEM está perguntando, dentro do system prompt.
 *
 * As tools já sabiam disso — `ctx.session.auth.current` é resolvido pelo canal
 * antes do modelo entrar no turno (decisão #21). O MODELO é que não sabia: uma
 * pergunta em primeira pessoa ("o que a Marina escreveu sobre mim?") morria num
 * `ask_question` perguntando o nome de quem já estava autenticado — que é
 * exatamente o oposto do que um sistema de registro deve fazer.
 *
 * Resolvido aqui e não pelo `clientContext` do eve, que injeta uma mensagem de
 * usuário e seria contornável (decisão #35). Isto é prompt de sistema, montado
 * no servidor a partir da sessão, e chega antes da primeira palavra do modelo.
 *
 * Continua sendo só informação: quem barra acesso é `permissoes.ts`. Se este
 * bloco mentisse, as tools negariam do mesmo jeito.
 */
export default defineDynamic({
  events: {
    'session.started': (_evento, ctx) => {
      const id = ctx.session.auth.current?.principalId
      const persona = PERSONAS.find((p) => p.pessoaId === id) ?? PERSONA_PADRAO
      const pessoa = pessoas.find((p) => p.id === persona.pessoaId)
      if (!pessoa) return null

      const reports = reportsDe(pessoa.id)

      return defineInstructions({
        markdown: [
          '## Quem está falando com você',
          '',
          `Nesta sessão, quem pergunta é **${pessoa.nome}** (\`${pessoa.id}\`), ${pessoa.cargo}, time ${pessoa.time}. Papel no produto: ${persona.papel}.`,
          reports.length > 0
            ? `Reportam a ela: ${reports.map((r) => `${r.nome} (\`${r.id}\`)`).join(', ')}.`
            : 'Ninguém reporta a ela.',
          '',
          '"eu", "mim", "meu registro", "meu time" e "meu 1:1" são sobre essa pessoa. Nunca',
          'pergunte quem ela é — você já sabe, e perguntar num sistema que guarda o registro',
          'dela soa a defeito.',
          '',
          'Isto diz de quem se trata, não o que ela pode ver. O alcance continua nas tools: se',
          'uma delas negar, relate a negação como ela veio.',
          '',
          '## Antes de escrever a primeira palavra',
          '',
          'Olhe o idioma da mensagem que acabou de chegar. Se não for português, sua resposta',
          'inteira sai naquele idioma — texto e componentes. Este prompt estar em português é',
          'irrelevante para essa escolha; ele é instrução para você, não amostra de como',
          'responder. *If they wrote in English, answer in English.*',
        ].join('\n'),
      })
    },
  },
})
