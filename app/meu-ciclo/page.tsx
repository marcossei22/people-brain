import { MeuCiclo } from './meu-ciclo'

/**
 * `/meu-ciclo` — JORNADAS C4 e C5.
 *
 * Rota sem parâmetro: o alvo é sempre quem está olhando, e é isso que faz a
 * tela não precisar de gate de permissão nenhum além do próprio viewer.
 * `/ciclo/[id]` existe para o outro lado do balcão e recusa quem não assina o
 * fechamento daquela pessoa; aqui não há id para errar.
 */
export default function PaginaMeuCiclo() {
  return <MeuCiclo />
}
