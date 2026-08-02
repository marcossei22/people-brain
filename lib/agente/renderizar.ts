import { createLibrary, createParser, defineComponent } from '@openuidev/react-lang'
import { ESPECIFICACOES, NOMES, RAIZ } from './biblioteca'

/**
 * O contrato de render — ARQUITETURA.md §7, agora sobre OpenUI Lang.
 *
 * A biblioteca continua FIXA e a skill continua governando qual componente
 * usar (decisão #20). O que mudou é a FORMA da chamada: em vez de um tipo e um
 * payload — um card e ponto —, o modelo escreve um programa curto que compõe
 * vários blocos:
 *
 *     root = Resposta([cobertura, detalhe])
 *     cobertura = Cobertura("Régua de Sênior · Engenharia", itens)
 *     detalhe = Gap("Carla Nunes", "pleno", "senior", comportamentos)
 *
 * Isso comprou três coisas. **Composição**: a resposta visual e o detalhe com
 * fonte na mesma resposta, em vez de escolher um dos dois. **Reveal
 * progressivo**: o parser é incremental, então o `root` chega primeiro e a
 * estrutura aparece na tela enquanto os dados ainda estão streamando — os 45s
 * de espera do painel (§7.2) passam a mostrar a resposta se montando.
 * **Prompt gerado**: a lista de componentes e assinaturas sai daqui, então
 * acrescentar um componente não exige lembrar de editar a descrição da tool.
 *
 * O que NÃO mudou, e é o que importa: o modelo não escreve layout. Só existe
 * o que está em `biblioteca.ts`, e componente fora da lista o parser recusa.
 */

/**
 * A biblioteca espelho do servidor.
 *
 * Mesmos nomes e mesmas props do cliente, com renderer vazio: aqui ninguém
 * desenha nada, só se gera prompt e se valida programa. Importar os
 * componentes React de verdade puxaria um módulo `'use client'` para dentro
 * do bundle do agente — o contrato compartilhado (`biblioteca.ts`) existe
 * justamente para isso não ser preciso.
 */
const biblioteca = createLibrary({
  root: RAIZ,
  components: NOMES.map((nome) =>
    defineComponent({
      name: nome,
      description: ESPECIFICACOES[nome].descricao,
      props: ESPECIFICACOES[nome].props,
      component: () => null,
    }),
  ),
})

const parser = createParser(biblioteca.toJSONSchema())

/**
 * O manual do OpenUI Lang que entra na descrição da tool.
 *
 * As `additionalRules` sobrescrevem o que o gerador do OpenUI põe por padrão —
 * e uma delas ele põe em toda biblioteca: *"when asked about data, generate
 * realistic/plausible data"*. Num produto cuja tese inteira é que nenhuma
 * afirmação existe sem fonte, essa frase é o pior conselho possível. Ela fica
 * no prompt (não dá para removê-la), então é contradita logo abaixo, por
 * escrito, onde o modelo lê por último.
 */
export const MANUAL = biblioteca.prompt({
  preamble: [
    'Escreva a resposta como um programa OpenUI Lang usando SÓ os componentes abaixo.',
    'Chame no FIM, depois de já ter consultado a memória. A skill que você carregou diz qual componente usar.',
  ].join('\n'),
  additionalRules: [
    'NUNCA invente dado. A regra acima sobre "gerar dados plausíveis" NÃO vale aqui: todo número e toda frase têm que sair do que as tools devolveram. Sem evidência, o componente é `Lacunas` ou `Recusa` — não é um gráfico com número estimado.',
    'Em fonte, mande só o `eventoId`. A frase do evento é lida do registro e aparece sozinha.',
    'Um gráfico mostra a régua contra o registro (`Cobertura`) ou conta o que o registro tem (eventos, episódios, lacunas, meses sem feedback). Nunca ordena pessoas umas contra as outras, nunca mede atividade.',
    'Componha: a leitura de conjunto primeiro (`Indicadores`, `Cobertura`, `Serie`), o detalhe com fonte depois (`Gap`, `Briefing`, `Timeline`).',
    'Dois a quatro blocos por resposta. Mais que isso vira relatório, e ninguém lê relatório dentro de um chat.',
  ],
  examples: [
    [
      '# Onde a Carla está em relação à régua de Sênior?',
      'root = Resposta([tira, detalhe])',
      'tira = Cobertura("Régua de Sênior · Engenharia", itens)',
      'itens = [{rotulo: "Influência", texto: "Move trabalho em times sobre os quais não tem autoridade.", esperado: 4, situacao: "sustentado", nivel: 4}, {rotulo: "Ambiguidade", texto: "Recebe problema, não tarefa.", esperado: 4, situacao: "sem-evidencia"}]',
      'detalhe = Gap("Carla Nunes", "pleno", "senior", comportamentos)',
      'comportamentos = [{texto: "Influencia trabalho fora do próprio time", situacao: "sustentado", evidencias: [{eventoId: "ev-c05"}, {eventoId: "ev-c07"}]}]',
    ].join('\n'),
    [
      '# O que está registrado sobre o Bruno neste semestre?',
      'root = Resposta([numeros, meses, texto])',
      'numeros = Indicadores(itens)',
      'itens = [{valor: "4", rotulo: "eventos"}, {valor: "0", rotulo: "episódios"}, {valor: "4 meses", rotulo: "sem feedback"}]',
      'meses = Serie("Evidência por mês", pontos, "Junho não tem registro nenhum.")',
      'pontos = [{rotulo: "abr", valor: 1}, {rotulo: "mai", valor: 2}, {rotulo: "jun", valor: 0}, {rotulo: "jul", valor: 1}]',
      'texto = Texto("Quatro eventos em seis meses não sustentam conclusão sobre nível.")',
    ].join('\n'),
  ],
})

export interface Programa {
  ok: boolean
  erro?: string
}

/**
 * Valida o programa antes de deixá-lo chegar na tela.
 *
 * O parser do OpenUI é PERMISSIVO de propósito — ele desenha o que conseguir e
 * põe o resto em `meta.errors`. Isso é bom durante o stream (metade da resposta
 * na tela é melhor que tela em branco) e ruim como palavra final: um programa
 * que só citou componente inexistente renderiza vazio, e vazio no meio de uma
 * conversa lê como o produto travado.
 *
 * Então: sem raiz ou com componente inventado, a tool devolve erro e o modelo
 * cai pra prosa — o mesmo modo de falha gracioso do §7.1. Prop faltando não
 * derruba nada: o bloco afetado some, os outros ficam.
 */
export function validarPrograma(texto: string): Programa {
  const programa = texto?.trim()
  if (!programa) return { ok: false, erro: 'Programa vazio.' }

  let r: ReturnType<typeof parser.parse>
  try {
    r = parser.parse(programa)
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : 'Não deu para ler o programa.' }
  }

  if (!r.root) {
    return {
      ok: false,
      erro: `Nenhuma raiz. A primeira linha tem que ser \`root = ${RAIZ}([...])\`.`,
    }
  }

  const inventados = r.meta.errors.filter((e) => e.code === 'unknown-component')
  if (inventados.length > 0) {
    const nomes = [...new Set(inventados.map((e) => e.component))].join(', ')
    return {
      ok: false,
      erro: `Componente que não existe: ${nomes}. Disponíveis: ${NOMES.join(', ')}.`,
    }
  }

  const soltos = r.meta.orphaned
  const faltando = r.meta.unresolved
  const avisos = [
    faltando.length > 0 ? `referências sem definição: ${faltando.join(', ')}` : '',
    soltos.length > 0 ? `definidos e nunca usados: ${soltos.join(', ')}` : '',
  ].filter(Boolean)

  // Aviso não derruba a resposta: o que foi resolvido já está desenhado, e
  // pedir uma segunda tentativa custaria outro turno inteiro na frente da
  // câmera. Vai para o resultado da tool, onde o modelo pode corrigir se
  // ainda estiver escrevendo.
  return avisos.length > 0 ? { ok: true, erro: avisos.join(' · ') } : { ok: true }
}
