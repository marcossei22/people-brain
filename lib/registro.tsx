'use client'

/**
 * A camada de ESCRITA do protótipo — ARQUITETURA §14.
 *
 * Até aqui o produto só lia. Nove botões espalhados por três telas eram forma
 * sem consequência, e um protótipo onde reconhecer não move a régua e responder
 * não vira evidência demonstra o contrário da tese: que o registro é
 * fotografia, não loop.
 *
 * O que este provider guarda é só o DELTA da sessão. `data/` continua sendo a
 * semente imutável, e a mesclagem semente + sessão mora em `lib/sessao.ts`,
 * fora daqui: as tools do agente rodam sem React e precisam da mesma leitura.
 * Enquanto elas liam `lib/memoria.ts` direto, o chat respondia pela semente com
 * o dossiê aberto atrás do painel mostrando outra coisa.
 *
 * Some no reload, e isso é correto (§14). O que não pode sumir é a coerência
 * enquanto dura — por isso nada aqui usa `Date.now()` nem `Math.random()`: id e
 * data têm que sair idênticos na primeira e na décima tomada.
 *
 * Fica DENTRO de `<ProvedorViewer>` porque toda escrita tem autor, e o autor é
 * sempre quem está olhando. Passar o autor em cada argumento seria pedir a nove
 * chamadas que não errassem o que o contexto já sabe.
 *
 * QUEM PODE ESCREVER está em `permissoes.ts`, com a leitura. Cada ação daqui
 * pergunta antes de tocar no estado, e a tela pergunta a MESMA função para
 * decidir se desenha o botão. Enquanto a regra vivia só no condicional de JSX,
 * a cópia já divergia do modelo de dados — e três pessoas com gestora declarada
 * não podiam receber reconhecimento de ninguém.
 */

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { cicloPorId } from '@/data/ciclos'
import { episodioPorId } from '@/data/episodios'
import { comportamentoPorId } from '@/data/regua'
import { HOJE, JANELA } from '@/data/tipos'
import type {
  Avaliacao,
  CicloId,
  DecisaoDeCiclo,
  Episodio,
  EpisodioId,
  Evento,
  EventoId,
  Feedback,
  Lacuna,
  LacunaId,
  Lastro,
  PessoaId,
  Veredito,
} from '@/data/tipos'
import type { Pendencia } from '@/data/pendencias'
import {
  podeAvaliar,
  podeCompletarRegistro,
  podeReconhecer,
  podeRegistrarConversa,
  podeResponderLacuna,
} from '@/lib/agente/permissoes'
import { comportamentosCobertos, pontuar } from '@/lib/metricas'
import { nomeDe, pessoa } from '@/lib/memoria'
import * as sessaoLib from '@/lib/sessao'
import { SESSAO_VAZIA } from '@/lib/sessao'
import type { Contestacao, Resposta, Sessao } from '@/lib/sessao'
import { useViewer } from '@/lib/viewer'

export type { Contestacao, Resposta } from '@/lib/sessao'

/**
 * O que o botão faz, dito antes do clique — JORNADAS G3.
 *
 * Vive aqui, e não em cada tela, porque as duas superfícies que reconhecem — o
 * dossiê e a caixa da semana — têm que dizer a mesma coisa. O produto já
 * implementava o +1 de `pontuar()` e não avisava ninguém: a gestora clicava
 * "Reconhecer" e a régua três centímetros acima subia sozinha, sem que nada na
 * tela tivesse dito que aquele clique mexia na avaliação.
 */
export const AVISO_ESTRELA =
  'Reconhecer vale +1 na nota dos comportamentos que este episódio sustenta.'

/** `ev-sessao-1`, `fb-sessao-2`, `pd-sessao-1`. Legível em cima da mesa de quem
 *  está gravando, e igual em toda tomada: id com timestamp ou aleatório mudaria
 *  a cada execução e apareceria no drill-down da fonte. */
const proximoId = (prefixo: string, quantos: number) => `${prefixo}-sessao-${quantos + 1}`

/** As perguntas que a IA escreve chamam a pessoa pelo primeiro nome, como
 *  alguém do time chamaria. Nome completo dentro da pergunta soa a formulário. */
const primeiroNome = (nome: string) => nome.split(' ')[0]

interface ContextoRegistro {
  // ── o que esta sessão escreveu ──────────────────────────────────────────
  /** O delta inteiro, para quem precisa mandá-lo adiante — hoje, o painel de
   *  chat, que o entrega ao agente pelo cabeçalho de `lib/sessao.ts`. */
  sessao: Sessao
  eventos: Evento[]
  feedbacks: Feedback[]
  respostas: Record<LacunaId, Resposta>
  contestacoes: Record<EventoId, Contestacao>
  lastros: Lastro[]
  avaliacoes: Avaliacao[]
  pendenciasExtras: Pendencia[]
  resolvidas: string[]

  // ── ações (o autor é sempre o viewer atual) ─────────────────────────────
  responderLacuna: (lacunaId: LacunaId, texto: string) => void
  reconhecer: (episodioId: EpisodioId, nota?: string) => void
  registrarConversa: (pessoaId: PessoaId, episodioId?: EpisodioId) => void
  adicionarContexto: (pessoaId: PessoaId, texto: string) => void
  contestar: (eventoId: EventoId, motivo: string) => void
  contestarLinha: (
    cicloId: CicloId,
    pessoaId: PessoaId,
    comportamentoId: string,
    motivo: string,
  ) => void
  pedirFeedbackDePar: (sobrePessoaId: PessoaId, episodioId: EpisodioId, aoPar: PessoaId) => void
  resolverPendencia: (id: string) => void

  // ── o fechamento do ciclo (JORNADAS G5) ─────────────────────────────────
  concordar: (cicloId: CicloId, pessoaId: PessoaId, comportamentoId: string) => void
  discordar: (
    cicloId: CicloId,
    pessoaId: PessoaId,
    comportamentoId: string,
    entrada: { episodioId: EpisodioId; texto: string },
  ) => void
  naoSei: (
    cicloId: CicloId,
    pessoaId: PessoaId,
    comportamentoId: string,
    perguntarA: PessoaId,
  ) => void
  decidirCiclo: (cicloId: CicloId, pessoaId: PessoaId, decisao: DecisaoDeCiclo) => void

  // ── leitores: semente + sessão, na ordem de sempre ──────────────────────
  eventosDe: (pessoaId: PessoaId) => Evento[]
  eventoPorId: (eventoId: EventoId) => Evento | undefined
  feedbacksDe: (pessoaId: PessoaId) => Feedback[]
  lacunasDe: (pessoaId: PessoaId) => Lacuna[]
  estrelaDe: (episodioId: EpisodioId) => Episodio['estrela']
  estreladosDe: (pessoaId: PessoaId) => EpisodioId[]
  contestacaoDe: (eventoId: EventoId) => Contestacao | undefined
  contestacaoDeLinha: (
    cicloId: CicloId,
    pessoaId: PessoaId,
    comportamentoId: string,
  ) => Contestacao | undefined
  pendenciasDe: (pessoaId: PessoaId) => Pendencia[]
  resumoDe: (pessoaId: PessoaId) => ReturnType<typeof sessaoLib.resumoDe>
  lastrosDe: (pessoaId: PessoaId) => Lastro[]
  avaliacaoDe: (cicloId: CicloId, pessoaId: PessoaId) => Avaliacao | undefined
  avaliacoesDe: (pessoaId: PessoaId) => Avaliacao[]
  avaliacoesDoCiclo: (cicloId: CicloId) => Avaliacao[]
}

const Ctx = createContext<ContextoRegistro | null>(null)

export function ProvedorRegistro({ children }: { children: React.ReactNode }) {
  const { viewer, geracao } = useViewer()
  const [sessao, setSessao] = useState<Sessao>(SESSAO_VAZIA)

  /* "Recomeçar" no seletor de persona incrementa `geracao`. Se o registro da
   * sessão não zerasse junto, o botão devolveria o viewer ao início e deixaria
   * as escritas de pé — o protótipo diria que reiniciou sem ter reiniciado.
   *
   * Ajuste durante o render, e não em efeito: em efeito, o primeiro quadro
   * depois do reset ainda mostra a evidência antiga e a tela pisca. O React
   * refaz este render antes de pintar, e `SESSAO_VAZIA` é a mesma referência do
   * estado inicial — quando já estava vazio, ele desiste sem re-renderizar. */
  const [geracaoVista, setGeracaoVista] = useState(geracao)
  if (geracaoVista !== geracao) {
    setGeracaoVista(geracao)
    setSessao(SESSAO_VAZIA)
  }

  const autor = viewer.pessoaId

  // ── ações ─────────────────────────────────────────────────────────────────

  /**
   * O loop de elicitação fechando.
   *
   * A lacuna e a evidência nascem juntas porque são o mesmo fato visto de dois
   * lados: o Brain deixa de não saber, e o registro passa a saber. A resposta
   * entra no dossiê de QUEM A PERGUNTA ERA SOBRE, não de quem digitou — quando
   * a Marina responde sobre a Carla, é o registro da Carla que cresce, com o
   * nome da Marina como procedência (JORNADAS §4).
   *
   * As duas datas são diferentes de propósito. O evento descreve trabalho do
   * semestre avaliado e por isso é datado em `JANELA.fim`: datado hoje, ele
   * apareceria na lista de eventos e sumiria do gráfico de evidência por mês
   * logo acima dela, e o dossiê se contradiria em uma tela só. Quando alguém
   * respondeu é outra informação, e ela fica na resposta da lacuna.
   */
  const responderLacuna = useCallback(
    (lacunaId: LacunaId, texto: string) => {
      const limpo = texto.trim()
      if (!limpo) return

      setSessao((s) => {
        if (s.respostas[lacunaId]) return s
        const lacuna = sessaoLib.lacunaPorId(s, lacunaId)
        // Lacuna já respondida na semente não se responde de novo: a evidência
        // dela já está no registro, e um segundo evento duplicaria o mesmo fato.
        if (!lacuna || lacuna.status === 'respondida') return s
        if (!podeResponderLacuna(viewer, lacuna).ok) return s

        const evento: Evento = {
          id: proximoId('ev', s.eventos.length),
          pessoaId: lacuna.pessoaId,
          data: JANELA.fim,
          texto: limpo,
          fonte: { tipo: 'humano', respondidoPor: autor, lacunaId },
        }
        return {
          ...s,
          eventos: [...s.eventos, evento],
          respostas: { ...s.respostas, [lacunaId]: { texto: limpo, por: autor, em: HOJE } },
        }
      })
    },
    [autor, viewer],
  )

  /**
   * A estrela — a unidade mais barata de julgamento humano (PLANO §3.3).
   *
   * Ela gruda no episódio e produz um `Feedback` de reconhecimento no mesmo
   * gesto, porque são a mesma coisa: marcar o momento É o retorno dado. Sem o
   * feedback, "quem está sem retorno há mais tempo" continuaria contando a
   * pessoa que acabou de ser reconhecida.
   *
   * A `nota` é opcional, e é aí que a estrela se paga: o clique de um segundo
   * tem que valer sozinho, senão vira formulário curto e ninguém dá 50 delas.
   * `validar.ts` exige texto em reconhecimento da SEMENTE, onde a alternativa
   * seria dado de elenco pela metade — aqui a ausência de nota é informação
   * verdadeira: marcaram o momento sem escrever nada.
   *
   * Não existe desfazer aqui, e não é esquecimento: o registro guarda o que
   * aconteceu. Tirar a estrela seria apagar que alguém reconheceu.
   */
  const reconhecer = useCallback(
    (episodioId: EpisodioId, nota?: string) => {
      const episodio = episodioPorId(episodioId)
      if (!episodio || episodio.estrela) return
      if (!podeReconhecer(viewer, episodio.pessoaId).ok) return

      setSessao((s) => {
        if (s.feedbacks.some((f) => f.tipo === 'reconhecimento' && f.episodioId === episodioId))
          return s
        const feedback: Feedback = {
          id: proximoId('fb', s.feedbacks.length),
          paraPessoaId: episodio.pessoaId,
          porPessoaId: autor,
          data: HOJE,
          tipo: 'reconhecimento',
          episodioId,
          texto: nota?.trim() || undefined,
        }
        return { ...s, feedbacks: [...s.feedbacks, feedback] }
      })
    },
    [autor, viewer],
  )

  /**
   * A conversa aconteceu — e é só isso que fica.
   *
   * NUNCA guarda texto. Registro do teor de uma correção é dossiê de demérito,
   * que é frio, é chilling e no Brasil é passivo trabalhista puro (PLANO §3.3,
   * decisão #7). O que a organização precisa saber é se a conversa existiu, não
   * o que foi dito nela — e a assimetria com o reconhecimento, que guarda o
   * texto, é proposital.
   *
   * O episódio é opcional porque nem toda conversa devida tem um: a pendência
   * do Bruno nasce de quatro meses sem retorno, não de um trabalho específico.
   */
  const registrarConversa = useCallback(
    (pessoaId: PessoaId, episodioId?: EpisodioId) => {
      if (!pessoa(pessoaId)) return
      if (!podeRegistrarConversa(viewer, pessoaId).ok) return
      if (episodioId && !episodioPorId(episodioId)) return

      setSessao((s) => {
        const jaHouve = s.feedbacks.some(
          (f) => f.tipo === 'conversa' && f.paraPessoaId === pessoaId && f.episodioId === episodioId,
        )
        if (jaHouve) return s
        const feedback: Feedback = {
          id: proximoId('fb', s.feedbacks.length),
          paraPessoaId: pessoaId,
          porPessoaId: autor,
          data: HOJE,
          tipo: 'conversa',
          episodioId,
        }
        return { ...s, feedbacks: [...s.feedbacks, feedback] }
      })
    },
    [autor, viewer],
  )

  /**
   * O que o sistema não podia saber, dito por quem sabia (JORNADAS §C3).
   *
   * Vira evidência de primeira classe, com fonte `proprio` — procedência
   * própria, separada de `humano`, que é resposta a uma pergunta do Brain. A
   * distinção não é burocracia: "ela contou porque perguntamos" e "ela contou
   * porque quis" são dois fatos diferentes sobre o registro, e o gráfico de
   * origem mostra os dois separados.
   *
   * A fonte carrega `em` além de `adicionadoPor` porque as duas datas do evento
   * são diferentes: o texto descreve o semestre e por isso o evento é datado em
   * `JANELA.fim`, enquanto adicionar aconteceu hoje. Sem o campo, a tela de
   * evidência mostrava a data da janela ao lado do nome dela, como se fosse a
   * procedência.
   */
  const adicionarContexto = useCallback(
    (pessoaId: PessoaId, texto: string) => {
      const limpo = texto.trim()
      if (!limpo || !pessoa(pessoaId)) return
      if (!podeCompletarRegistro(viewer, pessoaId).ok) return

      setSessao((s) => {
        const evento: Evento = {
          id: proximoId('ev', s.eventos.length),
          pessoaId,
          data: JANELA.fim,
          texto: limpo,
          fonte: { tipo: 'proprio', adicionadoPor: autor, em: HOJE },
        }
        return { ...s, eventos: [...s.eventos, evento] }
      })
    },
    [autor, viewer],
  )

  /**
   * O registro errou, e quem aparece nele diz isso.
   *
   * Duas coisas ao mesmo tempo: o item fica marcado (ele NÃO some — apagar
   * evidência contestada é reescrever a história, e o que o produto promete é
   * mostrar o que capturou), e a contestação entra na caixa do gestor da
   * pessoa, porque contestação que não chega em ninguém é formulário de
   * reclamação (JORNADAS §4).
   *
   * A pendência entra como `feedback`, e não como `pergunta`, por uma razão de
   * orçamento: `pergunta` consome uma das perguntas da semana do gestor, e a
   * contestação não é o Brain perguntando — é a pessoa falando.
   */
  const contestar = useCallback(
    (eventoId: EventoId, motivo: string) => {
      const limpo = motivo.trim()
      if (!limpo) return

      setSessao((s) => {
        if (s.contestacoes[eventoId]) return s
        const evento = sessaoLib.eventoPorId(s, eventoId)
        if (!evento) return s
        if (!podeCompletarRegistro(viewer, evento.pessoaId).ok) return s

        const gestorId = pessoa(evento.pessoaId)?.gestorId
        const contestacoes = {
          ...s.contestacoes,
          [eventoId]: { motivo: limpo, por: autor, em: HOJE },
        }
        // Sem gestor não há caixa para onde mandar. A marca no item fica de pé
        // de qualquer jeito: ela é o registro da discordância, não o recado.
        if (!gestorId) return { ...s, contestacoes }

        const pendencia: Pendencia = {
          id: proximoId('pd', s.pendenciasExtras.length),
          de: gestorId,
          tipo: 'feedback',
          sobre: evento.pessoaId,
          titulo: `${nomeDe(evento.pessoaId)} contestou um item do registro: "${evento.texto}"`,
          motivo: limpo,
          episodioId: evento.episodioId,
          acao: 'Agendar conversa',
        }
        return { ...s, contestacoes, pendenciasExtras: [...s.pendenciasExtras, pendencia] }
      })
    },
    [autor, viewer],
  )

  /**
   * Lastro que o sistema não tem, pedido a quem estava lá.
   *
   * Abre uma LACUNA e uma pendência no mesmo gesto, e as duas são necessárias.
   * A pendência é o pedido chegando na caixa do par; a lacuna é o que dá ao par
   * onde responder — sem ela, o item chegava com a ação "Responder" escrita e
   * sem campo nenhum na tela, porque `/feedback` só oferece o campo quando há
   * lacuna por trás (terceiro escrevendo no registro de outro sem procedência é
   * o que `validar.ts` recusa). O pedido saía e nada voltava: a terceira ação de
   * C3 não fechava o loop.
   *
   * A lacuna é declarada pela PESSOA, e não pelo Brain, e mesmo assim é uma
   * lacuna: o que ela nomeia é o que o registro não alcançou. Ela aparece no
   * dossiê como as outras, com o par como destinatário.
   *
   * Par não consulta par (§4 das jornadas, e `permissoes.ts` em código): o
   * pedido dá acesso a UM episódio para responder sobre ele, nunca ao dossiê.
   */
  const pedirFeedbackDePar = useCallback(
    (sobrePessoaId: PessoaId, episodioId: EpisodioId, aoPar: PessoaId) => {
      const episodio = episodioPorId(episodioId)
      if (!episodio || !pessoa(aoPar) || aoPar === sobrePessoaId) return
      if (!podeCompletarRegistro(viewer, sobrePessoaId).ok) return

      setSessao((s) => {
        const jaPediu = s.pendenciasExtras.some(
          (p) => p.de === aoPar && p.sobre === sobrePessoaId && p.episodioId === episodioId,
        )
        if (jaPediu) return s

        const motivo = `Vocês trabalharam juntos neste episódio e o registro não tem nada vindo de você. O pedido partiu de ${nomeDe(sobrePessoaId)}.`
        const lacuna: Lacuna = {
          id: proximoId('lac', s.lacunas.length),
          pessoaId: sobrePessoaId,
          pergunta: `O que ${nomeDe(aoPar)} viu no episódio "${episodio.titulo}"?`,
          perguntarA: aoPar,
          motivo,
          valor: 'media',
          status: 'aberta',
        }
        const pendencia: Pendencia = {
          id: proximoId('pd', s.pendenciasExtras.length),
          de: aoPar,
          tipo: 'pergunta',
          sobre: sobrePessoaId,
          titulo: `${nomeDe(sobrePessoaId)} pediu seu relato sobre "${episodio.titulo}".`,
          motivo,
          episodioId,
          lacunaId: lacuna.id,
          acao: 'Responder',
        }
        return {
          ...s,
          lacunas: [...s.lacunas, lacuna],
          pendenciasExtras: [...s.pendenciasExtras, pendencia],
        }
      })
    },
    [viewer],
  )

  /**
   * A linha assinada está errada, e quem foi avaliado diz isso — JORNADAS C5.
   *
   * `contestar` opera sobre um EVENTO, e por isso não alcançava a régua: só a
   * linha em que o gestor discordou tem evento por trás. Uma nota 2 assinada num
   * comportamento que a pessoa acha errado não tinha por onde ser contestada em
   * lugar nenhum do produto, e C5 promete o contrário.
   *
   * O destino é a caixa de QUEM ASSINOU, e não do gestor direto: quem responde
   * por uma nota é quem a assinou. Entra como `feedback` pelo mesmo motivo de
   * `contestar` — `pergunta` gastaria uma das perguntas da semana dele, e a
   * contestação não é o Brain perguntando.
   *
   * A nota não se mexe. Contestação não recalcula avaliação assinada: ela abre
   * uma conversa, e quem move nota é evidência.
   */
  const contestarLinha = useCallback(
    (cicloId: CicloId, pessoaId: PessoaId, comportamentoId: string, motivo: string) => {
      const limpo = motivo.trim()
      const comportamento = comportamentoPorId(comportamentoId)
      if (!limpo || !comportamento || !cicloPorId(cicloId)) return
      if (!podeCompletarRegistro(viewer, pessoaId).ok) return

      setSessao((s) => {
        const chave = sessaoLib.chaveDaLinha(cicloId, pessoaId, comportamentoId)
        if (s.contestacoesDeLinha[chave]) return s

        const avaliacao = sessaoLib.avaliacaoDe(s, cicloId, pessoaId)
        if (!avaliacao?.assinadaEm) return s

        const contestacoesDeLinha = {
          ...s.contestacoesDeLinha,
          [chave]: { motivo: limpo, por: autor, em: HOJE },
        }
        const pendencia: Pendencia = {
          id: proximoId('pd', s.pendenciasExtras.length),
          de: avaliacao.por,
          tipo: 'feedback',
          sobre: pessoaId,
          titulo: `${nomeDe(pessoaId)} contestou a linha "${comportamento.rotulo}" do ciclo fechado.`,
          motivo: limpo,
          acao: 'Agendar conversa',
        }
        return { ...s, contestacoesDeLinha, pendenciasExtras: [...s.pendenciasExtras, pendencia] }
      })
    },
    [autor, viewer],
  )

  /** Tratada nesta sessão: some da caixa. A caixa é o orçamento de atenção da
   *  semana, e item tratado que continua ali faz a semana parecer infinita. */
  const resolverPendencia = useCallback((id: string) => {
    setSessao((s) => (s.resolvidas.includes(id) ? s : { ...s, resolvidas: [...s.resolvidas, id] }))
  }, [])

  /* ───────────────────────────────────────────────────────────────────────
     O fechamento do ciclo — JORNADAS G5.

     Três saídas por linha da régua, e uma decisão no fim. O gestor não escreve
     avaliação: as três ações abaixo são a tela inteira, e duas delas não pedem
     texto nenhum.

     A regra que governa todas: **quem move a nota é evidência, nunca o clique.**
     `concordar` copia o que a contagem já dizia. `naoSei` não atribui nota
     nenhuma. Só `discordar` muda o número, e ele exige um episódio citado e uma
     frase — que viram lastro e evento antes de a nota ser recalculada, pela
     mesma `pontuar()` de sempre. Não existe caminho daqui até um número escrito
     à mão.
     ─────────────────────────────────────────────────────────────────────── */

  /**
   * Onde o veredito pousa: a avaliação da sessão, criada no primeiro gesto.
   *
   * Ela nasce no primeiro clique e não ao abrir a tela, porque abrir a tela não
   * é avaliar — um fechamento que existisse por ter sido visitado apareceria no
   * painel do RH como trabalho que ninguém fez.
   *
   * O último gesto sobre o mesmo comportamento vence: o gestor percorre a régua
   * e pode voltar atrás em qualquer linha enquanto não assinou. Depois de
   * assinada, nada entra — a avaliação fechada é registro, não rascunho.
   */
  const registrarVeredito = useCallback(
    (s: Sessao, cicloId: CicloId, pessoaId: PessoaId, autor: PessoaId, veredito: Veredito) => {
      const p = pessoa(pessoaId)
      if (!p?.trilha || !p.nivel) return s

      const atual = s.avaliacoes.find((a) => a.cicloId === cicloId && a.pessoaId === pessoaId)
      if (atual?.assinadaEm) return s

      const base: Avaliacao = atual ?? {
        id: proximoId('av', s.avaliacoes.length),
        cicloId,
        pessoaId,
        trilha: p.trilha,
        nivel: p.nivel,
        por: autor,
        vereditos: [],
      }
      const nova: Avaliacao = {
        ...base,
        vereditos: [
          ...base.vereditos.filter((v) => v.comportamentoId !== veredito.comportamentoId),
          veredito,
        ],
      }
      return {
        ...s,
        avaliacoes: atual
          ? s.avaliacoes.map((a) => (a === atual ? nova : a))
          : [...s.avaliacoes, nova],
      }
    },
    [],
  )

  /**
   * Concordo — a saída padrão, e um clique.
   *
   * A nota não é passada pela tela: ela é lida de `pontuar()` aqui dentro, com
   * os mesmos estrelados e lastros que a régua ao lado está usando. Receber o
   * número de quem desenhou a linha seria deixar a tela decidir o que a
   * avaliação guarda — e a tela não é a contagem.
   */
  const concordar = useCallback(
    (cicloId: CicloId, pessoaId: PessoaId, comportamentoId: string) => {
      if (!cicloPorId(cicloId) || !comportamentoPorId(comportamentoId)) return
      if (!podeAvaliar(viewer, pessoaId).ok) return

      setSessao((s) => {
        const nota = pontuar(
          pessoaId,
          comportamentoId,
          sessaoLib.estreladosDe(s, pessoaId),
          sessaoLib.lastrosDe(s, pessoaId),
        ).nivel
        return registrarVeredito(s, cicloId, pessoaId, autor, {
          comportamentoId,
          saida: 'concordo',
          notaIA: nota,
          nota,
          em: HOJE,
        })
      })
    },
    [autor, viewer, registrarVeredito],
  )

  /**
   * Discordo — o momento mais importante da tela.
   *
   * Quatro coisas nascem de uma frase, e a ordem entre elas é o argumento:
   *
   *   1. a LACUNA, que é a pergunta que a IA fez ("qual episódio sustenta isso?
   *      o que ela fez?") — sem ela a evidência não teria de onde vir, e
   *      `validar.ts` recusa evidência humana sem lacuna por trás;
   *   2. o EVENTO, com a resposta e procedência humana, visível no dossiê dela;
   *   3. o LASTRO, que liga o episódio citado ao comportamento — é ele que move
   *      a nota, porque `pontuar()` conta episódios e não frases;
   *   4. o VEREDITO, com as duas notas: a que a IA propôs e a que ficou.
   *
   * Sem o passo 3 a frase entraria no registro e o número não se mexeria: o
   * gestor teria escrito uma justificativa, que é o formulário que este produto
   * matou. Sem o passo 2 o número se moveria sem evidência nova, e aí ele
   * deixaria de ser contagem e viraria opinião com um número na frente — que é
   * o argumento inteiro pelo qual a nota existe.
   *
   * A nota nova não é escolhida por ninguém. Ela sai da mesma conta, com um
   * episódio a mais: se o episódio citado já sustentava o comportamento, o
   * número não sobe, e isso é correto — a evidência não era nova.
   */
  const discordar = useCallback(
    (
      cicloId: CicloId,
      pessoaId: PessoaId,
      comportamentoId: string,
      entrada: { episodioId: EpisodioId; texto: string },
    ) => {
      const limpo = entrada.texto.trim()
      const comportamento = comportamentoPorId(comportamentoId)
      const episodio = episodioPorId(entrada.episodioId)
      if (!limpo || !comportamento || !episodio || !cicloPorId(cicloId)) return
      if (episodio.pessoaId !== pessoaId) return
      if (!podeAvaliar(viewer, pessoaId).ok) return

      setSessao((s) => {
        const estrelados = sessaoLib.estreladosDe(s, pessoaId)
        const lastros = sessaoLib.lastrosDe(s, pessoaId)

        /* `notaIA` é o que a CONTAGEM propunha, e por isso os lastros deste
         * comportamento saem daqui: eles são declaração humana feita nesta
         * mesma tela. Sem o filtro, discordar duas vezes da mesma linha gravava
         * como proposta da IA a nota que a primeira discordância já tinha
         * produzido — a Carla lia "1 → 2" sobre um comportamento em que a IA
         * nunca propôs 1 (ela não propôs nada), e o "sem evidência" original
         * sumia da contagem do RH, que é justamente o sinal de A5. */
        const antes = pontuar(
          pessoaId,
          comportamentoId,
          estrelados,
          lastros.filter((l) => l.comportamentoId !== comportamentoId),
        )

        const lacuna: Lacuna = {
          id: proximoId('lac', s.lacunas.length),
          pessoaId,
          pergunta: `Qual episódio sustenta "${comportamento.rotulo}"? O que ${primeiroNome(nomeDe(pessoaId))} fez?`,
          perguntarA: autor,
          motivo: `${nomeDe(autor)} discordou da nota deste comportamento no fechamento do ciclo.`,
          valor: 'alta',
          status: 'aberta',
        }
        // Datado em `JANELA.fim` pelo mesmo motivo de toda evidência criada
        // agora: o texto descreve trabalho do semestre avaliado, e datá-lo hoje
        // o tiraria do gráfico de evidência por mês do próprio dossiê.
        const evento: Evento = {
          id: proximoId('ev', s.eventos.length),
          pessoaId,
          data: JANELA.fim,
          texto: limpo,
          fonte: { tipo: 'humano', respondidoPor: autor, lacunaId: lacuna.id },
        }
        const lastro: Lastro = {
          pessoaId,
          comportamentoId,
          episodioId: entrada.episodioId,
          eventoId: evento.id,
          por: autor,
          em: HOJE,
        }

        const comLastro: Sessao = {
          ...s,
          lacunas: [...s.lacunas, lacuna],
          respostas: { ...s.respostas, [lacuna.id]: { texto: limpo, por: autor, em: HOJE } },
          eventos: [...s.eventos, evento],
          lastros: [...s.lastros, lastro],
        }

        const depois = pontuar(
          pessoaId,
          comportamentoId,
          estrelados,
          sessaoLib.lastrosDe(comLastro, pessoaId),
        )

        return registrarVeredito(comLastro, cicloId, pessoaId, autor, {
          comportamentoId,
          saida: 'discordo',
          notaIA: antes.nivel,
          nota: depois.nivel,
          eventoId: evento.id,
          episodioId: entrada.episodioId,
          em: HOJE,
        })
      })
    },
    [autor, viewer, registrarVeredito],
  )

  /**
   * Não sei — a saída que não custa nada e registra tudo.
   *
   * Vira lacuna aberta com dono e prazo, e o prazo é o fim da janela de
   * fechamento: a pergunta existe para sustentar uma avaliação com data, então
   * uma resposta que chegue depois dela chega para o ciclo seguinte.
   *
   * O veredito fica SEM nota, de propósito. Herdar o número da IA aqui seria
   * fechar o comportamento com um veredito que ninguém sustentou — e é
   * exatamente isso que o fechamento precisa poder registrar: que aquela linha
   * passou sem lastro.
   *
   * A LACUNA E A PENDÊNCIA NASCEM JUNTAS, pelo mesmo motivo de
   * `pedirFeedbackDePar`: a lacuna é onde a resposta cabe, a pendência é o
   * pedido chegando na caixa de alguém. Enquanto só a lacuna era criada, a tela
   * prometia "vira pergunta aberta, com dono e prazo" e a caixa do dono
   * continuava com os itens da semente — a pergunta saía e nada voltava.
   * JORNADAS G5: "as lacunas abertas entram na fila da próxima semana".
   */
  const naoSei = useCallback(
    (cicloId: CicloId, pessoaId: PessoaId, comportamentoId: string, perguntarA: PessoaId) => {
      const ciclo = cicloPorId(cicloId)
      const comportamento = comportamentoPorId(comportamentoId)
      if (!ciclo || !comportamento || !pessoa(perguntarA)) return
      if (!podeAvaliar(viewer, pessoaId).ok) return

      setSessao((s) => {
        // Repetir o mesmo "não sei" para o mesmo dono não abre uma segunda
        // pergunta: seriam dois itens na caixa dele sobre a mesma linha.
        const atual = s.avaliacoes.find((a) => a.cicloId === cicloId && a.pessoaId === pessoaId)
        const jaAberta = atual?.vereditos.find(
          (v) => v.comportamentoId === comportamentoId && v.saida === 'nao-sei',
        )
        if (jaAberta && s.lacunas.find((l) => l.id === jaAberta.lacunaId)?.perguntarA === perguntarA)
          return s

        const nota = pontuar(
          pessoaId,
          comportamentoId,
          sessaoLib.estreladosDe(s, pessoaId),
          sessaoLib.lastrosDe(s, pessoaId),
        ).nivel

        const motivo = `Ficou sem lastro no fechamento do ciclo: ${nomeDe(autor)} não soube responder por este comportamento.`
        const lacuna: Lacuna = {
          id: proximoId('lac', s.lacunas.length),
          pessoaId,
          pergunta: `O que sustenta "${comportamento.texto.replace(/\.$/, '')}" no trabalho de ${primeiroNome(nomeDe(pessoaId))} neste semestre?`,
          perguntarA,
          motivo,
          valor: 'alta',
          status: 'aberta',
          prazo: ciclo.fechamento.fecha,
        }
        const pendencia: Pendencia = {
          id: proximoId('pd', s.pendenciasExtras.length),
          de: perguntarA,
          tipo: 'pergunta',
          sobre: pessoaId,
          titulo: lacuna.pergunta,
          motivo,
          lacunaId: lacuna.id,
          acao: 'Responder',
        }

        return registrarVeredito(
          {
            ...s,
            lacunas: [...s.lacunas, lacuna],
            pendenciasExtras: [...s.pendenciasExtras, pendencia],
          },
          cicloId,
          pessoaId,
          autor,
          {
            comportamentoId,
            saida: 'nao-sei',
            notaIA: nota,
            lacunaId: lacuna.id,
            em: HOJE,
          },
        )
      })
    },
    [autor, viewer, registrarVeredito],
  )

  /**
   * A decisão, que é humana e a IA não sugere — e a assinatura junto.
   *
   * As duas no mesmo gesto porque são o mesmo ato: decidir sem assinar deixaria
   * o fechamento num estado que ninguém sabe ler, e assinar sem decidir fecharia
   * um ciclo sem a única coisa que o ciclo existe para produzir.
   *
   * A partir daqui a avaliação para de se mexer. Reconhecer um episódio depois
   * disso muda a régua do dossiê e NÃO muda esta avaliação — o que ficou
   * registrado é o que o gestor assinou, na data em que assinou.
   *
   * A LINHA QUE NINGUÉM TOCOU É ASSINADA COMO "CONCORDO". "Concordo é um
   * clique, ou não fazer nada — o padrão é concordar" (G5), e o padrão só é
   * padrão se ele for para o registro: uma avaliação assinada pela metade
   * deixaria o produto sem saber dizer se aquele comportamento foi lido e
   * aceito ou pulado. Aqui as duas coisas viram a mesma, e é a verdadeira —
   * quem assina, assina a régua inteira.
   */
  const decidirCiclo = useCallback(
    (cicloId: CicloId, pessoaId: PessoaId, decisao: DecisaoDeCiclo) => {
      const p = pessoa(pessoaId)
      if (!cicloPorId(cicloId) || !p?.trilha || !p.nivel) return
      if (!podeAvaliar(viewer, pessoaId).ok) return

      setSessao((s) => {
        const atual = s.avaliacoes.find((a) => a.cicloId === cicloId && a.pessoaId === pessoaId)
        if (atual?.assinadaEm) return s

        const cobertos =
          comportamentosCobertos(
            pessoaId,
            p.trilha!,
            p.nivel!,
            sessaoLib.estreladosDe(s, pessoaId),
            sessaoLib.lastrosDe(s, pessoaId),
          ) ?? []

        const vereditos: Veredito[] = cobertos.map((c) => {
          const dado = atual?.vereditos.find((v) => v.comportamentoId === c.id)
          return (
            dado ?? {
              comportamentoId: c.id,
              saida: 'concordo',
              notaIA: c.nivel,
              nota: c.nivel,
              em: HOJE,
            }
          )
        })

        const assinada: Avaliacao = {
          id: atual?.id ?? proximoId('av', s.avaliacoes.length),
          cicloId,
          pessoaId,
          trilha: p.trilha!,
          nivel: p.nivel!,
          por: atual?.por ?? autor,
          vereditos,
          decisao,
          assinadaEm: HOJE,
        }

        return {
          ...s,
          avaliacoes: atual
            ? s.avaliacoes.map((a) => (a === atual ? assinada : a))
            : [...s.avaliacoes, assinada],
        }
      })
    },
    [autor, viewer],
  )

  // ── leitores ──────────────────────────────────────────────────────────────
  // Todos delegam para `lib/sessao.ts`, que é a mesma mesclagem que as tools do
  // agente usam. Reimplementá-los aqui seria pedir para o chat e a tela
  // divergirem de novo, agora com duas cópias da mesma regra.

  const eventosDe = useCallback((id: PessoaId) => sessaoLib.eventosDe(sessao, id), [sessao])
  const eventoPorId = useCallback((id: EventoId) => sessaoLib.eventoPorId(sessao, id), [sessao])
  const feedbacksDe = useCallback((id: PessoaId) => sessaoLib.feedbacksDe(sessao, id), [sessao])
  const lacunasDe = useCallback((id: PessoaId) => sessaoLib.lacunasDe(sessao, id), [sessao])
  const estrelaDe = useCallback((id: EpisodioId) => sessaoLib.estrelaDe(sessao, id), [sessao])
  const estreladosDe = useCallback((id: PessoaId) => sessaoLib.estreladosDe(sessao, id), [sessao])
  const contestacaoDe = useCallback(
    (id: EventoId) => sessaoLib.contestacaoDe(sessao, id),
    [sessao],
  )
  const contestacaoDeLinha = useCallback(
    (cicloId: CicloId, id: PessoaId, comportamentoId: string) =>
      sessaoLib.contestacaoDeLinha(sessao, cicloId, id, comportamentoId),
    [sessao],
  )
  const pendenciasDe = useCallback((id: PessoaId) => sessaoLib.pendenciasDe(sessao, id), [sessao])
  const resumoDe = useCallback((id: PessoaId) => sessaoLib.resumoDe(sessao, id), [sessao])
  const lastrosDe = useCallback((id: PessoaId) => sessaoLib.lastrosDe(sessao, id), [sessao])
  const avaliacaoDe = useCallback(
    (cicloId: CicloId, id: PessoaId) => sessaoLib.avaliacaoDe(sessao, cicloId, id),
    [sessao],
  )
  const avaliacoesDe = useCallback((id: PessoaId) => sessaoLib.avaliacoesDe(sessao, id), [sessao])
  const avaliacoesDoCiclo = useCallback(
    (cicloId: CicloId) => sessaoLib.avaliacoesDoCiclo(sessao, cicloId),
    [sessao],
  )

  const valor = useMemo(
    () => ({
      sessao,
      eventos: sessao.eventos,
      feedbacks: sessao.feedbacks,
      respostas: sessao.respostas,
      contestacoes: sessao.contestacoes,
      lastros: sessao.lastros,
      avaliacoes: sessao.avaliacoes,
      pendenciasExtras: sessao.pendenciasExtras,
      resolvidas: sessao.resolvidas,
      responderLacuna,
      reconhecer,
      registrarConversa,
      adicionarContexto,
      contestar,
      contestarLinha,
      pedirFeedbackDePar,
      resolverPendencia,
      concordar,
      discordar,
      naoSei,
      decidirCiclo,
      eventosDe,
      eventoPorId,
      feedbacksDe,
      lacunasDe,
      estrelaDe,
      estreladosDe,
      contestacaoDe,
      contestacaoDeLinha,
      pendenciasDe,
      resumoDe,
      lastrosDe,
      avaliacaoDe,
      avaliacoesDe,
      avaliacoesDoCiclo,
    }),
    [
      sessao,
      responderLacuna,
      reconhecer,
      registrarConversa,
      adicionarContexto,
      contestar,
      contestarLinha,
      pedirFeedbackDePar,
      resolverPendencia,
      concordar,
      discordar,
      naoSei,
      decidirCiclo,
      eventosDe,
      eventoPorId,
      feedbacksDe,
      lacunasDe,
      estrelaDe,
      estreladosDe,
      contestacaoDe,
      contestacaoDeLinha,
      pendenciasDe,
      resumoDe,
      lastrosDe,
      avaliacaoDe,
      avaliacoesDe,
      avaliacoesDoCiclo,
    ],
  )

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useRegistro() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useRegistro precisa estar dentro de <ProvedorRegistro>')
  return ctx
}

/** O tipo do delta, para quem só precisa mandá-lo adiante. */
export type { Registro, Sessao } from '@/lib/sessao'
