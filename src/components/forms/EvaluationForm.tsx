'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { TrackedLink } from '@/components/analytics/TrackedLink'
import { AREA_LABELS, AREA_VALUES, URGENCIA_LABELS, URGENCIA_VALUES } from '@/data/intake'
import { whatsappUrl } from '@/data/site'
import { track } from '@/lib/track'

// 🔒 Cloudflare Turnstile — captcha invisible anti-abuso
const TURNSTILE_SITE_KEY = '0x4AAAAAAD4LdTQMif5no3nF'

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
    gtag?: (...args: unknown[]) => void
  }
}

// Formulario pensado para personas: pocos campos, lenguaje cotidiano.
// El email es opcional (el contacto principal es el teléfono).
const formSchema = z.object({
  name: z.string().min(2, 'Escribí tu nombre.'),
  phone: z.string().min(6, 'Dejanos un teléfono para poder llamarte.'),
  email: z.union([z.literal(''), z.string().email('El email no es válido.')]),
  localidad: z.string().max(100, 'Es demasiado largo.').optional(),
  area: z.string().min(1, 'Elegí sobre qué es tu consulta.'),
  urgency: z.string().min(1, 'Elegí una opción.'),
  message: z
    .string()
    .min(10, 'Contanos un poco más para poder orientarte.')
    .max(800, 'Máximo 800 caracteres. Podés darnos más detalle cuando te llamemos.'),
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
  const formIniciado = useRef(false)

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

    return () => {
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.remove(turnstileWidgetId.current)
        turnstileWidgetId.current = null
      }
    }
  }, [turnstileReady])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // 🛠️ OPTIMIZACIÓN INP: validar únicamente al perder el foco del campo
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      localidad: '',
      area: '',
      urgency: '',
      message: '',
      website: '',
    },
  })

  // Mide cuántas personas empiezan a completar el formulario (una sola vez).
  function alEmpezar() {
    if (formIniciado.current) return
    formIniciado.current = true
    track('form_start', { form: 'evaluacion' })
  }

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
        throw new Error(responseData.error || 'No pudimos enviar tu consulta. Intentá de nuevo.')
      }

      setWarnings(responseData.warnings ?? [])
      setIsSuccess(true)
      track('generate_lead', { form: 'evaluacion', area: data.area, urgencia: data.urgency })
      reset()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error de comunicación. Intentá de nuevo.')
      setTurnstileToken('')
    }
  }

  // El token de Turnstile se usa una sola vez: si el envío falló, pedimos uno nuevo.
  useEffect(() => {
    if (serverError && window.turnstile && turnstileWidgetId.current) {
      window.turnstile.reset(turnstileWidgetId.current)
    }
  }, [serverError])

  // 🎯 PANTALLA DE ÉXITO
  if (isSuccess) {
    const wa = whatsappUrl('Hola, acabo de enviar mi consulta desde la web.')
    return (
      <div className="glass glass-strong rounded-[28px] p-8 md:rounded-[36px] md:p-16 min-h-[450px] flex flex-col justify-center items-center text-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none" />
        <div className="max-w-xl space-y-6 relative z-10">
          <h3 className="text-[22px] font-bold tracking-[0.15em] text-white uppercase sm:text-[26px]">
            Consulta recibida.
          </h3>
          <p className="text-[14px] leading-relaxed text-zinc-400 font-light md:text-[15px] text-justify md:text-center">
            Te vamos a llamar al teléfono que dejaste dentro de las próximas 24 horas hábiles. Mientras tanto, guardá
            los mensajes, documentos y notificaciones relacionados con tu caso.
          </p>
          {wa ? (
            <TrackedLink
              href={wa}
              evento="contact_click"
              params={{ method: 'whatsapp', location: 'form_success' }}
              external
              className="inline-flex text-[14px] font-semibold text-[var(--accent-bright)] underline-offset-4 hover:underline"
            >
              Escribinos por WhatsApp
            </TrackedLink>
          ) : null}
        </div>
      </div>
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
        data-glass
        onSubmit={handleSubmit(onSubmit)}
        onFocusCapture={alEmpezar}
        className="glass glass-strong rounded-[28px] p-6 md:rounded-[36px] md:p-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        <div className="grid gap-6 relative z-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre y apellido *</Label>
              <Input id="name" autoComplete="name" {...register('name')} placeholder="Tu nombre" />
              {errors.name && <p className="text-[13px] text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono (mejor si es WhatsApp) *</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                {...register('phone')}
                placeholder="+54 9 221 ..."
              />
              {errors.phone && <p className="text-[13px] text-red-400">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email (opcional)</Label>
              <Input id="email" type="email" autoComplete="email" {...register('email')} placeholder="tu@email.com" />
              {errors.email && <p className="text-[13px] text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="localidad">Ciudad o partido (opcional)</Label>
              <Input id="localidad" {...register('localidad')} placeholder="Ej.: La Plata, Berisso, Ensenada" />
              {errors.localidad && <p className="text-[13px] text-red-400">{errors.localidad.message}</p>}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="area">¿Sobre qué es tu consulta? *</Label>
              <Select id="area" {...register('area')}>
                <option value="">Elegir una opción...</option>
                {AREA_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {AREA_LABELS[v]}
                  </option>
                ))}
              </Select>
              {errors.area && <p className="text-[13px] text-red-400">{errors.area.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">¿Qué tan urgente es? *</Label>
              <Select id="urgency" {...register('urgency')}>
                <option value="">Elegir una opción...</option>
                {URGENCIA_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {URGENCIA_LABELS[v]}
                  </option>
                ))}
              </Select>
              {errors.urgency && <p className="text-[13px] text-red-400">{errors.urgency.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Contanos qué pasó *</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Con tus palabras: qué pasó y qué necesitás. No hace falta que sea técnico (máx. 800 caracteres)."
            />
            {errors.message && <p className="text-[13px] text-red-400">{errors.message.message}</p>}
          </div>

          {/* Honey pot */}
          <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />

          {/* 🔒 Widget de Turnstile (captcha invisible) */}
          <div ref={turnstileContainerRef} />

          <div className="text-justify border-t border-white/[0.05] pt-4">
            <p className="text-[12px] text-[var(--text-muted)] leading-relaxed font-light">
              Enviar este formulario no implica que aceptemos el caso ni genera una relación profesional hasta que lo
              conversemos. Usamos tus datos solo para responder tu consulta (ver{' '}
              <Link href="/politica-de-privacidad" className="underline underline-offset-4 hover:text-white">
                Política de Privacidad
              </Link>
              ). Respuesta en un plazo máximo de 24 horas hábiles.
            </p>
          </div>

          <div className="pt-2 space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              data-glass
              className="glass-btn glass-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar mi consulta'}
            </button>

            {warnings.length > 0 && (
              <div className="rounded-[10px] border border-[var(--accent-mute)] bg-[var(--accent-mute)]/10 p-4">
                <p className="text-[14px] font-semibold text-[var(--accent-bright)]">Observaciones:</p>
                <ul className="mt-2 space-y-1 text-[13px] text-[var(--text-secondary)]">
                  {warnings.map((warning) => (
                    <li key={warning}>• {warning}</li>
                  ))}
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
