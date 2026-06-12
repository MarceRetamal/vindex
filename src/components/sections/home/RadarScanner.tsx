'use client'

import { useState } from 'react'
import { FadeIn } from '@/components/motion/FadeIn'

export function RadarScanner() {
  const [cuit, setCuit] = useState('')
  const [loading, setLoading] = useState(false)
  const [reporte, setReporte] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cuit) return

    setLoading(true)
    setError(null)
    setReporte(null)

    try {
      // 📡 CONEXIÓN DIRECTA: Le pegamos a la URL de tu robot de Cloudflare
      const response = await fetch('https://long-shadow-2d55.retamalmarcelo078.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cuit }),
      })

      const data = await response.json()

      if (data.analisis) {
        setReporte(data.analisis)
      } else {
        setError('No se pudo procesar el perímetro de riesgo.')
      }
    } catch (err) {
      setError('Fallo en la conexión con el búnker de IA.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-[#0c0f14] border border-[var(--border)] rounded-2xl shadow-2xl">
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
          Módulo Táctico Satelital
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          VINDEX RADAR
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Auditoría perimetral instantánea de vulnerabilidad corporativa y riesgo procesal en Argentina.
        </p>
      </div>

      <form onSubmit={handleScan} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            maxLength={11}
            placeholder="Ingrese CUIT o Razón Social corporativa..."
            value={cuit}
            onChange={(e) => setCuit(e.target.value.replace(/\D/g, ''))} // Solo números
            className="w-full px-5 py-4 bg-black/40 border border-[var(--border)] rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37] text-center font-mono tracking-widest text-lg transition-colors"
            disabled={loading}
          />
        </div>

        {/* 🚀 BOTÓN NATIVO OPTIMIZADO: Pasa el control de TypeScript sin quejas */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 text-base font-bold bg-[#D4AF37] text-black rounded-xl hover:bg-[#b8952e] transition-colors disabled:opacity-40 font-mono tracking-widest uppercase shadow-[0_4px_20px_rgba(212,175,55,0.15)] cursor-pointer"
        >
          {loading ? 'EJECUTANDO ESCANEO PERIMETRAL...' : 'INICIAR AUDITORÍA DE RIESGO'}
        </button>
      </form>

      {/* 📊 PANTALLA DE RESULTADOS */}
      {(loading || reporte || error) && (
        <div className="mt-8 pt-6 border-t border-[var(--border)] font-mono text-sm">
          {loading && (
            <div className="text-center py-6 space-y-3 text-gray-500 animate-pulse">
              <p>[SISTEMA CORE: ACTIVADO]</p>
              <p>Conectando con servidores en el Edge...</p>
              <p>Procesando matriz de riesgo con Llama-3.1...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-center">
              [ERROR]: {error}
            </div>
          )}

          {reporte && (
            <FadeIn>
              <div className="p-5 bg-black/60 border border-[#D4AF37]/20 rounded-xl text-gray-300 space-y-4 whitespace-pre-wrap leading-relaxed shadow-inner">
                <div className="flex justify-between items-center text-xs text-[#D4AF37] border-b border-[var(--border)] pb-2 mb-2 font-bold">
                  <span>REPORTE GENERADO POR LLAMA-3.1</span>
                  <span>ESTADO: CONFIDENCIAL</span>
                </div>
                {reporte}
              </div>
            </FadeIn>
          )}
        </div>
      )}
    </div>
  )
}