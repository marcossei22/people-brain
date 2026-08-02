import type { Lacuna } from './tipos'

/**
 * O que o Brain sabe que não sabe.
 *
 * `motivo` não é decoração: é o "declara o porquê" do orçamento de pergunta
 * (decisão #11). O recurso escasso não é o dado — é o direito de perguntar,
 * e pergunta sem motivo declarado não entra na fila.
 *
 * O Diego tem quatro lacunas e a Carla tem uma. Não é descuido: com quem deixa
 * muito rastro o sistema observa e pergunta pouco; com quem deixa pouco, ele
 * pergunta mais. Mesmo mecanismo, comportamento diferente conforme a
 * legibilidade da função.
 */
export const lacunas: Lacuna[] = [
  // ── Carla · densidade alta, pouca lacuna ────────────────────────────────
  {
    id: 'lac-carla-articulacao',
    pessoaId: 'carla',
    pergunta:
      'Como a Carla conseguiu a fila dedicada com o time de Dados? O registro tem o resultado, não a conversa que o produziu.',
    perguntarA: 'marina',
    motivo:
      'A régua de sênior pede "move trabalho em times sobre os quais não tem autoridade". O que está registrado prova o resultado; falta a evidência de que a articulação foi dela, e não do acordo entre gestores.',
    valor: 'alta',
    status: 'aberta',
  },

  // ── Bruno · o buraco fechado por pergunta ───────────────────────────────
  {
    id: 'lac-bruno-junho',
    pessoaId: 'bruno',
    pergunta: 'O Bruno não tem nenhum registro de trabalho entre maio e junho. Ele estava em quê?',
    perguntarA: 'marina',
    motivo:
      'Um buraco de seis semanas no registro quase sempre é falha de captura, não ausência de trabalho. Registrar como "sem evidência" seria produzir um dado falso.',
    valor: 'alta',
    status: 'respondida',
    resposta: {
      texto:
        'Ele ficou seis semanas no plantão do incidente de faturamento. Foi trabalho pesado e quase todo em call — não gerou PR nem thread.',
      por: 'marina',
      em: '2026-06-30',
    },
  },

  // ── Diego · densidade baixa, muita lacuna ───────────────────────────────
  {
    id: 'lac-diego-pesquisa',
    pessoaId: 'diego',
    pergunta:
      'O redesenho do checkout saiu de pesquisa ou de intuição? Não há registro de conversa com usuário.',
    perguntarA: 'helena',
    motivo:
      'A régua de design sênior pede "desenha depois de entender, não antes", e o observável é registro de conversa com usuário. Sem isso, o melhor resultado do semestre fica sem lastro.',
    valor: 'alta',
    status: 'respondida',
    resposta: {
      texto:
        'Ele rodou nove entrevistas com clientes antes de abrir o Figma. O recorte saiu delas — a decisão de cortar o cadastro em duas etapas veio de sete das nove conversas.',
      por: 'helena',
      em: '2026-04-08',
    },
  },
  {
    id: 'lac-diego-sistema',
    pessoaId: 'diego',
    pergunta: 'Quem sustenta o design system da Aurora? Não há registro de manutenção.',
    perguntarA: 'helena',
    motivo:
      'A régua de design staff pede "constrói o que o resto do time reusa". O design system existe e é usado — mas manter design system não gera PR nem thread, então ele é invisível para o registro.',
    valor: 'alta',
    status: 'respondida',
    resposta: {
      texto:
        'É o Diego, sozinho, o semestre inteiro. Ninguém pediu e ninguém agradeceu — e nada disso aparece em lugar nenhum.',
      por: 'helena',
      em: '2026-06-15',
    },
  },
  {
    id: 'lac-diego-direcao',
    pessoaId: 'diego',
    pergunta:
      'O Diego participa da decisão de escopo ou recebe escopo pronto? A régua de staff separa as duas coisas.',
    perguntarA: 'helena',
    motivo:
      'É o comportamento que decide se ele já está operando em staff. Nenhuma fonte registra quem estava na sala quando o escopo foi decidido.',
    valor: 'alta',
    status: 'aberta',
  },
  {
    id: 'lac-diego-facilitacao',
    pessoaId: 'diego',
    pergunta: 'Quantas sessões de alinhamento entre produto e engenharia ele conduziu?',
    perguntarA: 'helena',
    motivo:
      'Facilitação é metade do trabalho de um lead de design e não deixa rastro em ferramenta nenhuma.',
    valor: 'media',
    status: 'aberta',
  },

  // ── Thiago e Juliana · a lacuna que vira achado de organização ─────────
  {
    id: 'lac-thiago-feedback',
    pessoaId: 'thiago',
    pergunta: 'Houve alguma conversa de feedback entre o Paulo e o Thiago neste semestre?',
    perguntarA: 'paulo',
    motivo:
      'Zero feedbacks registrados em seis meses. Ou as conversas aconteceram e não foram registradas, ou não aconteceram — e as duas respostas levam a ações diferentes.',
    valor: 'alta',
    status: 'perguntada',
  },
  {
    id: 'lac-juliana-nivel',
    pessoaId: 'juliana',
    pergunta:
      'O trabalho de CI da Juliana foi atribuído a ela ou ela puxou sozinha? Muda a leitura do nível.',
    perguntarA: 'paulo',
    motivo:
      '"Recebe problema, não tarefa" é o primeiro comportamento de sênior. O registro mostra a entrega, não a origem do trabalho.',
    valor: 'alta',
    status: 'aberta',
  },

  // ── Rafael · o que o registro não distingue ─────────────────────────────
  {
    id: 'lac-rafael-escalada',
    pessoaId: 'rafael',
    pergunta:
      'O Rafael tentou destravar a dependência de Dados por conta própria antes de reprogramar?',
    perguntarA: 'marina',
    motivo:
      'A Carla destravou a mesma dependência. Saber se o Rafael tentou e não conseguiu, ou não tentou, é a diferença entre um gap de habilidade e um gap de contexto — e o registro não distingue.',
    valor: 'alta',
    status: 'aberta',
  },

  // ── André · a sobrecarga que ninguém mediu ─────────────────────────────
  {
    id: 'lac-andre-capacidade',
    pessoaId: 'andre',
    pergunta: 'Quantos pedidos entraram na fila de Dados neste semestre e quantas pessoas atendiam?',
    perguntarA: 'paulo',
    motivo:
      'Seis pessoas de quatro times ficaram bloqueadas na mesma fila. Antes de tratar isso como problema de indivíduo, é preciso saber a razão entre demanda e capacidade.',
    valor: 'alta',
    status: 'perguntada',
  },

  // ── Letícia ─────────────────────────────────────────────────────────────
  {
    id: 'lac-leticia-territorio',
    pessoaId: 'leticia',
    pergunta: 'A Letícia abriu algum segmento novo, ou trabalhou dentro do território existente?',
    perguntarA: 'helena',
    motivo:
      '"Abre segmento onde a empresa ainda não vende" é o primeiro comportamento de staff em Vendas. O CRM registra contratos, não fronteira de território.',
    valor: 'media',
    status: 'aberta',
  },

  // ── A recusa de escopo, virando dado ────────────────────────────────────
  {
    id: 'lac-carla-estado',
    pessoaId: 'carla',
    pergunta: 'A Carla está insatisfeita? Há risco de ela sair depois do resultado do comitê?',
    perguntarA: 'marina',
    motivo:
      'Descartada pelo Brain. Isso é estado, não trabalho. Não existe campo de sentimento, intenção ou risco de saída em nenhum ponto do modelo de dados — responder exigiria inferir, e inferir sobre pessoa é exatamente o que este sistema não faz.',
    valor: 'baixa',
    status: 'descartada',
  },
]

export const lacunasDe = (pessoaId: string) => lacunas.filter((l) => l.pessoaId === pessoaId)
