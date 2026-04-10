'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'

const formSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio y debe ser válido.'),
  email: z.string().email('Dirección de email inválida.'),
  phone: z.string().min(6, 'El teléfono es obligatorio.'),
  locality: z.string().min(2, 'La localidad es obligatoria.'),
  province: z.string().min(1, 'La provincia es obligatoria.'),
  status: z.string().optional(),
  urgency: z.string().optional(),
  message: z.string().min(10, 'La descripción del escenario requiere mayor detalle.'),
  website: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const provinceOptions = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
]

export function EvaluationForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState('')
  const [warnings, setWarnings] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '', email: '', phone: '', locality: '', province: '',
      status: '', urgency: '', message: '', website: ''
    }
  })

  async function onSubmit(data: FormValues) {
    setServerError('')
    setWarnings([])
    setIsSuccess(false)

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
    }
  }

  return (
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
            <Label htmlFor="urgency">Nivel de Riesgo (Prioridad)</Label>
            <Select id="urgency" {...register('urgency')}>
              <option value="">Seleccionar nivel...</option>
              <option value="baja">Riesgo Bajo (Estratégico)</option>
              <option value="media">Riesgo Medio (Contingencia)</option>
              <option value="alta">Riesgo Alto (Exposición Crítica)</option>
              <option value="urgente">Urgencia Máxima (Plazos inminentes)</option>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="locality">Sede / Localidad *</Label>
            <Input id="locality" {...register('locality')} placeholder="Jurisdicción local" />
            {errors.locality && <p className="text-[13px] text-red-400">{errors.locality.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Provincia *</Label>
            <Select id="province" {...register('province')}>
              <option value="">Seleccionar jurisdicción...</option>
              {provinceOptions.map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </Select>
            {errors.province && <p className="text-[13px] text-red-400">{errors.province.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statu Quo (Estado del Conflicto)</Label>
          <Input 
            id="status" 
            {...register('status')} 
            placeholder="Ej.: mediación judicial en curso, medida cautelar notificada..." 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Descripción Estructural del Escenario *</Label>
          <Textarea 
            id="message" 
            {...register('message')} 
            placeholder="Describa el núcleo del conflicto, los posibles daños patrimoniales y las partes involucradas..." 
          />
          {errors.message && <p className="text-[13px] text-red-400">{errors.message.message}</p>}
        </div>

        {/* Honey pot */}
        <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="pt-4 space-y-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-[8px] bg-[var(--accent)] px-8 py-4 text-[15px] font-bold text-[var(--bg-deep)] transition-all duration-300 hover:-translate-y-[2px] hover:bg-[var(--accent-bright)] hover:shadow-lg hover:shadow-[var(--accent-mute)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? 'Cifrando envío...' : 'Someter Caso a Evaluación Estricta'}
          </button>

          {isSuccess && (
            <div className="rounded-[10px] bg-green-500/10 border border-green-500/20 p-4">
              <p className="text-[14px] font-medium text-green-400">
                El caso se encuentra bajo análisis de nuestra estructura central. Responderemos oportunamente.
              </p>
            </div>
          )}

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
  )
}