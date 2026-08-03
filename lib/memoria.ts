/**
 * Consultas sobre a memória — ARQUITETURA.md §6.3.
 * Funções puras e determinísticas sobre os dados tipados.
 *
 * TUDO AQUI VÊ SÓ A SEMENTE. Quem conta alguma coisa que a sessão pode ter
 * mudado — evento, feedback, lacuna, estrela — chama `lib/sessao.ts`, que
 * mescla as duas e é a mesma leitura que as tools do agente usam. Contar por
 * aqui numa tela que escreve é como o dossiê e a lista de `/org` passaram a
 * discordar sobre a mesma pessoa a um clique de distância.
 *
 * O que continua saindo daqui é o que a sessão não cria: pessoa, episódio,
 * tema, e as conversões de data.
 */

import { pessoas } from '@/data/pessoas'
import { eventos } from '@/data/eventos'
import { episodios } from '@/data/episodios'
import { temas } from '@/data/temas'
import { lacunas } from '@/data/lacunas'
import { feedbacks } from '@/data/feedbacks'
import { HOJE } from '@/data/tipos'
import type { Pessoa, PessoaId } from '@/data/tipos'

export const pessoa = (id: PessoaId): Pessoa | undefined => pessoas.find((p) => p.id === id)

export const nomeDe = (id: PessoaId) => pessoa(id)?.nome ?? id

export const reportsDe = (gestorId: PessoaId) => pessoas.filter((p) => p.gestorId === gestorId)

export const eventosDe = (pessoaId: PessoaId) =>
  eventos.filter((e) => e.pessoaId === pessoaId).sort((a, b) => b.data.localeCompare(a.data))

export const episodiosDe = (pessoaId: PessoaId) =>
  episodios.filter((e) => e.pessoaId === pessoaId).sort((a, b) => b.fim.localeCompare(a.fim))

export const temasDe = (pessoaId: PessoaId) => temas.filter((t) => t.pessoaId === pessoaId)

export const lacunasAbertasDe = (pessoaId: PessoaId) =>
  lacunas.filter((l) => l.pessoaId === pessoaId && l.status === 'aberta')

/** Último sinal de trabalho registrado. Alimenta "quem está sem feedback há
 *  mais tempo" e o rótulo de silêncio no `/org`. */
export function ultimoRegistro(pessoaId: PessoaId): string | undefined {
  return eventosDe(pessoaId)[0]?.data
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** "2026-06-27" → "27 jun". Data em texto de leitura, não em ISO: ISO é para
 *  quando a tela está mostrando o mecanismo, não a informação. */
export function dataCurta(iso: string): string {
  const [, mes, dia] = iso.split('-')
  return `${Number(dia)} ${MESES[Number(mes) - 1]}`
}

export function diasDesde(iso: string | undefined, hoje: string = HOJE): number | undefined {
  if (!iso) return undefined
  const ms = Date.parse(hoje) - Date.parse(iso)
  return Math.max(0, Math.round(ms / 86_400_000))
}

/** Dias daqui até uma data. O par de `diasDesde` para a frente: a janela de
 *  fechamento é a única coisa do produto que conta nessa direção, e ela é dita
 *  em três telas — a lista do ciclo, o painel do gestor e o aviso que a pessoa
 *  avaliada recebe. Uma conta só, para as três não discordarem sobre quantos
 *  dias faltam. */
export function diasAte(iso: string, hoje: string = HOJE): number {
  return Math.max(0, Math.round((Date.parse(iso) - Date.parse(hoje)) / 86_400_000))
}

export const feedbacksDe = (pessoaId: PessoaId) =>
  feedbacks.filter((f) => f.paraPessoaId === pessoaId).sort((a, b) => b.data.localeCompare(a.data))

/** Último feedback recebido. Alimenta "quem está sem retorno há mais tempo". */
export const ultimoFeedback = (pessoaId: PessoaId) => feedbacksDe(pessoaId)[0]?.data

/**
 * Meses desde o último feedback, arredondados como uma pessoa arredondaria.
 *
 * Existe num lugar só porque o chat e o `/feedback` estavam dando números
 * diferentes para o mesmo Bruno — a tela dizia "4 meses" e o Brain dizia
 * "mais de 3". Duas falas sobre a mesma pessoa, na mesma gravação.
 */
export function mesesSemFeedback(pessoaId: PessoaId): number | undefined {
  const dias = diasDesde(ultimoFeedback(pessoaId))
  return dias === undefined ? undefined : Math.round(dias / 30.44)
}

/** Contagem por pessoa — usada nos indicadores do `/org`. */
export function resumoDe(pessoaId: PessoaId) {
  const eps = episodiosDe(pessoaId)
  return {
    eventos: eventosDe(pessoaId).length,
    episodios: eps.length,
    estrelas: eps.filter((e) => e.estrela).length,
    lacunasAbertas: lacunasAbertasDe(pessoaId).length,
    ultimo: ultimoRegistro(pessoaId),
    feedbacks: feedbacksDe(pessoaId).length,
    ultimoFeedback: ultimoFeedback(pessoaId),
    mesesSemFeedback: mesesSemFeedback(pessoaId),
  }
}
