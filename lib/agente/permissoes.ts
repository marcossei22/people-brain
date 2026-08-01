/**
 * Permissão em CÓDIGO, nunca em prompt — ARQUITETURA.md §6.6 e princípio 4.
 *
 * Regra de acesso escrita só no system prompt é contornável com uma pergunta
 * esperta, e isso seria uma falha catastrófica na frente da liderança. Toda
 * tool chama daqui antes de tocar em dado. Negação devolve objeto estruturado
 * que o modelo EXPLICA — ele não inventa a recusa, relata uma que já aconteceu.
 */

import { pessoas } from '@/data/pessoas'
import type { Pessoa, PessoaId } from '@/data/tipos'
import type { Viewer } from '@/lib/viewer'

export type Autorizacao =
  | { ok: true; escopo?: 'agregado' }
  | { ok: false; motivo: string }

export function ehReportDireto(gestorId: PessoaId, alvo: PessoaId): boolean {
  return pessoas.some((p) => p.id === alvo && p.gestorId === gestorId)
}

export function podeConsultar(viewer: Viewer, alvo: PessoaId): Autorizacao {
  if (viewer.pessoaId === alvo) return { ok: true }
  if (viewer.papel === 'gestor' && ehReportDireto(viewer.pessoaId, alvo)) return { ok: true }
  if (viewer.papel === 'chro') return { ok: true, escopo: 'agregado' }
  return {
    ok: false,
    motivo: 'Pares não consultam o registro de pares. Só você e seu gestor veem o seu.',
  }
}

/**
 * A régua é doutrina da empresa, não conteúdo de gestor individual (§8.4).
 * No protótipo o papel de admin mora na CHRO — quem escreve a régua é quem
 * responde por ela. Uma quarta persona no seletor custaria tempo de vídeo
 * sem provar nada que a Helena já não prove.
 */
export function podeAdministrar(viewer: Viewer): boolean {
  return viewer.papel === 'chro'
}

/** Diagnóstico de organização é output agregado — não é sobre uma pessoa. */
export function podeVerDiagnosticoOrg(viewer: Viewer): boolean {
  return viewer.papel === 'chro'
}

/**
 * As pessoas que este viewer alcança. A lista de `/org` é literalmente esta
 * função na tela: a permissão deixa de ser parágrafo e vira o que se vê.
 */
export function pessoasVisiveis(viewer: Viewer): Pessoa[] {
  return pessoas.filter((p) => podeConsultar(viewer, p.id).ok)
}
