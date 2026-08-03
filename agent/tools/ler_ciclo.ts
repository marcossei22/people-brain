import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { CICLO_ATUAL, cicloEmFechamento } from '../../data/ciclos'
import { comportamentoPorId } from '../../data/regua'
import type { Avaliacao } from '../../data/tipos'
import { ehGestorDe, podeConsultar, pessoasVisiveis } from '../../lib/agente/permissoes'
import { lerAvaliacao } from '../../lib/ciclo'
import { situacaoDe } from '../../lib/metricas'
import { avaliacaoDe, avaliacoesDoCiclo } from '../../lib/sessao'
import { nomeDe, registroDaSessao, viewerDaSessao } from '../lib/viewer-da-sessao'

/**
 * O fechamento do ciclo, do lado do agente — JORNADAS G5 e A4.
 *
 * O ciclo inteiro (avaliação, discordância, decisão, assinatura) já viajava no
 * cabeçalho de `lib/sessao.ts` e NENHUMA tool o lia. A gestora assinava "abrir
 * caso de promoção" na tela e perguntava no chat da mesma tela se o ciclo tinha
 * fechado; o agente respondia como se nada tivesse sido assinado, e montava um
 * caso que já estava aberto. A discordância chegava pela metade — a nota nova
 * vinha em `ler_regua`, o fato de ela ter vindo de um humano não vinha —, e a
 * pergunta "quem já fechou?" não tinha como ser respondida.
 *
 * Lê pelo registro mesclado, como todas as outras: o que está em `data/ciclos`
 * (os fechamentos do Paulo) e o que a sessão assinou agora saem pela mesma
 * porta.
 *
 * O QUE NÃO SAI DAQUI: avaliação em curso de terceiro. Enquanto não é assinada,
 * ela é uma decisão que o gestor ainda está tomando (JORNADAS §0, regra 4), e
 * publicá-la mostraria a um terceiro o que a própria pessoa avaliada ainda não
 * vê. Quem assina vê a própria em curso, e só ela.
 */
export default defineTool({
  description: [
    'Lê o fechamento do ciclo: quem já fechou, o que foi assinado e com que lastro. Com `pessoaId`, devolve a avaliação daquela pessoa comportamento a comportamento — a saída do gestor em cada linha (concordo, discordo, não sei), o que a contagem propunha, o que ficou assinado e a decisão.',
    'CHAME ANTES de montar um caso de promoção ou de falar do ciclo de alguém: o caso pode já ter sido aberto e assinado, e montar de novo o que já foi decidido é responder sobre um produto que não é o que está na tela.',
    '`notaIA` é o que a contagem propunha e `nota` é o que ficou. Quando as duas divergem, houve DISCORDÂNCIA HUMANA: diga isso, com o nome de quem discordou e a evidência que ele trouxe — a nota nova não é uma releitura da IA.',
    'Linha sem `nota` e com saída `nao-sei` fechou SEM LASTRO: a pergunta ficou aberta com dono e prazo. Isso não é o mesmo que sem evidência, e as duas palavras não se trocam.',
    'A régua assinada é a do nível que a pessoa OCUPA. Um caso de promoção é lido contra a régua do nível ALVO — para essa, use `ler_regua` com o nível de cima.',
  ].join('\n'),
  inputSchema: z.object({
    pessoaId: z
      .string()
      .optional()
      .describe('Quando informado, devolve o fechamento dessa pessoa em vez do panorama.'),
  }),
  async execute({ pessoaId }, ctx) {
    const viewer = viewerDaSessao(ctx)
    const registro = registroDaSessao(ctx)
    const ciclo = cicloEmFechamento()

    const base = {
      ciclo: ciclo ? { id: ciclo.id, nome: ciclo.nome, fecha: ciclo.fechamento.fecha } : null,
    }
    if (!ciclo) return { ...base, aberto: false, motivo: 'Nenhum ciclo em janela de fechamento.' }

    const linhasDe = (a: Avaliacao) =>
      a.vereditos.map((v) => {
        const c = comportamentoPorId(v.comportamentoId)
        const esperado = c?.esperado ?? 0
        return {
          comportamento: c?.rotulo ?? v.comportamentoId,
          texto: c?.texto,
          saida: v.saida,
          notaIA: v.notaIA ?? null,
          nota: v.nota ?? null,
          esperado,
          situacao: v.saida === 'nao-sei' ? 'sem-lastro' : situacaoDe(v.nota, esperado),
        }
      })

    if (pessoaId) {
      const auth = podeConsultar(viewer, pessoaId)
      if (!auth.ok) return { negado: true, motivo: auth.motivo }

      const a = avaliacaoDe(registro, CICLO_ATUAL, pessoaId)
      // Em curso só para quem assina. Para os outros, ela ainda não existe.
      const visivel = a?.assinadaEm || (a && ehGestorDe(viewer, pessoaId))
      if (!a || !visivel)
        return { ...base, pessoa: nomeDe(pessoaId), fechado: false, avaliacao: null }

      return {
        ...base,
        pessoa: nomeDe(pessoaId),
        fechado: Boolean(a.assinadaEm),
        avaliacao: {
          reguaJulgada: { trilha: a.trilha, nivel: a.nivel },
          por: nomeDe(a.por),
          assinadaEm: a.assinadaEm ?? null,
          decisao: a.decisao ?? null,
          linhas: linhasDe(a),
          leitura: lerAvaliacao(a),
        },
      }
    }

    const visiveis = pessoasVisiveis(viewer)
    const doCiclo = avaliacoesDoCiclo(registro, CICLO_ATUAL).filter(
      (a) => a.assinadaEm && visiveis.some((p) => p.id === a.pessoaId),
    )

    return {
      ...base,
      fechadas: doCiclo.length,
      pessoas: doCiclo.map((a) => ({
        pessoa: nomeDe(a.pessoaId),
        pessoaId: a.pessoaId,
        por: nomeDe(a.por),
        assinadaEm: a.assinadaEm,
        decisao: a.decisao ?? null,
        leitura: lerAvaliacao(a),
      })),
    }
  },
})
