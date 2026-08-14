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
        { id: 'area_penal', title: 'Urgencia penal', description: 'Denuncias, citaciones, medidas cautelares' },
        { id: 'area_familia', title: 'Derecho de Familia', description: 'Divorcios, alimentos, régimen de comunicación' },
        { id: 'area_sucesiones', title: 'Sucesiones', description: 'Herencias, particiones, inventarios' },
        { id: 'area_laboral', title: 'Derecho Laboral', description: 'Despidos, indemnizaciones, reclamos' },
        { id: 'area_civil', title: 'Civil y Comercial', description: 'Contratos, deudas, daños y perjuicios' },
        { id: 'area_administrativo', title: 'Administrativo', description: 'Trámites y conflictos con el Estado' },
        { id: 'agendar', title: 'Agendar evaluación', description: 'Reservar una consulta con el estudio' },
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
