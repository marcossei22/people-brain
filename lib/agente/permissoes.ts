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

/* ─────────────────────────────────────────────────────────────────────────
   Escrita. Mesma doutrina, o outro lado dela.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Quem pode escrever no registro de quem — e por que isto não é um `&&` na tela.
 *
 * A leitura já passava por aqui em toda tool e no dossiê; a escrita nasceu com a
 * regra duplicada num condicional de JSX (`viewer.papel === 'gestor' && p.gestorId
 * === viewer.pessoaId`), e a cópia já divergia do modelo de dados: a Helena é a
 * gestora declarada de três pessoas em `data/pessoas.ts` e o papel dela é `chro`,
 * então metade da condição a excluía e Letícia, Sofia e Diego não podiam receber
 * reconhecimento nem conversa de ninguém no produto inteiro.
 *
 * Quem manda é o `gestorId`. Papel diz o que a pessoa faz no produto; gestor de
 * alguém é um fato do organograma, e é esse fato que autoriza reconhecer.
 */
export function ehGestorDe(viewer: Viewer, alvo: PessoaId): boolean {
  return ehReportDireto(viewer.pessoaId, alvo)
}

const SO_O_GESTOR =
  'Reconhecimento e conversa são gestos de quem responde pela pessoa. Só o gestor direto dela registra.'

/** A estrela é do gestor, e nunca da própria pessoa — a mesma regra que
 *  `validar.ts` aplica sobre a semente. */
export function podeReconhecer(viewer: Viewer, alvo: PessoaId): Autorizacao {
  if (viewer.pessoaId === alvo)
    return { ok: false, motivo: 'Ninguém reconhece o próprio trabalho.' }
  if (!ehGestorDe(viewer, alvo)) return { ok: false, motivo: SO_O_GESTOR }
  return { ok: true, escopo: 'time' }
}

/** Registrar que a conversa aconteceu é o mesmo alcance do reconhecimento: quem
 *  conversa com a pessoa é quem responde por ela. */
export function podeRegistrarConversa(viewer: Viewer, alvo: PessoaId): Autorizacao {
  if (viewer.pessoaId === alvo)
    return { ok: false, motivo: 'Conversa se registra com outra pessoa, não consigo mesmo.' }
  if (!ehGestorDe(viewer, alvo)) return { ok: false, motivo: SO_O_GESTOR }
  return { ok: true, escopo: 'time' }
}

/**
 * As três ações de C3 — adicionar contexto, contestar item, pedir relato a um
 * par — são da pessoa sobre o próprio registro, e de mais ninguém.
 *
 * Terceiro escrevendo no registro de outro sem pergunta por trás é exatamente o
 * que `validar.ts` recusa na semente: evidência sem procedência declarada.
 */
export function podeCompletarRegistro(viewer: Viewer, alvo: PessoaId): Autorizacao {
  if (viewer.pessoaId !== alvo)
    return {
      ok: false,
      motivo: 'Completar, contestar e pedir relato são ações de quem aparece no registro.',
    }
  return { ok: true, escopo: 'proprio' }
}

/** Responder uma lacuna é de quem ela pergunta a. A resposta entra no dossiê de
 *  quem a pergunta era SOBRE — por isso a autoria importa aqui e não lá. */
export function podeResponderLacuna(
  viewer: Viewer,
  lacuna: { perguntarA: PessoaId },
): Autorizacao {
  if (viewer.pessoaId !== lacuna.perguntarA)
    return { ok: false, motivo: 'Esta pergunta foi feita a outra pessoa.' }
  return { ok: true, escopo: 'proprio' }
}

/**
 * Quem fecha o ciclo de quem — JORNADAS G5.
 *
 * Duas condições, e a segunda não é detalhe técnico: sem trilha e nível não
 * existe régua contra a qual avaliar, e uma tela de fechamento sem régua seria
 * o formulário em branco voltando pela porta dos fundos. A Helena é CHRO e
 * mesmo assim entra aqui pelo `gestorId` — quem avalia é o gestor direto, e
 * papel no produto não substitui fato do organograma.
 *
 * A CHRO NÃO avalia quem não reporta a ela, e é por isso que este gate não
 * repete o `podeConsultar`: ela lê o registro da organização inteira (com
 * rastro de auditoria) e não assina o fechamento de ninguém fora do time dela.
 * Ler e julgar são alcances diferentes.
 */
export function podeAvaliar(viewer: Viewer, alvo: PessoaId): Autorizacao {
  const p = pessoas.find((x) => x.id === alvo)
  if (!p) return { ok: false, motivo: `Não existe ninguém com o identificador "${alvo}".` }
  if (!ehGestorDe(viewer, alvo))
    return {
      ok: false,
      motivo: 'O fechamento é assinado pelo gestor direto. Esta pessoa não reporta a você.',
    }
  if (!p.trilha || !p.nivel)
    return {
      ok: false,
      motivo: `${p.nome} não tem trilha e nível definidos — não há régua contra a qual fechar o ciclo.`,
    }
  return { ok: true, escopo: 'time' }
}

/** Quem este viewer fecha neste ciclo. A lista da tela É esta função, como a
 *  de `/org` é `pessoasVisiveis`. */
export function pessoasAvaliaveis(viewer: Viewer): Pessoa[] {
  return pessoas.filter((p) => podeAvaliar(viewer, p.id).ok)
}

/**
 * Quem assina o fechamento desta pessoa — `podeAvaliar` visto do outro lado.
 *
 * É o que a tela do colaborador pergunta: a janela de contexto de C4 só existe
 * para quem tem ciclo a fechar, e quem tem ciclo a fechar é quem tem gestor com
 * régua. Quem não tem — a Marina, a Helena — não vê a tela, e não vê porque não
 * há nada acontecendo, não porque foi escondido.
 *
 * Delega em `podeAvaliar` em vez de reescrever as condições: a regra de quem
 * julga quem é uma só, e duas cópias dela divergiriam no dia em que uma trilha
 * nova entrasse sem nível.
 */
export function quemAvalia(alvo: PessoaId): PessoaId | undefined {
  const gestorId = pessoas.find((p) => p.id === alvo)?.gestorId
  if (!gestorId) return undefined
  return podeAvaliar({ pessoaId: gestorId, papel: 'gestor' }, alvo).ok ? gestorId : undefined
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
