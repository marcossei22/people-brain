'use client'

/**
 * `/ciclo` — a lista do time com o status de cada fechamento. JORNADAS G5.
 *
 * O gatilho da jornada é uma notificação ("o ciclo do seu time fecha em 15
 * dias, 5 pessoas"), e esta é a tela onde ela pousa. Como a de `/org`, a lista
 * É a permissão: `pessoasAvaliaveis()` na tela. A diferença entre as duas não é
 * de escopo, é de verbo — `/org` mostra quem o viewer alcança, aqui mostra quem
 * ele ASSINA. A Helena vê a organização inteira em `/org` e fecha o ciclo de
 * três pessoas, que são as que reportam a ela.
 *
 * CADA LINHA TRAZ O STATUS DO FECHAMENTO, e só ele — mais a densidade de
 * evidência, que é sobre o registro e não sobre a pessoa. É o que G5 pede aqui.
 *
 * A cobertura por pessoa ("3 de 4 sustentados", com a tira ao lado) já esteve
 * nesta tela e saiu: não bastava não ordenar a lista, porque quem ordena é o
 * leitor. Três leituras de régua empilhadas, uma linha embaixo da outra, são o
 * ranking indireto que o produto diz não ter — o mesmo caso que
 * `agent/instructions.md` proíbe para a IA ("duas teias na mesma tela se
 * ordenam sozinhas"), e pior aqui, porque `sustentado` não distingue nota baixa
 * de ausência de registro: quem tinha tudo sem evidência saía "0 de 4" e a
 * ausência virava placar. A régua se lê uma pessoa por vez, na tela de
 * fechamento, que é onde ela é julgada.
 */

import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Densidade } from '@/components/shell/densidade'
import { NOME_DECISAO, cicloEmFechamento } from '@/data/ciclos'
import { NOME_NIVEL } from '@/data/regua'
import type { Ciclo, Pessoa } from '@/data/tipos'
import { pessoasAvaliaveis } from '@/lib/agente/permissoes'
import { dataCurta } from '@/lib/memoria'
import { coberturaDoNivelOcupado } from '@/lib/metricas'
import { useRegistro } from '@/lib/registro'
import { useViewer } from '@/lib/viewer'

export default function PaginaCiclo() {
  const { viewer, geracao } = useViewer()
  const { avaliacaoDe } = useRegistro()

  const ciclo = cicloEmFechamento()
  const time = pessoasAvaliaveis(viewer)

  if (!ciclo)
    return (
      <div className="mx-auto max-w-3xl px-10 py-12">
        <p className="etiqueta">Ciclo</p>
        <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">
          Nenhum ciclo aberto
        </h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          O registro continua correndo. Quando a janela abrir, as pessoas do seu time aparecem aqui.
        </p>
      </div>
    )

  const fechadas = time.filter((p) => avaliacaoDe(ciclo.id, p.id)?.assinadaEm).length

  return (
    <div key={geracao} className="mx-auto max-w-4xl px-10 py-12">
      <header className="surgir">
        <p className="etiqueta">Fechamento do ciclo</p>
        <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">{ciclo.nome}</h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          {time.length === 0
            ? 'Você não assina o fechamento de ninguém neste ciclo.'
            : `${time.length === 1 ? '1 pessoa' : `${time.length} pessoas`} para fechar. A janela vai até ${dataCurta(ciclo.fechamento.fecha)}.`}
        </p>
      </header>

      {time.length > 0 && (
        <>
          <div className="mt-10">
            <div className="flex items-baseline justify-between pb-2.5">
              <p className="etiqueta">
                {fechadas} de {time.length} {fechadas === 1 ? 'fechada' : 'fechadas'}
              </p>
              <p className="etiqueta">Densidade do registro</p>
            </div>
            <Separator />
          </div>

          <ul>
            {time.map((p, i) => (
              <li key={p.id} className="surgir" style={{ animationDelay: `${60 + i * 45}ms` }}>
                <LinhaDoTime pessoa={p} ciclo={ciclo} />
              </li>
            ))}
          </ul>

          {/* O que a tela promete, em uma linha e sem defender a tese. */}
          <p className="surgir mt-8 text-[0.8rem] leading-snug text-muted-foreground">
            Nada aqui é formulário. Você lê a régua já pontuada, discorda onde discordar, e decide.
          </p>
        </>
      )}
    </div>
  )
}

function LinhaDoTime({ pessoa, ciclo }: { pessoa: Pessoa; ciclo: Ciclo }) {
  const { avaliacaoDe } = useRegistro()

  /* Só o TAMANHO da régua, que é quantas linhas o gestor tem para ler. Nenhuma
   * situação sai daqui, e por isso a chamada não passa a sessão: quanto está
   * sustentado é leitura de uma pessoa, e ela acontece na tela de fechamento. */
  const linhasDaRegua = coberturaDoNivelOcupado(pessoa.id)?.itens.length ?? 0
  const avaliacao = avaliacaoDe(ciclo.id, pessoa.id)

  return (
    <Link
      href={`/ciclo/${pessoa.id}`}
      className="group flex items-center gap-5 border-b border-border/70 py-5 transition-colors hover:bg-foreground/[0.025]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="display text-[1.15rem] leading-none tracking-tight">{pessoa.nome}</h3>
          {avaliacao?.assinadaEm ? (
            <Badge
              variant="outline"
              className="etiqueta border-comp/35 bg-comp-suave/40 px-1.5 py-[3px] text-comp"
            >
              <Check className="mr-1 size-3" />
              {NOME_DECISAO[avaliacao.decisao!]}
            </Badge>
          ) : (
            avaliacao && (
              <Badge variant="outline" className="etiqueta px-1.5 py-[3px]">
                {avaliacao.vereditos.length} de {linhasDaRegua} lidos
              </Badge>
            )
          )}
          <ArrowUpRight className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </div>
        <p className="mt-1.5 text-[0.82rem] text-muted-foreground">
          {pessoa.cargo}
          {pessoa.nivel && (
            <span className="text-foreground/45"> · {NOME_NIVEL[pessoa.nivel] ?? pessoa.nivel}</span>
          )}
        </p>
      </div>

      <div className="hidden w-[9rem] shrink-0 text-right sm:block">
        <p className="font-mono text-[0.72rem] tabular-nums text-muted-foreground">
          {avaliacao?.assinadaEm
            ? `assinado em ${dataCurta(avaliacao.assinadaEm)}`
            : `${linhasDaRegua} ${linhasDaRegua === 1 ? 'comportamento' : 'comportamentos'} para ler`}
        </p>
      </div>

      <Densidade nivel={pessoa.densidadeEvidencia} className="shrink-0" />
    </Link>
  )
}
