/**
 * A leitura do registro DEPOIS do que a sessão escreveu — uma só, para as duas
 * pontas.
 *
 * `lib/registro.tsx` guarda o delta e as ações; aqui ficam as funções puras que
 * mesclam esse delta com a semente de `data/`. Elas vivem separadas do provider
 * por um motivo que não é organização de arquivo: as tools do agente rodam no
 * runtime do eve, sem React, e precisam da MESMA mesclagem. Enquanto elas liam
 * `lib/memoria.ts` direto, o chat respondia sobre a Carla da semente enquanto o
 * dossiê atrás do painel mostrava a Carla de agora — 14 eventos contra 15, régua
 * 4 contra 5, lacuna aberta contra lacuna respondida, na mesma gravação. É a
 * divergência que o cabeçalho de `lib/metricas.ts` diz que aquele arquivo existe
 * para impedir, e ela tinha voltado por baixo, pelo agente.
 *
 * `lib/memoria.ts` continua puro sobre a semente e não some: quem só lê (o
 * índice de diretrizes, o validador, os componentes de doutrina) não tem sessão
 * nenhuma para mesclar. Quem escreve, ou lê o que alguém escreveu, entra por
 * aqui.
 *
 * Nada aqui usa `Date.now()` nem `Math.random()`, pela mesma razão do provider:
 * a mesma sessão tem que produzir a mesma resposta na primeira e na décima
 * tomada.
 */

import { avaliacoes as avaliacoesNaSemente } from '@/data/ciclos'
import { episodioPorId } from '@/data/episodios'
import { eventoPorId as eventoNaSemente } from '@/data/eventos'
import { lacunas, lacunasDe as lacunasNaSemente } from '@/data/lacunas'
import { pendenciasDe as pendenciasNaSemente } from '@/data/pendencias'
import type { Pendencia } from '@/data/pendencias'
import type {
  AchadoOrg,
  Avaliacao,
  CicloId,
  Episodio,
  EpisodioId,
  Evento,
  EventoId,
  Feedback,
  Lacuna,
  LacunaId,
  Lastro,
  PessoaId,
} from '@/data/tipos'
import {
  diasDesde,
  episodiosDe,
  eventosDe as eventosNaSemente,
  feedbacksDe as feedbacksNaSemente,
} from '@/lib/memoria'

/** Uma lacuna fechada nesta sessão. Mesmo formato de `Lacuna['resposta']`,
 *  porque o leitor injeta isto ali dentro sem conversão. */
export interface Resposta {
  texto: string
  por: PessoaId
  em: string
}

export interface Contestacao {
  motivo: string
  por: PessoaId
  em: string
}

/**
 * O que a sessão acrescentou ao registro — e o que viaja até o agente.
 *
 * São exatamente os campos que alguma tool lê. A caixa de pendências (`Sessao`)
 * fica de fora do que vai pelo fio porque nenhuma tool a consulta, e cabeçalho
 * HTTP tem teto de tamanho: mandar o que ninguém lê é gastar esse teto com o
 * título de uma pendência.
 *
 * `lastros` e `avaliacoes` entram porque a régua que o chat lê tem que ser a
 * mesma que a tela mostra. Sem o lastro no fio, a gestora discordava na tela de
 * fechamento, a nota subia ali, e o chat aberto ao lado continuava respondendo
 * 4 sobre o mesmo comportamento — a divergência que o cabeçalho deste arquivo
 * existe para impedir, de volta pela porta do fechamento.
 */
export interface Registro {
  eventos: Evento[]
  feedbacks: Feedback[]
  /** Lacunas abertas NESTA sessão — o pedido de relato a um par, e o "não sei"
   *  do fechamento. */
  lacunas: Lacuna[]
  respostas: Record<LacunaId, Resposta>
  contestacoes: Record<EventoId, Contestacao>
  /** As ligações episódio → comportamento declaradas ao discordar da nota. */
  lastros: Lastro[]
  /** Os fechamentos escritos nesta sessão, assinados ou em curso. */
  avaliacoes: Avaliacao[]
}

/** O registro mais o que só as telas leem: a caixa da semana e as linhas de
 *  ciclo contestadas. */
export interface Sessao extends Registro {
  pendenciasExtras: Pendencia[]
  resolvidas: string[]
  /** Linhas do ciclo fechado que a pessoa contestou, por `chaveDaLinha`.
   *
   *  Separado de `contestacoes` porque o alvo é outro: lá é um EVENTO do
   *  registro, aqui é a NOTA assinada num comportamento. Enquanto só existia o
   *  primeiro, C5 só oferecia "contestar" na linha em que o gestor tinha
   *  discordado — a única com evento por trás —, e uma nota que a pessoa achasse
   *  errada não tinha por onde ser contestada em lugar nenhum do produto.
   *  JORNADAS C5: "Pode contestar qualquer linha." */
  contestacoesDeLinha: Record<string, Contestacao>
}

export const SESSAO_VAZIA: Sessao = {
  eventos: [],
  feedbacks: [],
  lacunas: [],
  respostas: {},
  contestacoes: {},
  lastros: [],
  avaliacoes: [],
  pendenciasExtras: [],
  resolvidas: [],
  contestacoesDeLinha: {},
}

const REGISTRO_VAZIO: Registro = {
  eventos: [],
  feedbacks: [],
  lacunas: [],
  respostas: {},
  contestacoes: {},
  lastros: [],
  avaliacoes: [],
}

/* ─────────────────────────────────────────────────────────────────────────
   Leitura — semente + sessão, na ordem de sempre.
   ───────────────────────────────────────────────────────────────────────── */

/* Mais recente primeiro, como `lib/memoria.ts`. Os eventos da sessão entram
 * antes dos da semente na concatenação, e não depois: o `sort` de JS é estável,
 * então em empate de data — que é o caso, todos nascem em `JANELA.fim` — a
 * evidência recém-criada fica no topo do próprio dia em vez de aparecer atrás de
 * registros antigos. A ordenação continua sendo a mesma; o que se decide aqui é
 * só o desempate. */
export const eventosDe = (r: Registro, pessoaId: PessoaId): Evento[] =>
  [...r.eventos.filter((e) => e.pessoaId === pessoaId), ...eventosNaSemente(pessoaId)].sort(
    (a, b) => b.data.localeCompare(a.data),
  )

export const eventoPorId = (r: Registro, id: EventoId): Evento | undefined =>
  r.eventos.find((e) => e.id === id) ?? eventoNaSemente(id)

export const feedbacksDe = (r: Registro, pessoaId: PessoaId): Feedback[] =>
  [...r.feedbacks.filter((f) => f.paraPessoaId === pessoaId), ...feedbacksNaSemente(pessoaId)].sort(
    (a, b) => b.data.localeCompare(a.data),
  )

/* A lacuna respondida na sessão passa a se comportar como respondida em
 * qualquer tela — inclusive a de quem não respondeu. `enviada` fica como estava
 * de propósito: a pergunta foi respondida na caixa de pendências, e carimbar
 * "enviada no Slack" seria inventar uma mensagem que não existiu. */
export const lacunasDe = (r: Registro, pessoaId: PessoaId): Lacuna[] =>
  [...lacunasNaSemente(pessoaId), ...r.lacunas.filter((l) => l.pessoaId === pessoaId)].map((l) => {
    const resposta = r.respostas[l.id]
    return resposta ? { ...l, status: 'respondida' as const, resposta } : l
  })

export const lacunaPorId = (r: Registro, id: LacunaId): Lacuna | undefined => {
  const lacuna = lacunas.find((l) => l.id === id) ?? r.lacunas.find((l) => l.id === id)
  if (!lacuna) return undefined
  const resposta = r.respostas[id]
  return resposta ? { ...lacuna, status: 'respondida', resposta } : lacuna
}

/** A estrela da semente ganha da sessão: episódio já reconhecido não é
 *  reconhecido de novo, e `reconhecer` já recusa esse caso. */
export function estrelaDe(r: Registro, episodioId: EpisodioId): Episodio['estrela'] {
  const naSemente = episodioPorId(episodioId)?.estrela
  if (naSemente) return naSemente
  const fb = r.feedbacks.find((f) => f.tipo === 'reconhecimento' && f.episodioId === episodioId)
  return fb ? { por: fb.porPessoaId, em: fb.data, nota: fb.texto } : undefined
}

/* Os episódios que ganharam estrela NESTA SESSÃO, e só eles. É o que
 * `pontuar()` precisa receber para que reconhecer mova a régua — e é por isso
 * que não devolve as estrelas da semente junto: aquelas o cálculo já enxerga
 * sozinho, e mandá-las de novo não mudaria nada, mas mandar reconhecimentos
 * antigos que nunca viraram estrela mudaria os números de quem não fez nada. */
export const estreladosDe = (r: Registro, pessoaId: PessoaId): EpisodioId[] =>
  r.feedbacks
    .filter((f) => f.tipo === 'reconhecimento' && f.paraPessoaId === pessoaId && f.episodioId)
    .map((f) => f.episodioId!)

export const contestacaoDe = (r: Registro, eventoId: EventoId): Contestacao | undefined =>
  r.contestacoes[eventoId]

/** A chave de uma linha do ciclo. Ciclo e pessoa entram junto do comportamento
 *  porque o mesmo comportamento é julgado de novo no semestre seguinte, e a
 *  contestação é daquela assinatura. */
export const chaveDaLinha = (cicloId: CicloId, pessoaId: PessoaId, comportamentoId: string) =>
  `${cicloId}:${pessoaId}:${comportamentoId}`

export const contestacaoDeLinha = (
  s: Sessao,
  cicloId: CicloId,
  pessoaId: PessoaId,
  comportamentoId: string,
): Contestacao | undefined => s.contestacoesDeLinha[chaveDaLinha(cicloId, pessoaId, comportamentoId)]

/* Semente na ordem do arquivo, depois o que chegou nesta sessão — e sem o que
 * já foi tratado. Item novo entra no fim porque a caixa é a semana de quem
 * abre, não uma timeline: reordenar os três itens de sempre porque um quarto
 * chegou é mudar a tela por baixo de quem está lendo.
 *
 * "Tratado" não é só "tratado AQUI". O item pede uma coisa do mundo — que a
 * lacuna tenha resposta, que o episódio tenha reconhecimento — e o botão da
 * caixa é um dos caminhos até ela, não o único: reconhecer pelo dossiê resolve
 * o pedido tão bem quanto clicar em "Rascunhar". Sem esta segunda condição a
 * caixa continuava dizendo "e ninguém comentou" sobre um episódio que a própria
 * pessoa acabou de reconhecer na tela ao lado — e o botão dali seria um clique
 * que não escreve nada, porque `reconhecer` recusa o segundo reconhecimento.
 *
 * Só entram condições que casam por IDENTIDADE (`episodioId`, `lacunaId`). O
 * item de feedback devido fica de fora de propósito: "sem retorno há 4 meses"
 * não tem chave, e adivinhar por par (de, sobre) apagaria a contestação que
 * chega depois — que é outra pendência, sobre a mesma pessoa. */
export const pendenciasDe = (s: Sessao, pessoaId: PessoaId): Pendencia[] =>
  [...pendenciasNaSemente(pessoaId), ...s.pendenciasExtras.filter((p) => p.de === pessoaId)].filter(
    (p) => !s.resolvidas.includes(p.id) && !jaAtendida(s, p),
  )

/** O que o item pedia já existe no registro, tendo sido feito onde for. */
function jaAtendida(s: Sessao, p: Pendencia): boolean {
  if (p.tipo === 'reconhecimento' && p.episodioId) return Boolean(estrelaDe(s, p.episodioId))
  if (p.tipo === 'pergunta' && p.lacunaId) return Boolean(s.respostas[p.lacunaId])
  return false
}

/* ─────────────────────────────────────────────────────────────────────────
   O ciclo — JORNADAS G5 e G6.
   ───────────────────────────────────────────────────────────────────────── */

/** Os lastros de uma pessoa. É o que `pontuar()` precisa receber para que
 *  discordar mova a nota — o par exato de `estreladosDe`, do outro gesto. */
export const lastrosDe = (r: Registro, pessoaId: PessoaId): Lastro[] =>
  r.lastros.filter((l) => l.pessoaId === pessoaId)

/* A avaliação da SESSÃO ganha da semente: a semente só tem fechamentos de
 * outros gestores, e se alguma vez as duas colidirem sobre a mesma pessoa, o
 * que vale é o que acabou de ser assinado nesta tela. */
export const avaliacaoDe = (
  r: Registro,
  cicloId: CicloId,
  pessoaId: PessoaId,
): Avaliacao | undefined =>
  r.avaliacoes.find((a) => a.cicloId === cicloId && a.pessoaId === pessoaId) ??
  avaliacoesNaSemente.find((a) => a.cicloId === cicloId && a.pessoaId === pessoaId)

/**
 * O histórico de fechamentos de uma pessoa — o marco de G6.
 *
 * Só as ASSINADAS. Uma avaliação em curso não é marco na linha do tempo dela:
 * é uma decisão que o gestor ainda está tomando, e ela dura o tempo de uma
 * sessão (JORNADAS §0, regra 4). Mostrá-la no dossiê antes da assinatura
 * publicaria uma decisão que não foi tomada — que é o oposto do problema que a
 * regra resolve, e igualmente errado.
 */
export const avaliacoesDe = (r: Registro, pessoaId: PessoaId): Avaliacao[] =>
  [...r.avaliacoes, ...avaliacoesNaSemente]
    .filter((a) => a.pessoaId === pessoaId && a.assinadaEm)
    .sort((a, b) => (b.assinadaEm ?? '').localeCompare(a.assinadaEm ?? ''))

/** Todas as avaliações de um ciclo, para o painel que conta quem fechou. */
export const avaliacoesDoCiclo = (r: Registro, cicloId: CicloId): Avaliacao[] => [
  ...r.avaliacoes.filter((a) => a.cicloId === cicloId),
  ...avaliacoesNaSemente.filter(
    (a) => a.cicloId === cicloId && !r.avaliacoes.some((x) => x.pessoaId === a.pessoaId),
  ),
]

/* ─────────────────────────────────────────────────────────────────────────
   Contagens — as mesmas de `lib/memoria.ts`, sobre o registro mesclado.
   ───────────────────────────────────────────────────────────────────────── */

export const ultimoRegistro = (r: Registro, pessoaId: PessoaId): string | undefined =>
  eventosDe(r, pessoaId)[0]?.data

export const ultimoFeedback = (r: Registro, pessoaId: PessoaId): string | undefined =>
  feedbacksDe(r, pessoaId)[0]?.data

/** Meses desde o último feedback, arredondados como uma pessoa arredondaria.
 *  Mesma conta de `lib/memoria.ts`, um nível acima: sem isto, uma conversa
 *  agendada agora deixava o Bruno em "4 meses sem retorno" no chat e em "2 no
 *  semestre" no dossiê. */
export function mesesSemFeedback(r: Registro, pessoaId: PessoaId): number | undefined {
  const dias = diasDesde(ultimoFeedback(r, pessoaId))
  return dias === undefined ? undefined : Math.round(dias / 30.44)
}

/** Contagem por pessoa — o que `/org` e `buscar_pessoas` mostram. */
export function resumoDe(r: Registro, pessoaId: PessoaId) {
  const eps = episodiosDe(pessoaId)
  const lacunas = lacunasDe(r, pessoaId)
  return {
    eventos: eventosDe(r, pessoaId).length,
    episodios: eps.length,
    estrelas: eps.filter((e) => Boolean(estrelaDe(r, e.id))).length,
    lacunasAbertas: lacunas.filter((l) => l.status === 'aberta').length,
    ultimo: ultimoRegistro(r, pessoaId),
    feedbacks: feedbacksDe(r, pessoaId).length,
    ultimoFeedback: ultimoFeedback(r, pessoaId),
    mesesSemFeedback: mesesSemFeedback(r, pessoaId),
  }
}

/** Os episódios de uma pessoa com a estrela desta sessão já aplicada. */
export const episodiosComEstrela = (r: Registro, pessoaId: PessoaId): Episodio[] =>
  episodiosDe(pessoaId).map((ep) => {
    const estrela = estrelaDe(r, ep.id)
    return estrela === ep.estrela ? ep : { ...ep, estrela }
  })

/**
 * Um achado de organização contra as perguntas de que ele depende.
 *
 * "Dois casos de promoção dependem de evidência que o registro não captura" é
 * uma afirmação com prazo de validade: ela vale enquanto as lacunas estiverem
 * abertas. Sem esta função, `/org` pedia a pergunta no bloco de cima e mostrava
 * a resposta no chip de baixo, na mesma tela.
 *
 * `superado` só é verdadeiro quando o achado declarava lacunas E todas foram
 * respondidas. Achado sem lacuna declarada não é um achado resolvido: é um
 * achado que não depende de pergunta nenhuma.
 */
export function estadoDoAchado(r: Registro, achado: AchadoOrg) {
  const ligadas = (achado.evidencia.lacunaIds ?? [])
    .map((id) => lacunaPorId(r, id))
    .filter((l): l is Lacuna => Boolean(l))
  const respondidas = ligadas.filter((l) => l.status === 'respondida')
  return {
    lacunas: ligadas,
    respondidas,
    abertas: ligadas.filter((l) => l.status !== 'respondida'),
    superado: ligadas.length > 0 && respondidas.length === ligadas.length,
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   O fio até o agente.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * O cabeçalho que carrega o delta da sessão até as tools.
 *
 * Vai pelo mesmo caminho da persona (`agent/channels/eve.ts`): o canal resolve
 * os dois ANTES de o modelo entrar no turno, e nenhum deles passa pelo prompt. O
 * `clientContext` do eve seria mais fácil e está errado pelo mesmo motivo da
 * decisão #35 — ele injeta uma mensagem de usuário, e uma contagem que o modelo
 * pode ignorar ou reinterpretar é exatamente a contagem em prosa que
 * `lib/metricas.ts` existe para não ser.
 */
export const HEADER_REGISTRO = 'x-people-brain-registro'

/** JSON com escape de URI: cabeçalho HTTP não carrega acento, e o registro é
 *  todo em português. */
export function serializar(r: Registro): string {
  const enxuto: Registro = {
    eventos: r.eventos,
    feedbacks: r.feedbacks,
    lacunas: r.lacunas,
    respostas: r.respostas,
    contestacoes: r.contestacoes,
    lastros: r.lastros,
    avaliacoes: r.avaliacoes,
  }
  return encodeURIComponent(JSON.stringify(enxuto))
}

/**
 * O que chegou pelo cabeçalho, de volta em `Registro`.
 *
 * Payload inválido vira registro vazio em vez de exceção: o pior caso aceitável
 * é o agente responder pela semente, como fazia antes: o pior caso inaceitável é
 * o chat inteiro devolver erro porque alguém mexeu num header.
 */
export function desserializar(bruto: string | null | undefined): Registro {
  if (!bruto) return REGISTRO_VAZIO
  try {
    const cru = JSON.parse(decodeURIComponent(bruto)) as Partial<Registro>
    return {
      eventos: Array.isArray(cru.eventos) ? cru.eventos : [],
      feedbacks: Array.isArray(cru.feedbacks) ? cru.feedbacks : [],
      lacunas: Array.isArray(cru.lacunas) ? cru.lacunas : [],
      respostas: cru.respostas ?? {},
      contestacoes: cru.contestacoes ?? {},
      lastros: Array.isArray(cru.lastros) ? cru.lastros : [],
      avaliacoes: Array.isArray(cru.avaliacoes) ? cru.avaliacoes : [],
    }
  } catch {
    return REGISTRO_VAZIO
  }
}
