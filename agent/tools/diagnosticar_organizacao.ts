import { defineTool } from 'eve/tools'
import { z } from 'zod'
import { achadosOrg } from '../../data/achados-org'
import { podeVerDiagnosticoOrg } from '../../lib/agente/permissoes'
import { estadoDoAchado } from '../../lib/sessao'
import { nomeDe, registroDaSessao, viewerDaSessao } from '../lib/viewer-da-sessao'

export default defineTool({
  description: [
    'Lê os achados de organização: padrões que atravessam pessoas e times. É o que separa "o Rafael é lento" de "Dados é gargalo de seis pessoas". Só quem tem escopo agregado alcança.',
    'Um achado com `superado: true` teve todas as perguntas de que dependia respondidas. Ele continua na lista porque o padrão existiu, mas a recomendação não vale mais: diga que a evidência chegou, e cite a resposta.',
  ].join('\n'),
  inputSchema: z.object({
    tipo: z
      .enum(['gargalo', 'bloqueio-promocao', 'cobertura-gestor', 'gap-skill'])
      .optional(),
  }),
  async execute({ tipo }, ctx) {
    const viewer = viewerDaSessao(ctx)
    if (!podeVerDiagnosticoOrg(viewer))
      return {
        negado: true,
        motivo:
          'O diagnóstico de organização é agregado e fica com quem responde pela organização. Um gestor vê o próprio time.',
      }

    const registro = registroDaSessao(ctx)
    const lista = achadosOrg.filter((a) => !tipo || a.tipo === tipo)
    return {
      total: lista.length,
      achados: lista.map((a) => {
        const estado = estadoDoAchado(registro, a)
        return {
          id: a.id,
          tipo: a.tipo,
          titulo: a.titulo,
          pessoasAfetadas: a.evidencia.pessoaIds.map(nomeDe),
          episodioIds: a.evidencia.episodioIds,
          recomendacao: a.recomendacao,
          superado: estado.superado,
          /* As perguntas de que o achado depende, com o que já foi respondido.
           * Sem isso o Brain repetia "faltam duas perguntas" depois de as duas
           * terem sido respondidas na caixa desta semana. */
          lacunas: estado.lacunas.map((l) => ({
            id: l.id,
            pergunta: l.pergunta,
            status: l.status,
            resposta: l.resposta
              ? { texto: l.resposta.texto, por: nomeDe(l.resposta.por), em: l.resposta.em }
              : null,
          })),
        }
      }),
    }
  },
})
