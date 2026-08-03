'use client'

/**
 * A fonte de um evento — PLANO.md §2.1: nenhuma frase sem link pra fonte.
 *
 * A variante `humano` é a que carrega tese: evidência obtida perguntando tem
 * marca visual própria, porque ela custou uma das perguntas da semana e
 * porque é o que prova que o sistema fecha lacuna em vez de inferir.
 *
 * Hover explica o que é a fonte; clique abre a evidência inteira. O chip
 * parecia clicável e não era — e "link até a fonte" só é verificável se dá
 * pra chegar no registro bruto a partir da frase.
 */

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  FileText,
  GitPullRequest,
  MessageSquare,
  PenLine,
  Target,
  UserRoundSearch,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { episodioPorId } from '@/data/episodios'
import type { Evento, Fonte as TipoFonte } from '@/data/tipos'
import { nomeDe } from '@/lib/memoria'

/** O que o chip é, dito antes do detalhe. As duas variantes de gente têm
 *  rótulo próprio: quem respondeu não é o mesmo que quem completou. */
const ETIQUETA: Record<TipoFonte['tipo'], string> = {
  slack: 'fonte',
  github: 'fonte',
  doc: 'fonte',
  crm: 'fonte',
  humano: 'evidência obtida perguntando',
  proprio: 'contexto adicionado pela pessoa',
}

export function Fonte({ evento }: { evento: Evento }) {
  const [aberto, setAberto] = useState(false)
  const { Icone, rotulo, detalhe, origem, referencia, quando } = descrever(evento.fonte)
  /* Evidência que não veio de ferramenta nenhuma tem marca própria: ou alguém
   * respondeu uma pergunta, ou a própria pessoa completou o registro. Nos dois
   * casos a procedência é gente, e é isso que o chip destaca. */
  const dePessoa = evento.fonte.tipo === 'humano' || evento.fonte.tipo === 'proprio'
  const episodio = evento.episodioId ? episodioPorId(evento.episodioId) : undefined

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setAberto(true)}
            aria-label={`Ver a evidência em ${rotulo}`}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-1.5 py-0.5 align-baseline font-mono text-[0.68rem] transition-colors ${
              dePessoa
                ? 'bg-comp-suave/50 text-comp hover:bg-comp-suave'
                : 'text-muted-foreground/70 hover:bg-foreground/[0.06] hover:text-foreground'
            }`}
          >
            <Icone className="size-3 shrink-0" />
            {rotulo}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[18rem] flex-col items-start gap-0">
          <span className="etiqueta block opacity-70">{ETIQUETA[evento.fonte.tipo]}</span>
          <span className="mt-1 block leading-snug">{detalhe}</span>
          <span className="mt-1.5 block font-mono text-[0.65rem] opacity-55">
            clique para ver a evidência
          </span>
        </TooltipContent>
      </Tooltip>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="gap-0 p-0 sm:max-w-lg">
          <div className="px-6 pt-6">
            <DialogTitle className="etiqueta font-mono text-[0.7rem] font-normal">
              Evidência
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detalhe do evento e da fonte de onde ele foi registrado.
            </DialogDescription>

            <p className="prosa mt-3 text-[1.05rem] leading-snug text-foreground">{evento.texto}</p>
            <p className="mt-3 font-mono text-[0.7rem] text-muted-foreground/70">
              {formatarData(evento.data)} · {nomeDe(evento.pessoaId)}
            </p>
          </div>

          <dl className="mt-6 border-t border-border">
            <Linha rotulo="Fonte">
              <span className="inline-flex items-center gap-1.5">
                <Icone className="size-3.5 shrink-0 text-muted-foreground" />
                {origem}
              </span>
            </Linha>
            <Linha rotulo="Referência">
              <span className="font-mono text-[0.78rem] text-muted-foreground">{referencia}</span>
            </Linha>
            {/* Quando a evidência ENTROU no registro, que é outra data que a do
                trabalho logo acima: o evento é datado no semestre que descreve, e
                sem esta linha a data da janela ficava ao lado do nome de quem
                adicionou, afirmando uma procedência que não é a dela. */}
            {quando && (
              <Linha rotulo="Adicionado">
                <span className="font-mono text-[0.78rem] text-muted-foreground">
                  {formatarData(quando)}
                </span>
              </Linha>
            )}
            <Linha rotulo="Episódio">
              {episodio ? (
                episodio.titulo
              ) : (
                <span className="text-muted-foreground">
                  Ainda não agrupado — este evento está solto no registro.
                </span>
              )}
            </Linha>
          </dl>

          <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-3.5">
            <Link
              href="/integrations"
              onClick={() => setAberto(false)}
              className="inline-flex items-center gap-1 text-[0.8rem] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              De onde vem esta fonte
              <ArrowUpRight className="size-3" />
            </Link>
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="h-7 text-[0.78rem]">
                Fechar
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-6 border-b border-border/60 px-6 py-3 last:border-b-0">
      <dt className="etiqueta w-[6.5rem] shrink-0 pt-[3px]">{rotulo}</dt>
      <dd className="min-w-0 flex-1 text-[0.88rem] leading-snug">{children}</dd>
    </div>
  )
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatarData(iso: string) {
  const [ano, mes, dia] = iso.split('-')
  return `${Number(dia)} ${MESES[Number(mes) - 1]} ${ano}`
}

function descrever(f: TipoFonte) {
  switch (f.tipo) {
    case 'slack':
      return {
        Icone: MessageSquare,
        rotulo: f.canal,
        detalhe: `Mensagem em ${f.canal}, canal público de trabalho.`,
        origem: `Slack · ${f.canal}`,
        referencia: `mensagem ${f.mensagemId}`,
      }
    case 'github':
      return {
        Icone: GitPullRequest,
        rotulo: `#${f.pr}`,
        detalhe: `Pull request #${f.pr} em ${f.repo}.`,
        origem: `GitHub · ${f.repo}`,
        referencia: `pull request #${f.pr}`,
      }
    case 'doc':
      return {
        Icone: FileText,
        rotulo: 'doc',
        detalhe: `Documento "${f.titulo}", em drive compartilhado do time.`,
        origem: 'Google Drive · drive do time',
        referencia: f.titulo,
      }
    case 'crm':
      return {
        Icone: Target,
        rotulo: 'crm',
        detalhe: `Negócio ${f.negocio} no CRM.`,
        origem: 'CRM · pipeline comercial',
        referencia: `negócio ${f.negocio}`,
      }
    case 'humano':
      return {
        Icone: UserRoundSearch,
        rotulo: 'perguntado',
        detalhe: `${nomeDe(f.respondidoPor)} respondeu a uma pergunta do Brain. Esta evidência não estava em fonte nenhuma — ela foi elicitada.`,
        origem: `Resposta de ${nomeDe(f.respondidoPor)}`,
        referencia: `lacuna ${f.lacunaId}`,
      }
    case 'proprio':
      return {
        Icone: PenLine,
        rotulo: 'adicionado',
        detalhe: `${nomeDe(f.adicionadoPor)} adicionou este contexto ao próprio registro. Ninguém perguntou — o registro não alcançava e ela completou.`,
        origem: `Contexto de ${nomeDe(f.adicionadoPor)}`,
        referencia: 'adicionado no dossiê',
        quando: f.em,
      }
  }
}
