import type { ReactNode } from 'react'
import { Label } from '@/components/ui/Label'

/** Atributos que <Field> le pasa al control para vincularlo con su etiqueta, ayuda y error. */
export type FieldControlProps = {
  id: string
  'aria-invalid'?: true
  'aria-required'?: true
  'aria-describedby'?: string
}

type FieldProps = {
  /** Se usa como `id` del control y como prefijo de los ids de ayuda y error. */
  id: string
  label: ReactNode
  /** Marca visual "*" (oculta a lectores de pantalla) y `aria-required` en el control. */
  required?: boolean
  /** Texto de ayuda debajo del control (ej.: contador de caracteres). */
  hint?: ReactNode
  /** Mensaje de error. Si está presente, el control queda `aria-invalid`. */
  error?: string
  className?: string
  /** Render prop: recibe los atributos de accesibilidad y devuelve el control. */
  children: (control: FieldControlProps) => ReactNode
}

/**
 * Campo de formulario accesible: etiqueta + control + ayuda + error, con los
 * ids y atributos ARIA ya conectados. El control lo elige quien lo usa
 * (Input, Select, Textarea), así que funciona con react-hook-form sin magia:
 *
 *   <Field id="email" label="Email" error={errors.email?.message}>
 *     {(control) => <Input type="email" {...control} {...register('email')} />}
 *   </Field>
 */
export function Field({ id, label, required, hint, error, className = 'space-y-2', children }: FieldProps) {
  const idHint = hint ? `${id}-ayuda` : undefined
  const idError = error ? `${id}-error` : undefined
  const describedBy = [idHint, idError].filter(Boolean).join(' ') || undefined

  return (
    <div className={className}>
      <Label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </Label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {hint ? (
        <p id={idHint} className="text-[12px] text-[var(--text-muted)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={idError} className="text-[13px] text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
}
