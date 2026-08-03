'use client'

/**
 * Os quatro sinais de qualidade do ciclo — JORNADAS A4.
 *
 * Cada sinal é sobre a ORGANIZAÇÃO e sobre o processo, nunca sobre quem é
 * melhor. É a mesma regra do diagnóstico de organização (decisão #10) aplicada
 * ao fechamento: "a fila de Dados travou seis pessoas" produz uma decisão de
 * alocação; "o Rafael é lento" produz um PDI inútil. Aqui a versão é outra —
 * "sete linhas fecharam sobre comportamentos que nenhuma fonte alcança" produz
 * uma recalibração da régua; "o Paulo é ruim" não produz nada.
 *
 * Onde uma pessoa é nomeada, ela é a evidência de um sinal do sistema: quem
 * está sendo avaliado com registro fino, quem passou seis meses sem retorno. E
 * cada sinal abre nas pessoas e nos comportamentos que o sustentam, pelo mesmo
 * motivo que o resto do produto: número que não abre é opinião com um número na
 * frente.
 *
 * A FORMA É A DO ACHADO, de propósito. Etiqueta, contagem, uma frase derivada
 * do dado e um chevron. A Helena já leu quatro desses na tela de organização, e
 * o painel do ciclo não é um segundo idioma — é a mesma leitura, agora com data.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Densidade } from '@/components/shell/densidade'
import { Barras } from '@/components/brain/graficos'
import { NOME_NIVEL } from '@/data/regua'
import type { Avaliacao, Pessoa } from '@/data/tipos'
import type { AndamentoDoCiclo, LinhaDoCiclo } from '@/lib/ciclo'
import {
  coberturaDeFeedback,
  comportamentosSemFonte,
  discordanciaPorGestor,
  NOME_DENSIDADE,
} from '@/lib/ciclo'
import { nomeDe } from '@/lib/memoria'
import { useRegistro } from '@/lib/registro'

export function SinaisDeQualidade({
  andamento,
  avaliacoes,
  pessoas,
}: {
  andamento: AndamentoDoCiclo
  avaliacoes: Avaliacao[]
  pessoas: Pessoa[]
}) {
  return (
    <section className="mt-16">
      <div className="flex items-baseline justify-between pb-2.5">
        <p className="etiqueta">Sinais de qualidade</p>
        <p className="etiqueta">4 sinais</p>
      </div>
      <div className="border-t border-border" />

      <p className="prosa mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
        O que o ciclo diz sobre a organização, e não sobre as pessoas. Cada sinal abre na evidência
        que o sustenta.
      </p>

      <ul className="mt-2">
        <SinalDeDensidade linhas={andamento.linhas} atraso={0} />
        <SinalDeDiscordancia avaliacoes={avaliacoes} andamento={andamento} atraso={1} />
        <SinalSemEvidencia avaliacoes={avaliacoes} atraso={2} />
        <SinalDeCobertura pessoas={pessoas} atraso={3} />
      </ul>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   A casca de um sinal.
   ───────────────────────────────────────────────────────────────────────── */

function Sinal({
  etiqueta,
  contagem,
  titulo,
  atraso,
  children,
}: {
  etiqueta: string
  contagem: string
  titulo: string
  atraso: number
  children: React.ReactNode
}) {
  const [aberto, setAberto] = useState(false)

  return (
    <li
      className="surgir border-b border-border/70"
      style={{ animationDelay: `${120 + atraso * 50}ms` }}
    >
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-start gap-4 py-5 text-left transition-colors hover:bg-foreground/[0.02]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="outline" className="etiqueta px-1.5 py-[3px]">
              {etiqueta}
            </Badge>
            <span className="font-mono text-[0.7rem] text-muted-foreground">{contagem}</span>
          </div>
          {/* O título sai do dado, e não de uma constante: um sinal com frase
              fixa continuaria dizendo a mesma coisa depois de a Marina fechar
              três avaliações, que é justamente quando ele muda. */}
          <h3 className="display mt-2 max-w-2xl text-[1.15rem] leading-snug tracking-tight">
            {titulo}
          </h3>
        </div>
        <ChevronDown
          className={`mt-1 size-4 shrink-0 text-muted-foreground transition-transform ${
            aberto ? 'rotate-180' : ''
          }`}
        />
      </button>

      {aberto && <div className="pb-6 pr-10">{children}</div>}
    </li>
  )
}

/** Um nome que leva ao registro. A afirmação do painel termina no dossiê da
 *  pessoa, como toda afirmação deste produto termina na fonte. */
export function ChipDePessoa({ id, nota }: { id: string; nota?: string }) {
  return (
    <Link
      href={`/org/${id}`}
      className="inline-flex items-baseline gap-1.5 rounded-sm border border-border bg-card px-2 py-1 text-[0.78rem] transition-colors hover:border-comp/40 hover:text-comp"
    >
      {nomeDe(id)}
      {nota && <span className="font-mono text-[0.68rem] text-muted-foreground">{nota}</span>}
    </Link>
  )
}

const plural = (n: number, um: string, muitos: string) => (n === 1 ? um : muitos)

/* ─────────────────────────────────────────────────────────────────────────
   1 · Densidade de evidência — com quanto lastro se está avaliando.
   ───────────────────────────────────────────────────────────────────────── */

const ORDEM_DENSIDADE: Pessoa['densidadeEvidencia'][] = ['baixa', 'media', 'alta']

const LEGENDA_DENSIDADE: Record<Pessoa['densidadeEvidencia'], string> = {
  baixa: 'Pouca evidência registrada no semestre.',
  media: 'Evidência parcial.',
  alta: 'O registro alcançou o semestre.',
}

function SinalDeDensidade({ linhas, atraso }: { linhas: LinhaDoCiclo[]; atraso: number }) {
  const { resumoDe } = useRegistro()
  const baixa = linhas.filter((l) => l.pessoa.densidadeEvidencia === 'baixa')

  return (
    <Sinal
      etiqueta="Densidade de evidência"
      contagem={`${linhas.length} ${plural(linhas.length, 'pessoa', 'pessoas')} no ciclo`}
      titulo={
        baixa.length === 0
          ? 'Ninguém chega ao fechamento com densidade baixa'
          : `${baixa.length} ${plural(baixa.length, 'pessoa chega', 'pessoas chegam')} ao fechamento com densidade baixa`
      }
      atraso={atraso}
    >
      {/* A regra de leitura da política de decisão, dita onde ela é aplicada.
          É o que impede a nota de ser lida como afirmação sobre o trabalho
          quando o registro não alcançou o semestre. */}
      <p className="prosa max-w-2xl text-[0.95rem] leading-relaxed">
        Com densidade baixa, nota baixa diz primeiro que o registro é fino — e pede a mesma coisa que
        &ldquo;sem evidência&rdquo; pede, que é uma pergunta. O que autoriza ler o número como
        afirmação sobre o trabalho é densidade alta.
      </p>

      {ORDEM_DENSIDADE.map((nivel) => {
        const doNivel = linhas.filter((l) => l.pessoa.densidadeEvidencia === nivel)
        if (doNivel.length === 0) return null
        return (
          <div key={nivel} className="mt-5">
            <div className="flex items-baseline gap-2 pb-2">
              <Densidade nivel={nivel} />
              <p className="etiqueta">
                {NOME_DENSIDADE[nivel]} · {doNivel.length}{' '}
                {plural(doNivel.length, 'pessoa', 'pessoas')}
              </p>
              <p className="text-[0.75rem] text-muted-foreground/80">{LEGENDA_DENSIDADE[nivel]}</p>
            </div>

            <ul className="space-y-1">
              {doNivel.map((l) => {
                const r = resumoDe(l.pessoa.id)
                return (
                  <li key={l.pessoa.id}>
                    <Link
                      href={`/org/${l.pessoa.id}`}
                      className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 py-1 text-[0.85rem] transition-colors hover:text-comp"
                    >
                      <span className="min-w-[9rem]">{l.pessoa.nome}</span>
                      <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                        {r.eventos} {plural(r.eventos, 'evento', 'eventos')} · {r.episodios}{' '}
                        {plural(r.episodios, 'episódio', 'episódios')}
                      </span>
                      {/* A densidade e o que foi assinado, na mesma linha. É a
                          exigência da política de decisão virando pixel: quem
                          lê o veredito lê o denominador junto. */}
                      {l.leitura && (
                        <span className="text-[0.75rem] text-muted-foreground/80">
                          ciclo fechado com {l.leitura.semEvidencia}{' '}
                          {plural(l.leitura.semEvidencia, 'linha', 'linhas')} sem evidência
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </Sinal>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   2 · Taxa de discordância por gestor.
   ───────────────────────────────────────────────────────────────────────── */

function SinalDeDiscordancia({
  avaliacoes,
  andamento,
  atraso,
}: {
  avaliacoes: Avaliacao[]
  andamento: AndamentoDoCiclo
  atraso: number
}) {
  const leituras = discordanciaPorGestor(avaliacoes)
  const semDiscordar = leituras.filter((l) => l.discordos === 0)
  const linhasSemDiscordar = semDiscordar.reduce((s, l) => s + l.linhas, 0)
  const gestoresSemFechar = andamento.grupos.filter(
    (g) => g.gestorId && !leituras.some((l) => l.gestorId === g.gestorId),
  ).length

  const titulo =
    leituras.length === 0
      ? 'Nenhum gestor fechou uma avaliação ainda neste ciclo'
      : semDiscordar.length > 0
        ? `${semDiscordar.length} ${plural(semDiscordar.length, 'gestor assinou', 'gestores assinaram')} ${linhasSemDiscordar} ${plural(linhasSemDiscordar, 'linha', 'linhas')} da régua sem discordar de nenhuma`
        : `${leituras.length} ${plural(leituras.length, 'gestor discordou', 'gestores discordaram')} da leitura em pelo menos uma linha`

  return (
    <Sinal
      etiqueta="Discordância por gestor"
      contagem={`${leituras.length} ${plural(leituras.length, 'gestor fechou', 'gestores fecharam')}`}
      titulo={titulo}
      atraso={atraso}
    >
      <p className="prosa max-w-2xl text-[0.95rem] leading-relaxed">
        Discordar de tudo e não discordar de nada são os dois extremos, e nenhum dos dois é conclusão
        sobre o gestor: um diz que a régua ou o registro não servem, o outro que a régua não foi
        lida. Os dois pedem a mesma coisa, que é uma conversa.
      </p>

      {leituras.length === 0 ? (
        <p className="mt-4 text-[0.85rem] leading-snug text-muted-foreground">
          A taxa aparece quando a primeira avaliação for assinada. Gestor que ainda não fechou não
          entra com 0 % — não fechar e concordar com tudo são coisas diferentes.
        </p>
      ) : (
        <>
          <Barras
            titulo="Linhas em que o gestor discordou da leitura"
            unidade="% das linhas"
            series={leituras.map((l) => ({
              rotulo: nomeDe(l.gestorId),
              valor: Math.round(l.taxa * 100),
              nota: `${l.pessoaIds.length} ${plural(l.pessoaIds.length, 'avaliação', 'avaliações')} · ${l.linhas} ${plural(l.linhas, 'linha', 'linhas')} · ${l.discordos} ${plural(l.discordos, 'discordância', 'discordâncias')} · ${l.semEvidencia} sem evidência · ${l.semLastro} ${plural(l.semLastro, 'pergunta aberta', 'perguntas abertas')}`,
            }))}
          />

          <p className="etiqueta mt-4 pb-2">Quem foi avaliado nessas linhas</p>
          <div className="flex flex-wrap gap-1.5">
            {leituras.flatMap((l) => l.pessoaIds).map((id) => (
              <ChipDePessoa key={id} id={id} />
            ))}
          </div>

          {gestoresSemFechar > 0 && (
            <p className="mt-4 text-[0.8rem] leading-snug text-muted-foreground">
              {gestoresSemFechar}{' '}
              {plural(gestoresSemFechar, 'gestor ainda não assinou nada', 'gestores ainda não assinaram nada')}{' '}
              neste ciclo e por isso não {plural(gestoresSemFechar, 'aparece', 'aparecem')} acima.
            </p>
          )}
        </>
      )}
    </Sinal>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   3 · Comportamentos que fecharam sem evidência.
   ───────────────────────────────────────────────────────────────────────── */

function SinalSemEvidencia({ avaliacoes, atraso }: { avaliacoes: Avaliacao[]; atraso: number }) {
  const semFonte = comportamentosSemFonte(avaliacoes)
  const linhas = semFonte.reduce((s, c) => s + c.quantas, 0)

  return (
    <Sinal
      etiqueta="Sem evidência"
      contagem={`${linhas} ${plural(linhas, 'linha assinada', 'linhas assinadas')}`}
      titulo={
        semFonte.length === 0
          ? 'Toda linha assinada até agora tinha evidência por trás'
          : `${semFonte.length} ${plural(semFonte.length, 'comportamento da régua fechou', 'comportamentos da régua fecharam')} sem que fonte nenhuma os alcançasse`
      }
      atraso={atraso}
    >
      <p className="prosa max-w-2xl text-[0.95rem] leading-relaxed">
        Sem evidência não quer dizer que a pessoa não faz — quer dizer que o registro não alcançou.
        Repetido em gente diferente, deixa de ser sobre as pessoas: ou a régua pede o que a empresa
        não faz, ou nenhuma fonte conectada captura o que ela pede.
      </p>

      {semFonte.length === 0 ? (
        <p className="mt-4 text-[0.85rem] leading-snug text-muted-foreground">
          Nada a recalibrar por aqui neste ciclo.
        </p>
      ) : (
        <>
          <ul className="mt-5 space-y-4">
            {semFonte.map((c) => (
              <li key={c.comportamentoId}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-wider text-comp">
                    {c.rotulo}
                  </p>
                  <p className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                    {c.quantas} {plural(c.quantas, 'avaliação', 'avaliações')}
                  </p>
                </div>
                <p className="prosa mt-1 text-[0.9rem] leading-snug">{c.texto}</p>
                <p className="mt-1 text-[0.78rem] leading-snug text-muted-foreground">
                  O observável escrito na régua: {c.observavel}
                </p>
                {/* O caso em que o registro não alcançou e um humano alcançou.
                    É o que separa "a empresa não faz isso" de "isso só aparece
                    perguntando" — e as duas conclusões pedem coisas opostas. */}
                {c.elicitadas > 0 && (
                  <p className="mt-1 text-[0.78rem] leading-snug text-comp">
                    {c.elicitadas} {plural(c.elicitadas, 'delas fechou', 'delas fecharam')} com
                    evidência que o gestor trouxe na hora.
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.pessoaIds.map((id) => (
                    <ChipDePessoa key={id} id={id} />
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/diretrizes"
            className="mt-5 inline-block text-[0.82rem] underline-offset-4 hover:underline"
          >
            Ver a régua de carreira
          </Link>
        </>
      )}
    </Sinal>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   4 · Cobertura de feedback — onde o silêncio é o dado.
   ───────────────────────────────────────────────────────────────────────── */

function SinalDeCobertura({ pessoas, atraso }: { pessoas: Pessoa[]; atraso: number }) {
  const { feedbacksDe } = useRegistro()
  const cobertura = coberturaDeFeedback(pessoas, feedbacksDe)
  const semNenhum = cobertura.flatMap((c) => c.semFeedback)
  const total = cobertura.reduce((s, c) => s + c.comFeedback.length + c.semFeedback.length, 0)

  return (
    <Sinal
      etiqueta="Cobertura de feedback"
      contagem={`${total - semNenhum.length} de ${total} ${plural(total, 'pessoa', 'pessoas')}`}
      titulo={
        semNenhum.length === 0
          ? 'Todo mundo com gestor direto recebeu retorno no semestre'
          : `${semNenhum.length} ${plural(semNenhum.length, 'pessoa passou', 'pessoas passaram')} o semestre sem nenhum feedback registrado`
      }
      atraso={atraso}
    >
      <p className="prosa max-w-2xl text-[0.95rem] leading-relaxed">
        Conta reconhecimento e conversa registrada. O teor de uma conversa nunca é guardado — o que
        a organização precisa saber é se ela existiu.
      </p>

      <Barras
        titulo="Pessoas com feedback registrado no semestre"
        unidade="por gestor"
        series={cobertura.map((c) => {
          const doGestor = c.comFeedback.length + c.semFeedback.length
          return {
            rotulo: nomeDe(c.gestorId),
            valor: c.comFeedback.length,
            nota:
              c.semFeedback.length === 0
                ? `${doGestor} de ${doGestor}`
                : `${c.comFeedback.length} de ${doGestor} · sem nenhum registro: ${c.semFeedback.map(nomeDe).join(', ')}`,
          }
        })}
      />

      {/* O silêncio nomeado. Numa média ele vira "cobertura de 67 %" e some;
          aqui ele é uma lista de gente com nome, que é o que produz a pergunta
          da semana seguinte. */}
      {semNenhum.length > 0 && (
        <>
          <p className="etiqueta mt-4 pb-2">Seis meses sem nenhum registro</p>
          <div className="flex flex-wrap gap-1.5">
            {semNenhum.map((id) => (
              <ChipDePessoa key={id} id={id} nota={NOME_NIVEL[nivelDe(pessoas, id)] ?? ''} />
            ))}
          </div>
        </>
      )}
    </Sinal>
  )
}

const nivelDe = (pessoas: Pessoa[], id: string) => pessoas.find((p) => p.id === id)?.nivel ?? ''
