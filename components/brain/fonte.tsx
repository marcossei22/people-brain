'use client'

/**
 * A fonte de um evento — PLANO.md §2.1: nenhuma frase sem link pra fonte.
 *
 * A variante `humano` é a que carrega tese: evidência obtida perguntando tem
 * marca visual própria, porque ela custou uma das perguntas da semana e
 * porque é o que prova que o sistema fecha lacuna em vez de inferir.
 */

import { FileText, GitPullRequest, MessageSquare, Target, UserRoundSearch } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Fonte as TipoFonte } from '@/data/tipos'
import { nomeDe } from '@/lib/memoria'

export function Fonte({ fonte, data }: { fonte: TipoFonte; data?: string }) {
  const { Icone, rotulo, detalhe } = descrever(fonte)
  const humano = fonte.tipo === 'humano'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 font-mono text-[0.68rem] transition-colors ${
            humano
              ? 'bg-comp-suave/50 text-comp'
              : 'text-muted-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground/70'
          }`}
        >
          <Icone className="size-3 shrink-0" />
          {rotulo}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[20rem]">
        <span className="etiqueta block text-current opacity-70">
          {humano ? 'evidência obtida perguntando' : 'fonte'}
          {data && ` · ${data}`}
        </span>
        <span className="mt-1 block leading-snug">{detalhe}</span>
      </TooltipContent>
    </Tooltip>
  )
}

function descrever(f: TipoFonte) {
  switch (f.tipo) {
    case 'slack':
      return {
        Icone: MessageSquare,
        rotulo: f.canal,
        detalhe: `Mensagem em ${f.canal}, id ${f.mensagemId}. Canal público de trabalho.`,
      }
    case 'github':
      return {
        Icone: GitPullRequest,
        rotulo: `#${f.pr}`,
        detalhe: `Pull request #${f.pr} em ${f.repo}.`,
      }
    case 'doc':
      return {
        Icone: FileText,
        rotulo: 'doc',
        detalhe: `Documento "${f.titulo}", em drive compartilhado do time.`,
      }
    case 'crm':
      return {
        Icone: Target,
        rotulo: 'crm',
        detalhe: `Negócio ${f.negocio} no CRM.`,
      }
    case 'humano':
      return {
        Icone: UserRoundSearch,
        rotulo: 'perguntado',
        detalhe: `${nomeDe(f.respondidoPor)} respondeu a uma pergunta do Brain. Esta evidência não estava em fonte nenhuma — ela foi elicitada.`,
      }
  }
}
