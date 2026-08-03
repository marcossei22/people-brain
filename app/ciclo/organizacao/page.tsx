'use client'

/**
 * `/ciclo/organizacao` — o painel do ciclo do RH. JORNADAS A4.
 *
 * O argumento de venda para uma empresa grande não é "a avaliação ficou mais
 * rápida": é que **o ciclo virou auditável**. O RH já tinha o diagnóstico de
 * organização e não tinha nenhuma visão do fechamento — dava para ver a empresa
 * e não dava para ver o ritual que decide nível e promoção nela.
 *
 * O PRINCÍPIO QUE GOVERNA ESTA TELA é o sexto do PLANO: performance é
 * propriedade do sistema, não só da pessoa. Todo número aqui é sobre a
 * organização e sobre a qualidade do processo. Se um sinal puder ser lido como
 * "quem é melhor", ele está errado — e é por isso que não existe aqui uma
 * ordenação de pessoas por nota, uma média por time nem um comparativo entre
 * gestores que não seja sobre COMO eles leram a régua.
 *
 * A ROTA É ESTÁTICA DENTRO DE `/ciclo`, ao lado de `/ciclo/[id]`. Não é acaso
 * de arquivo: `/ciclo` é a lista de quem o viewer ASSINA e esta é a leitura de
 * quem o viewer ACOMPANHA. A Helena tem as duas — ela fecha o ciclo de três
 * pessoas de Vendas e Design, e responde pelo fechamento das onze.
 *
 * Nada aqui é pré-renderizado com conteúdo, pelo mesmo motivo do dossiê
 * (decisão #36): o viewer é estado de cliente, e a persona padrão é justamente
 * a CHRO. Sem o guarda de montagem, o HTML inicial entregaria o andamento do
 * ciclo da organização inteira antes de qualquer permissão rodar.
 */

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Densidade } from '@/components/shell/densidade'
import { Indicadores, TiraDeCobertura } from '@/components/brain/graficos'
import { SemAcesso } from '@/components/brain/sem-acesso'
import { CICLO_ATUAL, NOME_DECISAO, cicloEmFechamento } from '@/data/ciclos'
import { NOME_NIVEL } from '@/data/regua'
import { pessoasVisiveis, podeVerDiagnosticoOrg } from '@/lib/agente/permissoes'
import type { AndamentoDoCiclo, CasoDoCiclo, GrupoDeGestor } from '@/lib/ciclo'
import { andamentoDoCiclo, casosDoCiclo, diasAte } from '@/lib/ciclo'
import { dataCurta, nomeDe } from '@/lib/memoria'
import { useRegistro } from '@/lib/registro'
import { useViewer } from '@/lib/viewer'
import { ChipDePessoa, SinaisDeQualidade } from './sinais'

export default function PainelDoCiclo() {
  const { viewer, geracao } = useViewer()
  const { avaliacoesDoCiclo, estreladosDe, lastrosDe } = useRegistro()

  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const ciclo = cicloEmFechamento()

  if (!montado) return <div className="mx-auto max-w-4xl px-10 py-12" />
  if (!podeVerDiagnosticoOrg(viewer))
    return (
      <SemAcesso motivo="O painel do ciclo é uma leitura sobre a organização inteira. Ele é do RH." />
    )
  if (!ciclo)
    return (
      <div className="mx-auto max-w-3xl px-10 py-12">
        <p className="etiqueta">Ciclo</p>
        <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">
          Nenhum ciclo em janela
        </h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          O registro continua correndo. Quando a próxima janela abrir, o andamento aparece aqui.
        </p>
      </div>
    )

  /* A permissão entra como o universo do painel, e não como um `if` depois da
   * conta: quem o viewer não alcança não entra em denominador nenhum. Para a
   * Helena são as onze pessoas com régua; para qualquer outra persona esta tela
   * nem abre. */
  const visiveis = pessoasVisiveis(viewer)
  const avaliacoes = avaliacoesDoCiclo(CICLO_ATUAL)
  const andamento = andamentoDoCiclo(visiveis, avaliacoes)
  /* A régua do caso é lida contra o nível ALVO, e por isso passa pela sessão:
   * o reconhecimento e o lastro escritos na tela de fechamento têm que chegar
   * aqui, senão o card do comitê conta a mesma pessoa por outro critério que o
   * dossiê a um clique de distância. */
  const { promocoes, prontas } = casosDoCiclo(visiveis, avaliacoes, estreladosDe, lastrosDe)

  return (
    <div key={geracao} className="mx-auto max-w-4xl px-10 py-12">
      <header className="surgir">
        <p className="etiqueta">Ciclo · organização</p>
        <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">{ciclo.nome}</h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          Quem fechou, quem falta, e com que qualidade a organização está avaliando. A janela abriu
          em {dataCurta(ciclo.fechamento.abre)} e fecha em {dataCurta(ciclo.fechamento.fecha)},
          daqui a {diasAte(ciclo.fechamento.fecha)} dias.
        </p>
      </header>

      <div className="surgir mt-8" style={{ animationDelay: '60ms' }}>
        <Indicadores
          titulo="Andamento"
          itens={[
            {
              valor: `${andamento.fechadas} de ${andamento.linhas.length}`,
              rotulo: 'ciclos fechados',
              nota: 'pessoas com régua contra a qual fechar',
            },
            {
              valor: `${andamento.faltam}`,
              rotulo: 'faltam',
              nota:
                andamento.semGestor > 0
                  ? `${andamento.semGestor} sem gestor direto no registro`
                  : undefined,
            },
            {
              valor: `${andamento.semEvidencia}`,
              rotulo: 'linhas sem evidência',
              /* A linha que o gestor completou discordando SAI daqui. Ela
                 fechou com evidência — contá-la aqui fazia o indicador que a
                 régua usa para se recalibrar acusar justamente o caso em que o
                 registro foi consertado. */
              nota:
                andamento.elicitadas > 0
                  ? `assinadas sem que nenhuma fonte alcançasse · outras ${andamento.elicitadas} o gestor completou no fechamento`
                  : 'assinadas sobre comportamentos que nenhuma fonte alcançou',
            },
          ]}
        />
      </div>

      {/* A ordem da tela é a do princípio 6: a leitura da organização vem antes
          de qualquer leitura individual. Diagnóstico depois do veredito é
          errata. */}
      <p className="surgir mt-4 text-[0.8rem] leading-snug text-muted-foreground">
        O diagnóstico de organização é lido antes das leituras individuais.{' '}
        <Link href="/org" className="underline underline-offset-4 hover:text-foreground">
          Ver o diagnóstico
        </Link>
      </p>

      <Andamento andamento={andamento} />

      <SinaisDeQualidade andamento={andamento} avaliacoes={avaliacoes} pessoas={visiveis} />

      <OComite promocoes={promocoes} prontas={prontas} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Andamento — agrupado por quem assina, porque é assim que se cobra.
   ───────────────────────────────────────────────────────────────────────── */

function Andamento({ andamento }: { andamento: AndamentoDoCiclo }) {
  return (
    <section className="mt-14">
      <div className="flex items-baseline justify-between pb-2.5">
        <p className="etiqueta">Quem fechou, por quem assina</p>
        <p className="etiqueta">Densidade</p>
      </div>
      <Separator />

      {andamento.grupos.map((g, i) => (
        <Grupo key={g.gestorId ?? 'sem-gestor'} grupo={g} atraso={i} />
      ))}
    </section>
  )
}

function Grupo({ grupo, atraso }: { grupo: GrupoDeGestor; atraso: number }) {
  return (
    <section
      className="surgir border-b border-border/70 py-5"
      style={{ animationDelay: `${80 + atraso * 45}ms` }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="display text-[1.05rem] leading-none tracking-tight">
          {grupo.gestorId ? nomeDe(grupo.gestorId) : 'Sem gestor direto'}
        </h3>
        <p className="font-mono text-[0.72rem] tabular-nums text-muted-foreground">
          {grupo.fechadas} de {grupo.linhas.length} {grupo.fechadas === 1 ? 'fechada' : 'fechadas'}
        </p>
      </div>

      {/* Duas pessoas que ninguém assina somem dentro de "faltam 9" e voltam
          como cobrança sem destinatário. Ditas, viram uma decisão de
          organograma — que é a decisão que elas de fato pedem. */}
      {!grupo.gestorId && (
        <p className="mt-1.5 text-[0.8rem] leading-snug text-muted-foreground">
          Ninguém assina o fechamento destas pessoas neste ciclo.
        </p>
      )}

      <ul className="mt-2.5">
        {grupo.linhas.map((l) => (
          <li key={l.pessoa.id}>
            <Link
              href={`/org/${l.pessoa.id}`}
              className="group -mx-2 flex items-center gap-4 rounded-sm px-2 py-2 transition-colors hover:bg-foreground/[0.03]"
            >
              <span className="min-w-0 flex-1">
                <span className="text-[0.92rem]">{l.pessoa.nome}</span>
                <span className="ml-2 text-[0.76rem] text-muted-foreground">
                  {l.pessoa.nivel && NOME_NIVEL[l.pessoa.nivel]} · {l.pessoa.time}
                </span>
              </span>

              <span className="shrink-0 text-right">
                {l.avaliacao ? (
                  <>
                    <Badge
                      variant="outline"
                      className="etiqueta border-comp/35 bg-comp-suave/40 px-1.5 py-[3px] text-comp"
                    >
                      <Check className="mr-1 size-3" />
                      {NOME_DECISAO[l.avaliacao.decisao!]}
                    </Badge>
                    {/* O que foi assinado, junto de quanto lastro havia. As duas
                        coisas separadas é o que a política de decisão proíbe. */}
                    <span className="mt-1 block font-mono text-[0.68rem] tabular-nums text-muted-foreground">
                      {dataCurta(l.avaliacao.assinadaEm!)} · {l.leitura!.linhas} linhas ·{' '}
                      {l.leitura!.semEvidencia} sem evidência
                    </span>
                  </>
                ) : (
                  <span className="text-[0.78rem] text-muted-foreground/70">
                    {grupo.gestorId ? 'falta fechar' : 'sem quem assine'}
                  </span>
                )}
              </span>

              <Densidade nivel={l.pessoa.densidadeEvidencia} className="shrink-0" />
              <ArrowUpRight className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   O comitê — o que sai do fechamento e vai para uma mesa.
   ───────────────────────────────────────────────────────────────────────── */

const NOME_INSTANCIA: Record<CasoDoCiclo['instancia'], string> = {
  time: 'Comitê do time',
  'comite-cima': 'Comitê de engenharia e CHRO',
}

const QUEM_DECIDE: Record<CasoDoCiclo['instancia'], string> = {
  time: 'Promoção até sênior é decidida pelo comitê do time, com o caso aberto pelo gestor.',
  'comite-cima':
    'Promoção a staff e acima passa pelo comitê de engenharia com a CHRO, com calibração entre times.',
}

function OComite({ promocoes, prontas }: { promocoes: CasoDoCiclo[]; prontas: CasoDoCiclo[] }) {
  const instancias: CasoDoCiclo['instancia'][] = ['comite-cima', 'time']

  return (
    <section className="mt-16">
      <div className="flex items-baseline justify-between pb-2.5">
        <p className="etiqueta">O que vai ao comitê</p>
        <p className="etiqueta">{promocoes.length} para o comitê</p>
      </div>
      <Separator />

      <p className="prosa mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
        Os casos que os gestores abriram neste fechamento, lidos contra a régua do nível alvo, com a
        densidade do período ao lado. O comitê lê as duas juntas: com registro fino, nota baixa diz
        primeiro que o registro é fino.
      </p>

      {promocoes.length === 0 ? (
        <p className="mt-5 text-[0.88rem] leading-snug text-muted-foreground">
          Nenhum caso aberto ainda. Quando um gestor decide abrir promoção no fechamento, o caso
          aparece aqui com a régua do nível alvo e a evidência que a sustenta.
        </p>
      ) : (
        instancias.map((inst) => {
          const doGrupo = promocoes.filter((c) => c.instancia === inst)
          if (doGrupo.length === 0) return null
          return (
            <div key={inst} className="mt-6">
              <p className="etiqueta">{NOME_INSTANCIA[inst]}</p>
              <p className="mt-1 text-[0.8rem] leading-snug text-muted-foreground">
                {QUEM_DECIDE[inst]}
              </p>
              <ul className="mt-3 space-y-2">
                {doGrupo.map((c) => (
                  <li key={c.pessoa.id}>
                    <Caso caso={c} />
                  </li>
                ))}
              </ul>
            </div>
          )
        })
      )}

      {/* Prontidão registrada que o orçamento não absorveu. Não vai a mesa
          nenhuma, e é a informação que o RH precisa ter antes de a pessoa ir
          embora — a fila de risco do achado de bloqueio de promoção. */}
      {prontas.length > 0 && (
        <div className="mt-8">
          <p className="etiqueta">Prontas, sem vaga</p>
          <p className="mt-1 text-[0.8rem] leading-snug text-muted-foreground">
            Registrado no fechamento. O caso espera orçamento ou vaga, e a prontidão não expira com
            o ciclo.
          </p>
          <ul className="mt-3 space-y-2">
            {prontas.map((c) => (
              <li key={c.pessoa.id}>
                <Caso caso={c} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

/**
 * Um caso na fila do comitê.
 *
 * DUAS LEITURAS, e elas respondem perguntas diferentes: a tira é a régua do
 * nível ALVO, que é contra o que a política de decisão manda ler um caso; a
 * linha de baixo é o FECHAMENTO que o gestor assinou, que foi sobre o nível
 * ocupado. Cada uma sai com o nível escrito ao lado, porque foi exatamente a
 * ausência desse rótulo que fez o card afirmar "Pleno → Sênior" desenhando a
 * régua de pleno.
 *
 * SEM ESCALAR DE RÉGUA. O "N de M sustentados" que ficava aqui reduzia o caso a
 * um número, e casos empilhados com um número cada se ordenam sozinhos — que é
 * a curva que a política de decisão proíbe na frase seguinte à que manda ler
 * contra o alvo. A tira mostra a forma sem publicar o placar, e o caso
 * comportamento a comportamento é lido onde ele existe inteiro: no registro da
 * pessoa, a um clique.
 */
function Caso({ caso }: { caso: CasoDoCiclo }) {
  const { pessoa, avaliacao, itens, leitura, alvo, nivelLido } = caso

  return (
    <div className="rounded-sm border border-border bg-card px-4 py-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="display text-[1.05rem] leading-none tracking-tight">{pessoa.nome}</p>
        <p className="font-mono text-[0.7rem] text-muted-foreground">
          {NOME_NIVEL[avaliacao.nivel]}
          {alvo && ` → ${NOME_NIVEL[alvo]}`}
        </p>
      </div>

      <p className="mt-1.5 font-mono text-[0.68rem] text-muted-foreground">
        {NOME_DECISAO[avaliacao.decisao!]} · assinado por {nomeDe(avaliacao.por)} ·{' '}
        {dataCurta(avaliacao.assinadaEm!)}
      </p>

      <div className="mt-3.5 flex items-center gap-4">
        <span className="min-w-0 flex-1">
          <span className="etiqueta block pb-1.5">
            Régua de {NOME_NIVEL[nivelLido]} · {itens.length}{' '}
            {itens.length === 1 ? 'comportamento' : 'comportamentos'}
          </span>
          <TiraDeCobertura itens={itens} />
        </span>
        <span className="shrink-0 text-right">
          <span className="etiqueta block pb-1">Densidade</span>
          <Densidade nivel={pessoa.densidadeEvidencia} className="justify-end" />
        </span>
      </div>

      <p className="mt-2.5 font-mono text-[0.7rem] tabular-nums text-muted-foreground">
        fechamento de {NOME_NIVEL[avaliacao.nivel]} · {leitura.linhas} linhas ·{' '}
        {leitura.discordos} {leitura.discordos === 1 ? 'discordância' : 'discordâncias'} ·{' '}
        {leitura.semLastro} sem lastro · {leitura.semEvidencia} sem evidência
        {leitura.elicitadas > 0 &&
          ` · ${leitura.elicitadas} ${leitura.elicitadas === 1 ? 'completada' : 'completadas'} no fechamento`}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <ChipDePessoa id={pessoa.id} nota="registro do período" />
      </div>
    </div>
  )
}
