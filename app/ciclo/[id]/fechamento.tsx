'use client'

/**
 * `/ciclo/[id]` — a tela de fechamento. JORNADAS G5.
 *
 * É a tela em que a tese fica inteira. O produto já mostrava a memória se
 * construindo o ano todo e nunca mostrava as duas horas que substituíram as
 * seis semanas: dava para ver que o formulário morreu, não dava para ver o que
 * ficou no lugar dele. O que ficou é isto — o gestor lê, discorda onde
 * discorda, e decide. **Ele não escreve avaliação em lugar nenhum desta tela.**
 *
 * DUAS COLUNAS, e a da esquerda é literalmente `<Dossie>`. Não é reuso por
 * economia: o que ele lê no fechamento tem que ser o mesmo dossiê que ela abre
 * o ano inteiro, com os mesmos números e os mesmos links até a fonte. Uma
 * segunda versão "de fechamento" seria a primeira tela do produto que mostra
 * ao gestor algo que a pessoa não vê — e é exatamente isso que "sem arquivo
 * secreto" proíbe.
 *
 * QUAL RÉGUA. A da direita é a do nível que a pessoa OCUPA
 * (`coberturaDoNivelOcupado`), enquanto a do dossiê à esquerda é a do nível
 * ALVO. As duas perguntas são diferentes — "ela sustenta o que já é dela?" e
 * "o que falta para subir" — e a conta é a mesma: `pontuar()` roda igual contra
 * qualquer nível. Ter as duas na mesma tela, lado a lado, é o que torna a
 * distinção visível em vez de teórica.
 *
 * O QUE NÃO EXISTE AQUI: campo de texto livre para avaliar, nota da pessoa,
 * média dos comportamentos, comparação com outro report. A decisão do fim é um
 * enum de três valores e o Brain não sugere nenhum deles.
 */

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, HelpCircle, PenLine, Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Densidade } from '@/components/shell/densidade'
import { Fonte } from '@/components/brain/fonte'
import { SemAcesso } from '@/components/brain/sem-acesso'
import { Dossie } from '@/app/org/[id]/dossie'
import { EXPLICACAO_DECISAO, NOME_DECISAO, cicloEmFechamento } from '@/data/ciclos'
import { episodioPorId } from '@/data/episodios'
import { eventoPorId } from '@/data/eventos'
import { NOME_NIVEL, NOME_TRILHA } from '@/data/regua'
import { HOJE } from '@/data/tipos'
import type {
  Avaliacao,
  Ciclo,
  DecisaoDeCiclo,
  EpisodioId,
  Pessoa,
  PessoaId,
  Veredito,
} from '@/data/tipos'
import { podeAvaliar } from '@/lib/agente/permissoes'
import { NOME_DENSIDADE } from '@/lib/ciclo'
import { dataCurta, diasAte, episodiosDe, nomeDe, pessoa as buscarPessoa } from '@/lib/memoria'
import type { ComportamentoCoberto, Parcela } from '@/lib/metricas'
import { comportamentosCobertos, situacaoDe } from '@/lib/metricas'
import { useRegistro } from '@/lib/registro'
import { useViewer } from '@/lib/viewer'

export function Fechamento({ pessoaId }: { pessoaId: PessoaId }) {
  const { viewer, geracao } = useViewer()
  const { estreladosDe, lastrosDe, avaliacaoDe } = useRegistro()

  /* Nada de conteúdo antes da hidratação, como no dossiê: no servidor não
   * existe viewer, e renderizar a régua avaliada ali a entregaria no HTML sem
   * passar pela permissão. `useSyncExternalStore` em vez de efeito porque o
   * efeito seria um `setState` dentro de `useEffect` — três já existem no
   * produto e nenhum novo entra. */
  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const p = buscarPessoa(pessoaId)
  const ciclo = cicloEmFechamento()
  const auth = podeAvaliar(viewer, pessoaId)

  if (!montado) return <div className="mx-auto max-w-4xl px-10 py-12" />
  if (!p) return null
  if (!auth.ok) return <SemAcesso motivo={auth.motivo} />
  if (!ciclo)
    return (
      <div className="mx-auto max-w-3xl px-10 py-12">
        <p className="prosa text-[0.98rem] leading-relaxed text-muted-foreground">
          Nenhum ciclo em janela de fechamento. O registro continua correndo.
        </p>
      </div>
    )

  const avaliacao = avaliacaoDe(ciclo.id, pessoaId)
  const cobertos =
    comportamentosCobertos(
      pessoaId,
      p.trilha!,
      p.nivel!,
      estreladosDe(pessoaId),
      lastrosDe(pessoaId),
    ) ?? []

  return (
    <div key={geracao} className="flex min-h-dvh">
      {/* O dossiê como ele sempre foi. Rola com a página. */}
      <div className="min-w-0 flex-1 border-r border-border">
        <Dossie pessoaId={pessoaId} dentroDoFechamento />
      </div>

      {/* A régua avaliada. Fica parada enquanto o dossiê rola atrás: o gesto
          da tela é ler a evidência à esquerda sem perder a linha à direita. */}
      <aside className="sticky top-0 h-dvh w-[25rem] shrink-0 overflow-y-auto bg-card/40 xl:w-[29rem]">
        <PainelDaRegua
          ciclo={ciclo}
          pessoa={p}
          cobertos={cobertos}
          avaliacao={avaliacao}
        />
      </aside>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   O painel — a régua avaliada, linha a linha.
   ───────────────────────────────────────────────────────────────────────── */

function PainelDaRegua({
  ciclo,
  pessoa,
  cobertos,
  avaliacao,
}: {
  ciclo: Ciclo
  pessoa: Pessoa
  cobertos: ComportamentoCoberto[]
  avaliacao?: Avaliacao
}) {
  const fechada = Boolean(avaliacao?.assinadaEm)
  const vereditos = avaliacao?.vereditos ?? []
  const restantes = cobertos.filter((c) => !vereditos.some((v) => v.comportamentoId === c.id))

  return (
    <div className="px-7 py-8">
      {/* A saída desta tela é uma só, e mora no alto da coluna da esquerda,
          onde o olho já procura ("Sair do fechamento"). Aqui existia uma
          segunda seta para `/ciclo`: com a do dossiê ainda apontando para
          `/org`, a tela tinha dois voltares para dois lugares e nenhum deles
          era de onde se veio. */}
      <p className="etiqueta">Fechamento do ciclo</p>

      <h2 className="display mt-2 text-[1.35rem] leading-tight tracking-tight">{ciclo.nome}</h2>
      <p className="mt-1.5 text-[0.82rem] text-muted-foreground">
        {fechada
          ? `Fechado para ${primeiroNome(pessoa.nome)}. As notas abaixo são as que foram assinadas — o registro continua correndo e elas não se movem mais.`
          : `A janela fecha em ${diasAte(ciclo.fechamento.fecha)} dias.`}
      </p>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="etiqueta">A régua julgada</p>
          <p className="prosa mt-1.5 text-[1rem] leading-snug">
            {NOME_NIVEL[pessoa.nivel!]} · {NOME_TRILHA[pessoa.trilha!]}
          </p>
          {/* O nível que ela ocupa, dito na tela. Sem esta linha, a régua da
              direita e a do dossiê à esquerda são dois números diferentes sobre
              a mesma pessoa sem nada explicando por quê. */}
          <p className="mt-1 text-[0.78rem] leading-snug text-muted-foreground">
            O nível que {primeiroNome(pessoa.nome)} ocupa hoje.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="etiqueta pb-1.5">Densidade</p>
          <div className="flex items-center justify-end gap-2">
            <span className="text-[0.78rem] text-muted-foreground">
              {NOME_DENSIDADE[pessoa.densidadeEvidencia]}
            </span>
            <Densidade nivel={pessoa.densidadeEvidencia} />
          </div>
        </div>
      </div>

      {/* A regra de leitura, dita uma vez e não em cada linha. Densidade baixa
          é o que impede o número de ser lido como afirmação sobre o trabalho —
          com pouco registro, nota baixa pede a mesma coisa que "sem evidência"
          pede, que é uma pergunta. */}
      {pessoa.densidadeEvidencia !== 'alta' && (
        <p className="mt-3 border-l-2 border-border pl-3 text-[0.8rem] leading-snug text-muted-foreground">
          Densidade {NOME_DENSIDADE[pessoa.densidadeEvidencia]}: o registro alcançou pouco deste
          semestre. Nota baixa aqui pede pergunta, não conclusão.
        </p>
      )}

      <Separator className="mt-6" />

      <ul className="divide-y divide-border/60">
        {cobertos.map((c) => (
          <li key={c.id} className="py-5">
            <LinhaDaRegua
              ciclo={ciclo}
              pessoa={pessoa}
              coberto={c}
              veredito={vereditos.find((v) => v.comportamentoId === c.id)}
              fechada={fechada}
            />
          </li>
        ))}
      </ul>

      {fechada ? (
        <Assinatura avaliacao={avaliacao!} pessoa={pessoa} />
      ) : (
        <ADecisao ciclo={ciclo} pessoa={pessoa} restantes={restantes.length} />
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Uma linha da régua, e as três saídas.
   ───────────────────────────────────────────────────────────────────────── */

const NOME_SAIDA: Record<Veredito['saida'], string> = {
  concordo: 'Concordou',
  discordo: 'Discordou',
  'nao-sei': 'Ficou sem lastro',
}

function LinhaDaRegua({
  ciclo,
  pessoa,
  coberto,
  veredito,
  fechada,
}: {
  ciclo: Ciclo
  pessoa: Pessoa
  coberto: ComportamentoCoberto
  veredito?: Veredito
  fechada: boolean
}) {
  const { concordar, discordar, naoSei, eventoPorId: eventoDaSessao } = useRegistro()
  const [conta, setConta] = useState(false)
  const [modo, setModo] = useState<'nenhum' | 'discordo' | 'nao-sei'>('nenhum')

  /* DEPOIS DE ASSINADA, O NÚMERO É O ASSINADO. Enquanto esta linha lia
   * `coberto`, reconhecer um episódio no dossiê à esquerda movia a nota numa
   * tela que anuncia estar fechada — e a mesma pessoa saía 5 aqui e 4 em
   * `/meu-ciclo` e no painel do RH, que já mostravam a congelada. O que ficou
   * registrado é o que o gestor assinou, na data em que assinou. */
  const congelada = fechada && veredito !== undefined
  const nota = congelada ? veredito.nota : coberto.nivel
  const situacao = congelada ? situacaoDe(veredito.nota, coberto.esperado) : coberto.situacao
  const sustentado = situacao === 'sustentado'
  const evidencia = veredito?.eventoId ? eventoDaSessao(veredito.eventoId) : undefined

  return (
    <>
      <p className="font-mono text-[0.68rem] uppercase tracking-wider text-comp">
        {coberto.rotulo}
      </p>
      <p className="prosa mt-1 text-[0.95rem] leading-snug">{coberto.texto}</p>

      {/* Dois números e uma palavra, e os três são sobre o COMPORTAMENTO.
          Clicar abre a conta: é a promessa de que ninguém precisa acreditar no
          número — dá para descer até a mensagem no Slack em qualquer parcela.

          Assinada, a conta não abre mais: as parcelas são as de hoje, e o
          número ao lado é o de então. Publicar as duas juntas fabricaria uma
          coerência que não existe — é a mesma razão pela qual `/meu-ciclo` abre
          a linha fechada sem parcelas. */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          type="button"
          onClick={() => setConta((v) => !v)}
          disabled={nota === undefined || congelada}
          className="inline-flex items-center gap-2 rounded-sm font-mono text-[0.75rem] tabular-nums transition-colors enabled:cursor-pointer enabled:hover:text-comp"
        >
          {nota === undefined ? (
            <span className="text-foreground/45">
              {congelada && veredito.saida === 'nao-sei' ? 'sem lastro' : 'sem evidência'} · pede{' '}
              {coberto.esperado}
            </span>
          ) : (
            <>
              <span className={sustentado ? 'text-comp' : 'text-foreground'}>
                {nota} de {coberto.esperado}
              </span>
              <span className="uppercase tracking-wider text-muted-foreground/80">
                {sustentado ? 'sustentado' : 'parcial'}
              </span>
            </>
          )}
        </button>

        {coberto.episodioIds.length > 0 && (
          <VerEvidencias
            titulo={coberto.rotulo}
            episodioIds={coberto.episodioIds}
            rotulo={`${coberto.episodioIds.length} ${coberto.episodioIds.length === 1 ? 'evidência' : 'evidências'}`}
          />
        )}
      </div>

      {conta && !congelada && coberto.parcelas.length > 0 && (
        <AConta parcelas={coberto.parcelas} soma={coberto.soma} nivel={coberto.nivel!} />
      )}

      {/* O que já foi respondido. A discordância mostra as duas notas e a frase
          que moveu uma para a outra — é o que a pessoa avaliada lê em C5. */}
      {veredito && (
        <div className="mt-3 border-l-2 border-comp/40 pl-3">
          <p className="font-mono text-[0.7rem] text-comp">
            {NOME_SAIDA[veredito.saida]}
            {veredito.saida === 'discordo' && (
              <span className="text-muted-foreground">
                {' '}
                · {veredito.notaIA ?? 'sem evidência'} → {veredito.nota ?? '—'}
              </span>
            )}
          </p>
          {evidencia && (
            <p className="prosa mt-1.5 text-[0.85rem] leading-snug">
              {evidencia.texto} <Fonte evento={evidencia} />
            </p>
          )}
          {veredito.saida === 'nao-sei' && (
            <p className="mt-1.5 text-[0.8rem] leading-snug text-muted-foreground">
              Pergunta aberta até {dataCurta(ciclo.fechamento.fecha)}. O comportamento fecha o
              ciclo sem lastro.
            </p>
          )}
        </div>
      )}

      {!fechada && modo === 'nenhum' && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={veredito?.saida === 'concordo' ? 'secondary' : 'outline'}
            onClick={() => concordar(ciclo.id, pessoa.id, coberto.id)}
            className="h-7 gap-1.5 text-[0.75rem]"
          >
            <Check className="size-3" />
            Concordo
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setModo('discordo')}
            className="h-7 gap-1.5 text-[0.75rem] text-muted-foreground"
          >
            <PenLine className="size-3" />
            Discordo
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setModo('nao-sei')}
            className="h-7 gap-1.5 text-[0.75rem] text-muted-foreground"
          >
            <HelpCircle className="size-3" />
            Não sei
          </Button>
        </div>
      )}

      {!fechada && modo === 'discordo' && (
        <FormDiscordo
          pessoa={pessoa}
          rotulo={coberto.rotulo}
          jaContam={coberto.episodioIds}
          aoRegistrar={(episodioId, texto) => {
            discordar(ciclo.id, pessoa.id, coberto.id, { episodioId, texto })
            setModo('nenhum')
          }}
          aoCancelar={() => setModo('nenhum')}
        />
      )}

      {!fechada && modo === 'nao-sei' && (
        <FormNaoSei
          pessoa={pessoa}
          prazo={ciclo.fechamento.fecha}
          aoRegistrar={(aQuem) => {
            naoSei(ciclo.id, pessoa.id, coberto.id, aQuem)
            setModo('nenhum')
          }}
          aoCancelar={() => setModo('nenhum')}
        />
      )}
    </>
  )
}

/**
 * A conta aberta — as quatro parcelas, inclusive as que valem zero.
 *
 * A parcela de zero é a que responde a pergunta que o gestor de fato faz, que
 * nunca é "por que 4" e sim "por que 4 e não 5". Mostrar só o que somou
 * explicaria o número pelo que ele tem, quando a dúvida é sempre sobre o que
 * falta.
 */
function AConta({
  parcelas,
  soma,
  nivel,
}: {
  parcelas: Parcela[]
  soma: number
  nivel: number
}) {
  return (
    <div className="mt-3 rounded-sm border border-border bg-card px-3.5 py-3">
      <p className="etiqueta pb-2.5">Como chegou em {nivel}</p>
      <ul className="space-y-2">
        {parcelas.map((p) => (
          <li key={p.id} className="flex items-start gap-2.5">
            <span
              className={`mt-[1px] w-5 shrink-0 font-mono text-[0.72rem] tabular-nums ${
                p.valor > 0 ? 'text-comp' : 'text-foreground/30'
              }`}
            >
              {p.valor > 0 ? `+${p.valor}` : '0'}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={`block text-[0.8rem] leading-snug ${
                  p.valor > 0 ? 'text-foreground' : 'text-muted-foreground/70'
                }`}
              >
                {p.motivo}
              </span>
              {p.episodioIds.length > 0 && (
                <span className="mt-1 block">
                  <VerEvidencias
                    titulo={p.motivo}
                    episodioIds={p.episodioIds}
                    rotulo="abrir no episódio"
                  />
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
      {/* O teto dito quando ele morde. Sem isso as parcelas não fecham com o
          número acima delas, e uma conta publicada que não fecha é pior que
          conta nenhuma. */}
      {soma > nivel && (
        <p className="mt-3 border-t border-border pt-2.5 text-[0.76rem] leading-snug text-muted-foreground">
          A soma daria {soma}. A escala para em 5.
        </p>
      )}
    </div>
  )
}

/**
 * Discordar — e a pergunta que a IA faz na hora.
 *
 * O campo é DE TEXTO LONGO, e a mudança tem argumento. Em todo o resto do
 * produto o custo de responder é deliberadamente baixo — uma frase fecha uma
 * lacuna, um clique reconhece um episódio — porque ali o que se pede é memória,
 * e memória cara não é dada. Aqui é o contrário: o gestor está **contradizendo
 * a conta com a própria autoridade**, e o que ele escrever entra no registro da
 * pessoa com o nome dele, é lido por ela, e passa a valer como evidência em
 * qualquer leitura futura. Um campo de uma linha convida a frase que não
 * sustenta o que a nota vai carregar. Onde a escrita vira evidência
 * permanente, a caixa tem que caber um parágrafo.
 *
 * O episódio é escolhido de uma lista fechada: os episódios que já existem no
 * registro dela. Os que já contam vêm marcados, porque citar um deles não move
 * o número — a evidência não seria nova, e a tela diz isso antes do clique em
 * vez de deixar o gestor descobrir depois.
 */
function FormDiscordo({
  pessoa,
  rotulo,
  jaContam,
  aoRegistrar,
  aoCancelar,
}: {
  pessoa: Pessoa
  rotulo: string
  jaContam: EpisodioId[]
  aoRegistrar: (episodioId: EpisodioId, texto: string) => void
  aoCancelar: () => void
}) {
  const [texto, setTexto] = useState('')
  const [escolhido, setEscolhido] = useState<EpisodioId | undefined>(undefined)
  const episodios = episodiosDe(pessoa.id)

  if (episodios.length === 0)
    return (
      <p className="mt-3 border-l-2 border-border pl-3 text-[0.82rem] leading-snug text-muted-foreground">
        O registro de {primeiroNome(pessoa.nome)} não tem episódio nenhum para citar. Sem
        evidência, a nota não se move — o caminho aqui é a pergunta.{' '}
        <button type="button" onClick={aoCancelar} className="underline underline-offset-4">
          Voltar
        </button>
      </p>
    )

  return (
    <form
      className="mt-3 rounded-sm border border-comp/30 bg-comp-suave/20 px-3.5 py-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (escolhido && texto.trim()) aoRegistrar(escolhido, texto)
      }}
    >
      <p className="prosa text-[0.88rem] leading-snug">
        Qual episódio sustenta &ldquo;{rotulo}&rdquo;? O que {primeiroNome(pessoa.nome)} fez?
      </p>

      <Textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={`O que ${primeiroNome(pessoa.nome)} fez, quando, e por que isso sustenta o comportamento.`}
        rows={4}
        className="mt-2.5 min-h-[5.5rem] resize-y bg-card text-[0.85rem] leading-snug"
      />

      <p className="etiqueta mt-3 pb-1.5">o episódio</p>
      <div className="flex flex-wrap gap-1.5">
        {episodios.map((ep) => {
          const conta = jaContam.includes(ep.id)
          return (
            <Button
              key={ep.id}
              type="button"
              size="sm"
              variant={escolhido === ep.id ? 'secondary' : 'outline'}
              onClick={() => setEscolhido(ep.id)}
              className="h-auto max-w-full whitespace-normal px-2 py-1 text-left text-[0.74rem] leading-snug"
            >
              {ep.titulo}
              {conta && <span className="ml-1.5 text-muted-foreground">· já conta</span>}
            </Button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={!escolhido || !texto.trim()}
          className="h-7 text-[0.75rem]"
        >
          Registrar
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={aoCancelar}
          className="h-7 gap-1.5 text-[0.75rem] text-muted-foreground"
        >
          <X className="size-3" />
          Cancelar
        </Button>
      </div>

      <p className="mt-2.5 text-[0.76rem] leading-snug text-muted-foreground">
        O que você escrever entra com o seu nome no registro de {primeiroNome(pessoa.nome)}, que vê
        tudo o que está lá. A nota é recalculada com o episódio que você citou — quem move o número
        é a evidência.
      </p>
    </form>
  )
}

/**
 * Não sei — a saída que não cobra nada de ninguém e registra tudo.
 *
 * Pede um nome porque pergunta sem destinatário não é pergunta, é anotação. A
 * própria pessoa vem primeiro: metade das lacunas do fechamento são coisas que
 * só ela sabe, e perguntar a ela é o que a janela de contexto de C4 já faz.
 */
function FormNaoSei({
  pessoa,
  prazo,
  aoRegistrar,
  aoCancelar,
}: {
  pessoa: Pessoa
  prazo: string
  aoRegistrar: (aQuem: PessoaId) => void
  aoCancelar: () => void
}) {
  /* A própria pessoa, mais quem trabalhou com ela nos episódios do semestre.
   * Lista fechada é permissão: não dá para perguntar sobre alguém a quem não
   * estava lá. */
  const candidatos = [
    pessoa.id,
    ...new Set(episodiosDe(pessoa.id).flatMap((ep) => ep.colaboradores)),
  ]

  return (
    <div className="mt-3 rounded-sm border border-border bg-card px-3.5 py-3">
      <p className="prosa text-[0.88rem] leading-snug">
        Vira pergunta aberta, com dono e prazo. Quem consegue responder?
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {candidatos.map((id) => (
          <Button
            key={id}
            size="sm"
            variant="outline"
            onClick={() => aoRegistrar(id)}
            className="h-7 text-[0.75rem]"
          >
            {nomeDe(id)}
            {id === pessoa.id && <span className="ml-1.5 text-muted-foreground">· ela mesma</span>}
          </Button>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={aoCancelar}
          className="h-7 gap-1.5 text-[0.75rem] text-muted-foreground"
        >
          <X className="size-3" />
          Cancelar
        </Button>
      </div>
      <p className="mt-2.5 text-[0.76rem] leading-snug text-muted-foreground">
        Prazo: {dataCurta(prazo)}, quando a janela fecha. O comportamento fecha o ciclo sem lastro,
        e isso fica registrado.
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   A decisão — humana, e a IA não sugere.
   ───────────────────────────────────────────────────────────────────────── */

const DECISOES: DecisaoDeCiclo[] = ['manter', 'abrir-promocao', 'pronta-sem-vaga']

function ADecisao({
  ciclo,
  pessoa,
  restantes,
}: {
  ciclo: Ciclo
  pessoa: Pessoa
  restantes: number
}) {
  const { decidirCiclo } = useRegistro()

  return (
    <section className="mt-8 border-t border-border pt-6">
      <p className="etiqueta">A decisão</p>
      {/* Dito na tela, e não só na doutrina: é a única coisa desta página que o
          Brain não propõe. Ele leu o semestre inteiro e para aqui. */}
      <p className="prosa mt-2 text-[0.92rem] leading-snug text-muted-foreground">
        O Brain não sugere nenhuma das três. Nível, promoção e mérito continuam sendo decisão de
        gente.
      </p>

      <ul className="mt-4 space-y-2">
        {DECISOES.map((d) => (
          <li key={d}>
            <Button
              variant="outline"
              onClick={() => decidirCiclo(ciclo.id, pessoa.id, d)}
              className="h-auto w-full flex-col items-start gap-1 whitespace-normal px-3.5 py-2.5 text-left"
            >
              <span className="text-[0.88rem] leading-snug">{NOME_DECISAO[d]}</span>
              <span className="text-[0.76rem] leading-snug font-normal text-muted-foreground">
                {EXPLICACAO_DECISAO[d]}
              </span>
            </Button>
          </li>
        ))}
      </ul>

      {/* O padrão declarado antes do clique. "Concordo é um clique ou não fazer
          nada" só é honesto se a tela disser o que vai acontecer com o que
          ficou sem resposta. */}
      {restantes > 0 && (
        <p className="mt-3 text-[0.78rem] leading-snug text-muted-foreground">
          {restantes === 1
            ? '1 comportamento sem resposta será assinado como concordo.'
            : `${restantes} comportamentos sem resposta serão assinados como concordo.`}
        </p>
      )}
    </section>
  )
}

/** O ciclo fechado — o marco de G6, visto de dentro da tela que o produziu. */
function Assinatura({ avaliacao, pessoa }: { avaliacao: Avaliacao; pessoa: Pessoa }) {
  const conta = (saida: Veredito['saida']) =>
    avaliacao.vereditos.filter((v) => v.saida === saida).length

  return (
    <section className="mt-8 border-t border-border pt-6">
      <p className="etiqueta">Fechado</p>
      <p className="display mt-2 text-[1.15rem] leading-tight tracking-tight">
        {NOME_DECISAO[avaliacao.decisao!]}
      </p>
      <p className="mt-2 font-mono text-[0.72rem] text-muted-foreground">
        assinado por {nomeDe(avaliacao.por)} · {dataCurta(avaliacao.assinadaEm ?? HOJE)}
      </p>

      <p className="mt-3 text-[0.82rem] leading-snug text-muted-foreground">
        {avaliacao.vereditos.length} comportamentos · {conta('concordo')} concordo ·{' '}
        {conta('discordo')} discordo · {conta('nao-sei')} sem lastro
      </p>

      <Link
        href={`/org/${pessoa.id}`}
        className="mt-4 inline-flex items-center gap-1 text-[0.82rem] underline-offset-4 hover:underline"
      >
        Ver no registro de {primeiroNome(pessoa.nome)}
        <ArrowUpRight className="size-3" />
      </Link>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   A evidência — onde toda afirmação desta tela termina.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Os episódios que sustentam uma nota ou uma parcela, com os eventos e a fonte
 * de cada um.
 *
 * Mesma linguagem do drill-down de `components/brain/fonte.tsx` e do de
 * `/feedback`, porque é a mesma promessa em outro nível de zoom: lá é um
 * evento, aqui é o conjunto que produziu um número. Um número que não abre não
 * é contagem — é opinião com um número na frente.
 */
function VerEvidencias({
  titulo,
  episodioIds,
  rotulo,
}: {
  titulo: string
  episodioIds: EpisodioId[]
  rotulo: string
}) {
  const [aberto, setAberto] = useState(false)
  const { estrelaDe } = useRegistro()

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="inline-flex cursor-pointer items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[0.68rem] text-muted-foreground/80 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
      >
        {rotulo}
        <ArrowUpRight className="size-3 shrink-0" />
      </button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="gap-0 p-0 sm:max-w-lg">
          <div className="px-6 pt-6">
            <DialogTitle className="etiqueta font-mono text-[0.7rem] font-normal">
              Evidência
            </DialogTitle>
            <DialogDescription className="sr-only">
              Os episódios que sustentam esta parcela, com a fonte de cada evento.
            </DialogDescription>
            <p className="prosa mt-3 text-[1rem] leading-snug text-foreground">{titulo}</p>
          </div>

          <div className="mt-5 max-h-[26rem] overflow-y-auto border-t border-border">
            {episodioIds.map((id) => {
              const ep = episodioPorId(id)
              if (!ep) return null
              const estrela = estrelaDe(ep.id)
              return (
                <article key={id} className="border-b border-border/60 px-6 py-4 last:border-b-0">
                  <p className="prosa text-[0.95rem] leading-snug">{ep.titulo}</p>
                  <p className="mt-1 font-mono text-[0.68rem] text-muted-foreground/70">
                    {dataCurta(ep.inicio)} → {dataCurta(ep.fim)}
                    {ep.nivelObservado && ` · observado em nível ${ep.nivelObservado}`}
                  </p>

                  <ul className="mt-2.5 space-y-1.5">
                    {ep.eventoIds.map((evId) => {
                      const ev = eventoPorId(evId)
                      if (!ev) return null
                      return (
                        <li key={evId} className="flex items-start gap-2 leading-snug">
                          <span className="mt-[7px] size-1 shrink-0 rounded-full bg-foreground/25" />
                          <span className="text-[0.85rem] text-muted-foreground">
                            {ev.texto} <Fonte evento={ev} />
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  {estrela && (
                    <p className="mt-2.5 flex items-center gap-1.5 font-mono text-[0.68rem] text-muted-foreground/70">
                      <Star className="size-3 fill-comp text-comp" />
                      reconhecido por {nomeDe(estrela.por)} · {dataCurta(estrela.em)}
                    </p>
                  )}
                </article>
              )
            })}
          </div>

          <div className="flex items-center justify-end border-t border-border px-6 py-3.5">
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

/* ─────────────────────────────────────────────────────────────────────────
   Utilitários locais.
   ───────────────────────────────────────────────────────────────────────── */

const primeiroNome = (n: string) => n.split(' ')[0]
