'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'

// 🔒 Cloudflare Turnstile — captcha invisible anti-abuso
const TURNSTILE_SITE_KEY = '0x4AAAAAAD4LdTQMif5no3nF'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
    }
  }
}

const formSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio y debe ser válido.'),
  email: z.string().email('Dirección de email inválida.'),
  phone: z.string().min(6, 'El teléfono es obligatorio.'),
  jurisdiction: z.string().min(2, 'La jurisdicción principal del conflicto es obligatoria.'),
  urgency: z.string().min(1, 'Debe seleccionar el estado técnico de los plazos.'),
  message: z.string()
    .min(10, 'La descripción del escenario requiere mayor detalle.')
    .max(800, 'La síntesis técnica estructural no debe superar los 800 caracteres.'),
  website: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function EvaluationForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState('')
  const [warnings, setWarnings] = useState<string[]>([])
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetId = useRef<string | null>(null)

  useEffect(() => {
    if (!turnstileReady || !turnstileContainerRef.current || !window.turnstile || turnstileWidgetId.current) {
      return
    }

    turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token: string) => setTurnstileToken(token),
      'expired-callback': () => setTurnstileToken(''),
      'error-callback': () => setTurnstileToken(''),
    })
  }, [turnstileReady])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // 🛠️ OPTIMIZACIÓN CRÍTICA INP: Validar únicamente al perder el foco del campo
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '', email: '', phone: '', jurisdiction: '',
      urgency: '', message: '', website: ''
    }
  })

  async function onSubmit(data: FormValues) {
    setServerError('')
    setWarnings([])
    setIsSuccess(false)

    if (!turnstileToken) {
      setServerError('Esperá un instante a que termine la verificación de seguridad e intentá de nuevo.')
      return
    }

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
      })

      const responseData = (await response.json()) as {
        ok: boolean
        error?: string
        warnings?: string[]
      }

      if (!response.ok || !responseData.ok) {
        throw new Error(responseData.error || 'Falla estructural al transmitir el caso.')
      }

      setWarnings(responseData.warnings ?? [])
      setIsSuccess(true)
      reset()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error interno de comunicación.')
      setTurnstileToken('')
    }
  }

  // El token de Turnstile se usa una sola vez: si el envío falló, pedimos uno nuevo.
  useEffect(() => {
    if (serverError && window.turnstile && turnstileWidgetId.current) {
      window.turnstile.reset(turnstileWidgetId.current)
    }
  }, [serverError])

  // 🎯 PANTALLA DE ÉXITO: MODO BÚNKER (Sustituye todo el formulario para generar alta tensión psicológica)
  if (isSuccess) {
    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
        />
        <div className="rounded-[20px] border border-[var(--border-strong)] bg-black p-8 md:rounded-[24px] md:p-16 shadow-2xl min-h-[450px] flex flex-col justify-center items-center text-center relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none" />
          <div className="max-w-xl space-y-6 relative z-10">
            <h3 className="text-[22px] font-bold tracking-[0.15em] text-white uppercase sm:text-[26px]">
              Análisis en ejecución.
            </h3>
            <p className="text-[14px] leading-relaxed text-zinc-400 font-light md:text-[15px] text-justify md:text-center">
              Los datos ingresados han sido derivados al área de estrategia para evaluar la viabilidad de la intervención. 
              Si el escenario cumple con los criterios de admisibilidad institucional del gabinete, se abrirá un canal 
              oficial de comunicación en su línea telefónica registrada dentro de los próximos minutos.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setTurnstileReady(true)}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[20px] border border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 md:rounded-[24px] md:p-10 shadow-2xl relative overflow-hidden"
      >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="grid gap-6 relative z-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre y Apellido *</Label>
            <Input id="name" {...register('name')} placeholder="Representante o titular" />
            {errors.name && <p className="text-[13px] text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input id="email" type="email" {...register('email')} placeholder="contacto@empresa.com" />
            {errors.email && <p className="text-[13px] text-red-400">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono Directo *</Label>
            <Input id="phone" {...register('phone')} placeholder="+54 9 11 ..." />
            {errors.phone && <p className="text-[13px] text-red-400">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Estado de Plazos Legales *</Label>
            <Select id="urgency" {...register('urgency')}>
              <option value="">Seleccionar estado...</option>
              <option value="plazo_corriendo">Plazo judicial / procesal corriendo (Urgente)</option>
              <option value="medida_notificada">Medida cautelar o intimación notificada</option>
              <option value="conflicto_preventivo">Conflicto abierto sin curso judicial (Fase preventiva)</option>
              <option value="auditoria_estrategia">Auditoría de riesgos o diseño de estrategia de fondo</option>
            </Select>
            {errors.urgency && <p className="text-[13px] text-red-400">{errors.urgency.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jurisdiction">Jurisdicción Principal del Conflicto *</Label>
          <Input 
            id="jurisdiction" 
            {...register('jurisdiction')} 
            placeholder="Ej.: Justicia Federal, Tribunales Ordinarios CABA, PBA, Arbitraje Internacional..." 
          />
          {errors.jurisdiction && <p className="text-[13px] text-red-400">{errors.jurisdiction.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Descripción Estructural del Escenario *</Label>
          <Textarea 
            id="message" 
            {...register('message')} 
            placeholder="Describa el núcleo del conflicto, la contraparte y los activos o estructuras comprometidas en forma sintética (máx. 800 caracteres)..." 
          />
          {errors.message && <p className="text-[13px] text-red-400">{errors.message.message}</p>}
        </div>

        {/* Honey pot */}
        <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />

        {/* 🔒 Widget de Turnstile (captcha invisible) */}
        <div ref={turnstileContainerRef} />

        {/* 🏛️ DISCLAIMER INSTITUCIONAL DE ADMISIBILIDAD */}
        <div className="text-justify border-t border-white/[0.05] pt-4">
          <p className="text-[12px] text-zinc-500 leading-relaxed font-light">
            La transmisión de estos datos inicia el protocolo preliminar de análisis de admisibilidad técnica de VINDEX LEGAL. 
            El envío del formulario no constituye la aceptación del caso ni genera relación profesional alguna hasta tanto 
            la firma emita un dictamen de viabilidad estratégica formal e informe las condiciones de contratación.
          </p>
        </div>

        <div className="pt-2 space-y-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-[8px] bg-[var(--accent)] px-8 py-4 text-[15px] font-bold text-[var(--bg-deep)] transition-all duration-300 hover:-translate-y-[2px] hover:bg-[var(--accent-bright)] hover:shadow-lg hover:shadow-[var(--accent-mute)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? 'Cifrando envío...' : 'Someter Caso a Evaluación Estricta'}
          </button>

          {warnings.length > 0 && (
            <div className="rounded-[10px] border border-[var(--accent-mute)] bg-[var(--accent-mute)]/10 p-4">
              <p className="text-[14px] font-semibold text-[var(--accent-bright)]">Observaciones de validación:</p>
              <ul className="mt-2 space-y-1 text-[13px] text-[var(--text-secondary)]">
                {warnings.map((warning) => <li key={warning}>• {warning}</li>)}
              </ul>
            </div>
          )}

          {serverError && (
            <div className="rounded-[10px] bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-[14px] text-red-400 font-medium">{serverError}</p>
            </div>
          )}
        </div>
      </div>
    </form>
    </>
  )
}