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
      setError('Todos los campos del protocolo de seguridad son obligatorios.')
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
        setReporte(data.analisis)
        // 💡 AQUÍ ES DONDE TE QUEDÁS CON LOS DATOS:
        console.log("NUEVO LEAD DE ALTA PRECISIÓN CAPTURADO:", formData)
        // (Acá en el futuro asociamos un webhook para que te llegue un mail automático con el CUIT/Teléfono de este tipo)
      } else {
        setError('Acceso denegado en el procesamiento perimetral.')
      }
    } catch (err) {
      setError('Fallo de conexión con el búnker analítico.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-[#080a0f] border border-red-950/30 rounded-2xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
      
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold animate-pulse">
          • ALERTA DE VULNERABILIDAD INSTITUCIONAL
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-mono">
          VINDEX RADAR ENGINE
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Módulo restringido para directivos. Evaluación perimetral de riesgo corporativo, asedio procesal y medidas cautelares bancarias en Argentina.
        </p>
      </div>

      <form onSubmit={handleScan} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre completo del Directivo / CEO"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="w-full px-4 py-3 bg-black/60 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-red-900 font-mono text-sm transition-colors"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Teléfono Directo de Contacto"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="w-full px-4 py-3 bg-black/60 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-red-900 font-mono text-sm transition-colors"
            disabled={loading}
          />
        </div>

        <div className="relative">
          <input
            type="text"
            maxLength={11}
            placeholder="Ingrese CUIT de la Firma Corporativa (Solo números)"
            value={formData.cuit}
            onChange={(e) => setFormData({ ...formData, cuit: e.target.value.replace(/\D/g, '') })}
            className="w-full px-5 py-4 bg-black border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-red-700 text-center font-mono tracking-widest text-lg transition-colors shadow-inner"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 text-sm font-bold bg-red-950/40 text-red-400 border border-red-900/60 rounded-xl hover:bg-red-900 hover:text-white transition-all disabled:opacity-40 font-mono tracking-widest uppercase cursor-pointer shadow-[0_4px_30px_rgba(153,27,27,0.1)]"
        >
          {loading ? '[EJECUTANDO ESCANEO DE AMENAZAS...]' : '[INICIAR AUDITORÍA DE CONTINGENCIA]'}
        </button>
      </form>

      {/* RESULTADOS PROFESIONALES */}
      {(loading || reporte || error) && (
        <div className="mt-8 pt-6 border-t border-gray-900 font-mono text-xs">
          {loading && (
            <div className="text-center py-6 space-y-2 text-red-500/60 animate-pulse">
              <p>[SISTEMA AMENAZAS: CONECTADO]</p>
              <p>Rastreando bases consolidadas del BCRA y fueros judiciales...</p>
              <p>Mapeando medidas cautelares y perfiles de deudores...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 text-center">
              [SISTEMA ERROR]: {error}
            </div>
          )}

          {reporte && (
            <FadeIn>
              <div className="p-6 bg-black border border-red-900/30 rounded-xl text-gray-400 space-y-4 whitespace-pre-wrap leading-relaxed shadow-2xl relative">
                <div className="flex justify-between items-center text-[10px] text-red-500 border-b border-gray-900 pb-2 mb-2 font-bold tracking-widest">
                  <span>DOCUMENTO INTERNO DE SEGUIMIENTO</span>
                  <span>ESTADO: RESERVADO</span>
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