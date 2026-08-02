/**
 * As séries que os gráficos desenham — ARQUITETURA.md §6.3.
 *
 * Funções puras sobre `data/`, como o resto de `lib/memoria.ts`. É de propósito
 * que nenhuma delas passe por modelo: o dossiê é set-piece de câmera
 * (princípio 2 — determinismo onde tem câmera), então o gráfico dele tem que
 * sair idêntico na primeira e na décima tomada. O agente usa os MESMOS
 * componentes no chat, com números que ele leu das tools; a forma é a mesma,
 * o autor é que muda.
 *
 * A regra de contagem de `cobertura` é a mesma da skill `comparar-com-regua`.
 * Uma só, aqui, porque a alternativa é a tira do dossiê e o card do chat
 * discordarem sobre a mesma Carla na mesma gravação — que foi exatamente o
 * problema que `mesesSemFeedback` já teve que resolver uma vez.
 */

import { episodios } from '@/data/episodios'
import { eventos } from '@/data/eventos'
import { lerRegua, NOME_NIVEL, NOME_TRILHA } from '@/data/regua'
import { temas } from '@/data/temas'
import { JANELA } from '@/data/tipos'
import type { Evento, Nivel, PessoaId } from '@/data/tipos'
import { pessoa } from '@/lib/memoria'

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** O nível seguinte na trilha. Staff é o topo das réguas da Aurora. */
export const NIVEL_SEGUINTE: Record<Nivel, Nivel | undefined> = {
  pleno: 'senior',
  senior: 'staff',
  staff: undefined,
}

export interface Ponto {
  rotulo: string
  valor: number
  nota?: string
}

/**
 * Eventos por mês, dentro da janela do semestre.
 *
 * Inclui o mês de valor zero. Um gráfico que pula os meses vazios conta uma
 * história contínua que não aconteceu — e o buraco é justamente o que o
 * produto precisa mostrar: junho do Bruno é a tese inteira em uma coluna.
 */
export function evidenciaPorMes(pessoaId: PessoaId): Ponto[] {
  const [anoIni, mesIni] = JANELA.inicio.split('-').map(Number)
  const [anoFim, mesFim] = JANELA.fim.split('-').map(Number)

  const contagem = new Map<string, number>()
  let ano = anoIni
  let mes = mesIni
  while (ano < anoFim || (ano === anoFim && mes <= mesFim)) {
    contagem.set(`${ano}-${String(mes).padStart(2, '0')}`, 0)
    if (mes === 12) {
      mes = 1
      ano += 1
    } else {
      mes += 1
    }
  }

  for (const e of eventos) {
    if (e.pessoaId !== pessoaId) continue
    const chave = e.data.slice(0, 7)
    if (contagem.has(chave)) contagem.set(chave, contagem.get(chave)! + 1)
  }

  return [...contagem].map(([chave, valor]) => ({
    rotulo: MESES[Number(chave.slice(5)) - 1],
    valor,
  }))
}

/**
 * De onde a evidência veio.
 *
 * `humano` é uma fatia própria e não some no meio das outras: evidência
 * obtida PERGUNTANDO é o loop de elicitação aparecendo em número (§5.1 dos
 * tipos). Sem essa fatia separada, o produto pareceria um raspador de Slack.
 */
const ORIGEM: Record<Evento['fonte']['tipo'], string> = {
  slack: 'Slack',
  github: 'GitHub',
  doc: 'Documento',
  crm: 'CRM',
  humano: 'Pergunta',
}

export function origemDaEvidencia(pessoaId: PessoaId): Ponto[] {
  const contagem = new Map<string, number>()
  for (const e of eventos) {
    if (e.pessoaId !== pessoaId) continue
    const rotulo = ORIGEM[e.fonte.tipo]
    contagem.set(rotulo, (contagem.get(rotulo) ?? 0) + 1)
  }

  return [...contagem]
    .map(([rotulo, valor]) => ({
      rotulo,
      valor,
      nota: rotulo === 'Pergunta' ? 'evidência que não foi observada — foi perguntada' : undefined,
    }))
    .sort((a, b) => b.valor - a.valor)
}

export type Situacao = 'sustentado' | 'parcial' | 'sem-evidencia'

const ORDEM: Record<Nivel, number> = { pleno: 1, senior: 2, staff: 3 }

/**
 * A nota de uma pessoa numa skill, de 1 a 5 — calculada, nunca escrita.
 *
 * Toda parcela sai do registro, e é por isso que a nota é clicável até a
 * fonte: ela não é uma opinião com número na frente, é uma contagem com
 * regra publicada. Um gestor pode discordar da regra; ele não pode dizer que
 * não sabe de onde o 4 veio.
 *
 *     episódios distintos (teto 3)       quanto do trabalho apareceu
 *     + 1 confiança do tema é alta       quão firme é o padrão
 *     + 1 houve reconhecimento           alguém apontou o trabalho
 *     + 1 nível observado acima do dela  o trabalho foi além do cargo
 *     teto 5
 *
 * As três parcelas de cima são separadas de propósito. Somadas numa só — "teve
 * estrela OU foi acima do nível" —, a Carla saía 5 nas quatro skills que o
 * mesmo tema sustenta, e uma teia com todas as pontas no máximo não é leitura,
 * é decoração. Separar é o que faz `risco` (que tem estrela) sair diferente de
 * `influência` (que não tem), com a mesma evidência de base.
 *
 * **Zero episódio não é nota 1.** Devolve `undefined`, e a tela mostra isso
 * como "sem evidência". A distinção é o produto inteiro: nota 1 afirma que a
 * pessoa é fraca naquilo; sem evidência afirma que o registro não alcançou, e
 * as duas levam a ações opostas — uma vira conversa de desempenho, a outra
 * vira pergunta na semana seguinte.
 *
 * A ligação entre skill e trabalho vem de `Tema.comportamentosRegua`. Dois
 * temas que apontam para o mesmo comportamento pelo mesmo episódio contam uma
 * vez só: o Set existe para o mesmo trabalho não valer duas evidências.
 */
export function pontuar(
  pessoaId: PessoaId,
  comportamentoId: string,
): { nivel?: number; episodios: number } {
  const eps = new Set<string>()
  let alta = false

  for (const t of temas) {
    if (t.pessoaId !== pessoaId) continue
    if (!t.comportamentosRegua.includes(comportamentoId)) continue
    if (t.confianca === 'alta') alta = true
    for (const id of t.episodioIds) eps.add(id)
  }

  if (eps.size === 0) return { episodios: 0 }

  const nivelDela = pessoa(pessoaId)?.nivel
  const sustentam = [...eps].map((id) => episodios.find((e) => e.id === id)).filter(Boolean)

  const reconhecido = sustentam.some((ep) => ep!.estrela)
  const acimaDoNivel = sustentam.some(
    (ep) => ep!.nivelObservado && nivelDela && ORDEM[ep!.nivelObservado] > ORDEM[nivelDela],
  )

  const nivel = Math.min(
    5,
    Math.min(eps.size, 3) + (alta ? 1 : 0) + (reconhecido ? 1 : 0) + (acimaDoNivel ? 1 : 0),
  )
  return { nivel, episodios: eps.size }
}

/** Episódios distintos que sustentam um comportamento. */
export const ocorrencias = (pessoaId: PessoaId, comportamentoId: string): number =>
  pontuar(pessoaId, comportamentoId).episodios

/**
 * A leitura em uma palavra, derivada da mesma nota.
 *
 * Existe porque o `Gap` do chat fala em sustentado/parcial e a teia fala em
 * número: são a mesma coisa dita de dois jeitos, e derivar uma da outra é o
 * que impede os dois blocos da mesma resposta de discordarem.
 */
export function situacaoDe(nivel: number | undefined, esperado: number): Situacao {
  if (nivel === undefined) return 'sem-evidencia'
  return nivel >= esperado ? 'sustentado' : 'parcial'
}

export interface ComportamentoCoberto {
  id: string
  /** Nome curto da skill — vira ponta da teia. */
  rotulo: string
  texto: string
  observavel: string
  /** Quanto o nível pede, de 1 a 5. */
  esperado: number
  /** Onde a pessoa está, de 1 a 5. Ausente quando não há evidência nenhuma. */
  nivel?: number
  /** Episódios distintos que sustentam este comportamento. */
  episodios: number
  situacao: Situacao
}

/**
 * A régua de um nível já pesada contra o registro de uma pessoa.
 *
 * Existe para haver UMA contagem. A regra estava escrita em prosa na skill
 * `comparar-com-regua` ("dois ou mais é sustentado") e o modelo a aplicava de
 * cabeça — que funcionava até a mesma régua aparecer em duas superfícies. Na
 * primeira vez que o dossiê e o chat mostraram a Carla lado a lado, a tira
 * dizia 4 de 5 sustentados e o card dizia 1: os dois contando certo, por
 * critérios diferentes de "quantos episódios". Contagem em prosa é contagem
 * que diverge; agora ela é código, e a skill manda usar o que veio da tool.
 */
export function comportamentosCobertos(
  pessoaId: PessoaId,
  trilha: string,
  nivel: string,
): ComportamentoCoberto[] | undefined {
  const nivelRegua = lerRegua(trilha, nivel)
  if (!nivelRegua?.comportamentos.length) return undefined

  return nivelRegua.comportamentos.map((c) => {
    const { nivel, episodios } = pontuar(pessoaId, c.id)
    return {
      id: c.id,
      rotulo: c.rotulo,
      texto: c.texto,
      observavel: c.observavel,
      esperado: c.esperado,
      nivel,
      episodios,
      situacao: situacaoDe(nivel, c.esperado),
    }
  })
}

export interface Cobertura {
  titulo: string
  nivel: Nivel
  itens: {
    rotulo: string
    texto: string
    esperado: number
    nivel?: number
    situacao: Situacao
  }[]
}

/**
 * A régua de um nível contra o registro de uma pessoa.
 *
 * `nivel` é o **alvo** quando existe um acima — a pergunta que o produto
 * responde é "o que falta para subir", não "ela cumpre o que já é dela".
 * Quem está no topo da trilha é medido contra o próprio nível, que é a única
 * régua que existe para ela.
 */
export function coberturaDaRegua(pessoaId: PessoaId): Cobertura | undefined {
  const p = pessoa(pessoaId)
  if (!p?.trilha || !p.nivel) return undefined

  const nivel = NIVEL_SEGUINTE[p.nivel] ?? p.nivel
  const cobertos = comportamentosCobertos(pessoaId, p.trilha, nivel)
  if (!cobertos) return undefined

  return {
    titulo: `Régua de ${NOME_NIVEL[nivel] ?? nivel} · ${NOME_TRILHA[p.trilha]}`,
    nivel,
    itens: cobertos.map((c) => ({
      rotulo: c.rotulo,
      texto: c.texto,
      esperado: c.esperado,
      nivel: c.nivel,
      situacao: c.situacao,
    })),
  }
}
