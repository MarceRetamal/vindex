// Opciones del formulario de consulta. Se usan tanto en el formulario
// (navegador) como en la validación del servidor, para que nunca se
// desincronicen. Si cambiás una opción, se cambia acá y listo.

export const AREA_VALUES = [
  'familia',
  'transito',
  'laboral',
  'art',
  'amparo',
  'penal',
  'sucesion',
  'otro',
] as const

export const URGENCIA_VALUES = ['urgente', 'notificado', 'reciente', 'antiguo'] as const

export type AreaValue = (typeof AREA_VALUES)[number]
export type UrgenciaValue = (typeof URGENCIA_VALUES)[number]

export const AREA_LABELS: Record<AreaValue, string> = {
  familia: 'Familia (cuota alimentaria, contacto con hijos, divorcio)',
  transito: 'Accidente de tránsito',
  laboral: 'Despido o problema laboral',
  art: 'Accidente de trabajo o ART',
  amparo: 'Salud, discapacidad, IOMA o sentencia incumplida',
  penal: 'Denuncia o causa penal',
  sucesion: 'Sucesión o herencia',
  otro: 'Otro tema',
}

export const URGENCIA_LABELS: Record<UrgenciaValue, string> = {
  urgente: 'Tengo una audiencia, un plazo o una intimación en curso',
  notificado: 'Me notificaron algo y no sé qué hacer',
  reciente: 'Pasó hace poco y quiero saber mis opciones',
  antiguo: 'Es un problema de hace tiempo',
}

// Largos mínimos y máximos de cada campo. Los usan el formulario y la
// validación del servidor, para que los dos midan igual.
export const LIMITES = {
  nombreMin: 2,
  nombreMax: 120,
  telefonoMin: 6,
  telefonoMax: 30,
  emailMax: 200,
  localidadMax: 100,
  mensajeMin: 10,
  mensajeMax: 800,
} as const
