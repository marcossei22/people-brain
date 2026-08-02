import type { Evento } from './tipos'

/**
 * O registro de trabalho da Aurora entre fevereiro e julho de 2026.
 *
 * Cada evento é UMA frase sobre algo que aconteceu, com fonte rastreável.
 * Não é log de atividade: é linha do tempo curada de momentos de contribuição.
 * Se não dá para apontar a mensagem, o PR ou o documento, não entra.
 */
export const eventos: Evento[] = [
  // ══ CARLA NUNES · densidade alta ═════════════════════════════════════
  { id: 'ev-c01', pessoaId: 'carla', data: '2026-03-04', texto: 'Propôs cortar a migração do checkout em três fases para dispensar janela de downtime.', fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-4412' }, episodioId: 'ep-carla-migracao' },
  { id: 'ev-c02', pessoaId: 'carla', data: '2026-03-11', texto: 'Abriu a fase 1 da migração com plano de rollback documentado no próprio PR.', fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1841 }, episodioId: 'ep-carla-migracao' },
  { id: 'ev-c03', pessoaId: 'carla', data: '2026-03-18', texto: 'Escreveu o postmortem da migração antes da virada, listando o que poderia falhar.', fonte: { tipo: 'doc', titulo: 'Migração checkout — riscos e rollback' }, episodioId: 'ep-carla-migracao' },
  { id: 'ev-c04', pessoaId: 'carla', data: '2026-03-21', texto: 'Conduziu a virada às 5h de sábado; zero incidentes e nenhuma transação perdida.', fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-4790' }, episodioId: 'ep-carla-migracao' },

  { id: 'ev-c05', pessoaId: 'carla', data: '2026-05-06', texto: 'Mapeou com o time de Dados por que o pipeline de conciliação travava e transformou isso em pauta semanal.', fonte: { tipo: 'slack', canal: '#dados', mensagemId: 'd-2201' }, episodioId: 'ep-carla-dados' },
  { id: 'ev-c06', pessoaId: 'carla', data: '2026-05-20', texto: 'Negociou com Dados uma fila dedicada para os pedidos de Pagamentos.', fonte: { tipo: 'slack', canal: '#dados', mensagemId: 'd-2388' }, episodioId: 'ep-carla-dados' },
  { id: 'ev-c07', pessoaId: 'carla', data: '2026-06-02', texto: 'Escreveu o handoff Dados↔Pagamentos que os dois times passaram a usar.', fonte: { tipo: 'doc', titulo: 'Handoff Dados ↔ Pagamentos' }, episodioId: 'ep-carla-dados' },

  { id: 'ev-c08', pessoaId: 'carla', data: '2026-02-10', texto: 'Assumiu o onboarding técnico do Bruno sem que ninguém tivesse pedido.', fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-3980' }, episodioId: 'ep-carla-onboarding' },
  { id: 'ev-c09', pessoaId: 'carla', data: '2026-02-27', texto: 'Revisou linha a linha os seis primeiros PRs do Bruno.', fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1702 }, episodioId: 'ep-carla-onboarding' },

  { id: 'ev-c10', pessoaId: 'carla', data: '2026-07-08', texto: 'Refatorou o cliente de idempotência do gateway para cobrir retries parciais.', fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 2033 }, episodioId: 'ep-carla-idempotencia' },
  { id: 'ev-c11', pessoaId: 'carla', data: '2026-07-15', texto: 'Documentou as três formas de cobrança duplicada que o retry parcial causava.', fonte: { tipo: 'doc', titulo: 'Idempotência no gateway — modos de falha' }, episodioId: 'ep-carla-idempotencia' },

  { id: 'ev-c12', pessoaId: 'carla', data: '2026-04-14', texto: 'Explicou para a Juliana como o time de Pagamentos versiona contrato de API.', fonte: { tipo: 'slack', canal: '#plataforma', mensagemId: 'pl-1180' } },
  { id: 'ev-c13', pessoaId: 'carla', data: '2026-06-24', texto: 'Reduziu o tempo de build do serviço de cobrança de 11 para 4 minutos.', fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1988 } },
  { id: 'ev-c14', pessoaId: 'carla', data: '2026-07-22', texto: 'Levantou na retro que o time não tem dono definido para a fila de erros do gateway.', fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-6210' } },

  // ══ RAFAEL LIMA · densidade média · travado por Dados ════════════════
  { id: 'ev-r01', pessoaId: 'rafael', data: '2026-04-14', texto: 'Sinalizou que a conciliação depende de uma tabela que o time de Dados ainda não expôs.', fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-5120' }, episodioId: 'ep-rafael-conciliacao' },
  { id: 'ev-r02', pessoaId: 'rafael', data: '2026-05-05', texto: 'Reprogramou a entrega pela primeira vez, com a dependência ainda em aberto.', fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-5390' }, episodioId: 'ep-rafael-conciliacao' },
  { id: 'ev-r03', pessoaId: 'rafael', data: '2026-05-28', texto: 'Reprogramou pela segunda vez; o bloqueio seguia em Dados.', fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-5644' }, episodioId: 'ep-rafael-conciliacao' },
  { id: 'ev-r04', pessoaId: 'rafael', data: '2026-06-25', texto: 'Cortou escopo e entregou a conciliação sem o dado de origem, documentando a dívida.', fonte: { tipo: 'doc', titulo: 'Conciliação v1 — escopo cortado' }, episodioId: 'ep-rafael-conciliacao' },

  { id: 'ev-r05', pessoaId: 'rafael', data: '2026-06-09', texto: 'Corrigiu uma race condition no retry de webhooks que gerava cobrança duplicada.', fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1955 }, episodioId: 'ep-rafael-webhook' },
  { id: 'ev-r06', pessoaId: 'rafael', data: '2026-06-16', texto: 'Escreveu o teste de carga que reproduz a condição de corrida antes do fix.', fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1961 }, episodioId: 'ep-rafael-webhook' },

  { id: 'ev-r07', pessoaId: 'rafael', data: '2026-02-19', texto: 'Integrou o gateway secundário para tirar a Aurora de fornecedor único.', fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1655 }, episodioId: 'ep-rafael-gateway' },
  { id: 'ev-r08', pessoaId: 'rafael', data: '2026-03-05', texto: 'Definiu a regra de failover entre os dois gateways e testou em produção com 1% do tráfego.', fonte: { tipo: 'doc', titulo: 'Failover de gateway — regra e rollout' }, episodioId: 'ep-rafael-gateway' },

  { id: 'ev-r09', pessoaId: 'rafael', data: '2026-07-01', texto: 'Revisou o desenho de particionamento que a Juliana propôs para a tabela de eventos.', fonte: { tipo: 'github', repo: 'aurora/plataforma', pr: 890 } },
  { id: 'ev-r10', pessoaId: 'rafael', data: '2026-04-28', texto: 'Assumiu o plantão de dois colegas na semana do feriado.', fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-5270' } },

  // ══ BRUNO SATO · densidade baixa · o esquecido ═══════════════════════
  { id: 'ev-b01', pessoaId: 'bruno', data: '2026-04-02', texto: 'Ajustou os logs do serviço de cobrança para incluir o id de correlação.', fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1889 } },
  {
    // O loop de elicitação no sistema de tipos: esta evidência não foi
    // observada, foi PERGUNTADA. Sem ela, junho do Bruno é um buraco.
    id: 'ev-b02', pessoaId: 'bruno', data: '2026-06-30',
    texto: 'Passou seis semanas no plantão do incidente de faturamento — trabalho todo em call, nada em PR.',
    fonte: { tipo: 'humano', respondidoPor: 'marina', lacunaId: 'lac-bruno-junho' },
    episodioId: 'ep-bruno-plantao',
  },
  { id: 'ev-b03', pessoaId: 'bruno', data: '2026-05-19', texto: 'Abriu o incidente de faturamento duplicado depois de reproduzir o caso em staging.', fonte: { tipo: 'slack', canal: '#incidentes', mensagemId: 'i-0412' }, episodioId: 'ep-bruno-plantao' },
  { id: 'ev-b04', pessoaId: 'bruno', data: '2026-02-24', texto: 'Entregou o primeiro endpoint sozinho, três semanas depois de entrar no time.', fonte: { tipo: 'github', repo: 'aurora/pagamentos', pr: 1698 } },
  { id: 'ev-b05', pessoaId: 'bruno', data: '2026-07-10', texto: 'Escreveu o runbook do plantão de faturamento a partir do que aprendeu no incidente.', fonte: { tipo: 'doc', titulo: 'Runbook — plantão de faturamento' } },

  // ══ THIAGO REIS · Plataforma · sem feedback do gestor ════════════════
  { id: 'ev-t01', pessoaId: 'thiago', data: '2026-02-12', texto: 'Instrumentou os quatro serviços críticos com tracing distribuído.', fonte: { tipo: 'github', repo: 'aurora/plataforma', pr: 771 }, episodioId: 'ep-thiago-observabilidade' },
  { id: 'ev-t02', pessoaId: 'thiago', data: '2026-03-09', texto: 'Criou o painel que reduziu o tempo de diagnóstico de incidente de 40 para 8 minutos.', fonte: { tipo: 'doc', titulo: 'Painel de latência ponta a ponta' }, episodioId: 'ep-thiago-observabilidade' },
  { id: 'ev-t03', pessoaId: 'thiago', data: '2026-03-24', texto: 'Treinou os plantonistas dos três times a usar o painel novo.', fonte: { tipo: 'slack', canal: '#plataforma', mensagemId: 'pl-0940' }, episodioId: 'ep-thiago-observabilidade' },

  { id: 'ev-t04', pessoaId: 'thiago', data: '2026-05-12', texto: 'Bloqueou o cache de leitura por depender de uma materialização que Dados não priorizou.', fonte: { tipo: 'slack', canal: '#dados', mensagemId: 'd-2310' }, episodioId: 'ep-thiago-cache' },
  { id: 'ev-t05', pessoaId: 'thiago', data: '2026-06-18', texto: 'Entregou o cache com invalidação manual, assumindo a dívida até Dados liberar a view.', fonte: { tipo: 'github', repo: 'aurora/plataforma', pr: 862 }, episodioId: 'ep-thiago-cache' },

  { id: 'ev-t06', pessoaId: 'thiago', data: '2026-07-14', texto: 'Escreveu o RFC de padronização de erro HTTP que os cinco times adotaram.', fonte: { tipo: 'doc', titulo: 'RFC 012 — erros HTTP na Aurora' } },
  { id: 'ev-t07', pessoaId: 'thiago', data: '2026-04-21', texto: 'Reduziu o custo de infraestrutura de staging em 38% desligando ambientes ociosos.', fonte: { tipo: 'github', repo: 'aurora/plataforma', pr: 820 } },

  // ══ JULIANA CASTRO · Plataforma · sem feedback do gestor ═════════════
  { id: 'ev-j01', pessoaId: 'juliana', data: '2026-02-18', texto: 'Reescreveu o pipeline de CI e cortou o tempo de build de 22 para 9 minutos.', fonte: { tipo: 'github', repo: 'aurora/plataforma', pr: 782 }, episodioId: 'ep-juliana-ci' },
  { id: 'ev-j02', pessoaId: 'juliana', data: '2026-03-13', texto: 'Colocou o cache de dependências que estava faltando havia dois anos.', fonte: { tipo: 'github', repo: 'aurora/plataforma', pr: 799 }, episodioId: 'ep-juliana-ci' },
  { id: 'ev-j03', pessoaId: 'juliana', data: '2026-03-30', texto: 'Documentou como adicionar um serviço novo ao CI sem pedir ajuda.', fonte: { tipo: 'doc', titulo: 'CI da Aurora — adicionar um serviço' }, episodioId: 'ep-juliana-ci' },

  { id: 'ev-j04', pessoaId: 'juliana', data: '2026-05-26', texto: 'Parou a migração de logs esperando o schema que Dados ia publicar.', fonte: { tipo: 'slack', canal: '#dados', mensagemId: 'd-2401' }, episodioId: 'ep-juliana-logs' },
  { id: 'ev-j05', pessoaId: 'juliana', data: '2026-07-07', texto: 'Retomou a migração seis semanas depois, com o schema já defasado.', fonte: { tipo: 'github', repo: 'aurora/plataforma', pr: 901 }, episodioId: 'ep-juliana-logs' },

  { id: 'ev-j06', pessoaId: 'juliana', data: '2026-06-11', texto: 'Propôs o particionamento da tabela de eventos que destravou a query de auditoria.', fonte: { tipo: 'github', repo: 'aurora/plataforma', pr: 878 } },
  { id: 'ev-j07', pessoaId: 'juliana', data: '2026-04-07', texto: 'Perguntou em público por que ninguém revisa PR de infraestrutura, e virou prática do time.', fonte: { tipo: 'slack', canal: '#plataforma', mensagemId: 'pl-1090' } },

  // ══ ANDRÉ VILELA · Dados · o gargalo visto de dentro ═════════════════
  { id: 'ev-a01', pessoaId: 'andre', data: '2026-05-20', texto: 'Construiu a fila dedicada de pedidos que a Carla negociou, em três dias.', fonte: { tipo: 'github', repo: 'aurora/dados', pr: 512 }, episodioId: 'ep-andre-fila' },
  { id: 'ev-a02', pessoaId: 'andre', data: '2026-06-02', texto: 'Aceitou o handoff escrito com Pagamentos e passou a operar por ele.', fonte: { tipo: 'slack', canal: '#dados', mensagemId: 'd-2455' }, episodioId: 'ep-andre-fila' },
  { id: 'ev-a03', pessoaId: 'andre', data: '2026-06-19', texto: 'Publicou a fila de pedidos de Dados em canal aberto, com prazo declarado por item.', fonte: { tipo: 'doc', titulo: 'Fila de Dados — o que está na frente do quê' }, episodioId: 'ep-andre-fila' },

  { id: 'ev-a04', pessoaId: 'andre', data: '2026-02-25', texto: 'Escreveu o catálogo de tabelas que ninguém sabia dizer de onde vinham.', fonte: { tipo: 'doc', titulo: 'Catálogo de dados da Aurora' }, episodioId: 'ep-andre-catalogo' },
  { id: 'ev-a05', pessoaId: 'andre', data: '2026-03-17', texto: 'Marcou as 14 tabelas sem dono e cobrou responsável para cada uma.', fonte: { tipo: 'slack', canal: '#dados', mensagemId: 'd-1980' }, episodioId: 'ep-andre-catalogo' },
  { id: 'ev-a06', pessoaId: 'andre', data: '2026-04-02', texto: 'Aposentou seis tabelas mortas depois de confirmar que nada as consumia.', fonte: { tipo: 'github', repo: 'aurora/dados', pr: 470 }, episodioId: 'ep-andre-catalogo' },

  { id: 'ev-a07', pessoaId: 'andre', data: '2026-04-30', texto: 'Sinalizou por escrito que a fila de Dados tinha 19 pedidos e uma pessoa.', fonte: { tipo: 'slack', canal: '#dados', mensagemId: 'd-2150' } },
  { id: 'ev-a08', pessoaId: 'andre', data: '2026-07-21', texto: 'Entregou o schema de logs seis semanas depois do combinado, com a fila declarada como motivo.', fonte: { tipo: 'github', repo: 'aurora/dados', pr: 561 } },

  // ══ LETÍCIA ALVES · Vendas · densidade média ═════════════════════════
  { id: 'ev-l01', pessoaId: 'leticia', data: '2026-02-09', texto: 'Abriu conversa com a Nexa mapeando quem decide, quem influencia e quem veta.', fonte: { tipo: 'crm', negocio: 'Nexa Logística' }, episodioId: 'ep-leticia-nexa' },
  { id: 'ev-l02', pessoaId: 'leticia', data: '2026-03-19', texto: 'Trouxe engenharia para a call técnica antes de prometer prazo de integração.', fonte: { tipo: 'slack', canal: '#vendas', mensagemId: 'v-0771' }, episodioId: 'ep-leticia-nexa' },
  { id: 'ev-l03', pessoaId: 'leticia', data: '2026-04-23', texto: 'Concedeu 12% de desconto com contrapartida de contrato de 24 meses, registrada.', fonte: { tipo: 'crm', negocio: 'Nexa Logística' }, episodioId: 'ep-leticia-nexa' },
  { id: 'ev-l04', pessoaId: 'leticia', data: '2026-05-08', texto: 'Fechou a Nexa, maior contrato de mid-market do semestre.', fonte: { tipo: 'crm', negocio: 'Nexa Logística' }, episodioId: 'ep-leticia-nexa' },

  { id: 'ev-l05', pessoaId: 'leticia', data: '2026-06-03', texto: 'Renovou a Corvo antecipando a conversa dois meses antes do vencimento.', fonte: { tipo: 'crm', negocio: 'Corvo Pagamentos' }, episodioId: 'ep-leticia-renovacao' },
  { id: 'ev-l06', pessoaId: 'leticia', data: '2026-06-17', texto: 'Levou para produto a objeção de billing que apareceu em quatro contas seguidas.', fonte: { tipo: 'doc', titulo: 'Objeções recorrentes — Q2' }, episodioId: 'ep-leticia-renovacao' },

  { id: 'ev-l07', pessoaId: 'leticia', data: '2026-05-14', texto: 'Perdeu prazo com a Meridiana esperando um relatório de uso que Dados não entregou.', fonte: { tipo: 'slack', canal: '#dados', mensagemId: 'd-2333' }, episodioId: 'ep-leticia-meridiana' },
  { id: 'ev-l08', pessoaId: 'leticia', data: '2026-07-02', texto: 'Fechou a Meridiana com escopo menor, sem o módulo que dependia do relatório.', fonte: { tipo: 'crm', negocio: 'Meridiana Seguros' }, episodioId: 'ep-leticia-meridiana' },

  { id: 'ev-l09', pessoaId: 'leticia', data: '2026-03-05', texto: 'Passou para a Sofia a conta que estava fora do território dela, com contexto escrito.', fonte: { tipo: 'crm', negocio: 'Alta Vista Varejo' } },
  { id: 'ev-l10', pessoaId: 'leticia', data: '2026-07-18', texto: 'Treinou o time novo de vendas no mapeamento de decisor que ela usa.', fonte: { tipo: 'slack', canal: '#vendas', mensagemId: 'v-1240' } },

  // ══ SOFIA BRANDÃO · Vendas ═══════════════════════════════════════════
  { id: 'ev-s01', pessoaId: 'sofia', data: '2026-02-20', texto: 'Bateu a meta do trimestre com 11 contratos de ticket menor.', fonte: { tipo: 'crm', negocio: 'Carteira mid-market Q1' }, episodioId: 'ep-sofia-midmarket' },
  { id: 'ev-s02', pessoaId: 'sofia', data: '2026-04-16', texto: 'Manteve a previsão do início do mês dentro de 5% do fechamento, três meses seguidos.', fonte: { tipo: 'crm', negocio: 'Carteira mid-market Q2' }, episodioId: 'ep-sofia-midmarket' },
  { id: 'ev-s03', pessoaId: 'sofia', data: '2026-05-29', texto: 'Registrou as notas de descoberta nas palavras do cliente, sem tradução para o produto.', fonte: { tipo: 'crm', negocio: 'Praia Grande Bebidas' }, episodioId: 'ep-sofia-midmarket' },

  { id: 'ev-s04', pessoaId: 'sofia', data: '2026-06-10', texto: 'Escreveu o playbook de descoberta que virou material de treinamento.', fonte: { tipo: 'doc', titulo: 'Playbook de descoberta — mid-market' }, episodioId: 'ep-sofia-playbook' },
  { id: 'ev-s05', pessoaId: 'sofia', data: '2026-07-09', texto: 'Rodou o playbook com as duas pessoas que entraram no time em julho.', fonte: { tipo: 'slack', canal: '#vendas', mensagemId: 'v-1190' }, episodioId: 'ep-sofia-playbook' },

  { id: 'ev-s06', pessoaId: 'sofia', data: '2026-03-26', texto: 'Recusou um desconto fora de política e explicou a razão para o cliente por escrito.', fonte: { tipo: 'crm', negocio: 'Alta Vista Varejo' } },

  // ══ DIEGO MOURA · Design · o rastro que o trabalho não deixa ═════════
  { id: 'ev-d01', pessoaId: 'diego', data: '2026-03-10', texto: 'Publicou a nova arquitetura de informação do checkout no Figma.', fonte: { tipo: 'doc', titulo: 'Checkout — arquitetura de informação v3' }, episodioId: 'ep-diego-checkout' },
  {
    id: 'ev-d02', pessoaId: 'diego', data: '2026-04-08',
    texto: 'Rodou nove entrevistas com clientes antes de desenhar qualquer tela, e o recorte saiu delas.',
    fonte: { tipo: 'humano', respondidoPor: 'helena', lacunaId: 'lac-diego-pesquisa' },
    episodioId: 'ep-diego-checkout',
  },
  { id: 'ev-d03', pessoaId: 'diego', data: '2026-05-04', texto: 'A taxa de abandono do checkout caiu de 31% para 19% depois do redesenho.', fonte: { tipo: 'doc', titulo: 'Checkout v3 — resultado' }, episodioId: 'ep-diego-checkout' },

  {
    id: 'ev-d04', pessoaId: 'diego', data: '2026-06-15',
    texto: 'Passou o semestre inteiro sustentando o design system sozinho, sem isso aparecer em lugar nenhum.',
    fonte: { tipo: 'humano', respondidoPor: 'helena', lacunaId: 'lac-diego-sistema' },
  },
  { id: 'ev-d05', pessoaId: 'diego', data: '2026-07-13', texto: 'Revisou o fluxo de cobrança com a Juliana antes de virar código.', fonte: { tipo: 'slack', canal: '#design', mensagemId: 'ds-0330' } },

  // ══ MARINA DUARTE · gestora ══════════════════════════════════════════
  { id: 'ev-m01', pessoaId: 'marina', data: '2026-06-05', texto: 'Escalou a dependência de Dados para a liderança de engenharia, com os dois casos do time dela.', fonte: { tipo: 'doc', titulo: 'Bloqueios de Pagamentos — maio' } },
  { id: 'ev-m02', pessoaId: 'marina', data: '2026-04-20', texto: 'Reorganizou o plantão do time depois de duas semanas seguidas com a mesma pessoa.', fonte: { tipo: 'slack', canal: '#pagamentos', mensagemId: 'p-5195' } },

  // ══ PAULO ROCHA · gestor sem cobertura ═══════════════════════════════
  { id: 'ev-p01', pessoaId: 'paulo', data: '2026-03-02', texto: 'Aprovou o RFC de padronização de erro sem comentários.', fonte: { tipo: 'github', repo: 'aurora/plataforma', pr: 795 } },
  { id: 'ev-p02', pessoaId: 'paulo', data: '2026-07-24', texto: 'Pediu prazo de entrega dos três projetos do time em uma única thread.', fonte: { tipo: 'slack', canal: '#plataforma', mensagemId: 'pl-1410' } },
]

export const eventoPorId = (id: string) => eventos.find((e) => e.id === id)
