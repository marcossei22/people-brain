import type { Lacuna } from './tipos'

/**
 * SEED MÍNIMO — 3 lacunas, uma de cada estado que importa.
 *
 * `motivo` não é decoração: é o "declara o porquê" do orçamento de pergunta
 * (decisão #11). O recurso escasso não é o dado — é o direito de perguntar.
 */
export const lacunas: Lacuna[] = [
  {
    // ABERTA — a lacuna que sustenta a decisão de promoção da Carla.
    id: 'lac-carla-articulacao',
    pessoaId: 'carla',
    pergunta:
      'Como a Carla conseguiu a fila dedicada com o time de Dados? O registro tem o resultado, não a conversa que o produziu.',
    perguntarA: 'marina',
    motivo:
      'A régua de senior pede "move trabalho em times sobre os quais não tem autoridade". O que está registrado prova o resultado; falta a evidência de que a articulação foi dela, e não do acordo entre gestores.',
    valor: 'alta',
    status: 'aberta',
  },
  {
    // RESPONDIDA — vira o evento ev-16. É o loop de elicitação fechando:
    // seis semanas de trabalho invisível que nenhum rastro digital tinha.
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
  {
    // DESCARTADA — a recusa de ESCOPO virando dado (§6.7).
    // A pergunta foi levantada; o Brain a descartou porque não existe campo
    // no modelo capaz de respondê-la. A recusa não é política, é consequência.
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
