/**
 * As contagens do ciclo vistas de cima — JORNADAS A4.
 *
 * Módulo novo ao lado de `lib/metricas.ts`, e não dentro dele, porque o que se
 * conta aqui não é a régua de ninguém: é o PROCESSO. Quantos fecharam, com
 * quanto lastro, quantas linhas passaram sem que fonte nenhuma tivesse
 * alcançado o comportamento. Misturar as duas coisas no mesmo arquivo faria a
 * contagem da régua ganhar um segundo conjunto de funções que a tocam de lado,
 * que é exatamente a divergência que o cabeçalho daquele arquivo existe para
 * impedir.
 *
 * NENHUMA FUNÇÃO DAQUI PRODUZ UM NÚMERO DA PESSOA. As agregações são por
 * gestor, por comportamento da régua e por estado do registro — nunca uma
 * ordenação de gente por quanto ela vale. Onde uma lista de pessoas aparece,
 * ela é a evidência de um sinal do processo (quem está sendo avaliado com
 * registro fino, quem passou o semestre sem retorno) e sai na ordem do arquivo
 * do elenco, que é a única que não afirma nada.
 *
 * Tudo puro e sem React: a mesma leitura serve à tela e, no dia em que o RH
 * perguntar isso no chat, à tool. O que vem da sessão (feedback dado agora,
 * avaliação assinada agora) entra por parâmetro — quem chama é que sabe
 * mesclar, e quem mescla é `lib/sessao.ts`.
 *
 * `Math.random()` e `Date.now()` não aparecem aqui pelo motivo de sempre: o
 * painel é set-piece de gravação. Empate de contagem desempata pela ordem em
 * que o dado apareceu, e `Array.prototype.sort` é estável — a lista sai igual
 * na primeira e na décima tomada.
 */

import { comportamentoPorId } from '@/data/regua'
import { HOJE } from '@/data/tipos'
import type {
  Avaliacao,
  EpisodioId,
  Feedback,
  Lastro,
  Nivel,
  Pessoa,
  PessoaId,
} from '@/data/tipos'
import { comportamentosCobertos, NIVEL_SEGUINTE } from '@/lib/metricas'
import type { Situacao } from '@/lib/metricas'

/** Quem entra no ciclo. Sem trilha e nível não há régua contra a qual fechar —
 *  é a mesma condição de `podeAvaliar`, e é por isso que a Helena não aparece
 *  na própria contagem. */
export const temRegua = (p: Pessoa) => Boolean(p.trilha && p.nivel)

/**
 * Dias daqui até uma data.
 *
 * `diasDesde` de `lib/memoria.ts` conta para trás; a janela de fechamento é a
 * única coisa do produto que conta para a frente.
 */
export function diasAte(iso: string, hoje: string = HOJE): number {
  return Math.max(0, Math.round((Date.parse(iso) - Date.parse(hoje)) / 86_400_000))
}

/** O campo é `media` sem acento porque é chave de dado. Na tela é palavra, e
 *  fica aqui porque as duas telas do ciclo a escrevem — o painel do RH num
 *  rótulo de grupo, o fechamento dentro de uma frase, onde "Densidade media"
 *  sem acento é erro de português e não abreviação de chave. */
export const NOME_DENSIDADE: Record<Pessoa['densidadeEvidencia'], string> = {
  baixa: 'baixa',
  media: 'média',
  alta: 'alta',
}

/* ─────────────────────────────────────────────────────────────────────────
   Andamento — quantos fecharam, quantos faltam, e por quem assina.
   ───────────────────────────────────────────────────────────────────────── */

/** O que uma avaliação assinada diz sobre a QUALIDADE do que foi assinado. */
export interface LeituraDaAvaliacao {
  linhas: number
  discordos: number
  /** Linhas em que o gestor respondeu "não sei": a pergunta ficou aberta e o
   *  comportamento fechou o ciclo sem lastro. */
  semLastro: number
  /** Linhas que fecharam sem evidência nenhuma: a contagem não tinha número
   *  para propor e o gestor também não trouxe episódio. Fora da escala, nunca
   *  o degrau 1. */
  semEvidencia: number
  /** Linhas em que a contagem não alcançou e o gestor completou o registro na
   *  hora, discordando com um episódio citado.
   *
   *  Elas ficavam somadas em `semEvidencia`, e o card do comitê imprimia "4 de
   *  4 sustentados · 1 sem evidência" sobre a MESMA linha: o comitê lia como
   *  fragilidade do caso exatamente onde o registro foi completado. São a
   *  fragilidade da FONTE, não do caso — e é `comportamentosSemFonte` que as
   *  usa nesse sentido, no campo `elicitadas`, para a recalibração de A5. */
  elicitadas: number
}

export function lerAvaliacao(a: Avaliacao): LeituraDaAvaliacao {
  const semFonte = a.vereditos.filter((v) => v.notaIA === undefined)
  return {
    linhas: a.vereditos.length,
    discordos: a.vereditos.filter((v) => v.saida === 'discordo').length,
    semLastro: a.vereditos.filter((v) => v.saida === 'nao-sei').length,
    semEvidencia: semFonte.filter((v) => v.nota === undefined).length,
    elicitadas: semFonte.filter((v) => v.nota !== undefined).length,
  }
}

export interface LinhaDoCiclo {
  pessoa: Pessoa
  /** Só a ASSINADA. Uma avaliação em curso é uma decisão que o gestor ainda
   *  está tomando, e ela dura o tempo de uma sessão (JORNADAS §0, regra 4).
   *  Publicá-la aqui mostraria a um terceiro o que a própria pessoa avaliada
   *  ainda não vê. Enquanto não é assinada, ela conta como "falta". */
  avaliacao?: Avaliacao
  leitura?: LeituraDaAvaliacao
}

export interface GrupoDeGestor {
  /** Ausente = ninguém assina o fechamento destas pessoas. */
  gestorId?: PessoaId
  linhas: LinhaDoCiclo[]
  fechadas: number
}

export interface AndamentoDoCiclo {
  linhas: LinhaDoCiclo[]
  fechadas: number
  faltam: number
  /** Quantas das que faltam não têm gestor direto no registro. É a diferença
   *  entre "o gestor ainda não fechou" e "não existe quem assine". */
  semGestor: number
  /** Linhas de régua assinadas sem evidência nenhuma por trás — o número de
   *  cima do sinal de qualidade. */
  semEvidencia: number
  /** Linhas que a contagem não alcançava e o gestor completou no fechamento.
   *  Ditas à parte porque pedem o oposto: "só sai perguntando" é problema de
   *  fonte, "ninguém sabe" é problema de régua ou de trabalho. */
  elicitadas: number
  grupos: GrupoDeGestor[]
}

/**
 * O ciclo inteiro, agrupado por quem assina.
 *
 * Agrupar por gestor é o que torna "cobrar quem não fechou" uma ação em vez de
 * uma intenção: a unidade de cobrança do RH é o gestor, não a pessoa avaliada.
 * O grupo sem gestor vem por último e existe declarado — duas pessoas que
 * ninguém fecha somem dentro de "faltam 9" e reaparecem como cobrança que não
 * tem destinatário.
 */
export function andamentoDoCiclo(
  pessoas: readonly Pessoa[],
  avaliacoes: readonly Avaliacao[],
): AndamentoDoCiclo {
  const assinadas = avaliacoes.filter((a) => a.assinadaEm)

  const linhas: LinhaDoCiclo[] = pessoas.filter(temRegua).map((pessoa) => {
    const avaliacao = assinadas.find((a) => a.pessoaId === pessoa.id)
    return { pessoa, avaliacao, leitura: avaliacao ? lerAvaliacao(avaliacao) : undefined }
  })

  const grupos: GrupoDeGestor[] = []
  for (const linha of linhas) {
    const gestorId = linha.pessoa.gestorId
    let grupo = grupos.find((g) => g.gestorId === gestorId)
    if (!grupo) {
      grupo = { gestorId, linhas: [], fechadas: 0 }
      grupos.push(grupo)
    }
    grupo.linhas.push(linha)
    if (linha.avaliacao) grupo.fechadas += 1
  }

  const fechadas = linhas.filter((l) => l.avaliacao).length
  return {
    linhas,
    fechadas,
    faltam: linhas.length - fechadas,
    semGestor: linhas.filter((l) => !l.avaliacao && !l.pessoa.gestorId).length,
    semEvidencia: linhas.reduce((s, l) => s + (l.leitura?.semEvidencia ?? 0), 0),
    elicitadas: linhas.reduce((s, l) => s + (l.leitura?.elicitadas ?? 0), 0),
    grupos: [...grupos.filter((g) => g.gestorId), ...grupos.filter((g) => !g.gestorId)],
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   Sinal 1 — como cada gestor leu a régua.
   ───────────────────────────────────────────────────────────────────────── */

export interface LeituraDeGestor {
  gestorId: PessoaId
  pessoaIds: PessoaId[]
  linhas: number
  discordos: number
  semLastro: number
  semEvidencia: number
  elicitadas: number
  /** Fração de 0 a 1. A tela é que decide se mostra porcentagem. */
  taxa: number
}

/**
 * Taxa de discordância por gestor — e por que o denominador é linha, não pessoa.
 *
 * O sinal não é "o gestor discordou de alguém": é quanto da régua ele leu com
 * atenção suficiente para achar que a contagem estava errada. Nove linhas
 * concordadas no mesmo dia, sete delas sobre comportamentos que o registro não
 * alcançou, não é um gestor que concorda — é um fechamento de dois minutos.
 *
 * QUEM NÃO ASSINOU NÃO APARECE. Um gestor sem avaliação fechada sairia com 0 %
 * ao lado de quem fechou tudo concordando, e as duas coisas seriam lidas como a
 * mesma. Quem não fechou é assunto do andamento, não deste sinal.
 *
 * E os dois extremos são sinal, não só o zero: quem reescreve toda linha está
 * dizendo que a régua ou o registro não servem. Nenhum dos dois é conclusão
 * sobre o gestor — os dois são motivo para perguntar.
 */
export function discordanciaPorGestor(avaliacoes: readonly Avaliacao[]): LeituraDeGestor[] {
  const porGestor = new Map<PessoaId, LeituraDeGestor>()

  for (const a of avaliacoes) {
    if (!a.assinadaEm) continue
    const atual = porGestor.get(a.por) ?? {
      gestorId: a.por,
      pessoaIds: [],
      linhas: 0,
      discordos: 0,
      semLastro: 0,
      semEvidencia: 0,
      elicitadas: 0,
      taxa: 0,
    }
    const l = lerAvaliacao(a)
    atual.pessoaIds.push(a.pessoaId)
    atual.linhas += l.linhas
    atual.discordos += l.discordos
    atual.semLastro += l.semLastro
    atual.semEvidencia += l.semEvidencia
    atual.elicitadas += l.elicitadas
    porGestor.set(a.por, atual)
  }

  return [...porGestor.values()].map((g) => ({
    ...g,
    taxa: g.linhas === 0 ? 0 : g.discordos / g.linhas,
  }))
}

/* ─────────────────────────────────────────────────────────────────────────
   Sinal 2 — o que a régua pede e nenhuma fonte captura.
   ───────────────────────────────────────────────────────────────────────── */

export interface ComportamentoSemFonte {
  comportamentoId: string
  rotulo: string
  texto: string
  observavel: string
  quantas: number
  pessoaIds: PessoaId[]
  /** Em quantas delas o gestor discordou e trouxe o episódio na hora. É a
   *  diferença entre "ninguém sabe" e "só sai perguntando" — a segunda é
   *  problema de fonte, não de trabalho. */
  elicitadas: number
}

/**
 * Os comportamentos que fecharam o ciclo sem evidência, do mais frequente ao
 * menos.
 *
 * O critério é `notaIA === undefined`: a contagem não tinha número para propor
 * porque episódio nenhum sustentava o comportamento. Repetido em muita gente,
 * isso deixa de ser sobre as pessoas e passa a ser sobre a régua ou sobre as
 * fontes conectadas — que é a entrada da recalibração de A5.
 *
 * Empate mantém a ordem de aparição (o `sort` é estável), e a ordem de aparição
 * é a do arquivo do elenco. Nada aqui é aleatório.
 */
export function comportamentosSemFonte(
  avaliacoes: readonly Avaliacao[],
): ComportamentoSemFonte[] {
  const porComportamento = new Map<string, ComportamentoSemFonte>()

  for (const a of avaliacoes) {
    if (!a.assinadaEm) continue
    for (const v of a.vereditos) {
      if (v.notaIA !== undefined) continue
      const c = comportamentoPorId(v.comportamentoId)
      if (!c) continue
      const atual = porComportamento.get(v.comportamentoId) ?? {
        comportamentoId: v.comportamentoId,
        rotulo: c.rotulo,
        texto: c.texto,
        observavel: c.observavel,
        quantas: 0,
        pessoaIds: [],
        elicitadas: 0,
      }
      atual.quantas += 1
      atual.pessoaIds.push(a.pessoaId)
      if (v.saida === 'discordo' && v.nota !== undefined) atual.elicitadas += 1
      porComportamento.set(v.comportamentoId, atual)
    }
  }

  return [...porComportamento.values()].sort((a, b) => b.quantas - a.quantas)
}

/* ─────────────────────────────────────────────────────────────────────────
   Sinal 3 — cobertura de feedback no período.
   ───────────────────────────────────────────────────────────────────────── */

export interface CoberturaDeGestor {
  gestorId: PessoaId
  comFeedback: PessoaId[]
  semFeedback: PessoaId[]
}

/**
 * Quem recebeu retorno no período, por gestor.
 *
 * O SILÊNCIO É O DADO. A saída não é uma média — é a lista de quem não aparece
 * nela. Três pessoas com zero registros em seis meses viram "cobertura de 67 %"
 * numa média e desaparecem; nomeadas, elas viram a pergunta que o RH faz na
 * semana seguinte.
 *
 * Não há filtro de data, de propósito. Um reconhecimento dado agora é datado
 * hoje, que já é o dia seguinte ao fim da janela: filtrando pelo semestre, a
 * Marina reconheceria a Carla e este painel continuaria dizendo que ela está
 * sem retorno, na mesma sessão. `feedbacksDe` já entrega a leitura mesclada.
 */
export function coberturaDeFeedback(
  pessoas: readonly Pessoa[],
  feedbacksDe: (pessoaId: PessoaId) => readonly Feedback[],
): CoberturaDeGestor[] {
  const porGestor = new Map<PessoaId, CoberturaDeGestor>()

  for (const p of pessoas) {
    if (!p.gestorId) continue
    const atual = porGestor.get(p.gestorId) ?? {
      gestorId: p.gestorId,
      comFeedback: [],
      semFeedback: [],
    }
    if (feedbacksDe(p.id).length > 0) atual.comFeedback.push(p.id)
    else atual.semFeedback.push(p.id)
    porGestor.set(p.gestorId, atual)
  }

  return [...porGestor.values()]
}

/* ─────────────────────────────────────────────────────────────────────────
   O comitê — o que sai daqui e vai para a mesa.
   ───────────────────────────────────────────────────────────────────────── */

/** Quem decide, segundo `doutrina/politica-de-decisao.md`: até sênior é o
 *  comitê do time; staff e acima é o comitê de engenharia com a CHRO. */
export type Instancia = 'time' | 'comite-cima'

export interface CasoDoCiclo {
  pessoa: Pessoa
  avaliacao: Avaliacao
  /** O nível alvo do caso — o de cima do que ela ocupa. */
  alvo?: Nivel
  /** O nível contra o qual a régua abaixo foi lida: o alvo quando existe, o
   *  ocupado para quem está no topo da trilha. É ele que a tela escreve. */
  nivelLido: Nivel
  instancia: Instancia
  /** A régua do NÍVEL ALVO, comportamento a comportamento.
   *
   *  Era a régua assinada — a do nível ocupado — sob um rótulo que dizia
   *  "Pleno → Sênior": outra lista de comportamentos e outro denominador que o
   *  dossiê da mesma pessoa e que o caso que o chat monta, com o card sendo a
   *  única das três superfícies a discordar, e a única onde a promoção é
   *  decidida. `doutrina/politica-de-decisao.md` é explícita: cada caso é lido
   *  contra a régua do nível alvo.
   *
   *  Ela não é congelada, e não há o que congelar: o que o gestor assinou foi o
   *  nível ocupado, e essa leitura continua inteira em `leitura` e na tela do
   *  fechamento. A régua do alvo nunca foi assinada por ninguém — é a mesma
   *  contagem viva que o dossiê e o chat mostram, e é assim que as três
   *  superfícies param de divergir. */
  itens: {
    comportamentoId: string
    rotulo: string
    nota?: number
    esperado: number
    situacao: Situacao
  }[]
  leitura: LeituraDaAvaliacao
}

/**
 * Os casos que uma decisão de ciclo abriu.
 *
 * `abrir-promocao` vai para uma mesa; `pronta-sem-vaga` não vai para mesa
 * nenhuma e mesmo assim aparece, porque é a fila de risco: prontidão registrada
 * que o orçamento não absorveu é a informação que o RH precisa ter antes de a
 * pessoa ir embora, e é o único lugar do produto onde ela existe.
 *
 * Os dois leitores no fim são a sessão entrando pela porta de sempre (o mesmo
 * desenho de `coberturaDeFeedback`): sem eles, a régua do alvo aqui ignoraria o
 * reconhecimento e o lastro que acabaram de acontecer na tela de fechamento, e
 * o painel do RH voltaria a discordar do dossiê por baixo.
 */
export function casosDoCiclo(
  pessoas: readonly Pessoa[],
  avaliacoes: readonly Avaliacao[],
  estreladosDe: (pessoaId: PessoaId) => readonly EpisodioId[] = () => [],
  lastrosDe: (pessoaId: PessoaId) => readonly Lastro[] = () => [],
): { promocoes: CasoDoCiclo[]; prontas: CasoDoCiclo[] } {
  const casos: CasoDoCiclo[] = []

  for (const a of avaliacoes) {
    if (!a.assinadaEm || !a.decisao || a.decisao === 'manter') continue
    const pessoa = pessoas.find((p) => p.id === a.pessoaId)
    if (!pessoa) continue

    const alvo = NIVEL_SEGUINTE[a.nivel]
    const nivelLido = alvo ?? a.nivel

    const cobertos =
      comportamentosCobertos(
        a.pessoaId,
        a.trilha,
        nivelLido,
        estreladosDe(a.pessoaId),
        lastrosDe(a.pessoaId),
      ) ?? []

    const itens = cobertos.map((c) => ({
      comportamentoId: c.id,
      rotulo: c.rotulo,
      nota: c.nivel,
      esperado: c.esperado,
      situacao: c.situacao,
    }))

    casos.push({
      pessoa,
      avaliacao: a,
      alvo,
      nivelLido,
      instancia: alvo === 'senior' ? 'time' : 'comite-cima',
      itens,
      leitura: lerAvaliacao(a),
    })
  }

  return {
    promocoes: casos.filter((c) => c.avaliacao.decisao === 'abrir-promocao'),
    prontas: casos.filter((c) => c.avaliacao.decisao === 'pronta-sem-vaga'),
  }
}
