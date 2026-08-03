'use client'

/**
 * `/feedback` — FLUXO 1 · Captura (ARQUITETURA.md §8.3).
 *
 * A caixa da semana, agora com consequência. Cada botão daqui escreve no
 * registro da sessão (`lib/registro.tsx`) e o item tratado sai da caixa. Até o
 * passo 5 eram cinco botões de layout, e botão sem efeito num protótipo diz o
 * contrário da tese: que o registro é fotografia, não loop.
 *
 * Três tipos de item, três consequências diferentes:
 *   pergunta        a resposta fecha a lacuna e nasce evidência no dossiê de
 *                   quem a pergunta era SOBRE — não de quem digitou;
 *   reconhecimento  a estrela gruda no episódio e o retorno passa a existir;
 *   feedback devido fica registrado que a conversa vai acontecer, e só isso —
 *                   teor de conversa não entra em lugar nenhum (decisão #7).
 *
 * As saídas sem consequência ("Não sei responder", "Depois") são de primeira
 * classe e não cobram nada de ninguém. Caixa em que ignorar dá culpa vira ruído
 * em 60 dias, e aí o produto perde o direito de dizer que silêncio é resposta.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CalendarPlus, MessageSquareQuote, PenLine, Star, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Fonte } from '@/components/brain/fonte'
import { episodioPorId } from '@/data/episodios'
import { eventoPorId } from '@/data/eventos'
import { NOME_TIPO, ORCAMENTO, pendenciasDe as pendenciasNaSemente } from '@/data/pendencias'
import type { Pendencia, TipoPendencia } from '@/data/pendencias'
import type { Episodio, PessoaId } from '@/data/tipos'
import { dataCurta, nomeDe } from '@/lib/memoria'
import { AVISO_ESTRELA, useRegistro } from '@/lib/registro'
import { useViewer } from '@/lib/viewer'

const ICONE: Record<TipoPendencia, LucideIcon> = {
  pergunta: MessageSquareQuote,
  reconhecimento: Star,
  feedback: CalendarPlus,
}

export default function PaginaFeedback() {
  const { viewer, geracao } = useViewer()
  const { pendenciasDe, pendenciasExtras, resolvidas, eventos, feedbacks } = useRegistro()

  // A caixa vem do registro: semente menos o que foi tratado, mais o que nasceu
  // nesta sessão (contestação, pedido de relato a um par). Ler a lista estática
  // daqui deixaria a tela cega para o que acabou de acontecer.
  const itens = pendenciasDe(viewer.pessoaId)

  /* O orçamento, porém, é da SEMANA — tratada ou não. Ele conta as perguntas que
   * o Brain gastou, e responder não devolve o direito de perguntar (decisão
   * #11): um contador que voltasse para "0 de 2" depois da resposta diria que a
   * semana está inteira de novo, e a escassez que sustenta a caixa evaporaria no
   * momento exato em que ela funcionou. Por isso a soma ignora `resolvidas`. */
  const daSemana = [
    ...pendenciasNaSemente(viewer.pessoaId),
    ...pendenciasExtras.filter((p) => p.de === viewer.pessoaId),
  ]
  const orcamento = ORCAMENTO[viewer.papel] ?? 0
  const usadas = daSemana.filter((p) => p.tipo === 'pergunta').length
  const tratados = daSemana.filter((p) => resolvidas.includes(p.id))

  /* Caixa vazia porque nada chegou e caixa vazia porque a pessoa tratou tudo são
   * dois estados diferentes, e o texto de silêncio só é verdadeiro no primeiro.
   * Dizer "o Brain não encontrou nada" para quem acabou de responder três itens
   * seria a tela desmentindo o que a pessoa fez nela. */
  const esvaziouTratando = itens.length === 0 && tratados.length > 0

  return (
    <div key={geracao} className="mx-auto max-w-3xl px-10 py-12">
      <header className="surgir">
        <p className="etiqueta">Pendências</p>
        <h2 className="display mt-3 text-[2.1rem] leading-[1.1] tracking-tight">
          Sua atenção desta semana
        </h2>
        <p className="prosa mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
          {itens.length > 0
            ? 'O que o Brain achou que vale seu tempo, com o motivo de cada item.'
            : esvaziouTratando
              ? 'Você tratou tudo o que chegou esta semana.'
              : 'Nada aqui esta semana.'}
        </p>
      </header>

      {itens.length === 0 ? (
        esvaziouTratando ? (
          <Tratado
            quantos={tratados.length}
            pessoas={pessoasComRegistro(tratados, eventos, feedbacks)}
          />
        ) : (
          <Silencio />
        )
      ) : (
        <>
          <div className="mt-10">
            <div className="flex items-baseline justify-between pb-2.5">
              <p className="etiqueta">
                {itens.length} {itens.length === 1 ? 'item' : 'itens'}
              </p>
              <p className="etiqueta">Semana de 27 jul</p>
            </div>
            <Separator />
          </div>

          <ul className="space-y-px">
            {itens.map((p, i) => (
              <li key={p.id} className="surgir" style={{ animationDelay: `${60 + i * 60}ms` }}>
                <ItemPendencia p={p} />
              </li>
            ))}
          </ul>

          {/* CHRO não tem orçamento de pergunta: mostrar "0 de 0" seria desenhar
              um limite que não existe para ela. */}
          {orcamento > 0 && <Orcamento usadas={usadas} total={orcamento} />}
        </>
      )}
    </div>
  )
}

function ItemPendencia({ p }: { p: Pendencia }) {
  const { responderLacuna, adicionarContexto, reconhecer, registrarConversa, resolverPendencia } =
    useRegistro()
  const [texto, setTexto] = useState(p.rascunho ?? '')
  const [rascunhando, setRascunhando] = useState(false)

  const Icone = ICONE[p.tipo]
  const episodio = p.episodioId ? episodioPorId(p.episodioId) : undefined

  /* Onde a resposta pousa depende do que o item carrega. Com `lacunaId`, ela
   * fecha a lacuna que o Brain declarou e a evidência nasce com procedência
   * `humano` — foi elicitada. Sem lacuna, só existe um caso legítimo: a pessoa
   * escrevendo no PRÓPRIO registro (JORNADAS §C3), que é a `pd-4` da Carla.
   * Terceiro escrevendo no registro de outro sem lacuna por trás é exatamente o
   * que `validar.ts` recusa, então a caixa nem oferece o campo — botão que
   * aceita texto e não registra nada é pior que botão morto. */
  const respondeLacuna = Boolean(p.lacunaId)
  const completaOProprio = !p.lacunaId && p.de === p.sobre
  const podeEscrever = respondeLacuna || completaOProprio

  const enviar = () => {
    if (!texto.trim()) return
    if (p.lacunaId) responderLacuna(p.lacunaId, texto)
    else adicionarContexto(p.sobre, texto)
    resolverPendencia(p.id)
  }

  const reconhecerAgora = () => {
    if (p.episodioId) reconhecer(p.episodioId, texto)
    resolverPendencia(p.id)
  }

  const agendar = () => {
    registrarConversa(p.sobre, p.episodioId)
    resolverPendencia(p.id)
  }

  return (
    <article className="border-b border-border/70 py-7">
      <div className="flex items-center gap-2.5">
        <Icone className="size-3.5 text-comp" />
        <Badge variant="outline" className="etiqueta px-1.5 py-[3px]">
          {NOME_TIPO[p.tipo]}
        </Badge>
        <Link
          href={`/org/${p.sobre}`}
          className="text-[0.78rem] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {nomeDe(p.sobre)}
        </Link>
      </div>

      <h3 className="prosa mt-3 max-w-[38rem] text-[1.12rem] leading-snug">{p.titulo}</h3>

      <p className="mt-3 max-w-[38rem] border-l-2 border-border pl-3.5 text-[0.85rem] leading-relaxed text-muted-foreground">
        <span className="etiqueta mr-1.5">por quê</span>
        {p.motivo}
      </p>

      {episodio && (
        <Link
          href={`/org/${p.sobre}`}
          className="mt-3 inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 transition-colors hover:bg-foreground/[0.03]"
        >
          <span className="etiqueta">episódio</span>
          <span className="text-[0.82rem]">{episodio.titulo}</span>
          <span className="font-mono text-[0.7rem] text-muted-foreground">
            {episodio.eventoIds.length} eventos
          </span>
        </Link>
      )}

      {p.tipo === 'pergunta' && (
        <div className="mt-4 max-w-[38rem]">
          {podeEscrever && (
            <Textarea
              rows={2}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="resize-none bg-card text-[0.9rem]"
            />
          )}
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {podeEscrever && (
              // Campo vazio não envia. Desabilitado em vez de silencioso: clique
              // que não faz nada é indistinguível de produto quebrado.
              <Button
                size="sm"
                onClick={enviar}
                disabled={!texto.trim()}
                className="h-7 text-[0.78rem]"
              >
                {p.acao}
              </Button>
            )}
            {episodio && <VerEvidencia episodio={episodio} />}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => resolverPendencia(p.id)}
              className="h-7 text-[0.78rem] text-muted-foreground"
            >
              {podeEscrever ? 'Não sei responder' : 'Depois'}
            </Button>
          </div>
        </div>
      )}

      {p.tipo === 'reconhecimento' && (
        <div className="mt-4 max-w-[38rem]">
          {/* O rascunho já existe no item — o trabalho que sobra para a gestora é
              editar, não escrever do zero. Ele só aparece depois do clique porque
              a caixa é uma lista de decisões; três textos longos abertos ao mesmo
              tempo transformariam a semana em formulário. */}
          {rascunhando && (
            <Textarea
              rows={4}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="mb-2.5 resize-none bg-card text-[0.9rem]"
            />
          )}
          <div className="flex flex-wrap gap-2">
            {episodio &&
              (rascunhando ? (
                // Sem `disabled`: reconhecimento sem nota é reconhecimento
                // válido. A estrela é a unidade barata de julgamento humano
                // (PLANO §3.3) e exigir texto a transformaria em formulário.
                <Button size="sm" onClick={reconhecerAgora} className="h-7 gap-1.5 text-[0.78rem]">
                  <Star className="size-3" />
                  Reconhecer
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setRascunhando(true)}
                  className="h-7 gap-1.5 text-[0.78rem]"
                >
                  <PenLine className="size-3" />
                  {p.acao}
                </Button>
              ))}
            {episodio && <VerEvidencia episodio={episodio} />}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => resolverPendencia(p.id)}
              className="h-7 text-[0.78rem] text-muted-foreground"
            >
              Depois
            </Button>
          </div>
          {/* O mesmo aviso do dossiê, pela mesma razão (JORNADAS G3): o clique
              soma +1 na régua da pessoa, e quem clica precisa saber disso antes.
              Aparece junto com o rascunho, que é o passo em que a decisão está
              sendo tomada. */}
          {rascunhando && (
            <p className="mt-2.5 text-[0.78rem] leading-snug text-muted-foreground">
              {AVISO_ESTRELA}
            </p>
          )}
        </div>
      )}

      {p.tipo === 'feedback' && (
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Sem campo de texto, e não é esquecimento: o que fica registrado é
              que a conversa vai acontecer. O teor não entra — registro de
              demérito é passivo trabalhista (decisão #7). */}
          <Button size="sm" onClick={agendar} className="h-7 gap-1.5 text-[0.78rem]">
            <CalendarPlus className="size-3" />
            {p.acao}
          </Button>
          {episodio && <VerEvidencia episodio={episodio} />}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => resolverPendencia(p.id)}
            className="h-7 text-[0.78rem] text-muted-foreground"
          >
            Depois
          </Button>
        </div>
      )}
    </article>
  )
}

/**
 * A evidência do episódio citado, sem sair da caixa.
 *
 * Mesma linguagem do drill-down de `components/brain/fonte.tsx` — título
 * "Evidência", ficha de linhas, rodapé com saída — porque são a mesma promessa
 * (§2.1: nenhuma frase sem link para a fonte) em dois níveis de zoom: lá é um
 * evento, aqui é o arco inteiro. Os eventos vêm com o chip de fonte de sempre,
 * então dá para descer mais um nível de dentro daqui.
 *
 * Existe para que reconhecer não seja um ato de fé: quem vai colocar o nome
 * embaixo do texto precisa ver o que sustenta o episódio antes de assinar.
 */
function VerEvidencia({ episodio }: { episodio: Episodio }) {
  const [aberto, setAberto] = useState(false)

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setAberto(true)}
        className="h-7 text-[0.78rem]"
      >
        Ver a evidência
      </Button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="gap-0 p-0 sm:max-w-lg">
          <div className="px-6 pt-6">
            <DialogTitle className="etiqueta font-mono text-[0.7rem] font-normal">
              Evidência
            </DialogTitle>
            <DialogDescription className="sr-only">
              Os eventos que formam o episódio e a fonte de cada um.
            </DialogDescription>

            <p className="prosa mt-3 text-[1.05rem] leading-snug text-foreground">
              {episodio.titulo}
            </p>
            <p className="prosa mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">
              {episodio.resumo}
            </p>
            <p className="mt-3 font-mono text-[0.7rem] text-muted-foreground/70">
              {dataCurta(episodio.inicio)} → {dataCurta(episodio.fim)} ·{' '}
              {nomeDe(episodio.pessoaId)}
            </p>
          </div>

          <dl className="mt-6 border-t border-border">
            <Linha rotulo="Eventos">
              <ul className="space-y-1.5">
                {episodio.eventoIds.map((id) => {
                  const ev = eventoPorId(id)
                  if (!ev) return null
                  return (
                    <li key={id} className="flex items-start gap-2 leading-snug">
                      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-foreground/25" />
                      <span className="text-muted-foreground">
                        {ev.texto} <Fonte evento={ev} />
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Linha>
            {episodio.colaboradores.length > 0 && (
              <Linha rotulo="Com">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Users className="size-3.5 shrink-0" />
                  {episodio.colaboradores.map(nomeDe).join(', ')}
                </span>
              </Linha>
            )}
            {episodio.nivelObservado && (
              <Linha rotulo="Nível observado">{episodio.nivelObservado}</Linha>
            )}
          </dl>

          <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-3.5">
            <Link
              href={`/org/${episodio.pessoaId}`}
              onClick={() => setAberto(false)}
              className="inline-flex items-center gap-1 text-[0.8rem] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Ver no dossiê
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

/** O orçamento de pergunta virando pixel — decisão #11. */
function Orcamento({ usadas, total }: { usadas: number; total: number }) {
  return (
    <div className="surgir mt-8 flex items-center gap-3" style={{ animationDelay: '260ms' }}>
      <span className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`block h-1 w-6 rounded-full ${i < usadas ? 'bg-comp' : 'bg-foreground/15'}`}
          />
        ))}
      </span>
      <p className="text-[0.78rem] text-muted-foreground">
        {usadas} de {total} {total === 1 ? 'pergunta' : 'perguntas'} desta semana. A próxima chega
        segunda.
      </p>
    </div>
  )
}

/**
 * De quem o registro cresceu nesta sessão, entre as pessoas que estavam na
 * caixa. É o único fim de fluxo que prova que os botões escreveram — a caixa
 * ficar vazia, sozinha, é indistinguível de ter ignorado tudo.
 *
 * A interseção importa: "Depois" e "Não sei responder" tiram o item da caixa
 * sem registrar nada, e listar essas pessoas aqui seria a tela reivindicando um
 * registro que não existe.
 */
function pessoasComRegistro(
  tratados: Pendencia[],
  eventos: { pessoaId: PessoaId }[],
  feedbacks: { paraPessoaId: PessoaId }[],
): PessoaId[] {
  const cresceu = new Set([
    ...eventos.map((e) => e.pessoaId),
    ...feedbacks.map((f) => f.paraPessoaId),
  ])
  return [...new Set(tratados.map((p) => p.sobre))].filter((id) => cresceu.has(id))
}

function Tratado({ quantos, pessoas }: { quantos: number; pessoas: PessoaId[] }) {
  return (
    <div className="surgir mt-12 max-w-xl rounded-sm border border-dashed border-border px-6 py-10">
      <p className="prosa text-[0.98rem] leading-relaxed text-muted-foreground">
        {quantos === 1 ? 'O item desta semana saiu' : `Os ${quantos} itens desta semana saíram`} da
        caixa. A próxima pendência chega segunda.
      </p>
      {pessoas.length > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="etiqueta">no registro</span>
          {pessoas.map((id) => (
            <Link
              key={id}
              href={`/org/${id}`}
              className="inline-flex items-center gap-1 text-[0.85rem] underline-offset-4 hover:underline"
            >
              {nomeDe(id)}
              <ArrowUpRight className="size-3" />
            </Link>
          ))}
        </p>
      )}
    </div>
  )
}

function Silencio() {
  return (
    <div className="surgir mt-12 max-w-xl rounded-sm border border-dashed border-border px-6 py-10">
      <p className="prosa text-[0.98rem] leading-relaxed text-muted-foreground">
        O Brain não encontrou nada que valha sua atenção esta semana. Quando encontrar, aparece
        aqui — no máximo três itens.
      </p>
    </div>
  )
}
