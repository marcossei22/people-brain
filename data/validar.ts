/**
 * Validador de integridade referencial — ARQUITETURA.md §5.2.
 *
 * Roda no `prebuild`. O maior risco do protótipo não é técnico: é o elenco se
 * contradizer entre os fluxos. Se a Carla tem uma história no Slack e outra no
 * dossiê, a liderança percebe na hora — e a gravação vai pro lixo.
 *
 * Custa 20 minutos e elimina a única classe de erro que estraga a gravação.
 */
import { JANELA } from './tipos'
import { pessoas } from './pessoas'
import { eventos } from './eventos'
import { episodios } from './episodios'
import { temas } from './temas'
import { lacunas } from './lacunas'
import { regua, comportamentoIds } from './regua'
import { feedbacks } from './feedbacks'
import { achadosOrg } from './achados-org'

const erros: string[] = []
const avisos: string[] = []

const falha = (onde: string, msg: string) => erros.push(`${onde}: ${msg}`)
const avisa = (onde: string, msg: string) => avisos.push(`${onde}: ${msg}`)

const pessoaIds = new Set(pessoas.map((p) => p.id))
const eventoIds = new Set(eventos.map((e) => e.id))
const episodioIds = new Set(episodios.map((e) => e.id))
const lacunaIds = new Set(lacunas.map((l) => l.id))

const exigePessoa = (onde: string, campo: string, id: string | undefined) => {
  if (id && !pessoaIds.has(id)) falha(onde, `${campo} aponta para pessoa inexistente "${id}"`)
}

const duplicados = (nome: string, ids: string[]) => {
  const vistos = new Set<string>()
  for (const id of ids) {
    if (vistos.has(id)) falha(nome, `id duplicado "${id}"`)
    vistos.add(id)
  }
}

const naJanela = (data: string) => data >= JANELA.inicio && data <= JANELA.fim
const dataValida = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d))

// ── ids únicos ────────────────────────────────────────────────────────────
duplicados('pessoas', pessoas.map((p) => p.id))
duplicados('eventos', eventos.map((e) => e.id))
duplicados('episodios', episodios.map((e) => e.id))
duplicados('temas', temas.map((t) => t.id))
duplicados('lacunas', lacunas.map((l) => l.id))
duplicados(
  'regua',
  regua.flatMap((r) => r.comportamentos.map((c) => c.id)),
)

// ── pessoas ───────────────────────────────────────────────────────────────
for (const p of pessoas) {
  exigePessoa(`pessoa ${p.id}`, 'gestorId', p.gestorId)
  if (p.gestorId === p.id) falha(`pessoa ${p.id}`, 'é gestora de si mesma')
  if (!dataValida(p.desde)) falha(`pessoa ${p.id}`, `desde inválido "${p.desde}"`)
  // Trilha e nível andam juntos: nível sem trilha não tem régua contra o que comparar.
  if (Boolean(p.trilha) !== Boolean(p.nivel))
    falha(`pessoa ${p.id}`, 'tem trilha sem nível (ou o contrário) — os dois andam juntos')
}

// Densidade declarada tem que bater com a evidência que existe. O agente
// consulta o registro e lê a densidade no mesmo fôlego: se as duas se
// contradizem, ele aponta a contradição na frente de quem estiver assistindo.
for (const p of pessoas) {
  const n = eventos.filter((e) => e.pessoaId === p.id).length
  const onde = `pessoa ${p.id}`
  if (n === 0 && p.densidadeEvidencia !== 'baixa')
    falha(onde, `declara densidade "${p.densidadeEvidencia}" com 0 eventos registrados`)
  if (p.densidadeEvidencia === 'alta' && n < 6)
    falha(onde, `declara densidade "alta" com apenas ${n} eventos`)
  if (p.densidadeEvidencia === 'media' && (n < 3 || n > 12))
    falha(onde, `declara densidade "media" com ${n} eventos — fora da faixa 3–12`)
}

// ── eventos ───────────────────────────────────────────────────────────────
for (const e of eventos) {
  const onde = `evento ${e.id}`
  exigePessoa(onde, 'pessoaId', e.pessoaId)
  if (!dataValida(e.data)) falha(onde, `data inválida "${e.data}"`)
  else if (!naJanela(e.data))
    falha(onde, `data ${e.data} fora da janela do semestre (${JANELA.inicio} → ${JANELA.fim})`)

  if (e.episodioId && !episodioIds.has(e.episodioId))
    falha(onde, `episodioId aponta para episódio inexistente "${e.episodioId}"`)

  if (e.fonte.tipo === 'humano') {
    exigePessoa(onde, 'fonte.respondidoPor', e.fonte.respondidoPor)
    if (!lacunaIds.has(e.fonte.lacunaId))
      falha(onde, `fonte.lacunaId aponta para lacuna inexistente "${e.fonte.lacunaId}"`)
  }
}

// evidência 'humano' só existe se a lacuna de origem foi de fato respondida
for (const e of eventos) {
  if (e.fonte.tipo !== 'humano') continue
  const l = lacunas.find((x) => x.id === (e.fonte as { lacunaId: string }).lacunaId)
  if (l && l.status !== 'respondida')
    falha(
      `evento ${e.id}`,
      `nasceu da lacuna "${l.id}", que está "${l.status}" — evidência humana exige lacuna respondida`,
    )
}

// ── episódios ─────────────────────────────────────────────────────────────
for (const ep of episodios) {
  const onde = `episodio ${ep.id}`
  exigePessoa(onde, 'pessoaId', ep.pessoaId)
  ep.colaboradores.forEach((c, i) => exigePessoa(onde, `colaboradores[${i}]`, c))
  if (ep.colaboradores.includes(ep.pessoaId))
    falha(onde, 'a própria pessoa aparece como colaboradora')

  if (!dataValida(ep.inicio) || !dataValida(ep.fim)) falha(onde, 'inicio/fim inválidos')
  else if (ep.inicio > ep.fim) falha(onde, `inicio ${ep.inicio} posterior a fim ${ep.fim}`)

  if (ep.eventoIds.length === 0) falha(onde, 'episódio sem nenhum evento')

  for (const evId of ep.eventoIds) {
    if (!eventoIds.has(evId)) {
      falha(onde, `referencia evento inexistente "${evId}"`)
      continue
    }
    const ev = eventos.find((x) => x.id === evId)!
    // A regra explícita do §5.2: episódio não pode conter evento de outra pessoa.
    if (ev.pessoaId !== ep.pessoaId)
      falha(onde, `contém o evento ${evId}, que é da pessoa "${ev.pessoaId}"`)
    // Ligação nos dois sentidos, senão o drill-down do componente quebra.
    if (ev.episodioId !== ep.id)
      falha(onde, `evento ${evId} não aponta de volta para este episódio (episodioId="${ev.episodioId ?? '—'}")`)
    if (!naJanela(ev.data)) continue
    if (ev.data < ep.inicio || ev.data > ep.fim)
      avisa(onde, `evento ${evId} (${ev.data}) está fora do intervalo do episódio`)
  }

  if (ep.estrela) {
    exigePessoa(onde, 'estrela.por', ep.estrela.por)
    if (!dataValida(ep.estrela.em)) falha(onde, `estrela.em inválido "${ep.estrela.em}"`)
    if (ep.estrela.por === ep.pessoaId) falha(onde, 'a pessoa deu estrela para si mesma')
  }
}

// ── temas ─────────────────────────────────────────────────────────────────
for (const t of temas) {
  const onde = `tema ${t.id}`
  exigePessoa(onde, 'pessoaId', t.pessoaId)
  if (t.episodioIds.length === 0) falha(onde, 'tema sem episódio de apoio')

  for (const epId of t.episodioIds) {
    if (!episodioIds.has(epId)) {
      falha(onde, `referencia episódio inexistente "${epId}"`)
      continue
    }
    const ep = episodios.find((x) => x.id === epId)!
    if (ep.pessoaId !== t.pessoaId)
      falha(onde, `referencia o episódio ${epId}, que é da pessoa "${ep.pessoaId}"`)
  }

  for (const cId of t.comportamentosRegua) {
    if (!comportamentoIds.has(cId))
      falha(onde, `aponta para comportamento inexistente na régua "${cId}"`)
  }

  // Confiança é função da densidade de evidência — não pode ser mais alta
  // que a da pessoa, senão o produto está exagerando o que sabe.
  const p = pessoas.find((x) => x.id === t.pessoaId)
  const ordem = { baixa: 0, media: 1, alta: 2 } as const
  if (p && ordem[t.confianca] > ordem[p.densidadeEvidencia])
    falha(
      onde,
      `confiança "${t.confianca}" acima da densidade de evidência de ${p.nome} ("${p.densidadeEvidencia}")`,
    )
}

// ── lacunas ───────────────────────────────────────────────────────────────
for (const l of lacunas) {
  const onde = `lacuna ${l.id}`
  exigePessoa(onde, 'pessoaId', l.pessoaId)
  exigePessoa(onde, 'perguntarA', l.perguntarA)
  if (!l.motivo?.trim()) falha(onde, 'sem motivo — o orçamento de pergunta exige declarar o porquê')

  if (l.status === 'respondida' && !l.resposta)
    falha(onde, 'está "respondida" mas não tem resposta')
  if (l.status !== 'respondida' && l.resposta)
    falha(onde, `tem resposta mas o status é "${l.status}"`)
  if (l.resposta) {
    exigePessoa(onde, 'resposta.por', l.resposta.por)
    if (!dataValida(l.resposta.em)) falha(onde, `resposta.em inválido "${l.resposta.em}"`)
    if (!l.resposta.texto.trim()) falha(onde, 'resposta vazia')
  }
}

// ── feedbacks ─────────────────────────────────────────────────────────────
duplicados('feedbacks', feedbacks.map((f) => f.id))
for (const f of feedbacks) {
  const onde = `feedback ${f.id}`
  exigePessoa(onde, 'paraPessoaId', f.paraPessoaId)
  exigePessoa(onde, 'porPessoaId', f.porPessoaId)
  if (f.paraPessoaId === f.porPessoaId) falha(onde, 'pessoa deu feedback para si mesma')
  if (!dataValida(f.data)) falha(onde, `data inválida "${f.data}"`)
  else if (!naJanela(f.data)) falha(onde, `data ${f.data} fora da janela do semestre`)
  if (f.episodioId && !episodioIds.has(f.episodioId))
    falha(onde, `episodioId inexistente "${f.episodioId}"`)
  // Conversa não guarda texto, por desenho (#7).
  if (f.tipo === 'conversa' && f.texto)
    falha(onde, 'feedback do tipo "conversa" não pode guardar texto — registro de demérito não existe')
  if (f.tipo === 'reconhecimento' && !f.texto?.trim())
    falha(onde, 'reconhecimento sem texto')
}

// ── achados de organização ────────────────────────────────────────────────
duplicados('achados-org', achadosOrg.map((a) => a.id))
for (const a of achadosOrg) {
  const onde = `achado ${a.id}`
  if (a.evidencia.pessoaIds.length === 0) falha(onde, 'achado sem pessoa afetada')
  a.evidencia.pessoaIds.forEach((id, i) => exigePessoa(onde, `evidencia.pessoaIds[${i}]`, id))
  for (const epId of a.evidencia.episodioIds) {
    if (!episodioIds.has(epId)) falha(onde, `referencia episódio inexistente "${epId}"`)
  }
  if (!a.recomendacao.trim()) falha(onde, 'achado sem recomendação')
}

// ── régua ─────────────────────────────────────────────────────────────────
for (const r of regua) {
  const onde = `regua ${r.trilha}/${r.nivel}`
  if (r.comportamentos.length === 0) falha(onde, 'nível sem comportamentos')
  r.derivado?.baseadoEm.forEach((id, i) => exigePessoa(onde, `derivado.baseadoEm[${i}]`, id))
}

// ── saída ─────────────────────────────────────────────────────────────────
const resumo = `${pessoas.length} pessoas · ${eventos.length} eventos · ${episodios.length} episódios · ${temas.length} temas · ${lacunas.length} lacunas · ${feedbacks.length} feedbacks · ${achadosOrg.length} achados`

if (avisos.length) {
  console.warn(`\n⚠  ${avisos.length} aviso(s):`)
  for (const a of avisos) console.warn(`   ${a}`)
}

if (erros.length) {
  console.error(`\n✗ Integridade dos dados falhou — ${erros.length} erro(s):\n`)
  for (const e of erros) console.error(`   ${e}`)
  console.error('')
  process.exit(1)
}

console.log(`✓ Dados íntegros — ${resumo}`)
