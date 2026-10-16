'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Field } from '@/components/ui/Field'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { TrackedLink } from '@/components/analytics/TrackedLink'
import { AREA_LABELS, AREA_VALUES, LIMITES, URGENCIA_LABELS, URGENCIA_VALUES } from '@/data/intake'
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
  name: z.string().min(LIMITES.nombreMin, 'Escribí tu nombre.').max(LIMITES.nombreMax, 'Es demasiado largo.'),
  phone: z
    .string()
    .min(LIMITES.telefonoMin, 'Dejanos un teléfono para poder llamarte.')
    .max(LIMITES.telefonoMax, 'Es demasiado largo.'),
  email: z.union([z.literal(''), z.string().email('El email no es válido.').max(LIMITES.emailMax, 'Es demasiado largo.')]),
  localidad: z.string().max(LIMITES.localidadMax, 'Es demasiado largo.').optional(),
  area: z.string().min(1, 'Elegí sobre qué es tu consulta.'),
  urgency: z.string().min(1, 'Elegí una opción.'),
  message: z
    .string()
    .min(LIMITES.mensajeMin, 'Contanos un poco más para poder orientarte.')
    .max(LIMITES.mensajeMax, `Máximo ${LIMITES.mensajeMax} caracteres. Podés darnos más detalle cuando te llamemos.`),
  website: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function EvaluationForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileReady, setTurnstileReady] = useState(false)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetId = useRef<string | null>(null)
  const formIniciado = useRef(false)
  const exitoRef = useRef<HTMLHeadingElement>(null)

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    // 🛠️ OPTIMIZACIÓN INP: la primera validación es al perder el foco del campo.
    mode: 'onBlur',
    // Después de un intento de envío, el error se borra mientras se escribe.
    // Con 'onBlur' el error recién desaparecía al hacer clic en "Enviar": el
    // botón subía ~28 px a mitad del clic y el envío se perdía.
    reValidateMode: 'onChange',
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

      const responseData = (await response.json().catch(() => ({ ok: false }))) as {
        ok: boolean
        error?: string
      }

      if (!response.ok || !responseData.ok) {
        throw new Error(responseData.error || 'No pudimos enviar tu consulta. Intentá de nuevo.')
      }

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

  // Al pasar a la pantalla de éxito, el foco va al título para que el lector
  // de pantalla la anuncie (el formulario que tenía el foco ya no existe).
  useEffect(() => {
    if (isSuccess) exitoRef.current?.focus()
  }, [isSuccess])

  const largoMensaje = useWatch({ control, name: 'message' })?.length ?? 0

  // 🎯 PANTALLA DE ÉXITO
  if (isSuccess) {
    const wa = whatsappUrl('Hola, acabo de enviar mi consulta desde la web.')
    return (
      <div
        role="status"
        className="glass glass-strong rounded-[28px] p-8 md:rounded-[36px] md:p-16 min-h-[450px] flex flex-col justify-center items-center text-center relative overflow-hidden animate-fade-in"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none" />
        <div className="max-w-xl space-y-6 relative z-10">
          <h3
            ref={exitoRef}
            tabIndex={-1}
            className="text-[22px] font-bold tracking-[0.15em] text-white uppercase focus:outline-none sm:text-[26px]"
          >
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
        noValidate
        aria-label="Formulario de consulta"
        className="glass glass-strong rounded-[28px] p-6 md:rounded-[36px] md:p-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        <div className="grid gap-6 relative z-10">
          <div className="grid gap-6 md:grid-cols-2">
            <Field id="name" label="Nombre y apellido" required error={errors.name?.message}>
              {(control) => (
                <Input {...control} autoComplete="name" maxLength={LIMITES.nombreMax} placeholder="Tu nombre" {...register('name')} />
              )}
            </Field>

            <Field id="phone" label="Teléfono (mejor si es WhatsApp)" required error={errors.phone?.message}>
              {(control) => (
                <Input
                  {...control}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={LIMITES.telefonoMax}
                  placeholder="+54 9 221 ..."
                  {...register('phone')}
                />
              )}
            </Field>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field id="email" label="Email (opcional)" error={errors.email?.message}>
              {(control) => (
                <Input
                  {...control}
                  type="email"
                  autoComplete="email"
                  maxLength={LIMITES.emailMax}
                  placeholder="tu@email.com"
                  {...register('email')}
                />
              )}
            </Field>

            <Field id="localidad" label="Ciudad o partido (opcional)" error={errors.localidad?.message}>
              {(control) => (
                <Input
                  {...control}
                  autoComplete="address-level2"
                  maxLength={LIMITES.localidadMax}
                  placeholder="Ej.: La Plata, Berisso, Ensenada"
                  {...register('localidad')}
                />
              )}
            </Field>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field id="area" label="¿Sobre qué es tu consulta?" required error={errors.area?.message}>
              {(control) => (
                <Select {...control} {...register('area')}>
                  <option value="">Elegir una opción...</option>
                  {AREA_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {AREA_LABELS[v]}
                    </option>
                  ))}
                </Select>
              )}
            </Field>

            <Field id="urgency" label="¿Qué tan urgente es?" required error={errors.urgency?.message}>
              {(control) => (
                <Select {...control} {...register('urgency')}>
                  <option value="">Elegir una opción...</option>
                  {URGENCIA_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {URGENCIA_LABELS[v]}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>

          <Field
            id="message"
            label="Contanos qué pasó"
            required
            error={errors.message?.message}
            hint={
              <span className={largoMensaje > LIMITES.mensajeMax ? 'text-red-400' : undefined}>
                {largoMensaje} / {LIMITES.mensajeMax} caracteres
              </span>
            }
          >
            {(control) => (
              <Textarea
                {...control}
                placeholder={`Con tus palabras: qué pasó y qué necesitás. No hace falta que sea técnico (máx. ${LIMITES.mensajeMax} caracteres).`}
                {...register('message')}
              />
            )}
          </Field>

          {/* Honeypot: invisible para personas y lectores de pantalla; si llega completo, es un bot. */}
          <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

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
            <Button type="submit" loading={isSubmitting} loadingLabel="Enviando..." arrow={false}>
              Enviar mi consulta
            </Button>

            {serverError ? <Alert tone="error">{serverError}</Alert> : null}
          </div>
        </div>
      </form>
    </>
  )
}
