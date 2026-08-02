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
  | { ok: true; escopo: 'proprio' | 'time' | 'organizacao' }
  | { ok: false; motivo: string }

export function ehReportDireto(gestorId: PessoaId, alvo: PessoaId): boolean {
  return pessoas.some((p) => p.id === alvo && p.gestorId === gestorId)
}

export function podeConsultar(viewer: Viewer, alvo: PessoaId): Autorizacao {
  /* Ninguém com esse id. Não é recusa de acesso, e responder "essa pessoa não
   * está no seu time" seria pior do que inútil: afirmaria que ela existe. Quem
   * está no organograma não é segredo — o que é segredo é o registro. */
  if (!pessoas.some((p) => p.id === alvo))
    return { ok: false, motivo: `Não existe ninguém com o identificador "${alvo}" no registro.` }

  if (viewer.pessoaId === alvo) return { ok: true, escopo: 'proprio' }
  if (viewer.papel === 'gestor' && ehReportDireto(viewer.pessoaId, alvo))
    return { ok: true, escopo: 'time' }

  /* A CHRO alcança o registro individual de toda a organização, e o campo diz
   * isso. Antes dizia `agregado`, que era o que a gente queria que fosse e não
   * o que o código fazia — num protótipo cuja tese é "permissão é código",
   * comentário que não bate com a função é pior do que comentário nenhum. Na
   * produção esse escopo é onde entraria a trilha de auditoria. */
  if (viewer.papel === 'chro') return { ok: true, escopo: 'organizacao' }

  if (viewer.papel === 'gestor')
    return {
      ok: false,
      motivo:
        'Um gestor vê o próprio registro e o de quem reporta a ele. Esta pessoa não está no seu time.',
    }

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
