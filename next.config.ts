import type { NextConfig } from 'next'
import { withEve } from 'eve/next'

const nextConfig: NextConfig = {
  // O indicador de dev fica exatamente em cima do seletor de persona, que é o
  // elemento mais demonstrado do protótipo. Movido pro canto oposto.
  devIndicators: { position: 'bottom-right' },
}

// Monta o agente de `agent/` nas rotas /eve/v1/* da mesma origem: um dev
// server, um deploy, sem CORS e sem env de URL para manter em sincronia.
export default withEve(nextConfig)
