/**
 * A régua viva — PLANO.md §3.1, JORNADAS A5.
 *
 * As sugestões de recalibração da régua eram três frases escritas à mão em
 * `data/regua.ts`, e a tela dizia embaixo delas "derivado da evidência de Carla
 * e Rafael". Não eram: eram texto digitado por alguém que já sabia a conclusão.
 * O produto inteiro se sustenta em "toda afirmação abre na fonte", e a única
 * afirmação sem fonte que existia no repo era justamente a que se anunciava
 * derivada. Aqui ela passa a ser calculada, e a primeira consequência é que
 * duas das três sumiram — a evidência não as sustentava (ver §"o que não
 * sobreviveu" no fim deste arquivo).
 *
 * NADA AQUI RECONTA NADA. `pontuar`, `situacaoDe` e `comportamentosCobertos`
 * vêm de `lib/metricas.ts`, que é onde a contagem mora. Se a régua viva
 * contasse "sustentado" por um critério e o dossiê por outro, a mesma Carla
 * apareceria dos dois jeitos na mesma gravação — o bug que aquele arquivo
 * existe para impedir, e que já voltou uma vez por baixo, pelo agente.
 *
 * A régua é o único documento de Setup que produz veredito. Por isso NADA aqui
 * muda a régua: tudo é proposta, e quem decide é o RH na tela. Um produto que
 * recalibra sozinho o critério contra o qual ele mesmo pontua é um produto se
 * avaliando.
 *
 * Determinismo: as listas de `data/` são percorridas na ordem do arquivo e não
 * há `Date.now()` nem `Math.random()` em lugar nenhum. A mesma sessão produz as
 * mesmas sugestões na primeira e na décima tomada.
 */

import { episodios } from '@/data/episodios'
import { eventos } from '@/data/eventos'
import { pessoas } from '@/data/pessoas'
import { lerRegua, NOME_NIVEL, NOME_TRILHA, regua } from '@/data/regua'
import type { ComportamentoRegua, EpisodioId, Nivel, PessoaId, Trilha } from '@/data/tipos'
import { nomeDe, reportsDe } from '@/lib/memoria'
import {
  comportamentosCobertos,
  pontuar,
  situacaoDe,
  type ComportamentoCoberto,
} from '@/lib/metricas'
import { estreladosDe, lastrosDe, SESSAO_VAZIA, type Registro } from '@/lib/sessao'

/**
 * Os três casos que a evidência consegue sustentar — JORNADAS A5.
 *
 * Não há um quarto, e em particular não há nenhum que aponte pessoa: a unidade
 * de análise é a linha da régua, sempre. "Ninguém sustenta Influência" é uma
 * afirmação sobre a régua e sobre o registro; "Fulano não sustenta Influência"
 * seria uma nota sobre gente numa tela de Setup, que é o que o produto não faz.
 */
export type TipoSugestao = 'barra-subiu' | 'sem-evidencia' | 'padrao-nao-mapeado'

/**
 * Por que ninguém sustenta — e a distinção é a informação, não um detalhe.
 *
 * `nao-aparece`: o registro ALCANÇA estas pessoas (outros comportamentos do
 * mesmo nível estão sustentados) e este comportamento não apareceu. A leitura é
 * sobre o trabalho: a régua pede o que a empresa não está fazendo.
 *
 * `fora-do-alcance`: o registro não alcança. Nenhum comportamento deste nível
 * tem evidência, e o pouco que existe só existe porque alguém perguntou. A
 * leitura é sobre as fontes: a régua pede o que nenhuma fonte captura.
 *
 * As duas causas exigem provas opostas, e é isso que impede a segunda de virar
 * desculpa da primeira. `nao-aparece` só é dizível quando há evidência sobrando
 * no mesmo nível; `fora-do-alcance` só é dizível quando não há nenhuma. Nenhum
 * limiar arbitrário separa as duas — o que separa é o próprio registro.
 */
export type CausaSemEvidencia = 'nao-aparece' | 'fora-do-alcance'

export interface SugestaoRegua {
  id: string
  trilha: Trilha
  nivel: Nivel
  tipo: TipoSugestao
  causa?: CausaSemEvidencia
  /** A leitura em uma linha — o rótulo do card. */
  rotulo: string
  /** O que a tela mostra. Números, nunca argumento. */
  texto: string
  /** Quem ocupa o nível. É a coorte que a conta olhou, e ela vai junto porque
   *  uma sugestão derivada de uma pessoa e uma derivada de doze não valem o
   *  mesmo — e quem decide tem que ver de quantas está falando. */
  coorte: PessoaId[]
  /** Os comportamentos que a sugestão toca. */
  comportamentos: ComportamentoRegua[]
  /** A conta aberta, linha a linha. É por aqui que a sugestão abre na fonte:
   *  numa afirmação de AUSÊNCIA não há episódio para clicar, então o que se
   *  mostra é a contagem que produziu a ausência. */
  conta: string[]
  /** Só em `barra-subiu`: o que a régua passaria a pedir. */
  novoEsperado?: number
  /** Só em `padrao-nao-mapeado`: os episódios que nenhum comportamento credita. */
  episodioIds?: EpisodioId[]
}

/* ─────────────────────────────────────────────────────────────────────────
   A coorte.

   Quem a régua de um nível descreve é quem OCUPA o nível — e não quem está um
   degrau abaixo mirando nele. A distinção decide o resultado inteiro: um pleno
   não sustentar um comportamento de sênior é a definição de "ainda não subiu",
   não é sinal de régua descalibrada. Contar os dois grupos juntos faria toda
   régua de topo parecer inalcançável, e a de Vendas Staff acusaria a Letícia de
   não ser staff.
   ───────────────────────────────────────────────────────────────────────── */

const ocupantes = (trilha: Trilha, nivel: Nivel): PessoaId[] =>
  pessoas.filter((p) => p.trilha === trilha && p.nivel === nivel).map((p) => p.id)

interface Leitura {
  pessoaId: PessoaId
  coberto: ComportamentoCoberto
}

const PALAVRA = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove']
const PALAVRA_F = ['zero', 'uma', 'duas']

/** Número por extenso até nove, como a copy do resto do produto escreve. Acima
 *  disso o algarismo lê melhor, e é onde o registro para de caber na cabeça.
 *  O gênero existe porque a frase conta ora pessoas, ora episódios, e "as dois
 *  pessoas" denuncia texto montado por máquina mais rápido que qualquer outra
 *  coisa nesta tela. */
const extenso = (n: number, genero: 'm' | 'f' = 'm') =>
  (genero === 'f' ? PALAVRA_F[n] : undefined) ?? PALAVRA[n] ?? String(n)

const lista = (itens: string[]): string =>
  itens.length <= 1
    ? (itens[0] ?? '')
    : `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`

const primeiroNome = (id: PessoaId) => nomeDe(id).split(' ')[0]

/* ─────────────────────────────────────────────────────────────────────────
   A leitura da régua contra a coorte — uma chamada por pessoa, e só uma.
   ───────────────────────────────────────────────────────────────────────── */

function lerCoorte(
  trilha: Trilha,
  nivel: Nivel,
  coorte: PessoaId[],
  registro: Registro,
): Map<string, Leitura[]> {
  const porComportamento = new Map<string, Leitura[]>()
  for (const pessoaId of coorte) {
    const cobertos = comportamentosCobertos(
      pessoaId,
      trilha,
      nivel,
      estreladosDe(registro, pessoaId),
      lastrosDe(registro, pessoaId),
    )
    if (!cobertos) continue
    for (const coberto of cobertos) {
      const linhas = porComportamento.get(coberto.id) ?? []
      linhas.push({ pessoaId, coberto })
      porComportamento.set(coberto.id, linhas)
    }
  }
  return porComportamento
}

/** Quem, FORA da coorte, sustenta este comportamento. Existe porque a resposta
 *  muda o que fazer com a sugestão: um comportamento que ninguém em Sênior
 *  sustenta e que uma pessoa de Pleno sustenta não é a mesma coisa que um que
 *  ninguém na empresa sustentou nunca. A primeira é uma régua no nível errado;
 *  a segunda é uma régua sem lastro nenhum. */
function sustentamFora(
  comportamento: ComportamentoRegua,
  coorte: PessoaId[],
  registro: Registro,
): PessoaId[] {
  return pessoas
    .filter((p) => {
      if (coorte.includes(p.id)) return false
      const { nivel } = pontuar(
        p.id,
        comportamento.id,
        estreladosDe(registro, p.id),
        lastrosDe(registro, p.id),
      )
      return situacaoDe(nivel, comportamento.esperado) === 'sustentado'
    })
    .map((p) => p.id)
}

/* ─────────────────────────────────────────────────────────────────────────
   Caso 1 — a barra subiu na prática.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Todo mundo do nível sustenta, e todo mundo sustenta ACIMA do que o nível
 * pede. A régua nova é o piso do grupo: o menor número que todos alcançam.
 *
 * Três exigências, e nenhuma delas é decoração. A coorte inteira precisa ter
 * evidência — "todo mundo sustenta" contado só sobre quem o registro alcançou é
 * a mesma sobrevivência do sobrevivente que faria a régua subir por causa da
 * pessoa mais visível do time. Precisa de duas pessoas no mínimo: uma pessoa
 * acima da régua é um caso de promoção, não uma régua desatualizada. E o piso
 * precisa ser estritamente maior que o esperado — todo mundo bater exatamente o
 * que a régua pede é régua calibrada, e mexer nela ali seria subir a barra
 * porque as pessoas a alcançaram, que é como uma empresa ensina o time a não
 * alcançar mais nada.
 */
function barraSubiu(
  trilha: Trilha,
  nivel: Nivel,
  comportamento: ComportamentoRegua,
  linhas: Leitura[],
  coorte: PessoaId[],
): SugestaoRegua | undefined {
  if (linhas.length < 2) return undefined
  if (linhas.some((l) => l.coberto.nivel === undefined)) return undefined
  if (linhas.some((l) => l.coberto.situacao !== 'sustentado')) return undefined

  const piso = Math.min(...linhas.map((l) => l.coberto.nivel!))
  if (piso <= comportamento.esperado) return undefined

  return {
    id: `viva-${comportamento.id}-barra`,
    trilha,
    nivel,
    tipo: 'barra-subiu',
    rotulo: 'A barra subiu na prática',
    texto: `${comportamento.rotulo} pede ${comportamento.esperado} e as ${extenso(linhas.length)} pessoas em ${NOME_NIVEL[nivel]} estão em ${piso} ou acima. O que a régua descreve como esperado já é o piso do nível.`,
    coorte,
    comportamentos: [comportamento],
    novoEsperado: piso,
    conta: [
      `${comportamento.rotulo} · a régua pede ${comportamento.esperado}`,
      ...linhas.map(
        (l) => `${nomeDe(l.pessoaId)} · ${l.coberto.nivel} · ${l.coberto.episodios} episódios`,
      ),
      `piso do nível · ${piso}`,
    ],
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   Caso 2 — ninguém sustenta.
   ───────────────────────────────────────────────────────────────────────── */

const episodiosDaCoorte = (coorte: PessoaId[]) =>
  episodios.filter((e) => coorte.includes(e.pessoaId))

/** Evidência que só existe porque alguém perguntou. É o sinal de fonte falhando
 *  que o modelo de dados já carrega: `Fonte` distingue o que foi observado do
 *  que foi elicitado justamente para esta pergunta poder ser feita. */
const elicitadosDaCoorte = (coorte: PessoaId[]) =>
  eventos.filter(
    (e) =>
      coorte.includes(e.pessoaId) && (e.fonte.tipo === 'humano' || e.fonte.tipo === 'proprio'),
  )

/**
 * Os comportamentos do nível que não têm um episódio sequer na coorte.
 *
 * Só entra o que está em ZERO. Comportamento com evidência que fica abaixo do
 * esperado é outra conversa — é uma pessoa a caminho, e a régua não tem nada de
 * errado. Misturar os dois transformaria esta tela num relatório de quem está
 * atrasado, que é exatamente o que a régua não é.
 */
function semEvidencia(
  trilha: Trilha,
  nivel: Nivel,
  comportamentos: ComportamentoRegua[],
  porComportamento: Map<string, Leitura[]>,
  coorte: PessoaId[],
  registro: Registro,
): SugestaoRegua | undefined {
  const vazios = comportamentos.filter((c) =>
    (porComportamento.get(c.id) ?? []).every((l) => l.coberto.nivel === undefined),
  )
  if (vazios.length === 0) return undefined

  const sustentados = comportamentos.filter((c) =>
    (porComportamento.get(c.id) ?? []).some((l) => l.coberto.situacao === 'sustentado'),
  )
  const eps = episodiosDaCoorte(coorte)
  const elicitados = elicitadosDaCoorte(coorte)
  const rotulos = lista(vazios.map((c) => c.rotulo))
  const conta: string[] = [
    `${coorte.length} ${coorte.length === 1 ? 'pessoa ocupa' : 'pessoas ocupam'} ${NOME_NIVEL[nivel]} · ${coorte.map(nomeDe).join(', ')}`,
    ...vazios.map((c) => `${c.rotulo} · zero episódios · a régua pede ${c.esperado}`),
  ]

  if (sustentados.length > 0) {
    /* O registro alcança estas pessoas: há comportamento sustentado no mesmo
     * nível. Com uma pessoa só na coorte isso não se diz — seria uma leitura
     * sobre o trabalho dela publicada numa tela de régua. */
    if (coorte.length < 2) return undefined

    /* Quantas pessoas do nível o registro alcançou em ALGUMA linha desta régua.
     * A frase precisa deste número e não do de comportamentos sustentados: três
     * linhas sustentadas pela mesma pessoa não provam que o registro chegou às
     * outras duas, e é essa chegada que autoriza dizer que a ausência é do
     * trabalho e não da fonte. */
    const alcancadas = coorte.filter((pessoaId) =>
      comportamentos.some((c) =>
        (porComportamento.get(c.id) ?? []).some(
          (l) => l.pessoaId === pessoaId && l.coberto.nivel !== undefined,
        ),
      ),
    )
    /* Mesmo piso da coorte, pelo mesmo motivo: "o registro alcança estas
     * pessoas" apoiado numa pessoa só é a leitura de um registro, não de um
     * nível. Abaixo disso a saída é silêncio — e silêncio é saída válida. */
    if (alcancadas.length < 2) return undefined

    const fora = vazios.flatMap((c) =>
      sustentamFora(c, coorte, registro).map((id) => ({ comportamento: c, pessoaId: id })),
    )
    const ondeEstao = lista(
      [...new Set(fora.map((f) => f.pessoaId))].map((id) => {
        const p = pessoas.find((x) => x.id === id)
        return `${nomeDe(id)}, em ${p?.nivel ? NOME_NIVEL[p.nivel] : 'outro nível'}`
      }),
    )

    return {
      id: `viva-${trilha}-${nivel}-nao-aparece`,
      trilha,
      nivel,
      tipo: 'sem-evidencia',
      causa: 'nao-aparece',
      rotulo: 'A régua pede o que não aparece no trabalho',
      texto:
        `${rotulos} não ${vazios.length === 1 ? 'tem' : 'têm'} um episódio entre as ${extenso(coorte.length, 'f')} pessoas em ${NOME_NIVEL[nivel]}. ` +
        `O registro alcança ${alcancadas.length === coorte.length ? `as ${extenso(coorte.length, 'f')}` : `${extenso(alcancadas.length, 'f')} delas`}: ${lista(sustentados.map((c) => c.rotulo))} ${sustentados.length === 1 ? 'está sustentado' : 'estão sustentados'} no mesmo nível. ` +
        (fora.length > 0
          ? `Quem sustenta ${lista([...new Set(fora.map((f) => f.comportamento.rotulo))])} no registro está fora deste nível: ${ondeEstao}.`
          : `Ninguém no registro sustenta ${vazios.length === 1 ? 'este comportamento' : 'estes comportamentos'}, em nenhum nível.`),
      coorte,
      comportamentos: vazios,
      conta: [
        ...conta,
        `com evidência em alguma linha deste nível · ${alcancadas.length} de ${coorte.length}`,
        ...sustentados.map((c) => {
          const quem = (porComportamento.get(c.id) ?? []).filter(
            (l) => l.coberto.situacao === 'sustentado',
          )
          return `${c.rotulo} · sustentado · ${quem.map((l) => `${primeiroNome(l.pessoaId)} (${l.coberto.episodios} episódios)`).join(', ')}`
        }),
        ...(fora.length > 0
          ? fora.map((f) => `${f.comportamento.rotulo} · sustentado fora do nível · ${nomeDe(f.pessoaId)}`)
          : ['fora deste nível · ninguém sustenta']),
      ],
    }
  }

  /* Nenhum comportamento do nível é sustentado por ninguém. Isso sozinho ainda
   * não é "as fontes não capturam" — pode ser um registro que simplesmente
   * ainda não encheu. O que autoriza a afirmação é o registro mostrar a fonte
   * falhando: ou não há episódio nenhum no semestre, ou o que existe só existe
   * porque alguém perguntou. Fora desses dois casos a saída é silêncio, que é
   * saída válida. */
  if (eps.length > 0 && elicitados.length === 0) return undefined

  const gestores = coorte.filter((id) => reportsDe(id).length > 0)
  const eventosDaCoorte = eventos.filter((e) => coorte.includes(e.pessoaId))
  const parciais = comportamentos.filter((c) =>
    (porComportamento.get(c.id) ?? []).some((l) => l.coberto.nivel !== undefined),
  )

  /* Duas frases de contexto, e a escolha entre elas é dado, não estilo. Quando
   * a coorte inteira gerencia gente, a ausência tem nome: as fontes conectadas
   * leem PR, thread e negócio, e trabalho de gestão não passa por nenhum dos
   * três. Fora desse caso o que resta é o tamanho do registro, dito com os
   * números que qualquer um confere na tela ao lado. */
  const contexto =
    gestores.length === coorte.length
      ? ` ${coorte.length === 1 ? 'A pessoa no nível gerencia um time' : `As ${extenso(coorte.length, 'f')} pessoas no nível gerenciam times`}, e o registro não tem episódio ${coorte.length === 1 ? 'dela' : 'de nenhuma delas'} no semestre — ${extenso(eventosDaCoorte.length)} eventos, nenhum ligado a episódio.`
      : ` ${NOME_TRILHA[trilha]} tem ${extenso(coorte.length, 'f')} ${coorte.length === 1 ? 'pessoa' : 'pessoas'} neste nível, ${extenso(eps.length)} ${eps.length === 1 ? 'episódio' : 'episódios'} e ${extenso(eventosDaCoorte.length)} eventos no semestre` +
        (elicitados.length > 0
          ? ` — ${extenso(elicitados.length)} ${elicitados.length === 1 ? 'deles só existe' : 'deles só existem'} porque alguém perguntou.`
          : '.')

  return {
    id: `viva-${trilha}-${nivel}-fora-do-alcance`,
    trilha,
    nivel,
    tipo: 'sem-evidencia',
    causa: 'fora-do-alcance',
    rotulo: 'A régua pede o que nenhuma fonte captura',
    texto:
      `${rotulos} não ${vazios.length === 1 ? 'tem' : 'têm'} episódio em ${NOME_NIVEL[nivel]}` +
      (parciais.length > 0
        ? `; ${lista(parciais.map((c) => c.rotulo))} ${parciais.length === 1 ? 'tem evidência e fica' : 'têm evidência e ficam'} abaixo do que o nível pede.`
        : '.') +
      contexto,
    coorte,
    comportamentos: vazios,
    conta: [
      ...conta,
      `episódios da coorte no semestre · ${eps.length}`,
      `eventos da coorte no semestre · ${eventosDaCoorte.length}, ${elicitados.length} obtidos perguntando`,
      ...parciais.map((c) => {
        const quem = (porComportamento.get(c.id) ?? []).filter((l) => l.coberto.nivel !== undefined)
        return `${c.rotulo} · ${quem.map((l) => `${primeiroNome(l.pessoaId)} está em ${l.coberto.nivel}`).join(', ')} · a régua pede ${c.esperado}`
      }),
    ],
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   Caso 3 — padrão que a régua não escreveu.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Trabalho que o registro capturou e que nenhum comportamento deste nível
 * credita, em mais de uma pessoa.
 *
 * "Frequente" aqui significa atravessar PESSOAS, e não episódios: um tema já é
 * um padrão que atravessa episódios de alguém, então repetir esse critério não
 * acrescentaria nada. O que faz uma linha nova de régua não é uma pessoa fazer
 * a mesma coisa três vezes — é duas pessoas independentes fazerem, e a régua
 * não ter onde creditar nenhuma das duas.
 *
 * NÃO É PROPOSTO UM COMPORTAMENTO PRONTO. O cálculo sabe apontar que existe
 * trabalho sem crédito e sabe dizer qual; ele não sabe escrever o `texto` e o
 * `observavel` da linha nova, e escrever isso a partir de um resumo de episódio
 * seria voltar exatamente à frase digitada que este arquivo veio substituir. A
 * sugestão entrega os episódios; a linha é escrita por quem responde pela
 * régua.
 */
function padraoNaoMapeado(
  trilha: Trilha,
  nivel: Nivel,
  comportamentos: ComportamentoRegua[],
  porComportamento: Map<string, Leitura[]>,
  coorte: PessoaId[],
): SugestaoRegua | undefined {
  const creditados = new Set<EpisodioId>()
  for (const c of comportamentos) {
    for (const l of porComportamento.get(c.id) ?? []) {
      for (const id of l.coberto.episodioIds) creditados.add(id)
    }
  }

  const orfaos = episodiosDaCoorte(coorte).filter((e) => !creditados.has(e.id))
  const pessoasComOrfao = [...new Set(orfaos.map((e) => e.pessoaId))]
  if (pessoasComOrfao.length < 2) return undefined

  return {
    id: `viva-${trilha}-${nivel}-nao-mapeado`,
    trilha,
    nivel,
    tipo: 'padrao-nao-mapeado',
    rotulo: 'A régua não previu isto',
    texto: `${extenso(orfaos.length)} episódios de ${extenso(pessoasComOrfao.length)} pessoas em ${NOME_NIVEL[nivel]} não são creditados por nenhum comportamento desta régua: ${lista(orfaos.map((e) => `"${e.titulo}"`))}. O trabalho está no registro e não tem onde ser lido.`,
    coorte,
    comportamentos: [],
    episodioIds: orfaos.map((e) => e.id),
    conta: [
      `${comportamentos.length} comportamentos em ${NOME_NIVEL[nivel]} · ${creditados.size} episódios creditados`,
      ...orfaos.map((e) => `${e.titulo} · ${primeiroNome(e.pessoaId)} · sem comportamento`),
    ],
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   A entrada.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * As sugestões para um nível da régua, derivadas do registro.
 *
 * `registro` é a sessão, e ela entra pelo mesmo motivo que entra em todo o
 * resto: quando a gestora discorda de uma nota no fechamento e cita o episódio
 * que sustenta, aquele comportamento deixa de estar em zero — e uma tela de
 * Setup afirmando "ninguém tem episódio para Comunicação" um clique depois
 * disso seria o produto se contradizendo dentro da mesma gravação. Sem sessão,
 * responde pela semente, como todo mundo aqui.
 */
export function sugestoesDe(
  trilha: Trilha,
  nivel: Nivel,
  registro: Registro = SESSAO_VAZIA,
): SugestaoRegua[] {
  const nivelRegua = lerRegua(trilha, nivel)
  if (!nivelRegua?.comportamentos.length) return []

  const coorte = ocupantes(trilha, nivel)
  if (coorte.length === 0) return []

  const porComportamento = lerCoorte(trilha, nivel, coorte, registro)
  const comportamentos = nivelRegua.comportamentos

  const achadas: (SugestaoRegua | undefined)[] = [
    ...comportamentos.map((c) =>
      barraSubiu(trilha, nivel, c, porComportamento.get(c.id) ?? [], coorte),
    ),
    semEvidencia(trilha, nivel, comportamentos, porComportamento, coorte, registro),
    padraoNaoMapeado(trilha, nivel, comportamentos, porComportamento, coorte),
  ]

  return achadas.filter((s): s is SugestaoRegua => Boolean(s))
}

/** Todas as sugestões da régua, na ordem em que os níveis estão escritos.
 *  É o que o índice de diretrizes conta para dizer se há algo pendente — e é
 *  por ele que a ficha da régua deixou de anunciar uma sugestão que não
 *  existia mais. */
export const sugestoesDaRegua = (registro: Registro = SESSAO_VAZIA): SugestaoRegua[] =>
  regua.flatMap((r) => sugestoesDe(r.trilha, r.nivel, registro))

/* ─────────────────────────────────────────────────────────────────────────
   O QUE NÃO SOBREVIVEU AO CÁLCULO

   Três frases escritas à mão saíram daqui, e nenhuma delas era derivável:

   1. `data/regua.ts`, Engenharia Sênior — "adicionar: transforma dependência
      entre times em acordo com dono e prazo; apareceu em dois casos
      independentes e hoje não tem onde ser creditado". A régua TEM onde
      creditar: `eng-senior-desbloqueio` diz "o bloqueio vira acordo
      documentado", e é exatamente ali que a coordenação da Carla é contada
      hoje. A sugestão propunha escrever uma linha que já estava escrita.

   2. `data/regua.ts`, Design Staff — "Design é a trilha com menor densidade:
      5 eventos contra uma média de 9". Cinco está certo; nove não sai de conta
      nenhuma (a média por pessoa da trilha é 6,9; entre quem não gerencia, 8,4).
      O achado sobrevive com os números que existem, e sem a média.

   3. `data/diretrizes.ts`, ficha da régua — a mesma frase do item 1, escrita de
      outro jeito. Duas superfícies afirmando a mesma coisa não derivada.

   E o caso "a barra subiu" não produz nada neste registro. Não por falta de
   gente boa: `eng-senior-risco` tem duas pessoas sustentando, e as duas param
   em 4, que é exatamente o que a régua pede. Régua calibrada é o resultado
   correto, e inventar uma recalibração ali seria repetir o defeito que este
   arquivo veio consertar.
   ───────────────────────────────────────────────────────────────────────── */
