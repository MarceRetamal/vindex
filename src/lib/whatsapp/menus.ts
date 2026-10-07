import type { ListMenu, ReplyButtons } from './graph'
import type { MenuId } from './types'

// Menús interactivos con estructura fija (WhatsApp exige límites estrictos
// de longitud y cantidad de filas). El modelo elige CUÁL menú mandar
// mediante `menu: MenuId`, pero nunca genera el JSON de WhatsApp en sí —
// así garantizamos mensajes siempre válidos para la Graph API.

export const MAIN_MENU: ListMenu = {
  header: 'VINDEX LEGAL',
  body: 'Elegí la opción que más se acerca a tu consulta, o simplemente contame con tus palabras qué te está pasando.',
  buttonLabel: 'Ver opciones',
  sections: [
    {
      title: 'Menú principal',
      rows: [
        { id: 'area_penal', title: 'Denuncia o causa penal', description: 'Denuncias, citaciones, medidas cautelares' },
        { id: 'area_familia', title: 'Familia', description: 'Cuota alimentaria, hijos, divorcio' },
        { id: 'area_transito', title: 'Accidente de tránsito', description: 'Choques, lesiones, aseguradora' },
        { id: 'area_laboral', title: 'Despido o trabajo', description: 'Despidos, trabajo en negro, sueldos' },
        { id: 'area_art', title: 'Accidente de trabajo / ART', description: 'Accidentes, alta médica, rechazos' },
        { id: 'area_amparo', title: 'Salud y discapacidad', description: 'Obra social, IOMA, CUD, amparos' },
        { id: 'area_sucesion', title: 'Sucesión o herencia', description: 'Herencias, particiones' },
        { id: 'area_otro', title: 'Otro tema', description: 'Contame qué pasó' },
        { id: 'humano', title: 'Hablar con un abogado', description: 'Te derivamos con el equipo' },
      ],
    },
  ],
}

export const CONFIRM_HUMAN_BUTTONS: ReplyButtons = {
  body: '¿Querés que te derive directamente con un abogado del estudio?',
  buttons: [
    { id: 'confirm_derivar', title: 'Sí, derivame' },
    { id: 'confirm_seguir', title: 'Prefiero seguir así' },
  ],
}

export const MENU_REGISTRY: Record<Exclude<MenuId, 'none'>, { kind: 'list'; menu: ListMenu } | { kind: 'buttons'; menu: ReplyButtons }> = {
  main_menu: { kind: 'list', menu: MAIN_MENU },
  confirm_human: { kind: 'buttons', menu: CONFIRM_HUMAN_BUTTONS },
}
