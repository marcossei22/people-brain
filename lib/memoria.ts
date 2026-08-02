/**
 * Consultas sobre a memória — ARQUITETURA.md §6.3.
 * Funções puras e determinísticas sobre os dados tipados. As tools do agente
 * (passo 4) chamam daqui depois de passar por `permissoes.ts`; as telas
 * chamam direto, sem passar pelo agente.
 */

import { pessoas } from '@/data/pessoas'
import { eventos } from '@/data/eventos'
import { episodios } from '@/data/episodios'
import { temas } from '@/data/temas'
import { lacunas } from '@/data/lacunas'
import { feedbacks } from '@/data/feedbacks'
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

export function diasDesde(iso: string | undefined, hoje = '2026-08-01'): number | undefined {
  if (!iso) return undefined
  const ms = Date.parse(hoje) - Date.parse(iso)
  return Math.max(0, Math.round(ms / 86_400_000))
}

export const feedbacksDe = (pessoaId: PessoaId) =>
  feedbacks.filter((f) => f.paraPessoaId === pessoaId).sort((a, b) => b.data.localeCompare(a.data))

/** Último feedback recebido. Alimenta "quem está sem retorno há mais tempo". */
export const ultimoFeedback = (pessoaId: PessoaId) => feedbacksDe(pessoaId)[0]?.data

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
  }
}
