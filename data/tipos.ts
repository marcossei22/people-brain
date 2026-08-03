/**
 * Modelo de dados do People Brain — ARQUITETURA.md §5.1
 *
 * Espelha a cadeia do PLANO.md §3.2: evento → episódio → tema → lacuna.
 * Nada aqui é opinião sobre a pessoa. Os tipos guardam TRABALHO, e é por isso
 * que a recusa do §6.7 não precisa ser uma política: não existe campo de
 * sentimento, então não há com o que responder.
 */

export type PessoaId = string
export type EventoId = string
export type EpisodioId = string
export type LacunaId = string
export type TemaId = string
export type CicloId = string
export type AvaliacaoId = string

export type Trilha = 'eng' | 'sales' | 'design'
export type Nivel = 'pleno' | 'senior' | 'staff'

/** Janela do semestre em avaliação. `validar.ts` recusa evento fora dela. */
export const JANELA = { inicio: '2026-02-01', fim: '2026-07-31' } as const

/**
 * O "hoje" do protótipo — o dia seguinte ao fim da janela.
 *
 * Existe como constante porque três coisas dependem de concordarem sobre que
 * dia é hoje: "há quantos dias foi o último registro", a data de um feedback
 * dado agora e a data de uma resposta escrita agora. Com `Date.now()` a
 * gravação de amanhã contaria um dia a mais que a de hoje, e o protótipo
 * envelheceria sozinho.
 *
 * Repare que hoje é DEPOIS da janela: o semestre fechou ontem. Por isso
 * evidência criada agora é datada em `JANELA.fim` (é trabalho do semestre
 * avaliado) enquanto o ATO de responder é datado aqui.
 */
export const HOJE = '2026-08-01'

/** De onde veio a evidência. A variante 'humano' é o loop de elicitação
 *  aparecendo no sistema de tipos: evidência obtida perguntando é
 *  first-class e distinguível de evidência observada.
 *
 *  'proprio' é a pessoa completando o próprio registro (JORNADAS §C3). Fica
 *  separada de 'humano' porque a procedência é outra: 'humano' é resposta a
 *  uma pergunta que o Brain fez e por isso exige `lacunaId`; 'proprio' é
 *  contexto que ninguém pediu. Fundir as duas apagaria a distinção e afrouxaria
 *  a regra do validador, que hoje exige lacuna respondida por trás de toda
 *  evidência elicitada. */
export type Fonte =
  | { tipo: 'slack'; canal: string; mensagemId: string }
  | { tipo: 'github'; repo: string; pr: number }
  | { tipo: 'doc'; titulo: string }
  | { tipo: 'crm'; negocio: string }
  | { tipo: 'humano'; respondidoPor: PessoaId; lacunaId: LacunaId }
  /** `em` é o dia em que a pessoa adicionou, e não o dia do trabalho: o evento é
   *  datado em `JANELA.fim` porque descreve o semestre avaliado, e sem este
   *  campo a tela de evidência mostrava "31 jul" como se fosse a procedência —
   *  uma data afirmando outra coisa. A resposta de lacuna já guardava o seu
   *  `em`; contexto próprio não tinha onde guardar o dele. */
  | { tipo: 'proprio'; adicionadoPor: PessoaId; em: string }

export interface Pessoa {
  id: PessoaId
  nome: string
  cargo: string
  /** Opcionais porque nem todo mundo é avaliado contra uma régua: quem só
   *  observa (CHRO, admin) não tem trilha nem nível. Sem isso, a alternativa
   *  seria inventar uma trilha falsa — e dado falso no elenco é o erro que
   *  estraga a gravação (§5.2). */
  trilha?: Trilha
  nivel?: Nivel
  gestorId?: PessoaId
  time: string
  desde: string
  /** Exibida no dossiê por honestidade — trade-off #1 do PLANO.md
   *  virando informação visível em vez de viés escondido. */
  densidadeEvidencia: 'alta' | 'media' | 'baixa'
}

export interface Evento {
  id: EventoId
  pessoaId: PessoaId
  data: string // ISO
  texto: string // uma frase: o que aconteceu
  fonte: Fonte
  episodioId?: EpisodioId
}

export interface Episodio {
  id: EpisodioId
  pessoaId: PessoaId
  titulo: string
  resumo: string
  inicio: string
  fim: string
  eventoIds: EventoId[]
  colaboradores: PessoaId[]
  /** A estrela gruda AQUI, no episódio — nunca na pessoa.
   *  Não existe campo para estrela negativa. Por desenho. (PLANO.md §3.3) */
  estrela?: { por: PessoaId; em: string; nota?: string }
  nivelObservado?: Nivel // "isso foi acima do nível dela"
}

export interface Tema {
  id: TemaId
  pessoaId: PessoaId
  padrao: string // "assume coordenação cross-team que ninguém pediu"
  episodioIds: EpisodioId[]
  comportamentosRegua: string[] // ids da régua — é o que liga tema a decisão
  confianca: 'alta' | 'media' | 'baixa' // função da densidade de evidência
}

export interface Lacuna {
  id: LacunaId
  pessoaId: PessoaId
  pergunta: string
  perguntarA: PessoaId
  motivo: string // o "declara o porquê" do orçamento de pergunta
  valor: 'alta' | 'media' | 'baixa' // valor da informação — governa a fila
  status: 'aberta' | 'perguntada' | 'respondida' | 'descartada'
  /** Até quando a resposta ainda serve para alguma coisa.
   *
   *  Só existe em lacuna nascida no fechamento (JORNADAS G5, saída "Não sei"):
   *  ali a pergunta tem dono E prazo, porque o que ela sustenta é uma avaliação
   *  com data. Lacuna do fluxo contínuo não tem prazo por desenho — cobrar data
   *  de uma pergunta que pode esperar a semana que vem é como a caixa de
   *  pendências vira lista de tarefa. */
  prazo?: string
  /** Quando a pergunta de fato saiu, e por onde. Existe a partir de
   *  `perguntada` — antes disso a lacuna está identificada, não perguntada,
   *  e a distinção importa: é a diferença entre o Brain saber que não sabe e
   *  o Brain ter gasto uma das perguntas da semana. */
  enviada?: { canal: 'slack'; em: string }
  resposta?: { texto: string; por: PessoaId; em: string }
}

/**
 * Feedback dado — o quarto tipo de registro.
 *
 * Não existia até o agente ser perguntado "quem está sem feedback há mais
 * tempo?" e responder, com razão, que o dado não existe. "Feedback devido" era
 * um tipo de pendência no produto sem lastro no modelo.
 *
 * Guarda que houve conversa e sobre qual episódio — nunca o teor da correção.
 * Registro de demérito é passivo trabalhista (decisão #7): o que fica é que a
 * conversa aconteceu, não o que foi dito nela.
 */
export interface Feedback {
  id: string
  paraPessoaId: PessoaId
  porPessoaId: PessoaId
  data: string
  tipo: 'reconhecimento' | 'conversa'
  episodioId?: EpisodioId
  /** Só para reconhecimento. Conversa não guarda texto, por desenho. */
  texto?: string
}

export interface ComportamentoRegua {
  id: string
  /** O nome curto da skill — uma palavra. É o que cabe na ponta da teia e o
   *  que uma pessoa usa para falar do comportamento em voz alta ("ela está
   *  bem em risco, falta ambiguidade"). O `texto` é a definição; este é o
   *  nome. Sem ele, o gráfico de skills teria que truncar a frase. */
  rotulo: string
  /**
   * Quanto o nível pede nesta skill, de 1 a 5. É a régua propriamente dita —
   * a linha tracejada da teia.
   *
   * A escala não é opinião: 1 é "está aprendendo", 3 é "faz de forma
   * consistente", 4 é "é referência disso no time", 5 é "define o padrão da
   * empresa". Varia entre skills do mesmo nível de propósito: um sênior tem
   * que ser referência em risco e influência, e basta ser consistente em
   * mentoria. Régua com o mesmo número em tudo é régua que ninguém escreveu.
   */
  esperado: number
  texto: string
  observavel: string
}

export interface NivelRegua {
  trilha: Trilha
  nivel: Nivel
  comportamentos: ComportamentoRegua[]
  /** A régua viva: sugestão derivada da evidência real (PLANO.md §3.1) */
  derivado?: {
    sugestao: string
    baseadoEm: PessoaId[]
    status: 'proposto' | 'aceito'
    /** O comportamento que entra na régua quando a sugestão é aceita. Só
     *  existe quando a sugestão já chegou nessa forma; sugestão que ainda é
     *  só um apontamento ("falta definir o observável de Design") não tem. */
    virariaComportamento?: ComportamentoRegua
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   O ciclo — JORNADAS G5 e G6.

   A tese do produto é "não mate o ciclo, mate o formulário". O ciclo sobrevive
   como DECISÃO, e é isso que estes tipos guardam: não há campo de texto livre
   para o gestor escrever avaliação, porque ele não escreve avaliação. Ele
   percorre a régua já pontuada, discorda onde discorda, e decide.

   Repare no que NÃO existe aqui: nenhum campo agrega os comportamentos numa
   nota da pessoa. `Avaliacao` guarda uma lista de vereditos por comportamento
   e uma decisão, e a decisão é um enum de três valores — não é um número.
   Média de comportamentos, rating geral e ordenação não estão de fora por
   política: não há onde caberiam.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * O período em avaliação e a janela em que ele fecha.
 *
 * É dado de SEMENTE (`data/ciclos.ts`), e não da sessão, porque o ciclo é fato
 * do calendário da empresa: a janela abre tenha alguém clicado ou não. Nascer
 * na sessão faria o produto abrir sem ciclo nenhum até que alguém o criasse —
 * e "criar ciclo" é justamente a operação de seis semanas que este produto diz
 * ter matado.
 */
export interface Ciclo {
  id: CicloId
  nome: string
  inicio: string
  fim: string
  /** Quando os gestores avaliam. Abre depois de o período ter fechado: avaliar
   *  um semestre que ainda está correndo é avaliar previsão. */
  fechamento: { abre: string; fecha: string }
  /** `aberto` = o período está correndo. `em-fechamento` = acabou e a janela de
   *  avaliação está de pé. `encerrado` = a janela fechou. */
  status: 'aberto' | 'em-fechamento' | 'encerrado'
}

/** As três saídas de cada linha da régua no fechamento. Não existe uma quarta,
 *  e em particular não existe uma que marque o comportamento como negativo. */
export type SaidaVeredito = 'concordo' | 'discordo' | 'nao-sei'

/**
 * A decisão do fim, que é humana e a IA não sugere.
 *
 * `pronta-sem-vaga` existe separada de `abrir-promocao` porque as duas são
 * verdadeiras ao mesmo tempo em metade dos casos reais, e fundi-las obrigaria o
 * gestor a mentir numa das duas direções: ou ele diz que a pessoa não está
 * pronta, ou ele abre um caso que o orçamento não sustenta (decisão #3 —
 * dinheiro é anual, prontidão não).
 */
export type DecisaoDeCiclo = 'manter' | 'abrir-promocao' | 'pronta-sem-vaga'

/**
 * O que o gestor respondeu numa linha da régua.
 *
 * `notaIA` e `nota` são campos separados de propósito. A primeira é o que a
 * contagem devolveu ANTES do gesto e fica congelada; a segunda é o que ficou
 * depois. Em "concordo" as duas são iguais e a igualdade é a informação. Em
 * "discordo" elas divergem, e a diferença tem nome, autor e uma frase por trás
 * — é o que a pessoa avaliada lê em C5 quando o produto diz "o que o gestor
 * adicionou por discordar da IA".
 *
 * Em "não sei" a `nota` fica ausente: o fechamento registra que aquele
 * comportamento passou sem lastro, e atribuir o número da IA ali seria fechar
 * uma avaliação com um veredito que ninguém sustentou.
 */
export interface Veredito {
  comportamentoId: string
  saida: SaidaVeredito
  /** O que a contagem dizia no momento do gesto. Ausente = sem evidência, que
   *  está fora da escala e não é o degrau 1. */
  notaIA?: number
  nota?: number
  /** Só em "discordo": o evento que a frase do gestor criou, e o episódio que
   *  ele citou. É a procedência da nota nova — sem os dois, a nota se moveu
   *  sem evidência e deixou de ser contagem. */
  eventoId?: EventoId
  episodioId?: EpisodioId
  /** Só em "não sei": a lacuna que ficou aberta, com dono e prazo. */
  lacunaId?: LacunaId
  em: string
}

/**
 * O fechamento de uma pessoa num ciclo.
 *
 * As avaliações que a demo produz nascem na SESSÃO (`lib/registro.tsx`), ao
 * contrário do ciclo: elas são o gesto humano acontecendo na frente da câmera,
 * e precisam existir para as telas do colaborador e do RH no mesmo instante em
 * que o gestor assina. `data/ciclos.ts` traz um punhado delas prontas por outro
 * motivo — são de OUTROS gestores, e sem elas o painel do ciclo abriria dizendo
 * que ninguém no mundo fechou nada.
 *
 * Não há campo `status`. Fechada é a que tem `decisao` e `assinadaEm`, e
 * derivar isso de um campo próprio é como um dia o produto teria uma avaliação
 * marcada como fechada sem decisão dentro.
 */
export interface Avaliacao {
  id: AvaliacaoId
  cicloId: CicloId
  pessoaId: PessoaId
  /** A régua julgada: o nível que a pessoa OCUPA. O fechamento pergunta "ela
   *  sustenta o que já é dela?"; o dossiê que ela abre o ano inteiro pergunta
   *  "o que falta para subir" e por isso mostra o nível alvo. Guardado no
   *  registro porque a pessoa muda de nível e a avaliação não pode mudar junto:
   *  recalcular contra o nível de hoje reescreveria o passado. */
  trilha: Trilha
  nivel: Nivel
  por: PessoaId
  vereditos: Veredito[]
  decisao?: DecisaoDeCiclo
  assinadaEm?: string
}

/**
 * Um episódio que passou a sustentar um comportamento porque um humano disse
 * que sustenta.
 *
 * Nasce quando o gestor discorda da nota no fechamento. A IA pergunta qual
 * episódio sustenta aquilo, ele responde em uma frase, e a frase vira evento
 * com procedência humana — mas evento não move nota: quem move é a ligação
 * entre episódio e comportamento, que hoje só existe dentro de `Tema`. O lastro
 * é essa ligação declarada por gente em vez de inferida pelo Brain.
 *
 * Por isso ele entra em `pontuar()` pela MESMA porta dos episódios do tema: a
 * conta soma como somaria qualquer episódio, e continua sendo uma só. Nota que
 * se move por fora da contagem é opinião com um número na frente.
 */
export interface Lastro {
  pessoaId: PessoaId
  comportamentoId: string
  episodioId: EpisodioId
  /** O evento que a frase do gestor criou. É por ele que o lastro é clicável
   *  até a fonte, como qualquer outra evidência. */
  eventoId: EventoId
  por: PessoaId
  em: string
}

export interface AchadoOrg {
  id: string
  tipo: 'gargalo' | 'bloqueio-promocao' | 'cobertura-gestor' | 'gap-skill'
  titulo: string
  /** `lacunaIds` são as perguntas de que o achado DEPENDE: quando todas são
   *  respondidas, o achado deixa de valer. Sem esse laço, a tela pedia a
   *  pergunta dois blocos abaixo de onde a resposta já estava — o diagnóstico
   *  afirmando que falta a evidência que a mesma página mostra existir. */
  evidencia: { pessoaIds: PessoaId[]; episodioIds: EpisodioId[]; lacunaIds?: LacunaId[] }
  recomendacao: string
}
