import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // O indicador de dev fica exatamente em cima do seletor de persona, que é o
  // elemento mais demonstrado do protótipo. Movido pro canto oposto.
  devIndicators: { position: 'bottom-right' },
}

export default nextConfig
