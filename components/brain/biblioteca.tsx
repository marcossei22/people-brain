'use client'

/**
 * A biblioteca OpenUI — o lado do cliente.
 *
 * Aqui cada nome do contrato (`lib/agente/biblioteca.ts`) ganha o React que o
 * desenha. O servidor monta a MESMA biblioteca com renderers vazios, só para
 * gerar o prompt e validar o programa — ver `lib/agente/renderizar.ts`. Duas
 * montagens, um contrato: é isso que impede o modelo receber um formato e a
 * tela esperar outro.
 *
 * O `Renderer` do OpenUI recebe `{ props, renderNode }`. `renderNode` é como
 * um componente desenha os filhos que o modelo pendurou nele — é o que torna a
 * resposta COMPONÍVEL em vez de um card só.
 */

import { createLibrary, defineComponent } from '@openuidev/react-lang'
import { ESPECIFICACOES, RAIZ } from '@/lib/agente/biblioteca'
import {
  Barras,
  Briefing,
  Cobertura,
  Diagnostico,
  Distribuicao,
  Dossie,
  Gap,
  Indicadores,
  Lacunas,
  Pessoas,
  Recusa,
  Resposta,
  Serie,
  Texto,
  Timeline,
} from '@/components/brain/componentes'

const spec = ESPECIFICACOES

export const biblioteca = createLibrary({
  root: RAIZ,
  components: [
    defineComponent({
      name: 'Resposta',
      description: spec.Resposta.descricao,
      props: spec.Resposta.props,
      component: ({ props, renderNode }) => <Resposta blocos={renderNode(props.blocos)} />,
    }),
    defineComponent({
      name: 'Texto',
      description: spec.Texto.descricao,
      props: spec.Texto.props,
      component: ({ props }) => <Texto {...props} />,
    }),
    defineComponent({
      name: 'Indicadores',
      description: spec.Indicadores.descricao,
      props: spec.Indicadores.props,
      component: ({ props }) => <Indicadores {...props} />,
    }),
    defineComponent({
      name: 'Barras',
      description: spec.Barras.descricao,
      props: spec.Barras.props,
      component: ({ props }) => <Barras {...props} />,
    }),
    defineComponent({
      name: 'Serie',
      description: spec.Serie.descricao,
      props: spec.Serie.props,
      component: ({ props }) => <Serie {...props} />,
    }),
    defineComponent({
      name: 'Distribuicao',
      description: spec.Distribuicao.descricao,
      props: spec.Distribuicao.props,
      component: ({ props }) => <Distribuicao {...props} />,
    }),
    defineComponent({
      name: 'Cobertura',
      description: spec.Cobertura.descricao,
      props: spec.Cobertura.props,
      component: ({ props }) => <Cobertura {...props} />,
    }),
    defineComponent({
      name: 'Briefing',
      description: spec.Briefing.descricao,
      props: spec.Briefing.props,
      component: ({ props }) => <Briefing {...props} />,
    }),
    defineComponent({
      name: 'Gap',
      description: spec.Gap.descricao,
      props: spec.Gap.props,
      component: ({ props }) => <Gap {...props} />,
    }),
    defineComponent({
      name: 'Dossie',
      description: spec.Dossie.descricao,
      props: spec.Dossie.props,
      component: ({ props }) => <Dossie {...props} />,
    }),
    defineComponent({
      name: 'Timeline',
      description: spec.Timeline.descricao,
      props: spec.Timeline.props,
      component: ({ props }) => <Timeline {...props} />,
    }),
    defineComponent({
      name: 'Lacunas',
      description: spec.Lacunas.descricao,
      props: spec.Lacunas.props,
      component: ({ props }) => <Lacunas {...props} />,
    }),
    defineComponent({
      name: 'Pessoas',
      description: spec.Pessoas.descricao,
      props: spec.Pessoas.props,
      component: ({ props }) => <Pessoas {...props} />,
    }),
    defineComponent({
      name: 'Diagnostico',
      description: spec.Diagnostico.descricao,
      props: spec.Diagnostico.props,
      component: ({ props }) => <Diagnostico {...props} />,
    }),
    defineComponent({
      name: 'Recusa',
      description: spec.Recusa.descricao,
      props: spec.Recusa.props,
      component: ({ props }) => <Recusa {...props} />,
    }),
  ],
})
