import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Política de Privacidad',
  description:
    'Política de privacidad de VINDEX | Estrategia Jurídica. Información sobre el tratamiento de datos personales conforme a la Ley N° 25.326.',
  path: '/politica-de-privacidad',
})

const sections = [
  {
    num: '01',
    title: 'Introducción y Responsable del Tratamiento',
    content: [
      'VINDEX | Estrategia Jurídica (en adelante, "VINDEX", "nosotros" o "el Estudio") es un estudio jurídico con sede en La Plata, Provincia de Buenos Aires, República Argentina, que presta servicios de asesoramiento, representación y estrategia legal.',
      'La presente Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos, protegemos y compartimos la información personal de quienes interactúan con nuestros canales de comunicación, incluyendo el sitio web vindex.website, el canal de WhatsApp Business y cualquier otro medio digital habilitado por el Estudio.',
      'VINDEX actúa como Responsable del Tratamiento de los datos personales en los términos de la Ley N° 25.326 de Protección de los Datos Personales de la República Argentina y la normativa complementaria aplicable.',
    ],
  },
  {
    num: '02',
    title: 'Datos que Recopilamos',
    content: [
      'En función del canal de comunicación utilizado y la naturaleza de la consulta, podemos recopilar las siguientes categorías de datos personales: datos de identificación (nombre completo, DNI/CUIT), datos de contacto (teléfono, correo electrónico, domicilio), registros de comunicaciones (mensajes de WhatsApp, correos), datos jurídicos vinculados a la situación legal del consultante, y datos técnicos (IP, dispositivo, navegador, cookies).',
      'No recopilamos datos sensibles (salud, origen racial, creencias religiosas o afiliación política) salvo que resulten estrictamente necesarios para la prestación del servicio jurídico encomendado y con consentimiento expreso del titular.',
    ],
  },
  {
    num: '03',
    title: 'Finalidades del Tratamiento',
    content: [
      'Los datos personales recopilados son utilizados exclusivamente para las siguientes finalidades: gestionar y responder consultas jurídicas recibidas por cualquier canal habilitado; prestar los servicios legales contratados y administrar la relación cliente-estudio; enviar comunicaciones relacionadas con el estado de expedientes, plazos procesales y novedades del caso; atender consultas a través del canal de WhatsApp Business, mediante sistemas de inteligencia artificial con carácter orientativo e informativo; y cumplir obligaciones legales, reglamentarias y deontológicas aplicables al ejercicio de la abogacía en la Provincia de Buenos Aires (Ley N° 5.177 y normativa del CAJLP).',
    ],
  },
  {
    num: '04',
    title: 'Canal de WhatsApp Business e Inteligencia Artificial',
    content: [
      'VINDEX utiliza WhatsApp Business API (Meta Platforms, Inc.) como canal oficial de comunicación. Las interacciones realizadas a través de este canal pueden ser procesadas por sistemas de inteligencia artificial para clasificar y priorizar consultas entrantes, brindar orientación general de carácter informativo sobre el ordenamiento jurídico argentino, y derivar la comunicación al profesional responsable cuando corresponda.',
      'Las respuestas automatizadas tienen carácter meramente orientativo e informativo. No constituyen asesoramiento jurídico, no crean relación abogado-cliente y no reemplazan la consulta profesional personalizada.',
      'Los mensajes intercambiados a través de WhatsApp están sujetos adicionalmente a la Política de Privacidad de WhatsApp y las condiciones de Meta Platforms, Inc.',
    ],
  },
  {
    num: '05',
    title: 'Base Legal del Tratamiento',
    content: [
      'El tratamiento de datos personales por parte de VINDEX se fundamenta en alguna de las siguientes bases legales: consentimiento del titular, otorgado de forma libre, expresa e informada al iniciar una comunicación; ejecución de un contrato, cuando el tratamiento es necesario para la prestación del servicio jurídico encomendado; obligación legal, cuando el tratamiento resulta exigido por el ordenamiento jurídico aplicable; e interés legítimo, para la gestión interna del Estudio y la mejora de los servicios.',
    ],
  },
  {
    num: '06',
    title: 'Conservación de los Datos',
    content: [
      'Los datos personales serán conservados durante el tiempo estrictamente necesario para cumplir con la finalidad para la que fueron recopilados y, en todo caso, durante los plazos de prescripción legalmente establecidos para las acciones derivadas de la relación jurídica.',
      'Los datos vinculados a expedientes judiciales o extrajudiciales se conservarán conforme a los plazos previstos por la normativa procesal y las disposiciones deontológicas del Colegio de Abogados de la Provincia de Buenos Aires.',
    ],
  },
  {
    num: '07',
    title: 'Compartición con Terceros',
    content: [
      'VINDEX no comercializa ni cede datos personales a terceros con fines comerciales. Los datos podrán ser compartidos únicamente con proveedores tecnológicos que actúan como encargados del tratamiento (plataformas de gestión, servicios en la nube, herramientas de automatización), bajo acuerdos de confidencialidad y seguridad; con organismos judiciales o administrativos cuando sea requerido por mandato legal o resolución judicial; y con peritos, mediadores u otros profesionales intervinientes en el proceso, cuando resulte necesario para la defensa del cliente.',
      'Los proveedores tecnológicos utilizados incluyen, entre otros: Meta Platforms Inc. (WhatsApp Business API), Google LLC (servicios de inteligencia artificial), HubSpot Inc. (gestión de contactos y análisis de navegación mediante cookies) y servicios de infraestructura en la nube. Todos ellos operan bajo marcos de protección de datos reconocidos internacionalmente.',
    ],
  },
  {
    num: '08',
    title: 'Derechos del Titular de los Datos',
    content: [
      'De conformidad con la Ley N° 25.326 y demás normativa aplicable, el titular de los datos personales tiene derecho a: acceder a qué datos personales trata VINDEX y con qué finalidad; rectificar datos inexactos o incompletos; solicitar la cancelación o supresión de datos cuando ya no resulten necesarios; oponerse al tratamiento de sus datos en determinadas circunstancias; y solicitar la portabilidad de sus datos en formato estructurado y legible.',
      'Para ejercer cualquiera de estos derechos, el titular puede dirigirse a VINDEX a través de los medios indicados en la sección de Contacto. La solicitud será atendida dentro de los plazos previstos por la normativa vigente.',
      'El titular tiene derecho a presentar una reclamación ante la Dirección Nacional de Protección de Datos Personales (www.argentina.gob.ar/aaip) si considera que el tratamiento de sus datos vulnera la normativa aplicable.',
    ],
  },
  {
    num: '09',
    title: 'Seguridad de la Información',
    content: [
      'VINDEX implementa medidas técnicas y organizativas adecuadas para garantizar la seguridad de los datos personales y prevenir su pérdida, alteración, acceso no autorizado o divulgación indebida.',
      'No obstante, ningún sistema de transmisión de datos por internet puede garantizar una seguridad absoluta. En caso de detectar una brecha de seguridad que pueda afectar sus datos, VINDEX lo comunicará conforme a los procedimientos previstos por la normativa vigente.',
    ],
  },
  {
    num: '10',
    title: 'Transferencias Internacionales',
    content: [
      'Algunos de nuestros proveedores tecnológicos están ubicados fuera de Argentina. En tales casos, VINDEX verifica que dichas transferencias se realicen hacia países o entidades que garanticen un nivel adecuado de protección, o bajo las garantías contractuales previstas por la normativa de protección de datos personales.',
    ],
  },
  {
    num: '11',
    title: 'Modificaciones a esta Política',
    content: [
      'VINDEX se reserva el derecho de actualizar la presente Política de Privacidad cuando resulte necesario por cambios normativos, tecnológicos o en los servicios prestados. La versión actualizada estará siempre disponible en esta página con indicación de la fecha de última modificación.',
    ],
  },
  {
    num: '12',
    title: 'Contacto',
    content: [
      'Para cualquier consulta, solicitud de ejercicio de derechos o comunicación relacionada con el tratamiento de datos personales, puede dirigirse a VINDEX a través del formulario de evaluación jurídica disponible en el sitio web o mediante el canal de WhatsApp Business habilitado.',
    ],
  },
]

export default function PoliticaPrivacidadPage() {
  return (
    <PageShell>
      {/* Hero */}
      <FadeIn>
        <div className="border-b border-[var(--border-strong)] pb-10 md:pb-14">
          <Eyebrow>Documento Legal</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-[2rem] font-extrabold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Política de Privacidad
          </h1>
          <div className="mt-6 flex flex-wrap gap-6 text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <span>
              Última actualización{' '}
              <span className="text-[var(--text-secondary)]">Mayo 2026</span>
            </span>
            <span>
              Jurisdicción{' '}
              <span className="text-[var(--text-secondary)]">
                Argentina — Pcia. Buenos Aires
              </span>
            </span>
            <span>
              Versión <span className="text-[var(--text-secondary)]">2.0</span>
            </span>
          </div>
        </div>
      </FadeIn>

      {/* Sections */}
      <StaggerFadeIn delay={0.1} stagger={0.08}>
        <div className="mt-12 flex flex-col gap-0 md:mt-16">
          {sections.map((section) => (
            <div
              key={section.num}
              className="group grid border-b border-[var(--border-strong)] py-10 transition-colors duration-300 hover:bg-white/[0.01] md:grid-cols-[160px_1fr] md:gap-12 md:py-12"
            >
              {/* Number + title */}
              <div className="mb-4 md:mb-0">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">
                  {section.num}
                </span>
                <h2 className="mt-2 text-base font-bold leading-tight text-[var(--text-primary)] md:text-[15px]">
                  {section.title}
                </h2>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {section.content.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-7 text-[var(--text-secondary)] md:text-base md:leading-8"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </StaggerFadeIn>

      {/* Footer note */}
      <FadeIn delay={0.2}>
        <div className="mt-12 rounded-[16px] border border-[var(--border-subtle)] bg-white/[0.02] p-6 md:mt-16 md:p-8">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Ley N° 25.326 — DNPDP
          </p>
          <p className="mt-3 text-[14px] leading-6 text-[var(--text-muted)]">
            La DIRECCIÓN NACIONAL DE PROTECCIÓN DE DATOS PERSONALES, Órgano de
            Control de la Ley N° 25.326, tiene la atribución de atender las
            denuncias y reclamos que se interpongan con relación al incumplimiento
            de las normas sobre protección de datos personales.
          </p>
        </div>
      </FadeIn>
    </PageShell>
  )
}
