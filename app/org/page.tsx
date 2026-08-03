'use client'

/**
 * `/org` — ARQUITETURA.md §8.1.
 *
 * A lista não é um diretório de RH: ela É a função `pessoasVisiveis()` na
 * tela. Trocar a persona no seletor muda a lista sem recarregar nada, e é
 * essa mudança que prova que a permissão vive em código (§6.6) e não numa
 * instrução educada no prompt.
 *
 * Embaixo, para quem tem escopo agregado, o diagnóstico de organização — que
 * é output de primeira classe e não nota de rodapé do fechamento (decisão #10).
 *
 * A contagem de cada linha sai do registro da sessão, não de `data/`. Esta tela
 * fica a UM clique do dossiê, e a lista dizia "14 eventos · último registro há
 * 10 dias" para quem tinha acabado de ver "15 eventos · há 1 dia" na tela
 * anterior. Duas telas, um clique, discordando sobre a mesma pessoa.
 */

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Densidade } from '@/components/shell/densidade'
import {
  pessoasAvaliaveis,
  pessoasVisiveis,
  podeVerDiagnosticoOrg,
} from '@/lib/agente/permissoes'
import { DiagnosticoOrg } from '@/components/brain/diagnostico-org'
import { cicloEmFechamento } from '@/data/ciclos'
import type { Ciclo } from '@/data/tipos'
import { diasAte } from '@/lib/ciclo'
import { diasDesde } from '@/lib/memoria'
import { useRegistro } from '@/lib/registro'
import { useViewer } from '@/lib/viewer'

export default function PaginaOrg() {
  const { viewer, geracao } = useViewer()
  const { resumoDe } = useRegistro()
  const visiveis = pessoasVisiveis(viewer)
  const veDiagnostico = podeVerDiagnosticoOrg(viewer)
  const ciclo = cicloEmFechamento()
  const aAssinar = pessoasAvaliaveis(viewer)

  return (
    <div key={geracao} className="mx-auto max-w-5xl px-10 py-12">
      <header className="surgir">
        <p className="etiqueta">Organização</p>
        <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">
          {titulo(viewer.papel)}
        </h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          {subtitulo(viewer.papel)}
        </p>
      </header>

      {ciclo && (aAssinar.length > 0 || veDiagnostico) && (
        <FaixaDoCiclo ciclo={ciclo} aAssinar={aAssinar.length} veOrganizacao={veDiagnostico} />
      )}

      <div className="mt-10">
        <div className="flex items-baseline justify-between pb-2.5">
          <p className="etiqueta">
            {visiveis.length} {visiveis.length === 1 ? 'pessoa' : 'pessoas'}
          </p>
          <p className="etiqueta">Densidade de evidência</p>
        </div>
        <Separator />
      </div>

      <ul>
        {visiveis.map((p, i) => {
          const r = resumoDe(p.id)
          const dias = diasDesde(r.ultimo)
          const souEu = p.id === viewer.pessoaId
          return (
            <li key={p.id} className="surgir" style={{ animationDelay: `${60 + i * 45}ms` }}>
              <Link
                href={`/org/${p.id}`}
                className="group flex items-center gap-5 border-b border-border/70 py-5 transition-colors hover:bg-foreground/[0.025]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="display text-[1.15rem] leading-none tracking-tight">
                      {p.nome}
                    </h3>
                    {souEu && (
                      <Badge
                        variant="outline"
                        className="etiqueta border-comp/35 bg-comp-suave/40 px-1.5 py-[3px] text-comp"
                      >
                        você
                      </Badge>
                    )}
                    <ArrowUpRight className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                  <p className="mt-1.5 text-[0.82rem] text-muted-foreground">
                    {p.cargo}
                    {p.nivel && <span className="text-foreground/45"> · {p.nivel}</span>}
                    <span className="text-foreground/45"> · {p.time}</span>
                  </p>
                </div>

                <div className="hidden w-[13rem] shrink-0 sm:block">
                  <p className="font-mono text-[0.72rem] tabular-nums text-muted-foreground">
                    {r.episodios} {r.episodios === 1 ? 'episódio' : 'episódios'} ·{' '}
                    {r.eventos} {r.eventos === 1 ? 'evento' : 'eventos'}
                  </p>
                  <p className="mt-1 text-[0.72rem] text-muted-foreground/80">
                    {textoDoSilencio(dias)}
                  </p>
                </div>

                <Densidade nivel={p.densidadeEvidencia} className="shrink-0" />
              </Link>
            </li>
          )
        })}
      </ul>

      {veDiagnostico && <DiagnosticoOrg />}
    </div>
  )
}

/**
 * O gatilho do fechamento, onde quem vai fechar já está.
 *
 * A jornada do gestor começa com um aviso ("o ciclo do seu time fecha em 15
 * dias, 5 pessoas") e o item de menu sozinho não é aviso: ele está lá o ano
 * inteiro, igual, com ou sem janela aberta. A faixa só existe enquanto existe
 * ciclo em fechamento — é a diferença entre navegação e notificação.
 *
 * Dois destinos, e eles não são o mesmo em escala diferente: um é a lista de
 * quem o viewer ASSINA, o outro é a leitura de como a organização inteira está
 * fechando. A Helena tem os dois, e é a única que tem.
 */
function FaixaDoCiclo({
  ciclo,
  aAssinar,
  veOrganizacao,
}: {
  ciclo: Ciclo
  aAssinar: number
  veOrganizacao: boolean
}) {
  const dias = diasAte(ciclo.fechamento.fecha)

  return (
    <div
      className="surgir mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 rounded-sm border border-comp/25 bg-comp-suave/25 px-4 py-3.5"
      style={{ animationDelay: '40ms' }}
    >
      <div className="min-w-0">
        <p className="etiqueta text-comp">Ciclo em fechamento</p>
        <p className="prosa mt-1 text-[0.95rem] leading-snug">
          {ciclo.nome} · a janela fecha em {dias} {dias === 1 ? 'dia' : 'dias'}.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {aAssinar > 0 && (
          <Link
            href="/ciclo"
            className="group inline-flex items-center gap-1 text-[0.85rem] underline-offset-4 hover:underline"
          >
            Fechar o ciclo do seu time · {aAssinar} {aAssinar === 1 ? 'pessoa' : 'pessoas'}
            <ArrowUpRight className="size-3.5 shrink-0" />
          </Link>
        )}
        {veOrganizacao && (
          <Link
            href="/ciclo/organizacao"
            className="group inline-flex items-center gap-1 text-[0.85rem] underline-offset-4 hover:underline"
          >
            Acompanhar o ciclo na organização
            <ArrowUpRight className="size-3.5 shrink-0" />
          </Link>
        )}
      </div>
    </div>
  )
}

function titulo(papel: string) {
  if (papel === 'chro') return 'Organização'
  if (papel === 'colaborador') return 'Seu registro'
  return 'Seu time'
}

function subtitulo(papel: string) {
  if (papel === 'chro') return 'Todos os colaboradores da organização.'
  if (papel === 'colaborador') return 'O que está registrado sobre o seu trabalho neste semestre.'
  return 'Abaixo você vê os colaboradores conectados a você.'
}

function textoDoSilencio(dias?: number) {
  if (dias === undefined) return 'sem registro no semestre'
  // O singular só é alcançável desde que a lista passou a ler o registro da
  // sessão: na semente o mais recente era de oito dias atrás.
  const quando = `${dias} ${dias === 1 ? 'dia' : 'dias'}`
  if (dias <= 21) return `último registro há ${quando}`
  return `sem registro há ${quando}`
}
