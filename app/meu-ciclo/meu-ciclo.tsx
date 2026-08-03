'use client'

/**
 * `/meu-ciclo` — o ciclo do lado de quem é avaliado. JORNADAS C4 e C5.
 *
 * UMA ROTA, DOIS MOMENTOS, e a diferença entre eles não é um estado da tela: é
 * o gestor ter assinado. Antes da assinatura ela vê a janela de contexto (C4) —
 * o que o registro não alcançou, com espaço para completar. Depois, o ciclo
 * fechado (C5). Duas rotas separadas obrigariam a pessoa a saber em que fase o
 * semestre dela está para escolher qual abrir, e a fase não é assunto dela.
 *
 * A CONTRA-REGRA QUE GOVERNA C4: **não existe autoavaliação.** Não há campo de
 * nota, não há texto sobre si mesma, não há formulário e nada é obrigatório. O
 * único gesto é `adicionarContexto()`, o mesmo de C3, e o que ele produz é
 * evidência de trabalho com o nome dela na procedência — não opinião sobre si.
 * "O colaborador não tem trabalho de performance para fazer" é tese, e o jeito
 * de a tela sustentá-la é não pedir nada.
 *
 * QUAL RÉGUA. A do nível OCUPADO, que é a régua contra a qual o gestor vai
 * assinar. O dossiê que ela abre o ano inteiro mostra a do nível ALVO, porque a
 * pergunta lá é "o que falta para subir". Mostrar aqui a do alvo faria a pessoa
 * completar buracos de uma régua que ninguém vai julgar neste semestre.
 *
 * O QUE ELA NÃO DESCOBRE AQUI: nada. A evidência é a mesma que esteve no dossiê
 * o semestre inteiro, com os mesmos números e os mesmos links até a fonte. O
 * único fato novo em C5 é a decisão — a parte que depende de orçamento, timing
 * e calibração, e que por isso continua sendo humana.
 */

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Check, Flag, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { AbrirComportamento, SetaDeAbertura } from '@/components/brain/comportamento'
import { Cobertura } from '@/components/brain/graficos'
import { Fonte } from '@/components/brain/fonte'
import { CICLO_ATUAL, EXPLICACAO_DECISAO, NOME_DECISAO, cicloEmFechamento } from '@/data/ciclos'
import { NOME_NIVEL, NOME_TRILHA, comportamentoPorId } from '@/data/regua'
import type { Avaliacao, Ciclo, Lastro, Pessoa, PessoaId, Veredito } from '@/data/tipos'
import { quemAvalia } from '@/lib/agente/permissoes'
import { dataCurta, diasAte, nomeDe, pessoa as buscarPessoa } from '@/lib/memoria'
import type { ComportamentoCoberto } from '@/lib/metricas'
import {
  comportamentosCobertos,
  coberturaDoNivelOcupado,
  episodiosQueSustentam,
} from '@/lib/metricas'
import { useRegistro } from '@/lib/registro'
import { useViewer } from '@/lib/viewer'

export function MeuCiclo() {
  const { viewer, geracao } = useViewer()
  const { avaliacaoDe } = useRegistro()

  /* Nada antes da hidratação, como no dossiê e no fechamento: no servidor não
   * existe viewer, e a tela inteira é sobre o registro de quem está olhando. */
  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const eu = buscarPessoa(viewer.pessoaId)
  const ciclo = cicloEmFechamento()
  const gestorId = quemAvalia(viewer.pessoaId)
  const avaliacao = avaliacaoDe(CICLO_ATUAL, viewer.pessoaId)

  if (!montado) return <div className="mx-auto max-w-3xl px-10 py-12" />
  if (!eu) return null

  // O fechado ganha da janela: assinado, o que a tela mostra é o resultado.
  if (avaliacao?.assinadaEm)
    return (
      <div key={geracao} className="mx-auto max-w-3xl px-10 py-12">
        <CicloFechado avaliacao={avaliacao} eu={eu} />
      </div>
    )

  if (!ciclo || !gestorId)
    return (
      <div className="mx-auto max-w-3xl px-10 py-12">
        <p className="etiqueta">Seu ciclo</p>
        <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">
          Nenhum ciclo para fechar
        </h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          {ciclo
            ? 'Ninguém assina o fechamento do seu registro neste semestre.'
            : 'A janela de fechamento não está aberta. O registro continua correndo.'}
        </p>
      </div>
    )

  return (
    <div key={geracao} className="mx-auto max-w-3xl px-10 py-12">
      <JanelaDeContexto ciclo={ciclo} eu={eu} gestorId={gestorId} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   C4 — a janela de contexto, antes do fechamento.
   ───────────────────────────────────────────────────────────────────────── */

function JanelaDeContexto({
  ciclo,
  eu,
  gestorId,
}: {
  ciclo: Ciclo
  eu: Pessoa
  gestorId: PessoaId
}) {
  const { estreladosDe, lastrosDe, eventos } = useRegistro()

  const estrelados = estreladosDe(eu.id)
  const lastros = lastrosDe(eu.id)
  const cobertura = coberturaDoNivelOcupado(eu.id, estrelados, lastros)
  const cobertos =
    eu.trilha && eu.nivel
      ? (comportamentosCobertos(eu.id, eu.trilha, eu.nivel, estrelados, lastros) ?? [])
      : []

  /* Sem evidência antes de parcial: a ordem é a do quanto o registro não
   * alcançou, e é ela que diz por onde começar a completar. Dentro de cada
   * grupo, a ordem da régua — reordenar por nota construiria um ranking de
   * comportamentos que o produto não tem. */
  const fracos = [
    ...cobertos.filter((c) => c.situacao === 'sem-evidencia'),
    ...cobertos.filter((c) => c.situacao === 'parcial'),
  ]

  const adicionados = eventos.filter(
    (e) => e.pessoaId === eu.id && e.fonte.tipo === 'proprio',
  )

  return (
    <>
      <header className="surgir">
        <p className="etiqueta">Seu ciclo</p>
        <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">
          Seu ciclo fecha em {diasAte(ciclo.fechamento.fecha)} dias
        </h2>
        <p className="prosa mt-3 max-w-xl text-[1.05rem] leading-relaxed">
          Tem alguma coisa que o registro não alcançou?
        </p>
        <p className="prosa mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
          {ciclo.nome} · {nomeDe(gestorId)} assina até {dataCurta(ciclo.fechamento.fecha)}. Você não
          se pontua e não escreve avaliação sobre si — o que entra aqui é trabalho que aconteceu e o
          registro não pegou. Nada é obrigatório.
        </p>
      </header>

      {cobertura && (
        <section className="surgir mt-10" style={{ animationDelay: '60ms' }}>
          <div className="flex items-baseline justify-between pb-2.5">
            <p className="etiqueta">A régua do ciclo</p>
            <p className="etiqueta">O nível que você ocupa</p>
          </div>
          <Separator />
          <p className="mt-2.5 max-w-2xl text-[0.82rem] leading-snug text-muted-foreground/80">
            É contra esta régua que o ciclo fecha. A do seu dossiê é a do nível seguinte, que
            responde outra pergunta — o que falta para subir.
          </p>
          <Cobertura titulo={cobertura.titulo} itens={cobertos} />
        </section>
      )}

      <section className="mt-12">
        <div className="flex items-baseline justify-between pb-2.5">
          <p className="etiqueta">Onde a evidência está fraca</p>
          <p className="etiqueta">{fracos.length === 0 ? 'nenhum' : fracos.length}</p>
        </div>
        <Separator />
        <p className="mt-2.5 max-w-2xl text-[0.82rem] leading-snug text-muted-foreground/80">
          Os comportamentos que o registro alcançou pouco ou não alcançou. Sem evidência não quer
          dizer que você não faz — quer dizer que não chegou aqui.
        </p>

        {fracos.length === 0 ? (
          <p className="prosa mt-4 max-w-xl rounded-sm border border-dashed border-border px-5 py-6 text-[0.92rem] leading-relaxed text-muted-foreground">
            Todos os comportamentos da sua régua estão sustentados pelo registro. Não há buraco
            declarado para completar.
          </p>
        ) : (
          <ul>
            {fracos.map((c, i) => (
              <li
                key={c.id}
                className="surgir border-b border-border/60 py-5"
                style={{ animationDelay: `${90 + i * 40}ms` }}
              >
                <ComportamentoFraco coberto={c} eu={eu} gestorId={gestorId} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* O que exatamente entrou no registro, dito depois do clique — o mesmo
          fecho de loop da caixa de pendências. Sem isto, "adicionar contexto" é
          um campo que some e uma promessa de que alguém leu. */}
      {adicionados.length > 0 && (
        <section className="mt-12">
          <div className="flex items-baseline justify-between pb-2.5">
            <p className="etiqueta">O que você adicionou agora</p>
            <p className="etiqueta">{adicionados.length}</p>
          </div>
          <Separator />
          <p className="mt-2.5 max-w-2xl text-[0.82rem] leading-snug text-muted-foreground/80">
            Já está no seu registro, com o seu nome na procedência. {nomeDe(gestorId)} lê antes de
            assinar.
          </p>
          <ul className="mt-4 space-y-2.5">
            {adicionados.map((ev) => (
              <li key={ev.id} className="flex items-start gap-2 leading-snug">
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-comp/60" />
                <span className="text-[0.88rem]">
                  {ev.texto} <Fonte evento={ev} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-[0.8rem] leading-snug text-muted-foreground">
        <Link href={`/org/${eu.id}`} className="underline-offset-4 hover:underline">
          Ver o registro inteiro
        </Link>{' '}
        — é lá que se contesta um item errado e se pede relato a um par.
      </p>
    </>
  )
}

/**
 * Um comportamento que o registro não sustenta, com o que a régua pede e o
 * campo para completar.
 *
 * O observável vem junto, e é ele que faz o campo ser respondível: "avisa cedo
 * quando vai atrasar" é uma frase de régua; "o aviso chega antes da data, com o
 * motivo e o novo prazo" é uma coisa que aconteceu ou não aconteceu, e sobre a
 * qual dá para lembrar de um caso.
 */
function ComportamentoFraco({
  coberto,
  eu,
  gestorId,
}: {
  coberto: ComportamentoCoberto
  eu: Pessoa
  gestorId: PessoaId
}) {
  const { adicionarContexto } = useRegistro()
  const [aberto, setAberto] = useState(false)
  const [texto, setTexto] = useState('')

  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="font-mono text-[0.68rem] uppercase tracking-wider text-comp">
            {coberto.rotulo}
          </p>
          <p className="prosa mt-1 text-[1rem] leading-snug">{coberto.texto}</p>
          <p className="mt-2 max-w-xl border-l-2 border-border pl-3 text-[0.85rem] leading-relaxed text-muted-foreground">
            <span className="etiqueta mr-1.5">o nível pede</span>
            {coberto.observavel}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <Badge variant="outline" className="etiqueta px-1.5 py-[3px]">
            {coberto.situacao === 'sem-evidencia' ? 'sem evidência' : 'parcial'}
          </Badge>
          <p className="mt-2 font-mono text-[0.72rem] tabular-nums text-muted-foreground">
            {coberto.nivel === undefined ? '—' : coberto.nivel} · pede {coberto.esperado}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <AbrirComportamento
          comportamento={coberto}
          className="rounded-sm px-1.5 py-0.5 font-mono text-[0.68rem] text-muted-foreground/80 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
        >
          <span className="inline-flex items-center gap-1">
            {coberto.episodioIds.length === 0
              ? 'ver o que a régua pede'
              : `${coberto.episodioIds.length} ${coberto.episodioIds.length === 1 ? 'evidência' : 'evidências'}`}
            <SetaDeAbertura className="opacity-100" />
          </span>
        </AbrirComportamento>

        {!aberto && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAberto(true)}
            className="h-7 gap-1.5 text-[0.75rem]"
          >
            <Plus className="size-3" />
            Adicionar contexto
          </Button>
        )}
      </div>

      {aberto && (
        <form
          className="mt-3 max-w-xl"
          onSubmit={(e) => {
            e.preventDefault()
            adicionarContexto(eu.id, texto)
            setTexto('')
            setAberto(false)
          }}
        >
          <Textarea
            rows={2}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={`O que aconteceu no semestre e o registro não pegou?`}
            className="resize-none bg-card text-[0.9rem]"
          />
          <div className="mt-2.5 flex items-center gap-2">
            <Button type="submit" size="sm" disabled={!texto.trim()} className="h-7 text-[0.78rem]">
              Adicionar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setAberto(false)}
              className="h-7 text-[0.78rem] text-muted-foreground"
            >
              Cancelar
            </Button>
          </div>
          {/* Dito antes do clique, porque é a diferença entre esta tela e uma
              autoavaliação: o que ela escreve é evidência que o gestor lê, e
              não um número que ela move sozinha. */}
          <p className="mt-2 text-[0.78rem] leading-snug text-muted-foreground">
            Entra como evidência no seu registro, com o seu nome, antes de {nomeDe(gestorId)}{' '}
            fechar. A nota não muda sozinha por isso — quem liga evidência a comportamento é quem lê
            o registro.
          </p>
        </form>
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   C5 — o ciclo fechado.
   ───────────────────────────────────────────────────────────────────────── */

const NOME_SAIDA: Record<Veredito['saida'], string> = {
  concordo: 'Concordou com a leitura',
  discordo: 'Discordou da leitura',
  'nao-sei': 'Ficou sem lastro',
}

function CicloFechado({ avaliacao, eu }: { avaliacao: Avaliacao; eu: Pessoa }) {
  const { lastrosDe } = useRegistro()
  const lastros = lastrosDe(eu.id)

  return (
    <>
      <header className="surgir">
        <p className="etiqueta">Ciclo fechado</p>
        <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">
          {NOME_DECISAO[avaliacao.decisao!]}
        </h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          {EXPLICACAO_DECISAO[avaliacao.decisao!]}
        </p>
        <p className="mt-3 font-mono text-[0.72rem] text-muted-foreground/80">
          assinado por {nomeDe(avaliacao.por)} · {dataCurta(avaliacao.assinadaEm!)}
        </p>
      </header>

      <section className="surgir mt-10" style={{ animationDelay: '60ms' }}>
        <div className="flex items-baseline justify-between pb-2.5">
          <p className="etiqueta">A régua julgada</p>
          <p className="etiqueta">
            {NOME_NIVEL[avaliacao.nivel] ?? avaliacao.nivel} ·{' '}
            {NOME_TRILHA[avaliacao.trilha] ?? avaliacao.trilha}
          </p>
        </div>
        <Separator />
        <p className="mt-2.5 max-w-2xl text-[0.82rem] leading-snug text-muted-foreground/80">
          O nível que você ocupa, comportamento a comportamento. Cada nota é a que foi assinada, e
          abre na evidência que a sustenta.
        </p>

        <ul>
          {avaliacao.vereditos.map((v, i) => (
            <li
              key={v.comportamentoId}
              className="surgir border-b border-border/60 py-5"
              style={{ animationDelay: `${90 + i * 40}ms` }}
            >
              <LinhaFechada veredito={v} avaliacao={avaliacao} eu={eu} lastros={lastros} />
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-[0.8rem] leading-snug text-muted-foreground">
        <Link href={`/org/${eu.id}`} className="underline-offset-4 hover:underline">
          Ver o registro inteiro
        </Link>{' '}
        — a evidência continua correndo depois do fechamento, e todo item dela se contesta lá.
      </p>
    </>
  )
}

/**
 * Uma linha do ciclo fechado.
 *
 * A NOTA É A CONGELADA, nunca recalculada. Se a gestora reconhecer um episódio
 * amanhã, a régua do dossiê sobe e esta linha continua dizendo o que dizia — é
 * o que foi assinado, na data em que foi assinado. Recalcular aqui faria o
 * dossiê discordar do documento que a pessoa recebeu.
 *
 * A EVIDÊNCIA, essa é a de hoje, e vem de `episodiosQueSustentam()`: quais
 * episódios sustentam o comportamento não muda com o tempo do jeito que a nota
 * muda, e é o caminho até a fonte que a linha precisa oferecer. Por isso o
 * diálogo desta tela abre sem as parcelas — a conta de agora pode não ser a que
 * produziu o número assinado, e publicar as duas juntas seria fabricar uma
 * coerência que não existe.
 */
function LinhaFechada({
  veredito,
  avaliacao,
  eu,
  lastros,
}: {
  veredito: Veredito
  avaliacao: Avaliacao
  eu: Pessoa
  lastros: Lastro[]
}) {
  const { eventoPorId, lacunasDe } = useRegistro()
  const c = comportamentoPorId(veredito.comportamentoId)
  if (!c) return null

  const evidencia = veredito.eventoId ? eventoPorId(veredito.eventoId) : undefined
  const lacuna = veredito.lacunaId
    ? lacunasDe(eu.id).find((l) => l.id === veredito.lacunaId)
    : undefined
  const episodioIds = episodiosQueSustentam(eu.id, veredito.comportamentoId, lastros)

  return (
    <>
      <AbrirComportamento
        className="-mx-1.5 block w-[calc(100%+0.75rem)] rounded-sm px-1.5 py-1 transition-colors hover:bg-foreground/[0.04]"
        comportamento={{
          rotulo: c.rotulo,
          texto: c.texto,
          observavel: c.observavel,
          esperado: c.esperado,
          nivel: veredito.nota,
          episodioIds,
        }}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="font-mono text-[0.68rem] uppercase tracking-wider text-comp">
              {c.rotulo}
            </p>
            <p className="prosa mt-1 text-[1rem] leading-snug">{c.texto}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-mono text-[0.75rem] tabular-nums">
            {/* Duas ausências diferentes, e a palavra não pode ser a mesma: sem
                evidência é o registro não ter alcançado; sem lastro é o
                comportamento ter fechado o ciclo com a pergunta aberta. */}
            {veredito.nota === undefined ? (
              <span className="text-foreground/40">
                {veredito.saida === 'nao-sei' ? 'sem lastro' : 'sem evidência'}
              </span>
            ) : (
              <span>
                <span className={veredito.nota >= c.esperado ? 'text-comp' : 'text-foreground'}>
                  {veredito.nota}
                </span>
                <span className="text-muted-foreground/70"> · pede {c.esperado}</span>
              </span>
            )}
            <SetaDeAbertura />
          </span>
        </div>
      </AbrirComportamento>

      <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground/80">
        {NOME_SAIDA[veredito.saida]}
        {veredito.saida === 'discordo' && (
          <span>
            {' '}
            · {veredito.notaIA ?? 'sem evidência'} → {veredito.nota ?? '—'}
          </span>
        )}
      </p>

      {/* O que o gestor adicionou por ter discordado da IA, com o nome dele. É a
          única coisa desta tela que a pessoa ainda não tinha visto no dossiê, e
          por isso ela vem inteira: a frase, a fonte e a autoria. */}
      {veredito.saida === 'discordo' && evidencia && (
        <div className="mt-2.5 max-w-2xl border-l-2 border-comp/40 pl-3">
          <p className="prosa text-[0.9rem] leading-snug">
            {evidencia.texto} <Fonte evento={evidencia} />
          </p>
          <p className="mt-1 font-mono text-[0.7rem] text-muted-foreground/70">
            {nomeDe(avaliacao.por)} adicionou isto ao discordar da leitura ·{' '}
            {dataCurta(veredito.em)}
          </p>
          <ContestarEvento eventoId={evidencia.id} gestorId={avaliacao.por} />
        </div>
      )}

      {veredito.saida === 'nao-sei' && (
        <div className="mt-2.5 max-w-2xl border-l-2 border-border pl-3">
          <p className="text-[0.88rem] leading-snug text-muted-foreground">
            {lacuna
              ? lacuna.pergunta
              : 'O comportamento fechou o ciclo sem lastro, e a pergunta ficou aberta.'}
          </p>
          <p className="mt-1 font-mono text-[0.7rem] text-muted-foreground/70">
            {lacuna
              ? `pergunta aberta para ${nomeDe(lacuna.perguntarA)}${lacuna.prazo ? ` · até ${dataCurta(lacuna.prazo)}` : ''}`
              : 'sem lastro no fechamento'}
          </p>
        </div>
      )}

      {/* EM TODA LINHA, e não só na que o gestor discordou. C5 promete
          contestar qualquer linha; enquanto o único alvo era o evento que a
          discordância criou, uma nota assinada que a pessoa achasse errada não
          tinha por onde ser contestada em lugar nenhum do produto. */}
      <ContestarLinha
        cicloId={avaliacao.cicloId}
        pessoaId={eu.id}
        comportamentoId={veredito.comportamentoId}
        assinadaPor={avaliacao.por}
      />
    </>
  )
}

/**
 * Contestar — dois alvos, e a diferença entre eles é o que se está negando.
 *
 * A EVIDÊNCIA que o gestor trouxe ao discordar é evidência como qualquer outra,
 * e se contesta pelo mesmo `contestar()` do dossiê: o item fica marcado lá
 * também, porque é o mesmo item.
 *
 * A LINHA é a nota assinada num comportamento, e ela não tem evento por trás —
 * é o que fazia C5 oferecer "contestar" só onde tinha havido discordância. Os
 * dois caminhos existem e não se sobrepõem: um diz "este fato está errado", o
 * outro diz "esta leitura está errada", e as duas coisas acontecem separadas na
 * vida real. Ambos terminam na mesma caixa, a de quem assinou.
 *
 * Nenhum dos dois recalcula nada. Contestação abre conversa; quem move nota é
 * evidência.
 */
function FormDeContestacao({
  contestacao,
  destino,
  rotulo,
  placeholder,
  aoContestar,
}: {
  contestacao?: { motivo: string; em: string }
  destino: PessoaId
  rotulo: string
  placeholder: string
  aoContestar: (motivo: string) => void
}) {
  const [aberto, setAberto] = useState(false)
  const [motivo, setMotivo] = useState('')

  if (contestacao)
    return (
      <p className="mt-2 text-[0.82rem] leading-snug">
        <span className="etiqueta mr-1.5 text-comp">contestado</span>
        {contestacao.motivo}
        <span className="mt-0.5 block font-mono text-[0.7rem] text-muted-foreground/70">
          <Check className="mr-1 inline size-3" />
          na caixa de {nomeDe(destino)} · {dataCurta(contestacao.em)}
        </span>
      </p>
    )

  if (!aberto)
    return (
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="mt-2 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[0.68rem] text-muted-foreground/70 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
      >
        <Flag className="size-3 shrink-0" />
        {rotulo}
      </button>
    )

  return (
    <form
      className="mt-2 flex max-w-xl items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        aoContestar(motivo)
        setMotivo('')
        setAberto(false)
      }}
    >
      <Input
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        placeholder={placeholder}
        className="h-8 text-[0.85rem]"
      />
      <Button type="submit" size="sm" disabled={!motivo.trim()} className="h-8 shrink-0 text-[0.78rem]">
        Contestar
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => setAberto(false)}
        className="h-8 shrink-0 text-[0.78rem] text-muted-foreground"
      >
        Cancelar
      </Button>
    </form>
  )
}

function ContestarEvento({ eventoId, gestorId }: { eventoId: string; gestorId: PessoaId }) {
  const { contestar, contestacaoDe } = useRegistro()
  return (
    <FormDeContestacao
      contestacao={contestacaoDe(eventoId)}
      destino={gestorId}
      rotulo="contestar esta evidência"
      placeholder="O que está errado neste item?"
      aoContestar={(motivo) => contestar(eventoId, motivo)}
    />
  )
}

function ContestarLinha({
  cicloId,
  pessoaId,
  comportamentoId,
  assinadaPor,
}: {
  cicloId: string
  pessoaId: PessoaId
  comportamentoId: string
  assinadaPor: PessoaId
}) {
  const { contestarLinha, contestacaoDeLinha } = useRegistro()
  return (
    <FormDeContestacao
      contestacao={contestacaoDeLinha(cicloId, pessoaId, comportamentoId)}
      destino={assinadaPor}
      rotulo="contestar esta linha"
      placeholder="O que está errado nesta leitura?"
      aoContestar={(motivo) => contestarLinha(cicloId, pessoaId, comportamentoId, motivo)}
    />
  )
}
