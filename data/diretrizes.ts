/**
 * Índice das diretrizes — o conteúdo fixo que a empresa define no Setup.
 *
 * Os procedimentos do agente (as skills) NÃO vivem aqui: são perfil do Brain,
 * não doutrina da empresa. Esta página é só o que a Aurora acredita e decidiu.
 *
 * `usadoPara` / `naoUsadoPara` é o campo que impede isto de ser um wiki: cada
 * documento declara o que o Brain faz com ele. O de cultura dizer "não é
 * critério de avaliação" responde antecipadamente a pergunta que a liderança
 * vai fazer, e responde no próprio documento (decisão #9).
 */

export type TipoDiretriz = 'regua' | 'cultura' | 'contexto' | 'politica'

export interface Diretriz {
  id: string
  tipo: TipoDiretriz
  titulo: string
  resumo: string
  /** Nome do arquivo em /doutrina. A régua não tem: é estruturada. */
  arquivo?: string
  autor: string
  atualizadoEm: string
  origem: 'escrito' | 'arquivo' | 'derivado'
  nomeDoArquivoOriginal?: string
  /** Contexto de ciclo expira. Doutrina permanente não. */
  validoAte?: string
  usadoPara: string
  naoUsadoPara: string
  sugestaoPendente?: {
    texto: string
    baseadoEm: string
  }
}

export const diretrizes: Diretriz[] = [
  {
    id: 'regua',
    tipo: 'regua',
    titulo: 'Régua de carreira',
    resumo: 'Duas trilhas, três níveis, comportamento a comportamento — cada um com o que conta como observável.',
    autor: 'helena',
    atualizadoEm: '2026-03-12',
    origem: 'arquivo',
    nomeDoArquivoOriginal: 'ladder-aurora-v3.pdf',
    usadoPara: 'Comparar a evidência de uma pessoa contra a expectativa do nível.',
    naoUsadoPara: 'Ordenar pessoas entre si, ou produzir nota.',
    /* Sem `sugestaoPendente` escrita, e é a única ficha assim. As sugestões da
     * régua são calculadas do registro em `lib/regua-viva.ts` — guardar aqui
     * uma cópia em prosa seria a mesma afirmação em dois lugares, com a de cá
     * envelhecendo sozinha assim que a evidência mudasse. Quem conta as
     * pendentes no índice pergunta ao cálculo. */
  },
  {
    id: 'cultura',
    tipo: 'cultura',
    titulo: 'Cultura e tom',
    resumo: 'Como a Aurora trabalha e como se fala sobre trabalho aqui.',
    arquivo: 'cultura.md',
    autor: 'helena',
    atualizadoEm: '2026-02-02',
    origem: 'escrito',
    usadoPara: 'Governar o tom de tudo que o Brain escreve — rascunho de feedback, resumo, pauta.',
    naoUsadoPara: 'Avaliar ninguém. Não se mede pessoa contra valor.',
    sugestaoPendente: {
      texto:
        'O documento fala em "problema de outro time também é problema". Nas últimas 12 promoções a sênior, isso apareceu como: puxar acordo com o time bloqueador, documentar o handoff, e assumir o prazo. Vale escrever assim?',
      baseadoEm: '12 promoções a sênior nos últimos 18 meses',
    },
  },
  {
    id: 'contexto-do-semestre',
    tipo: 'contexto',
    titulo: 'Contexto do semestre',
    resumo: 'As três prioridades de fev–jul 2026 e o que elas mudam na leitura da evidência.',
    arquivo: 'contexto-do-semestre.md',
    autor: 'helena',
    atualizadoEm: '2026-02-06',
    origem: 'escrito',
    validoAte: '2026-07-31',
    usadoPara: 'Ponderar o que conta como impacto neste ciclo.',
    naoUsadoPara: 'Valer para ciclos anteriores ou posteriores.',
  },
  {
    id: 'politica-de-decisao',
    tipo: 'politica',
    titulo: 'Política de decisão',
    resumo: 'Quem decide promoção e mérito, quando, e o que um caso precisa conter.',
    arquivo: 'politica-de-decisao.md',
    autor: 'helena',
    atualizadoEm: '2026-01-30',
    origem: 'arquivo',
    nomeDoArquivoOriginal: 'politica-carreira-2026.docx',
    usadoPara: 'Saber quando cada decisão acontece e o que o comitê precisa ver.',
    naoUsadoPara: 'Decidir no lugar de alguém.',
  },
]

export const NOME_TIPO: Record<TipoDiretriz, string> = {
  regua: 'Régua',
  cultura: 'Cultura',
  contexto: 'Contexto',
  politica: 'Política',
}

export const NOME_ORIGEM: Record<Diretriz['origem'], string> = {
  escrito: 'escrito no produto',
  arquivo: 'importado de arquivo',
  derivado: 'derivado da evidência',
}
