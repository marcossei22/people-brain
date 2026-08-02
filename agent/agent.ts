import { defineAgent } from 'eve'

export default defineAgent({
  model: 'anthropic/claude-sonnet-5',
  modelOptions: {
    // O chat é a única coisa não-determinística e está na câmera
    // (ARQUITETURA §10). Respostas precisam sair parecidas entre tomadas.
    providerOptions: { anthropic: { temperature: 0.2 } },
  },
})
