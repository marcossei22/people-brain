'use client'

/**
 * `/org/[id]` — o dossiê. ARQUITETURA.md §8.2.
 *
 * UM COMPONENTE, DOIS OBSERVADORES. A Carla vendo o próprio registro e a
 * Marina vendo o registro da Carla renderizam esta mesma função, com campos
 * governados por `permissoes.ts`. Isso não é economia de código: é o princípio
 * "sem arquivo secreto" virando fato que dá pra apontar na câmera — troca a
 * persona no rodapé da sidebar, sem sair da página.
 *
 * A estrela fica no EPISÓDIO e só para o gestor. Onde estaria a estrela
 * negativa, existe "Conversar sobre isso" — reconhecimento pode ser clique,
 * preocupação tem que ser conversa (decisão #7).
 *
 * ESTA TELA ESCREVE, e por isso ela não lê mais de `data/`. Evento, feedback,
 * lacuna e estrela vêm todos de `useRegistro()`, que mescla a semente com o que
 * a sessão acabou de criar. Ler da lista estática seria mostrar o botão e
 * esconder a consequência: a pessoa adiciona um contexto, o evento nasce, e o
 * gráfico três centímetros acima continua igual — o dossiê se contradizendo em
 * uma tela só. Os números que os gráficos e a régua recebem são os mesclados,
 * pelo mesmo motivo.
 *
 * O QUE CADA PAPEL PODE FAZER está em duas variáveis e não se repete depois:
 * `souGestor` reconhece e conversa; `souEu` adiciona contexto, contesta item e
 * pede feedback de par. Nenhuma ação existe para os dois.
 *
 * As duas saem de `permissoes.ts`, que é a mesma função que a ação chama antes
 * de escrever. Aqui já esteve escrito `viewer.papel === 'gestor' && p.gestorId
 * === viewer.pessoaId`, e a cópia divergia do modelo de dados: a Helena é a
 * gestora declarada de três pessoas e o papel dela é `chro`, então elas não
 * podiam receber reconhecimento nem conversa de ninguém no produto.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarCheck,
  Check,
  Clock3,
  Flag,
  Inbox,
  MessageCircle,
  MessageSquarePlus,
  Plus,
  Send,
  Star,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Densidade } from '@/components/shell/densidade'
import { Fonte } from '@/components/brain/fonte'
import { Cobertura, Distribuicao, Serie } from '@/components/brain/graficos'
import { SemAcesso } from '@/components/brain/sem-acesso'
import { NOME_NIVEL, NOME_TRILHA, regua } from '@/data/regua'
import { NOME_DECISAO, cicloEmFechamento } from '@/data/ciclos'
import { episodioPorId } from '@/data/episodios'
import { eventoPorId } from '@/data/eventos'
import type { Episodio, Evento, Lacuna, Pessoa, PessoaId } from '@/data/tipos'
import { ehGestorDe, podeAvaliar, podeConsultar, quemAvalia } from '@/lib/agente/permissoes'
import { useChat } from '@/lib/chat'
import {
  NIVEL_SEGUINTE,
  coberturaDaRegua,
  comportamentosCobertos,
  evidenciaPorMes,
  origemDaEvidencia,
} from '@/lib/metricas'
import {
  dataCurta,
  diasAte,
  diasDesde,
  episodiosDe,
  nomeDe,
  pessoa as buscarPessoa,
  reportsDe,
  temasDe,
} from '@/lib/memoria'
import { AVISO_ESTRELA, useRegistro } from '@/lib/registro'
import { useViewer } from '@/lib/viewer'

export function Dossie({
  pessoaId,
  dentroDoFechamento = false,
}: {
  pessoaId: string
  /* O dossiê é a coluna esquerda de `/ciclo/[id]`, e lá ele não é a página —
   * é metade dela. Sem esta flag o componente carregava a navegação da sua
   * própria rota para dentro de outra: a seta de voltar apontava para `/org`
   * (saindo do fechamento por um caminho que ninguém pediu) e o botão "Fechar
   * o ciclo" continuava aparecendo, ligando para a tela onde já se está. */
  dentroDoFechamento?: boolean
}) {
  const { viewer, geracao } = useViewer()
  const { abrirCom } = useChat()
  const { eventosDe, lacunasDe, estreladosDe, lastrosDe } = useRegistro()

  /* As duas ações do colaborador que precisam de estado nesta altura da árvore.
   * "Adicionar contexto" é um formulário só, então mora aqui; a contestação é
   * um MODO, porque o alvo dela é um item lá embaixo — sem o modo, cada um dos
   * catorze eventos da Carla carregaria um botão de contestar o tempo todo, e a
   * leitura do registro viraria uma coluna de affordance. */
  const [contextoAberto, setContextoAberto] = useState(false)
  const [modoContestacao, setModoContestacao] = useState(false)

  // Nada de conteúdo antes da hidratação: no servidor não existe viewer, e
  // renderizar o dossiê ali entregaria o registro sem passar pela permissão.
  const [montado, setMontado] = useState(false)
  useEffect(() => setMontado(true), [])

  const p = buscarPessoa(pessoaId)
  const auth = podeConsultar(viewer, pessoaId)

  if (!montado) return <div className="mx-auto max-w-4xl px-10 py-12" />
  if (!p) return null
  if (!auth.ok) return <SemAcesso motivo={auth.motivo} />

  const souEu = viewer.pessoaId === pessoaId
  const souGestor = ehGestorDe(viewer, pessoaId)
  const episodios = episodiosDe(pessoaId)
  const temas = temasDe(pessoaId)
  const eventos = eventosDe(pessoaId)
  const soltos = eventos.filter((e) => !e.episodioId)
  const lacunas = lacunasDe(pessoaId).filter((l) => l.status !== 'descartada')
  // Do registro mesclado, e não de `ultimoRegistro()`: contexto adicionado
  // agora é datado no fim da janela, e "há 10 dias" ao lado de uma evidência
  // que a pessoa acabou de escrever seria a tela desmentindo o próprio clique.
  const dias = diasDesde(eventos[0]?.data)
  const alvo = p.nivel ? NIVEL_SEGUINTE[p.nivel] : undefined

  // Calculado de `data/` + sessão, nunca por modelo: esta tela precisa sair
  // igual em toda tomada (ARQUITETURA §1, princípio 2). Os componentes são os
  // mesmos que o agente usa no chat — muda quem preenche, não o que se vê.
  const porMes = evidenciaPorMes(pessoaId, eventos)
  const origem = origemDaEvidencia(pessoaId, eventos)
  // As estrelas da sessão entram separadas da evidência porque não são
  // evidência: são um humano marcando um episódio que já existia. É este
  // argumento que faz reconhecer mover a régua no mesmo clique. Os lastros
  // entram pelo mesmo motivo, do outro lado: são episódios que um humano ligou
  // a um comportamento no fechamento, e a régua daqui tem que enxergá-los.
  const estrelados = estreladosDe(pessoaId)
  const lastros = lastrosDe(pessoaId)
  const cobertura = coberturaDaRegua(pessoaId, estrelados, lastros)
  /* A MESMA leitura da linha acima, com as parcelas e os episódios que
   * `Cobertura` joga fora quando só recebe `cobertura.itens`. É o que faz cada
   * comportamento abrir na evidência sem recontar nada: o nível vem de
   * `cobertura.nivel`, então não há aqui uma segunda escolha de régua. */
  const cobertos =
    cobertura && p.trilha
      ? comportamentosCobertos(pessoaId, p.trilha, cobertura.nivel, estrelados, lastros)
      : undefined

  return (
    <div key={geracao} className="mx-auto max-w-4xl px-10 py-12">
      <Link
        href={dentroDoFechamento ? '/ciclo' : '/org'}
        className="etiqueta surgir inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3" />
        {dentroDoFechamento ? 'Sair do fechamento' : 'Organização'}
      </Link>

      <header className="surgir mt-4 flex items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="display text-[2.1rem] leading-none tracking-tight">{p.nome}</h2>
            {souEu && (
              <Badge
                variant="outline"
                className="etiqueta border-comp/35 bg-comp-suave/40 px-1.5 py-[3px] text-comp"
              >
                você
              </Badge>
            )}
          </div>
          <p className="mt-2.5 text-[0.9rem] text-muted-foreground">
            {p.cargo}
            {p.nivel && <span className="text-foreground/45"> · {p.nivel}</span>}
            <span className="text-foreground/45"> · {p.time}</span>
            {p.gestorId && (
              <span className="text-foreground/45"> · reporta a {nomeDe(p.gestorId)}</span>
            )}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="etiqueta pb-1.5">Densidade de evidência</p>
          <div className="flex items-center justify-end gap-2">
            <span className="text-[0.82rem] text-muted-foreground">{p.densidadeEvidencia}</span>
            <Densidade nivel={p.densidadeEvidencia} />
          </div>
          <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground/70">
            {eventos.length} eventos · {episodios.length} episódios
          </p>
          {/* Singular explícito: o registro só chegava a "há 8 dias" na semente,
              e "há 1 dias" só aparece agora, quando alguém acabou de escrever. */}
          {dias !== undefined && (
            <p className="font-mono text-[0.7rem] text-muted-foreground/70">
              último registro há {dias} {dias === 1 ? 'dia' : 'dias'}
            </p>
          )}
        </div>
      </header>

      <div className="surgir mt-6" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-[0.8rem]"
            onClick={() => abrirCom(perguntaPadrao(p.nome, alvo, souEu))}
          >
            <MessageSquarePlus className="size-3.5" />
            {souEu ? 'Perguntar sobre meu registro' : `Perguntar sobre ${primeiroNome(p.nome)}`}
          </Button>

          {!dentroDoFechamento && <EntradaDoCiclo pessoa={p} souEu={souEu} />}

          {souEu && (
            <>
              <Button
                size="sm"
                variant={contextoAberto ? 'secondary' : 'outline'}
                className="h-8 gap-1.5 text-[0.8rem]"
                onClick={() => setContextoAberto((v) => !v)}
              >
                <Plus className="size-3.5" />
                Adicionar contexto
              </Button>
              <Button
                size="sm"
                variant={modoContestacao ? 'secondary' : 'ghost'}
                className={`h-8 gap-1.5 text-[0.8rem] ${modoContestacao ? '' : 'text-muted-foreground'}`}
                onClick={() => setModoContestacao((v) => !v)}
              >
                <Flag className="size-3.5" />
                Contestar item
              </Button>
            </>
          )}
        </div>

        {souEu && contextoAberto && (
          <FormContexto pessoaId={pessoaId} aoFechar={() => setContextoAberto(false)} />
        )}

        {/* O modo diz para onde a contestação vai antes de a pessoa escrever.
            Contestação que não chega em ninguém é formulário de reclamação. */}
        {souEu && modoContestacao && (
          <p className="mt-3 max-w-xl text-[0.82rem] leading-snug text-muted-foreground">
            Marque o item que está errado. Ele continua no registro, com a sua contestação junto
            {p.gestorId ? `, e o pedido de conversa entra na caixa de ${nomeDe(p.gestorId)}` : ''}.
          </p>
        )}
      </div>

      {/* A leitura de conjunto antes do detalhe — a mesma ordem que o agente
          usa no chat. O dossiê era texto do primeiro parágrafo ao último, e
          "quanto do semestre está coberto" só existia depois de ler tudo. */}
      {eventos.length > 0 && (
        <section className="surgir mt-12" style={{ animationDelay: '90ms' }}>
          <div className="flex items-baseline justify-between pb-2.5">
            <p className="etiqueta">Leitura do registro</p>
            <p className="etiqueta">fev — jul 2026</p>
          </div>
          <Separator />
          {/* Duas frases porque a seção faz duas coisas, e por muito tempo ela
              dizia só a primeira: "nada aqui mede desempenho" era a última linha
              da doutrina antiga ainda escrita em produto, e a `Cobertura` três
              elementos abaixo mede comportamento contra a régua desde então. A
              tela desmentia o produto na frase que se lê antes de olhar o
              gráfico. A densidade é o denominador da segunda leitura — é a regra
              de PLANO §7, trade-off 1, dita onde ela se aplica. */}
          <p className="mt-2.5 max-w-2xl text-[0.82rem] leading-snug text-muted-foreground/80">
            Duas leituras: quanto do semestre o registro alcançou, e o que essa evidência sustenta
            contra a régua. A densidade acima é o denominador da segunda — com pouco registro, nota
            baixa pede pergunta, não conclusão.
          </p>

          {/* `items-start` porque as duas caixas não têm a mesma altura por
              natureza: esticar a de composição para empatar com a de meses
              deixa um vazio embaixo que lê como card quebrado. */}
          <div className="mt-3 grid items-start gap-x-5 sm:grid-cols-2">
            <Serie
              titulo="Evidência por mês"
              pontos={porMes}
              nota={notaDosVazios(porMes)}
            />
            <Distribuicao titulo="De onde veio a evidência" partes={origem} />
          </div>

          {cobertura && <Cobertura titulo={cobertura.titulo} itens={cobertos ?? cobertura.itens} />}
        </section>
      )}

      {temas.length > 0 && (
        <section className="mt-12">
          <div className="flex items-baseline justify-between pb-2.5">
            <p className="etiqueta">Padrões</p>
            <p className="etiqueta">Comportamentos da régua</p>
          </div>
          <Separator />
          <ul>
            {temas.map((t, i) => (
              <li
                key={t.id}
                className="surgir border-b border-border/60 py-4"
                style={{ animationDelay: `${120 + i * 40}ms` }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="prosa text-[1.02rem] leading-snug">{t.padrao}</p>
                    <p className="mt-1.5 font-mono text-[0.7rem] text-muted-foreground/70">
                      {t.episodioIds.length} episódios · confiança {t.confianca}
                    </p>
                  </div>
                  <ul className="hidden w-[17rem] shrink-0 space-y-1 sm:block">
                    {t.comportamentosRegua.map((id) => (
                      <li key={id} className="text-[0.78rem] leading-snug text-muted-foreground">
                        {textoDoComportamento(id)}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <div className="flex items-baseline justify-between pb-2.5">
          <p className="etiqueta">Episódios</p>
          <p className="etiqueta">{episodios.length} no semestre</p>
        </div>
        <Separator />
        <p className="mt-2.5 max-w-2xl text-[0.82rem] leading-snug text-muted-foreground/80">
          Eventos do mesmo trabalho, agrupados em um arco com começo e fim. É a unidade que se
          reconhece, se contesta e vira conversa.
        </p>

        {episodios.length === 0 ? (
          <p className="prosa mt-4 max-w-xl text-[0.92rem] leading-relaxed text-muted-foreground">
            Nenhum episódio neste semestre. Os {eventos.length} eventos abaixo são registros soltos —
            não há material suficiente para formar um arco.
          </p>
        ) : (
          <ul>
            {episodios.map((ep, i) => (
              <li
                key={ep.id}
                className="surgir border-b border-border/60 py-5"
                style={{ animationDelay: `${160 + i * 50}ms` }}
              >
                <CartaoEpisodio
                  ep={ep}
                  dono={p}
                  souEu={souEu}
                  souGestor={souGestor}
                  modoContestacao={modoContestacao}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <FeedbacksDoPeriodo pessoaId={pessoaId} />

      <CiclosFechados pessoaId={pessoaId} />

      {soltos.length > 0 && (
        <section className="mt-12">
          <div className="flex items-baseline justify-between pb-2.5">
            <p className="etiqueta">Eventos sem episódio</p>
            <p className="etiqueta">{soltos.length}</p>
          </div>
          <Separator />
          <p className="mt-2.5 max-w-2xl text-[0.82rem] leading-snug text-muted-foreground/80">
            Um evento é um fato observado numa fonte, em uma frase. Estes ainda não se ligaram a
            nenhum trabalho maior — ficam no registro, mas não sustentam conclusão sozinhos.
          </p>
          <ul className="mt-4 space-y-2">
            {soltos.map((ev) => (
              <LinhaEvento
                key={ev.id}
                evento={ev}
                contestavel={souEu && modoContestacao}
                solto
              />
            ))}
          </ul>
        </section>
      )}

      {lacunas.length > 0 && (
        <section className="mt-12">
          <div className="flex items-baseline justify-between pb-2.5">
            <p className="etiqueta">O que ainda não sabemos</p>
            <p className="etiqueta">{lacunas.length}</p>
          </div>
          <Separator />
          <p className="mt-2.5 max-w-2xl text-[0.82rem] leading-snug text-muted-foreground/80">
            O Brain declara o que não alcançou em vez de inferir. Cada pergunta vai para quem pode
            respondê-la e custa uma das perguntas da semana.
          </p>
          <ul>
            {lacunas.map((l) => (
              <li key={l.id} className="border-b border-border/60 py-5">
                <div className="flex items-start justify-between gap-6">
                  <p className="prosa max-w-2xl text-[0.98rem] leading-snug">{l.pergunta}</p>
                  <Badge variant="outline" className="etiqueta shrink-0 px-1.5 py-[3px]">
                    valor {VALOR[l.valor]}
                  </Badge>
                </div>
                <p className="mt-2 max-w-2xl border-l-2 border-border pl-3 text-[0.85rem] leading-relaxed text-muted-foreground">
                  <span className="etiqueta mr-1.5">por quê</span>
                  {l.motivo}
                </p>

                <EstadoDaLacuna lacuna={l} minha={viewer.pessoaId === l.perguntarA} />

                {l.resposta && (
                  <p className="prosa mt-2.5 border-l-2 border-comp/40 pl-3 text-[0.88rem] leading-snug">
                    {l.resposta.texto}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

const VALOR: Record<Lacuna['valor'], string> = { alta: 'alto', media: 'médio', baixa: 'baixo' }

/* ─────────────────────────────────────────────────────────────────────────
   Episódio — onde as quatro ações do produto acontecem.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * O episódio, com os gestos que ele aceita de cada lado do balcão.
 *
 * Componente próprio por causa do estado: o campo da nota, o seletor de par e
 * o campo de contestação de cada evento são estados locais, e mantê-los no
 * `Dossie` significaria um `Record<EpisodioId, …>` por formulário aberto. Aqui
 * cada episódio guarda o próprio, e o `key={geracao}` lá em cima zera todos de
 * uma vez quando alguém aperta "Recomeçar".
 *
 * Ele lê do registro em vez de receber por prop porque o que importa é o
 * MESCLADO: a estrela que a Marina acabou de dar tem que aparecer no mesmo
 * lugar da que veio da semente, sem um segundo caminho de render que diga
 * "reconhecido agora" e depois esqueça de dizer por quem.
 */
function CartaoEpisodio({
  ep,
  dono,
  souEu,
  souGestor,
  modoContestacao,
}: {
  ep: Episodio
  dono: Pessoa
  souEu: boolean
  souGestor: boolean
  modoContestacao: boolean
}) {
  const { abrirCom } = useChat()
  const { reconhecer, registrarConversa, pedirFeedbackDePar, estrelaDe, feedbacksDe, pendenciasExtras } =
    useRegistro()

  const [notaAberta, setNotaAberta] = useState(false)
  const [nota, setNota] = useState('')
  const [paresAbertos, setParesAbertos] = useState(false)

  const estrela = estrelaDe(ep.id)
  const conversa = feedbacksDe(dono.id).find(
    (f) => f.tipo === 'conversa' && f.episodioId === ep.id,
  )
  /* Os pedidos saem de `pendenciasExtras` e não de um estado local: o que
   * confirma que o pedido existe é ele estar na caixa do par, não a tela ter
   * lembrado do clique. */
  const pedidos = pendenciasExtras.filter(
    (pd) => pd.tipo === 'pergunta' && pd.sobre === dono.id && pd.episodioId === ep.id,
  )

  /* Quem estava junto neste trabalho, mais quem senta ao lado. Par é par:
   * o gestor não entra na lista, porque "pedir feedback de um par" ao chefe é
   * outra coisa — e essa outra coisa é a conversa que ele já pode registrar. */
  const pares = [
    ...new Set([
      ...ep.colaboradores,
      ...(dono.gestorId ? reportsDe(dono.gestorId).map((x) => x.id) : []),
    ]),
  ].filter((id) => id !== dono.id)

  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="display text-[1.1rem] leading-tight tracking-tight">{ep.titulo}</h3>
            {ep.nivelObservado && (
              <Badge variant="outline" className="etiqueta px-1.5 py-[3px]">
                nível {ep.nivelObservado}
              </Badge>
            )}
          </div>
          <p className="prosa mt-1.5 max-w-xl text-[0.92rem] leading-relaxed text-muted-foreground">
            {ep.resumo}
          </p>
          <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground/60">
            {ep.inicio} → {ep.fim}
          </p>

          <ul className="mt-3 space-y-1.5">
            {ep.eventoIds.map((id) => {
              const ev = eventoPorId(id)
              if (!ev) return null
              return <LinhaEvento key={id} evento={ev} contestavel={souEu && modoContestacao} />
            })}
          </ul>

          {ep.colaboradores.length > 0 && (
            <p className="mt-2.5 flex items-center gap-1.5 font-mono text-[0.7rem] text-muted-foreground/60">
              <Users className="size-3" />
              com {ep.colaboradores.map(nomeDe).join(', ')}
            </p>
          )}

          {pedidos.length > 0 && (
            <p className="mt-2 flex items-center gap-1.5 font-mono text-[0.7rem] text-comp">
              <Send className="size-3" />
              feedback pedido a {pedidos.map((pd) => nomeDe(pd.de)).join(', ')}
            </p>
          )}

          {/* Reconhecimento mostra o texto inteiro, com autor e data. Sem nota
              a linha continua existindo: marcaram o momento sem escrever nada,
              e isso é informação verdadeira, não campo faltando. */}
          {estrela && (
            <div className="mt-3 border-l-2 border-comp/40 pl-3">
              {estrela.nota && (
                <p className="prosa text-[0.88rem] leading-snug">{estrela.nota}</p>
              )}
              <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[0.7rem] text-muted-foreground/70">
                <Star className="size-3 fill-comp text-comp" />
                reconhecido por {nomeDe(estrela.por)} · {dataCurta(estrela.em)}
              </p>
            </div>
          )}

          {/* A conversa deixa data e episódio, nunca o teor (decisão #7). Não
              existe campo de texto aqui, e a ausência dele é o desenho. */}
          {conversa && (
            <p className="mt-3 flex items-center gap-1.5 font-mono text-[0.7rem] text-muted-foreground">
              <MessageCircle className="size-3" />
              conversa registrada · {nomeDe(conversa.porPessoaId)} · {dataCurta(conversa.data)}
            </p>
          )}
        </div>

        {/* A estrela vive no episódio e só o gestor a dá. Onde estaria a
            estrela negativa, existe conversa — decisão #7. */}
        {souGestor && (
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {estrela ? (
              <span className="inline-flex h-7 items-center gap-1.5 px-2 font-mono text-[0.72rem] text-comp">
                <Star className="size-3 fill-comp" />
                reconhecido
              </span>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setNotaAberta(true)}
                className="h-7 gap-1.5 text-[0.75rem]"
              >
                <Star className="size-3" />
                Reconhecer
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                abrirCom(
                  `Rascunha uma conversa com ${primeiroNome(dono.nome)} sobre o episódio "${ep.titulo}".`,
                )
              }
              className="h-7 gap-1.5 text-[0.75rem] text-muted-foreground"
            >
              <MessageCircle className="size-3" />
              Conversar sobre isso
            </Button>

            {!conversa && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => registrarConversa(dono.id, ep.id)}
                className="h-7 gap-1.5 text-[0.75rem] text-muted-foreground"
              >
                <Check className="size-3" />
                Marcar como conversado
              </Button>
            )}
          </div>
        )}

        {souEu && pares.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setParesAbertos((v) => !v)}
            className="h-7 shrink-0 gap-1.5 text-[0.75rem] text-muted-foreground"
          >
            <Users className="size-3" />
            Pedir feedback de um par
          </Button>
        )}
      </div>

      {/* Um campo de UMA linha, e opcional — JORNADAS G3. A estrela se paga por
          ser barata: se reconhecer exigisse texto, viraria formulário curto e
          ninguém daria cinquenta delas.
          O aviso do efeito é o resto de G3, e não é cortesia: reconhecer soma +1
          na nota dos comportamentos que este episódio sustenta, e a régua acima
          se mexe no mesmo clique. Gesto que altera avaliação sem avisar quem
          clica é armadilha. */}
      {souGestor && notaAberta && !estrela && (
        <form
          className="mt-3 max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault()
            reconhecer(ep.id, nota)
            setNota('')
            setNotaAberta(false)
          }}
        >
          <div className="flex items-center gap-2">
            <Input
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Uma linha sobre o que foi bom — opcional"
              className="h-8 text-[0.85rem]"
            />
            <Button type="submit" size="sm" className="h-8 shrink-0 gap-1.5 text-[0.78rem]">
              <Star className="size-3" />
              Reconhecer
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setNotaAberta(false)}
              className="h-8 shrink-0 text-[0.78rem] text-muted-foreground"
            >
              Cancelar
            </Button>
          </div>
          <p className="mt-2 text-[0.78rem] leading-snug text-muted-foreground">{AVISO_ESTRELA}</p>
        </form>
      )}

      {/* Escolher o par é um clique num nome, não um select: são dois ou três
          nomes, e todos vieram do próprio episódio ou do time. Lista fechada
          também é permissão — não dá para pedir relato a quem não estava. */}
      {souEu && paresAbertos && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="etiqueta">quem pode contar</span>
          {pares.map((id) => (
            <Button
              key={id}
              size="sm"
              variant="outline"
              onClick={() => {
                pedirFeedbackDePar(dono.id, ep.id, id)
                setParesAbertos(false)
              }}
              className="h-7 text-[0.78rem]"
            >
              {nomeDe(id)}
            </Button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setParesAbertos(false)}
            className="h-7 text-[0.78rem] text-muted-foreground"
          >
            Cancelar
          </Button>
        </div>
      )}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Evento — e o lugar onde a pessoa diz que ele está errado.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Um evento na lista, com a contestação junto quando existe.
 *
 * O item contestado NÃO some e não muda de texto. Apagar evidência que alguém
 * contestou é reescrever a história, e o que este produto promete é mostrar o
 * que capturou — inclusive quando capturou errado. O que muda é que a
 * discordância passa a viajar colada nele, com nome e data, para todo mundo
 * que abrir o dossiê.
 */
function LinhaEvento({
  evento,
  contestavel,
  solto = false,
}: {
  evento: Evento
  contestavel: boolean
  solto?: boolean
}) {
  const { contestar, contestacaoDe } = useRegistro()
  const [aberto, setAberto] = useState(false)
  const [motivo, setMotivo] = useState('')

  const contestacao = contestacaoDe(evento.id)
  /* Só o que veio da semente se contesta. Contexto que a própria pessoa
   * acabou de adicionar não tem o que contestar — se estivesse errado, ela não
   * teria escrito —, e oferecer o botão ali seria oferecer um no-op. */
  const podeContestar = contestavel && !contestacao && Boolean(eventoPorId(evento.id))

  return (
    <li className={`flex items-start gap-2 leading-snug ${solto ? 'text-[0.88rem]' : 'text-[0.85rem]'}`}>
      <span
        className={`size-1 shrink-0 rounded-full bg-foreground/25 ${solto ? 'mt-[8px]' : 'mt-[7px]'}`}
      />
      <div className="min-w-0">
        <span className={solto ? undefined : 'text-muted-foreground'}>
          {evento.texto} <Fonte evento={evento} />
          {podeContestar && !aberto && (
            <button
              type="button"
              onClick={() => setAberto(true)}
              className="ml-1 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1.5 py-0.5 align-baseline font-mono text-[0.68rem] text-muted-foreground/70 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
            >
              <Flag className="size-3 shrink-0" />
              contestar
            </button>
          )}
        </span>

        {podeContestar && aberto && (
          <form
            className="mt-2 flex max-w-xl items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              contestar(evento.id, motivo)
              setMotivo('')
              setAberto(false)
            }}
          >
            <Input
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="O que está errado neste item?"
              className="h-8 text-[0.85rem]"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!motivo.trim()}
              className="h-8 shrink-0 text-[0.78rem]"
            >
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
        )}

        {contestacao && (
          <p className="mt-2 max-w-xl border-l-2 border-comp/40 pl-3 text-[0.82rem] leading-snug">
            <span className="etiqueta mr-1.5 text-comp">contestado</span>
            {contestacao.motivo}
            <span className="mt-0.5 block font-mono text-[0.7rem] text-muted-foreground/70">
              {nomeDe(contestacao.por)} · {dataCurta(contestacao.em)}
            </span>
          </p>
        )}
      </div>
    </li>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Feedbacks do período — e o silêncio, quando é o caso.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * O retorno que a pessoa recebeu no semestre (PLANO §3.4).
 *
 * A seção não some quando está vazia, e é aí que ela vale mais: o Thiago e a
 * Juliana atravessam seis meses sem uma linha, e é essa ausência que sustenta
 * o achado de organização "gestores com cobertura perto de zero". Escondê-la
 * quando não há nada faria o dossiê de quem nunca recebeu retorno parecer igual
 * ao de quem recebeu — que é exatamente o erro que o produto existe para
 * desfazer.
 *
 * A assimetria entre os dois tipos aparece na tela e não é explicada em ensaio:
 * reconhecimento traz o texto, conversa traz só data e episódio.
 */
function FeedbacksDoPeriodo({ pessoaId }: { pessoaId: PessoaId }) {
  const { feedbacksDe } = useRegistro()
  const lista = feedbacksDe(pessoaId)

  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between pb-2.5">
        <p className="etiqueta">Feedbacks do período</p>
        <p className="etiqueta">{lista.length === 0 ? 'nenhum' : `${lista.length} no semestre`}</p>
      </div>
      <Separator />
      <p className="mt-2.5 max-w-2xl text-[0.82rem] leading-snug text-muted-foreground/80">
        Reconhecimento guarda o texto. Conversa guarda que aconteceu, com data e episódio — nunca o
        teor.
      </p>

      {lista.length === 0 ? (
        <p className="prosa mt-4 max-w-xl rounded-sm border border-dashed border-border px-5 py-6 text-[0.92rem] leading-relaxed text-muted-foreground">
          Nenhum feedback registrado no semestre — nem reconhecimento, nem conversa.
        </p>
      ) : (
        <ul>
          {lista.map((f) => {
            const ep = f.episodioId ? episodioPorId(f.episodioId) : undefined
            return (
              <li key={f.id} className="border-b border-border/60 py-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  {f.tipo === 'reconhecimento' ? (
                    <Star className="size-3.5 fill-comp text-comp" />
                  ) : (
                    <MessageCircle className="size-3.5 text-muted-foreground" />
                  )}
                  <Badge variant="outline" className="etiqueta px-1.5 py-[3px]">
                    {f.tipo === 'reconhecimento' ? 'Reconhecimento' : 'Conversa'}
                  </Badge>
                  <span className="font-mono text-[0.7rem] text-muted-foreground/70">
                    {nomeDe(f.porPessoaId)} · {dataCurta(f.data)}
                  </span>
                  {ep && <span className="text-[0.8rem] text-muted-foreground">{ep.titulo}</span>}
                </div>

                {f.texto && (
                  <p className="prosa mt-2 max-w-2xl border-l-2 border-comp/40 pl-3 text-[0.92rem] leading-snug">
                    {f.texto}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   O ciclo — as duas portas que ele abre a partir do dossiê.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * O ciclo aparecendo onde a pessoa já está.
 *
 * O gatilho de C4 e de G5 é uma notificação, e notificação de protótipo é
 * botão: quem abre o dossiê no meio da janela de fechamento precisa saber que
 * ela existe sem ter que descobrir uma rota. São dois caminhos diferentes a
 * partir do mesmo lugar, e nunca os dois ao mesmo tempo — quem assina não é
 * quem é assinado.
 *
 * Some quando não há janela aberta. Um botão permanente chamado "Fechar o
 * ciclo" transformaria o fechamento em coisa que se faz a qualquer hora, e o
 * ciclo é fato do calendário.
 */
function EntradaDoCiclo({ pessoa: p, souEu }: { pessoa: Pessoa; souEu: boolean }) {
  const { viewer } = useViewer()
  const { avaliacaoDe } = useRegistro()

  const ciclo = cicloEmFechamento()
  if (!ciclo) return null

  const avaliacao = avaliacaoDe(ciclo.id, p.id)
  const fechada = Boolean(avaliacao?.assinadaEm)

  if (souEu) {
    if (!quemAvalia(p.id)) return null
    return (
      <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 text-[0.8rem]">
        <Link href="/meu-ciclo">
          <CalendarCheck className="size-3.5" />
          {fechada
            ? 'Ver o ciclo fechado'
            : `Seu ciclo fecha em ${diasAte(ciclo.fechamento.fecha)} dias`}
        </Link>
      </Button>
    )
  }

  if (!podeAvaliar(viewer, p.id).ok) return null

  return (
    <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 text-[0.8rem]">
      <Link href={`/ciclo/${p.id}`}>
        <CalendarCheck className="size-3.5" />
        {fechada ? 'Ver o fechamento' : 'Fechar o ciclo'}
      </Link>
    </Button>
  )
}

/**
 * Os ciclos que já fecharam — o marco de G6 na linha do tempo dela.
 *
 * SOME QUANDO ESTÁ VAZIA, ao contrário de "Feedbacks do período". A diferença
 * não é de estilo: feedback nenhum em seis meses é uma ausência que acusa
 * alguém, e é o achado de organização inteiro. Ciclo nenhum fechado é ausência
 * de DATA — a janela ainda não fechou —, e desenhar uma caixa vazia dizendo
 * isso faria o produto cobrar um trabalho que não está atrasado.
 *
 * Só as assinadas chegam aqui: `avaliacoesDe` filtra por `assinadaEm`. Uma
 * avaliação em curso é uma decisão sendo tomada, e publicá-la no dossiê seria
 * mostrar rascunho de julgamento — o oposto exato de "sem arquivo secreto", que
 * proíbe o campo escondido e não obriga a expor o gesto pela metade.
 */
function CiclosFechados({ pessoaId }: { pessoaId: PessoaId }) {
  const { avaliacoesDe } = useRegistro()
  const lista = avaliacoesDe(pessoaId)
  if (lista.length === 0) return null

  return (
    <section className="mt-12">
      <div className="flex items-baseline justify-between pb-2.5">
        <p className="etiqueta">Ciclos fechados</p>
        <p className="etiqueta">{lista.length}</p>
      </div>
      <Separator />
      <p className="mt-2.5 max-w-2xl text-[0.82rem] leading-snug text-muted-foreground/80">
        O que ficou registrado no fim de cada período, com a régua do nível ocupado e quem assinou.
      </p>

      <ul>
        {lista.map((a) => (
          <li key={a.id} className="border-b border-border/60 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
              <p className="display text-[1.05rem] leading-tight tracking-tight">
                {NOME_DECISAO[a.decisao!]}
              </p>
              <p className="etiqueta">
                {NOME_NIVEL[a.nivel] ?? a.nivel} · {NOME_TRILHA[a.trilha] ?? a.trilha}
              </p>
            </div>
            <p className="mt-1.5 font-mono text-[0.7rem] text-muted-foreground/70">
              assinado por {nomeDe(a.por)} · {dataCurta(a.assinadaEm!)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Contexto próprio.
   ───────────────────────────────────────────────────────────────────────── */

/**
 * O que o sistema não podia saber, dito por quem sabia (JORNADAS C3).
 *
 * Campo de texto e mais nada: sem título, sem data, sem categoria. Pedir
 * metadado aqui transformaria a correção em formulário, e formulário em branco
 * é o que este produto não tem em lugar nenhum — o texto vira evidência com a
 * procedência dela, e a procedência é tudo que o registro precisa saber.
 */
function FormContexto({ pessoaId, aoFechar }: { pessoaId: PessoaId; aoFechar: () => void }) {
  const { adicionarContexto } = useRegistro()
  const [texto, setTexto] = useState('')

  return (
    <form
      className="mt-3 max-w-xl"
      onSubmit={(e) => {
        e.preventDefault()
        adicionarContexto(pessoaId, texto)
        setTexto('')
        aoFechar()
      }}
    >
      <Textarea
        rows={2}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="O que o registro não alcançou?"
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
          onClick={aoFechar}
          className="h-7 text-[0.78rem] text-muted-foreground"
        >
          Cancelar
        </Button>
      </div>
      <p className="mt-2 text-[0.78rem] leading-snug text-muted-foreground">
        Entra como evidência no seu registro, com o seu nome na procedência.
      </p>
    </form>
  )
}

/**
 * O mês sem nenhum registro dito em palavra, não só desenhado.
 *
 * A coluna vazia é visível para quem procura; a frase é para quem não estava
 * procurando. Silêncio no registro é a informação mais acionável do dossiê —
 * é o que vira pergunta na semana seguinte.
 */
function notaDosVazios(pontos: { valor: number }[]): string | undefined {
  const vazios = pontos.filter((p) => p.valor === 0).length
  if (vazios === 0) return undefined
  return vazios === 1 ? 'Um mês sem nenhum registro.' : `${vazios} meses sem nenhum registro.`
}

/**
 * O estado de uma lacuna, dito em português — e o caminho até a caixa de
 * quem responde.
 *
 * `aberta` e `perguntada` eram valores de enum vazando pra tela, e a
 * diferença entre as duas é justamente a que o produto precisa mostrar:
 * identificada não é perguntada. Perguntada significa que o Brain gastou uma
 * das perguntas da semana e a mensagem já saiu no Slack.
 */
function EstadoDaLacuna({ lacuna, minha }: { lacuna: Lacuna; minha: boolean }) {
  const { pendenciasDe } = useRegistro()
  const quem = nomeDe(lacuna.perguntarA)
  /* Da caixa mesclada: o pedido de relato a um par nasce nesta sessão, e pela
   * lista estática a tela dizia "ainda não perguntada" sobre uma pergunta que já
   * estava na caixa de quem tem que responder. */
  const naCaixa = pendenciasDe(lacuna.perguntarA).some((p) => p.lacunaId === lacuna.id)
  const estado = descreverEstado(lacuna, quem, minha, naCaixa)

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[0.78rem] leading-none ${
          estado.fechada ? 'bg-comp-suave/45 text-comp' : 'bg-foreground/[0.045] text-muted-foreground'
        }`}
      >
        <estado.Icone className="size-3.5 shrink-0" />
        {estado.texto}
        {estado.quando && (
          <span className="font-mono text-[0.68rem] opacity-70">· {estado.quando}</span>
        )}
      </span>

      {/* O atalho só existe quando a pendência é de fato sua: mandar a Helena
          para /feedback abriria a caixa dela, não a da Marina. */}
      {minha && naCaixa && lacuna.status !== 'respondida' && (
        <Link
          href="/feedback"
          className="inline-flex items-center gap-1 text-[0.78rem] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Responder nas Pendências
          <ArrowUpRight className="size-3" />
        </Link>
      )}
    </div>
  )
}

function descreverEstado(l: Lacuna, quem: string, minha: boolean, naCaixa: boolean) {
  if (l.status === 'respondida' && l.resposta)
    return {
      Icone: Check,
      texto: `Respondida por ${quem}`,
      quando: dataCurta(l.resposta.em),
      fechada: true,
    }
  if (l.enviada)
    return {
      Icone: Send,
      texto: `Enviada no Slack ${minha ? 'para você' : `para ${quem}`} · aguardando`,
      quando: dataCurta(l.enviada.em),
      fechada: false,
    }
  if (naCaixa)
    return {
      Icone: Inbox,
      texto: minha ? 'Na sua caixa desta semana' : `Na caixa de ${quem} esta semana`,
      quando: undefined,
      fechada: false,
    }
  return {
    Icone: Clock3,
    texto: `Na fila para ${quem} · ainda não perguntada`,
    quando: undefined,
    fechada: false,
  }
}

function textoDoComportamento(id: string) {
  return regua.flatMap((r) => r.comportamentos).find((c) => c.id === id)?.texto ?? id
}

const primeiroNome = (n: string) => n.split(' ')[0]

function perguntaPadrao(nome: string, alvo: string | undefined, souEu: boolean) {
  if (souEu) return 'O que está registrado sobre mim neste semestre?'
  if (alvo) return `Onde ${primeiroNome(nome)} está em relação à régua de ${alvo}?`
  return `O que está registrado sobre ${primeiroNome(nome)} neste semestre?`
}
