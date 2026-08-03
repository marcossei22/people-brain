import type { Avaliacao, Ciclo } from './tipos'
import { HOJE, JANELA } from './tipos'

/**
 * Os ciclos da Aurora, e as avaliações que já estavam fechadas quando a demo
 * começa.
 *
 * O CICLO É SEMENTE. Ele é fato do calendário da empresa: o semestre acabou em
 * 31 de julho e a janela de fechamento está de pé desde o dia seguinte, tenha
 * alguém aberto o produto ou não. Um ciclo que nascesse na sessão faria o
 * produto abrir sem ciclo nenhum até que um humano o criasse — e criar ciclo,
 * convocar, cobrar e consolidar é exatamente a operação de seis semanas que
 * esta tese diz ter matado.
 *
 * AS AVALIAÇÕES DA MARINA SÃO DA SESSÃO, e não estão aqui. Elas são o gesto
 * humano acontecendo na frente da câmera; congeladas na semente, a tela de
 * fechamento abriria já fechada e o produto demonstraria o contrário do que
 * promete. Quem escreve é `lib/registro.tsx`, e o que ela assina existe no
 * mesmo instante para o dossiê da pessoa e para o painel do ciclo.
 *
 * O QUE ESTÁ AQUI são as avaliações de OUTRO gestor — o Paulo, do time de
 * Plataforma. Existem por duas razões, e nenhuma é encher tela:
 *
 *   1. Sem nenhuma avaliação fechada, o painel do ciclo abre dizendo que
 *      ninguém na organização fechou nada, e os sinais de qualidade que o RH lê
 *      (A4) não têm sobre o que ser calculados.
 *   2. Elas são o próprio sinal. O Paulo fecha cinco comportamentos do Thiago
 *      concordando com todos, quatro deles sem evidência nenhuma, sem abrir uma
 *      pergunta e no mesmo dia em que a janela abriu. Taxa de discordância
 *      zero não é gestor que concorda: é gestor que não leu. O achado de
 *      organização sobre a cobertura dele deixa de depender de ausência de
 *      feedback e passa a ter um segundo lastro, este com data e assinatura.
 *
 * As notas congeladas aqui são as que `pontuar()` devolve hoje sobre o mesmo
 * registro — e é assim que tem que ser lido: elas foram copiadas no momento da
 * assinatura e NÃO se movem depois. Se alguém reconhecer um episódio do Thiago
 * amanhã, a régua do dossiê dele sobe e esta avaliação continua dizendo o que
 * dizia, porque é o que o Paulo assinou.
 */

/** O ciclo que a demo abre. Hoje é o primeiro dia da janela de fechamento. */
export const CICLO_ATUAL = 'ciclo-2026-1'

export const ciclos: Ciclo[] = [
  {
    id: CICLO_ATUAL,
    nome: '1º semestre de 2026',
    inicio: JANELA.inicio,
    fim: JANELA.fim,
    /* Quinze dias, e o número aparece na tela ("o ciclo do seu time fecha em
     * 15 dias"). Duas semanas é o que resta de um ritual que era de seis:
     * o prazo não encolheu porque a empresa ficou apressada, encolheu porque o
     * trabalho de reconstruir seis meses de memória saiu de dentro dele. */
    fechamento: { abre: HOJE, fecha: '2026-08-16' },
    status: 'em-fechamento',
  },
]

export const cicloPorId = (id: string) => ciclos.find((c) => c.id === id)

/** O ciclo em janela de fechamento, se houver. É o que as telas perguntam —
 *  nenhuma delas escolhe ciclo, porque só existe um aberto por vez. */
export const cicloEmFechamento = (): Ciclo | undefined =>
  ciclos.find((c) => c.status === 'em-fechamento')

export const avaliacoes: Avaliacao[] = [
  {
    id: 'av-paulo-thiago',
    cicloId: CICLO_ATUAL,
    pessoaId: 'thiago',
    trilha: 'eng',
    nivel: 'senior',
    por: 'paulo',
    // Cinco "concordo" no mesmo dia, quatro deles sobre comportamentos que o
    // registro não alcançou. Nenhuma pergunta aberta. É o fechamento de vinte
    // minutos usado como fechamento de dois — e o produto registra a diferença
    // em vez de escondê-la.
    vereditos: [
      { comportamentoId: 'eng-senior-ambiguidade', saida: 'concordo', em: HOJE },
      { comportamentoId: 'eng-senior-influencia', saida: 'concordo', em: HOJE },
      { comportamentoId: 'eng-senior-desbloqueio', saida: 'concordo', em: HOJE },
      { comportamentoId: 'eng-senior-risco', saida: 'concordo', em: HOJE },
      { comportamentoId: 'eng-senior-mentoria', saida: 'concordo', notaIA: 2, nota: 2, em: HOJE },
    ],
    decisao: 'manter',
    assinadaEm: HOJE,
  },
  {
    id: 'av-paulo-juliana',
    cicloId: CICLO_ATUAL,
    pessoaId: 'juliana',
    trilha: 'eng',
    nivel: 'pleno',
    por: 'paulo',
    vereditos: [
      { comportamentoId: 'eng-pleno-entrega', saida: 'concordo', em: HOJE },
      { comportamentoId: 'eng-pleno-qualidade', saida: 'concordo', notaIA: 2, nota: 2, em: HOJE },
      { comportamentoId: 'eng-pleno-colaboracao', saida: 'concordo', em: HOJE },
      { comportamentoId: 'eng-pleno-comunicacao', saida: 'concordo', em: HOJE },
    ],
    decisao: 'manter',
    assinadaEm: HOJE,
  },
]

export const NOME_DECISAO: Record<Avaliacao['decisao'] & string, string> = {
  manter: 'Manter no nível',
  'abrir-promocao': 'Abrir caso de promoção',
  'pronta-sem-vaga': 'Pronta, sem vaga',
}

/**
 * O que cada decisão quer dizer, na tela em que ela é tomada.
 *
 * Fica junto do nome porque o gestor decide uma vez por semestre e não decora
 * o vocabulário do produto entre uma vez e outra. "Pronta, sem vaga" sem a
 * frase ao lado lê como recusa; com ela, lê como o que é — um registro de
 * prontidão que sobrevive ao orçamento deste ano.
 *
 * Sem pronome: as três frases aparecem na tela de fechamento de QUALQUER
 * pessoa, e "ela está pronta" saía escrito no fechamento do Rafael e do Bruno.
 */
export const EXPLICACAO_DECISAO: Record<Avaliacao['decisao'] & string, string> = {
  manter: 'O nível continua sendo o certo para o trabalho deste período.',
  'abrir-promocao': 'Vai para o comitê com a evidência do período anexada.',
  'pronta-sem-vaga': 'A prontidão fica registrada, e o caso espera orçamento ou vaga.',
}
