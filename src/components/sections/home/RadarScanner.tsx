'use client'

import { useState } from 'react'
import { FadeIn } from '@/components/motion/FadeIn'

export function RadarScanner() {
  const [formData, setFormData] = useState({ cuit: '', nombre: '', telefono: '' })
  const [loading, setLoading] = useState(false)
  const [reporte, setReporte] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.cuit || !formData.nombre || !formData.telefono) {
      setError('Todos los parámetros de validación del directivo son obligatorios.')
      return
    }

    setLoading(true)
    setError(null)
    setReporte(null)

    try {
      const response = await fetch('https://long-shadow-2d55.retamalmarcelo078.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.analisis) {
        // Filtro de seguridad: Borramos de raíz cualquier asterisco de formato residual antes de renderizar
        const formatoLimpio = data.analisis.replace(/\*/g, '')
        setReporte(formatoLimpio)
      } else {
        setError('No se pudo establecer el puente de diagnóstico perimetral.')
      }
    } catch (err) {
      setError('Fallo crítico de comunicación con el búnker analítico.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-[#07090d] border border-red-950/40 rounded-2xl shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-900/60 to-transparent" />
      
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold animate-pulse">
          • ACCESO RESTRINGIDO - ANÁLISIS DE RIESGO CORPORATIVO
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-mono">
          VINDEX RADAR
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Módulo de contingencia patrimonial. Verificación automatizada de pasivos bancarios consolidados, alertas de asedio judicial y medidas cautelares en Argentina.
        </p>
      </div>

      <form onSubmit={handleScan} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            required
            placeholder="Nombre Completo del Director / CEO"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full px-4 py-3 bg-black/60 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-red-900 font-mono text-sm transition-colors"
            disabled={loading}
          />
          <input
            type="text"
            required
            placeholder="Teléfono Corporativo Directo"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="w-full px-4 py-3 bg-black/60 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-red-900 font-mono text-sm transition-colors"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <input
            type="text"
            required
            maxLength={11}
            placeholder="Ingrese CUIT Corporativo a Evaluar (Solo números)"
            value={formData.cuit}
            onChange={(e) => setFormData({ ...formData, cuit: e.target.value.replace(/\D/g, '') })}
            className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-red-700 text-center font-mono tracking-widest text-lg transition-colors shadow-inner"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 text-sm font-bold bg-red-950/30 text-red-400 border border-red-900/50 rounded-xl hover:bg-red-900 hover:text-white transition-all disabled:opacity-40 font-mono tracking-widest uppercase cursor-pointer shadow-[0_4px_30px_rgba(153,27,27,0.1)]"
        >
          {loading ? '[EJECUTANDO AUDITORÍA PERIMETRAL...]' : '[INICIAR EVALUACIÓN DE CONTINGENCIA]'}
        </button>
      </form>

      {/* PANTALLA TÉCNICA DE DICTAMEN */}
      {(loading || reporte || error) && (
        <div className="mt-8 pt-6 border-t border-gray-900 font-mono text-xs">
          {loading && (
            <div className="text-center py-6 space-y-2 text-red-500/60 animate-pulse">
              <p>[SISTEMA CORE VINDEX: CONECTADO]</p>
              <p>Rastreando posiciones en la Central de Deudores del BCRA...</p>
              <p>Mapeando expedientes en los Fueros Comerciales de la Nación...</p>
              <p>Compilando matriz pericial de riesgo estructural...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-center">
              [SISTEMA ERROR]: {error}
            </div>
          )}

          {reporte && (
            <FadeIn>
              <div className="p-6 bg-black border border-red-900/30 rounded-xl text-gray-300 space-y-4 shadow-2xl relative">
                <div className="flex justify-between items-center text-[10px] text-red-500 border-b border-gray-900 pb-2 mb-4 font-bold tracking-widest">
                  <span>DOCUMENTO TÉCNICO EVALUATIVO</span>
                  <span>ESTADO: RESERVADO / CONFIDENCIAL</span>
                </div>
                <div className="text-gray-300 font-sans text-sm leading-relaxed whitespace-pre-line">
                  {reporte}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      )}
    </div>
  )
}