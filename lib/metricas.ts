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
import type { EpisodioId, Evento, Lastro, Nivel, PessoaId, TemaId } from '@/data/tipos'
import { pessoa } from '@/lib/memoria'

/**
 * O que a SESSÃO acrescentou ao registro estático.
 *
 * Toda função daqui aceita esta lista por último, sempre opcional e sempre com
 * default no registro estático. É o que permite `lib/registro.tsx` passar a
 * evidência criada agora sem que nada que não passe nada mude de número — as
 * telas que não escrevem continuam chamando com um argumento só.
 *
 * A lista de estrelas vem separada dos eventos porque a estrela não é
 * evidência nova: ela é um humano marcando um episódio que já existia.
 */
type Estrelados = readonly EpisodioId[]

/**
 * As ligações episódio → comportamento que um humano declarou no fechamento.
 *
 * Entram pela mesma porta dos episódios do tema, e não por uma segunda: o que
 * `Tema.comportamentosRegua` faz por inferência do Brain, o lastro faz por
 * declaração de gente. A conta continua sendo uma só — é isso que sustenta a
 * promessa de que a nota se move por evidência nova e nunca por um clique.
 */
type Lastros = readonly Lastro[]

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
 *
 * Só conta dentro da janela, e é por isso que evidência criada na sessão é
 * datada em `JANELA.fim`: datada fora, ela apareceria na lista de eventos e
 * sumiria do gráfico logo acima dela, na mesma tela.
 */
export function evidenciaPorMes(pessoaId: PessoaId, lista: readonly Evento[] = eventos): Ponto[] {
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

  for (const e of lista) {
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
 *
 * `proprio` é fatia separada pelo mesmo motivo, do outro lado do balcão: é o
 * que a pessoa acrescentou sobre si. Somada em "Pergunta", ela viraria mérito
 * do Brain — e o mérito é dela.
 */
const ORIGEM: Record<Evento['fonte']['tipo'], string> = {
  slack: 'Slack',
  github: 'GitHub',
  doc: 'Documento',
  crm: 'CRM',
  humano: 'Pergunta',
  proprio: 'A própria pessoa',
}

const NOTA_DA_ORIGEM: Record<string, string | undefined> = {
  Pergunta: 'evidência que não foi observada — foi perguntada',
  'A própria pessoa': 'contexto que só ela tinha, adicionado por ela',
}

export function origemDaEvidencia(
  pessoaId: PessoaId,
  lista: readonly Evento[] = eventos,
): Ponto[] {
  const contagem = new Map<string, number>()
  for (const e of lista) {
    if (e.pessoaId !== pessoaId) continue
    const rotulo = ORIGEM[e.fonte.tipo]
    contagem.set(rotulo, (contagem.get(rotulo) ?? 0) + 1)
  }

  return [...contagem]
    .map(([rotulo, valor]) => ({ rotulo, valor, nota: NOTA_DA_ORIGEM[rotulo] }))
    .sort((a, b) => b.valor - a.valor)
}

export type Situacao = 'sustentado' | 'parcial' | 'sem-evidencia'

const ORDEM: Record<Nivel, number> = { pleno: 1, senior: 2, staff: 3 }

/** As quatro parcelas da nota, na ordem em que a regra é publicada. */
export type ParcelaId = 'episodios' | 'padrao' | 'reconhecimento' | 'acima-do-nivel'

/**
 * Uma parcela da nota, com o que a produziu.
 *
 * As parcelas saíam de `pontuar()` somadas e a conta era jogada fora — só o
 * total chegava na tela e na tool. Quando a gestora perguntava "por que 4 e não
 * 5?", o modelo tinha que reconstruir a resposta a partir de outras leituras,
 * ou narrar mecanismo, que `agent/instructions.md` proíbe. Devolvendo cada
 * parcela com os episódios que a produziram, a resposta deixa de ser
 * reconstrução: **cada parcela abre na evidência**, que é o que G5 promete.
 *
 * A parcela de valor ZERO vem junto, e é ela que responde a pergunta: 4 e não 5
 * porque nenhum episódio foi reconhecido. Devolver só as que somaram deixaria a
 * tela explicando o número pelo que ele TEM, quando a dúvida é sempre sobre o
 * que falta.
 */
export interface Parcela {
  id: ParcelaId
  valor: number
  /** O que ela conta, em uma frase — a regra publicada, não o mecanismo. */
  motivo: string
  /** Onde ela abre. Sempre episódio, inclusive nas duas parcelas que passam
   *  antes por uma leitura do Brain (o tema, a marca de nível): são uma parada
   *  a mais até a fonte, não uma afirmação sem fonte. */
  episodioIds: EpisodioId[]
  /** O tema que firmou o padrão — só na parcela `padrao`. */
  temaId?: TemaId
}

export interface Pontuacao {
  /** Onde a pessoa está, 1–5. Ausente quando não há episódio nenhum. */
  nivel?: number
  episodios: number
  /** Os episódios distintos que sustentam o comportamento. */
  episodioIds: EpisodioId[]
  parcelas: Parcela[]
  /** A soma antes do teto de 5. Diverge de `nivel` só quando o teto morde, e a
   *  diferença é dita na tela — "5, e a soma daria 6" é honesto; esconder o
   *  teto faria as parcelas não fecharem com o número ao lado delas. */
  soma: number
}

/* Zero episódio devolve isto: `nivel` ausente, e não 1. A distinção é o produto
 * inteiro — nota 1 afirma que a pessoa é fraca naquilo, sem evidência afirma
 * que o registro não alcançou, e as duas levam a ações opostas. Sem parcela
 * nenhuma junto, porque não há conta que tenha acontecido. */
const SEM_EVIDENCIA: Pontuacao = {
  episodios: 0,
  episodioIds: [],
  parcelas: [],
  soma: 0,
}

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
 *
 * `estrelados` são os episódios que ganharam estrela NESTA SESSÃO. Contam
 * exatamente como as do registro, na mesma parcela: se a Marina reconhece um
 * episódio e a régua não se mexe, o produto acabou de dizer que reconhecer não
 * muda nada. Vazio por default — sem ação de usuário, os números são os de
 * sempre.
 *
 * `lastros` são as ligações episódio → comportamento que um humano declarou ao
 * discordar da nota no fechamento (G5). Entram na PRIMEIRA parcela, junto dos
 * episódios do tema, e não numa quinta parcela própria: a promessa é que a
 * resposta do gestor seja somada "como a conta somaria qualquer episódio", e
 * uma parcela de contexto seria alguém movendo o número à mão.
 *
 * O retorno traz as quatro parcelas com os episódios de cada uma, inclusive as
 * de valor zero. É o que permite responder "por que 4 e não 5" sem reconstruir
 * a conta a partir de outras leituras — ver `Parcela`.
 */
export function pontuar(
  pessoaId: PessoaId,
  comportamentoId: string,
  estrelados: Estrelados = [],
  lastros: Lastros = [],
): Pontuacao {
  const eps = new Set<EpisodioId>()
  const doTema = new Set<EpisodioId>()
  let temaFirme: TemaId | undefined

  for (const t of temas) {
    if (t.pessoaId !== pessoaId) continue
    if (!t.comportamentosRegua.includes(comportamentoId)) continue
    if (t.confianca === 'alta' && !temaFirme) temaFirme = t.id
    for (const id of t.episodioIds) {
      eps.add(id)
      doTema.add(id)
    }
  }

  /* O que o gestor declarou vale como o que o Brain inferiu, e por isso entra
   * no mesmo Set: um episódio que já contava não conta duas vezes só porque
   * alguém o citou de novo. É o mesmo motivo pelo qual o Set existe entre dois
   * temas que apontam para o mesmo comportamento. */
  for (const l of lastros) {
    if (l.pessoaId !== pessoaId || l.comportamentoId !== comportamentoId) continue
    eps.add(l.episodioId)
  }

  if (eps.size === 0) return SEM_EVIDENCIA

  const nivelDela = pessoa(pessoaId)?.nivel
  const sustentam = [...eps]
    .map((id) => episodios.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))

  const reconhecidos = sustentam.filter((ep) => ep.estrela || estrelados.includes(ep.id))
  const acima = sustentam.filter(
    (ep) => ep.nivelObservado && nivelDela && ORDEM[ep.nivelObservado] > ORDEM[nivelDela],
  )

  const episodioIds = sustentam.map((e) => e.id)
  const parcelas: Parcela[] = [
    {
      id: 'episodios',
      valor: Math.min(eps.size, 3),
      motivo:
        eps.size > 3
          ? `${eps.size} episódios distintos sustentam este comportamento — a parcela para em 3.`
          : `${eps.size} ${eps.size === 1 ? 'episódio distinto sustenta' : 'episódios distintos sustentam'} este comportamento.`,
      episodioIds,
    },
    {
      id: 'padrao',
      valor: temaFirme ? 1 : 0,
      motivo: temaFirme
        ? 'O padrão é firme: o tema que liga este comportamento tem confiança alta.'
        : doTema.size === 0
          ? 'Nenhum padrão do registro liga este comportamento — o que sustenta é o que foi declarado no fechamento.'
          : 'O tema que liga este comportamento não tem confiança alta.',
      episodioIds: temaFirme ? [...doTema] : [],
      temaId: temaFirme,
    },
    {
      id: 'reconhecimento',
      valor: reconhecidos.length > 0 ? 1 : 0,
      motivo:
        reconhecidos.length > 0
          ? 'Alguém apontou este trabalho: houve reconhecimento.'
          : 'Nenhum destes episódios foi reconhecido.',
      episodioIds: reconhecidos.map((e) => e.id),
    },
    {
      id: 'acima-do-nivel',
      valor: acima.length > 0 ? 1 : 0,
      // Sem pronome: a parcela é lida no fechamento e no dossiê de qualquer
      // pessoa, e "acima do nível dela" saía escrito na tela do Rafael.
      motivo:
        acima.length > 0
          ? 'O trabalho foi observado acima do nível ocupado.'
          : 'Nenhum destes episódios foi observado acima do nível ocupado.',
      episodioIds: acima.map((e) => e.id),
    },
  ]

  const soma = parcelas.reduce((s, p) => s + p.valor, 0)
  return { nivel: Math.min(5, soma), episodios: eps.size, episodioIds, parcelas, soma }
}

/** Episódios distintos que sustentam um comportamento.
 *
 *  `pontuar()` já monta este conjunto e o jogava fora: a régua do dossiê
 *  precisava abrir na evidência e recontar ali seria a segunda contagem que
 *  este arquivo existe para impedir. Não recebe `estrelados` porque o
 *  reconhecimento não muda QUAIS episódios sustentam — só quanto eles valem. */
export const episodiosQueSustentam = (
  pessoaId: PessoaId,
  comportamentoId: string,
  lastros: Lastros = [],
): EpisodioId[] => pontuar(pessoaId, comportamentoId, [], lastros).episodioIds

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
  /** Quais são eles. É por aqui que a régua abre na evidência sem recontar. */
  episodioIds: EpisodioId[]
  /** As quatro parcelas que produziram a nota, com o que abre cada uma.
   *  Vazio quando não há evidência: não houve conta. */
  parcelas: Parcela[]
  /** A soma antes do teto de 5. */
  soma: number
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
  estrelados: Estrelados = [],
  lastros: Lastros = [],
): ComportamentoCoberto[] | undefined {
  const nivelRegua = lerRegua(trilha, nivel)
  if (!nivelRegua?.comportamentos.length) return undefined

  return nivelRegua.comportamentos.map((c) => {
    const { nivel, episodios, episodioIds, parcelas, soma } = pontuar(
      pessoaId,
      c.id,
      estrelados,
      lastros,
    )
    return {
      id: c.id,
      rotulo: c.rotulo,
      texto: c.texto,
      observavel: c.observavel,
      esperado: c.esperado,
      nivel,
      episodios,
      episodioIds,
      parcelas,
      soma,
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
export function coberturaDaRegua(
  pessoaId: PessoaId,
  estrelados: Estrelados = [],
  lastros: Lastros = [],
): Cobertura | undefined {
  const p = pessoa(pessoaId)
  if (!p?.nivel) return undefined
  return coberturaContra(pessoaId, NIVEL_SEGUINTE[p.nivel] ?? p.nivel, estrelados, lastros)
}

/**
 * A mesma régua, contra o nível que a pessoa OCUPA — JORNADAS G5.
 *
 * É a régua do fechamento, e a diferença com a de cima é a pergunta, não a
 * conta: ali é "o que falta para subir", aqui é "ela sustenta o que já é dela?".
 * A nota de um comportamento é calculada do mesmo jeito contra qualquer nível —
 * o que muda é quais comportamentos entram na lista e quanto cada um pede.
 *
 * Existir como função separada, em vez de um parâmetro em `coberturaDaRegua`,
 * é o que impede a tela de fechamento de passar o nível errado sem que nada
 * reclame: quem chama daqui não escolhe nível nenhum.
 */
export function coberturaDoNivelOcupado(
  pessoaId: PessoaId,
  estrelados: Estrelados = [],
  lastros: Lastros = [],
): Cobertura | undefined {
  const p = pessoa(pessoaId)
  if (!p?.nivel) return undefined
  return coberturaContra(pessoaId, p.nivel, estrelados, lastros)
}

function coberturaContra(
  pessoaId: PessoaId,
  nivel: Nivel,
  estrelados: Estrelados,
  lastros: Lastros,
): Cobertura | undefined {
  const p = pessoa(pessoaId)
  if (!p?.trilha) return undefined

  const cobertos = comportamentosCobertos(pessoaId, p.trilha, nivel, estrelados, lastros)
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
