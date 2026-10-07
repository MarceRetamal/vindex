// Datos de las páginas de área (SEO). Cada área genera una página propia en
// /<slug> a través de src/app/(site)/[area]/page.tsx. Para agregar o
// cambiar una área se edita solo este archivo.
//
// `materia` debe coincidir con la materia de las notas del blog.
// `categoriaTips` debe coincidir con la categoría de los tips (src/lib/tips.ts).

export type Paso = { title: string; description: string }
export type Faq = { q: string; a: string }

export type Area = {
  slug: string
  nombre: string
  materia: string
  categoriaTips: string
  titleSeo: string
  description: string
  eyebrow: string
  h1: string
  intro: string
  cardTitle: string
  cardText: string
  tags: string[]
  situaciones: Paso[]
  pasos: Paso[]
  faqs: Faq[]
}

export const AREAS: Area[] = [
  {
    slug: 'derecho-de-familia',
    nombre: 'Derecho de familia',
    materia: 'Familia',
    categoriaTips: 'Familia',
    titleSeo: 'Abogado de Familia en La Plata',
    description:
      'Cuota alimentaria, régimen de comunicación con tus hijos, divorcio y cuidado personal en La Plata y toda la Provincia de Buenos Aires.',
    eyebrow: 'Derecho de familia',
    h1: 'Abogado de familia en La Plata',
    intro:
      'Cuota alimentaria, contacto con tus hijos, divorcio y cuidado personal. Te explicamos tu situación en lenguaje claro y actuamos en toda la Provincia de Buenos Aires.',
    cardTitle: 'Derecho de familia',
    cardText: 'Cuota alimentaria, contacto con los hijos, divorcio y cuidado personal.',
    tags: ['Cuota alimentaria', 'Impedimento de contacto', 'Divorcio', 'Cuidado personal'],
    situaciones: [
      {
        title: 'No me pasan la cuota alimentaria',
        description: 'Se reclama la cuota por primera vez, se actualiza o se ejecuta cuando hay deuda.',
      },
      {
        title: 'No me dejan ver a mis hijos',
        description: 'Se puede pedir que el juez fije un régimen de comunicación y que haga cumplirlo.',
      },
      {
        title: 'Me quiero divorciar y la otra persona no acepta',
        description: 'El divorcio puede pedirlo una sola de las partes. No hace falta acuerdo ni alegar una causa.',
      },
      {
        title: 'Necesito cambiar un acuerdo o una sentencia',
        description: 'Aumento o reducción de la cuota, cuidado personal o cambio de residencia de los chicos.',
      },
    ],
    pasos: [
      {
        title: 'Juntá lo que ya tenés',
        description:
          'Partidas de nacimiento, comprobantes de gastos de los chicos, mensajes y cualquier dato sobre los ingresos del otro progenitor.',
      },
      {
        title: 'No firmes ni acuerdes nada sin leerlo',
        description: 'Un acuerdo informal puede ser difícil de cambiar después. Consultá antes de comprometerte.',
      },
      {
        title: 'Contanos el caso',
        description: 'Te decimos qué vía conviene: acuerdo, medida urgente o juicio.',
      },
    ],
    faqs: [
      {
        q: '¿Cuánto es la cuota alimentaria?',
        a: 'La ley no fija un porcentaje. El juez la determina según lo que necesitan los hijos y lo que puede aportar cada progenitor. Incluye vivienda, comida, educación, salud, vestimenta y esparcimiento (art. 659 del Código Civil y Comercial).',
      },
      {
        q: '¿Hasta qué edad se paga?',
        a: 'Hasta los 21 años, y hasta los 25 si el hijo estudia o se capacita y eso le impide mantenerse (arts. 658 y 663).',
      },
      {
        q: '¿Me pueden impedir ver a mis hijos?',
        a: 'El progenitor que no convive con los hijos tiene derecho y deber de mantener una comunicación fluida con ellos (art. 652). Si lo obstaculizan, se puede pedir que el juez fije el régimen y lo haga cumplir.',
      },
      {
        q: '¿Puedo divorciarme si mi pareja no quiere?',
        a: 'Sí. Alcanza con que lo pida uno solo y no hace falta explicar los motivos (arts. 437 y 438). Hay que presentar una propuesta sobre vivienda, hijos y bienes.',
      },
    ],
  },
  {
    slug: 'accidentes-de-transito',
    nombre: 'Accidentes de tránsito',
    materia: 'Tránsito',
    categoriaTips: 'Tránsito',
    titleSeo: 'Abogado de Accidentes de Tránsito en La Plata',
    description:
      'Reclamo por lesiones y daños tras un choque, un accidente en moto o un atropello. Aseguradoras, indemnización y plazos en La Plata y la Provincia.',
    eyebrow: 'Accidentes de tránsito',
    h1: 'Abogado de accidentes de tránsito en La Plata',
    intro:
      'Si te chocaron, te atropellaron o perdiste a un familiar en un accidente, hay plazos y pruebas que cuidar desde el primer día. Te decimos qué reclamar y a quién.',
    cardTitle: 'Accidentes de tránsito',
    cardText: 'Lesiones, daños y reclamos a la aseguradora después de un choque o atropello.',
    tags: ['Choques', 'Moto y bici', 'Peatones', 'Aseguradoras'],
    situaciones: [
      {
        title: 'Choque con lesiones',
        description: 'Reclamo por daños físicos, gastos médicos, días sin trabajar y daños al vehículo.',
      },
      {
        title: 'Accidente en moto, bici o como peatón',
        description: 'Quienes no tienen carrocería suelen sufrir lesiones más graves. Hay que documentarlas desde el principio.',
      },
      {
        title: 'La aseguradora ofrece poco o demora',
        description: 'Antes de aceptar una oferta o firmar un recibo, conviene saber cuánto vale realmente tu reclamo.',
      },
      {
        title: 'Falleció un familiar',
        description: 'Reclamo de quienes dependían de la víctima y de sus herederos.',
      },
    ],
    pasos: [
      {
        title: 'Atención médica y registro',
        description: 'Hacete atender y guardá historia clínica, estudios, recetas y comprobantes de cada gasto.',
      },
      {
        title: 'Documentá la escena',
        description: 'Fotos, patente y seguro del otro vehículo, datos de testigos y número de la denuncia si hubo.',
      },
      {
        title: 'No firmes con la aseguradora',
        description: 'Un recibo puede incluir la renuncia a reclamos futuros. Leelo con un abogado antes de aceptar.',
      },
    ],
    faqs: [
      {
        q: '¿Cuánto tiempo tengo para reclamar?',
        a: 'En general, tres años desde el accidente (art. 2561 del Código Civil y Comercial). Conviene no esperar: las pruebas se pierden con el tiempo.',
      },
      {
        q: '¿Puedo reclamarle a la aseguradora del otro conductor?',
        a: 'Sí. La víctima puede demandar al responsable y pedir que se cite a su aseguradora, que responde dentro de los límites del contrato (art. 118 de la Ley 17.418).',
      },
      {
        q: '¿Y si el otro conductor no tiene seguro?',
        a: 'Se reclama directamente al conductor y al titular del vehículo. Por eso conviene anotar la patente y los datos del dueño.',
      },
      {
        q: '¿Tengo que hacer una denuncia penal?',
        a: 'No es obligatoria para reclamar los daños. En casos con lesiones puede ser útil por la prueba que genera. Se evalúa caso por caso.',
      },
    ],
  },
  {
    slug: 'derecho-laboral',
    nombre: 'Derecho laboral',
    materia: 'Laboral',
    categoriaTips: 'Laboral',
    titleSeo: 'Abogado Laboral en La Plata: despido y reclamos',
    description:
      'Despido sin causa, trabajo en negro, sueldos y horas extras sin pagar. Abogado laboral en La Plata y la Provincia de Buenos Aires.',
    eyebrow: 'Derecho laboral',
    h1: 'Abogado laboral en La Plata',
    intro:
      'Despidos, trabajo no registrado, sueldos adeudados y empleadores que no cumplen. Revisamos tu situación y te decimos qué te corresponde reclamar.',
    cardTitle: 'Derecho laboral',
    cardText: 'Despidos, trabajo en negro y pagos adeudados por tu empleador.',
    tags: ['Despido sin causa', 'Trabajo en negro', 'Horas extras', 'Despido indirecto'],
    situaciones: [
      {
        title: 'Me despidieron sin causa',
        description: 'Se revisa la indemnización y los rubros adeudados según tu antigüedad y tu sueldo.',
      },
      {
        title: 'Trabajo en negro o mal registrado',
        description: 'La relación laboral se puede probar con mensajes, pagos, testigos y otros elementos.',
      },
      {
        title: 'No me pagan lo que corresponde',
        description: 'Sueldos, horas extras, vacaciones y aguinaldo adeudados.',
      },
      {
        title: 'Me hacen la vida imposible para que renuncie',
        description: 'Cambios de condiciones, maltrato o falta de pago pueden justificar darse por despedido.',
      },
    ],
    pasos: [
      {
        title: 'Guardá todo',
        description: 'Recibos, mensajes, fotos de turnos o tareas, y los datos de compañeros que puedan declarar.',
      },
      {
        title: 'No firmes renuncia ni liquidación',
        description: 'Firmar sin entender puede cerrar tu reclamo. Consultá antes.',
      },
      {
        title: 'Reclamá por escrito',
        description: 'Una intimación bien redactada ordena el caso y deja constancia de lo que pediste.',
      },
    ],
    faqs: [
      {
        q: '¿Me corresponde indemnización si me despiden sin causa?',
        a: 'En general sí, pero el monto depende de tu antigüedad, tu sueldo y cómo estabas registrado. La ley laboral cambia, por eso se calcula con la norma vigente a la fecha del despido.',
      },
      {
        q: '¿Puedo reclamar si trabajé sin registrar?',
        a: 'Sí. Se puede probar la relación laboral por distintos medios y reclamar lo que no se pagó.',
      },
      {
        q: '¿Cuánto tiempo tengo para reclamar?',
        a: 'Los plazos son cortos: en general, dos años. Conviene consultar cuanto antes.',
      },
      {
        q: 'Si renuncié, ¿pierdo todo?',
        a: 'Renunciar suele no dar derecho a indemnización, pero depende de cómo se comunicó y de si hubo incumplimientos del empleador. Cada caso se analiza.',
      },
    ],
  },
  {
    slug: 'accidentes-laborales-art',
    nombre: 'Accidentes laborales y ART',
    materia: 'ART',
    categoriaTips: 'ART',
    titleSeo: 'Abogado de ART y Accidentes de Trabajo',
    description:
      'Accidente de trabajo, enfermedad profesional o in itinere. Reclamos a la ART, comisión médica e incapacidad en La Plata y la Provincia de Buenos Aires.',
    eyebrow: 'Accidentes laborales y ART',
    h1: 'Abogado de accidentes de trabajo y ART en La Plata',
    intro:
      'Si te lesionaste trabajando o la ART no cubre tu caso, hay pasos que no conviene saltear. Te explicamos qué hacer, qué guardar y qué podrías reclamar.',
    cardTitle: 'Accidentes laborales y ART',
    cardText: 'Accidentes en el trabajo, enfermedades profesionales y reclamos a la ART.',
    tags: ['Accidente de trabajo', 'In itinere', 'Enfermedad profesional', 'Comisión médica'],
    situaciones: [
      {
        title: 'Me accidenté trabajando',
        description: 'Atención, denuncia a la ART e incapacidad que puede quedar después del alta.',
      },
      {
        title: 'Me accidenté yendo o volviendo del trabajo',
        description: 'El accidente in itinere está contemplado si ocurre en el trayecto habitual.',
      },
      {
        title: 'Tengo una enfermedad por mi trabajo',
        description: 'Lesiones por movimientos repetitivos, esfuerzo o exposición a sustancias, entre otras.',
      },
      {
        title: 'La ART rechazó mi caso o me dio el alta sin estar recuperado',
        description: 'El rechazo o el alta se pueden discutir ante la comisión médica y después en la justicia.',
      },
    ],
    pasos: [
      {
        title: 'Avisá y hacete atender',
        description: 'Informá al empleador y a la ART y pedí atención médica. Si tu empleador no hace la denuncia, consultá cómo hacerla vos.',
      },
      {
        title: 'Guardá la documentación',
        description: 'Certificados, estudios, constancias de la ART y todo lo que muestre cómo ocurrió el accidente.',
      },
      {
        title: 'No aceptes altas ni conformidades sin entenderlas',
        description: 'Un alta o una firma pueden afectar tu reclamo posterior.',
      },
    ],
    faqs: [
      {
        q: '¿Qué es la comisión médica?',
        a: 'Es el organismo administrativo donde se discute si hubo accidente o enfermedad profesional y qué incapacidad tiene el trabajador. En muchos casos es un paso previo a la justicia.',
      },
      {
        q: '¿Cubre la ART un accidente yendo o volviendo del trabajo?',
        a: 'Sí. La Ley de Riesgos del Trabajo contempla el accidente in itinere, en el trayecto entre el domicilio y el lugar de trabajo.',
      },
      {
        q: '¿Qué hago si la ART no cubre mi enfermedad?',
        a: 'Se puede discutir el rechazo ante la comisión médica y después en la justicia. Es clave tener documentación médica y laboral que muestre la relación con tus tareas.',
      },
      {
        q: '¿Cuánto tiempo tengo para reclamar?',
        a: 'Los plazos son cortos: en general, dos años desde el accidente o desde que se determina la incapacidad. Consultá cuanto antes.',
      },
    ],
  },
  {
    slug: 'amparos-salud-discapacidad',
    nombre: 'Amparos de salud y discapacidad',
    materia: 'Discapacidad',
    categoriaTips: 'Amparos',
    titleSeo: 'Amparos de Salud, Discapacidad e IOMA',
    description:
      'Amparos contra obras sociales, prepagas e IOMA, y por pensiones y prestaciones de discapacidad. También cuando la sentencia no se cumple.',
    eyebrow: 'Amparos de salud y discapacidad',
    h1: 'Amparos de salud, discapacidad e IOMA',
    intro:
      'Cuando una obra social, una prepaga, IOMA o el Estado niega o demora una prestación de salud o de discapacidad, el amparo es la vía rápida. También actuamos cuando hay sentencia y no se cumple.',
    cardTitle: 'Amparos de salud y discapacidad',
    cardText: 'Obras sociales, prepagas, IOMA, pensiones y prestaciones por discapacidad.',
    tags: ['Amparo de salud', 'IOMA', 'Discapacidad', 'Sentencia incumplida'],
    situaciones: [
      {
        title: 'Mi obra social o prepaga niega un tratamiento',
        description: 'Medicamentos, cirugías, estudios y terapias indicados por tu médico.',
      },
      {
        title: 'IOMA no cubre o demora',
        description: 'Reclamo por coberturas negadas o demoradas a afiliados de IOMA.',
      },
      {
        title: 'Mi pensión o prestación por discapacidad está demorada o suspendida',
        description: 'Pensiones, certificado de discapacidad (CUD) y prestaciones de rehabilitación y apoyo.',
      },
      {
        title: 'Tengo sentencia a favor y no la cumplen',
        description: 'Se puede pedir intimación, multas por cada día de demora y otras medidas para que se cumpla.',
      },
    ],
    pasos: [
      {
        title: 'Pedí la negativa por escrito',
        description: 'Si no te la dan, dejá constancia de tu reclamo por un medio que quede registrado.',
      },
      {
        title: 'Certificado médico detallado',
        description: 'Que diga diagnóstico, tratamiento indicado, por qué lo necesitás y si hay urgencia.',
      },
      {
        title: 'Juntá la documentación',
        description: 'CUD, historia clínica, credencial, órdenes y todas las respuestas que recibiste.',
      },
    ],
    faqs: [
      {
        q: '¿Qué es un amparo?',
        a: 'Un juicio rápido para proteger derechos fundamentales, como la salud, cuando hay una negativa o una demora que los afecta (art. 43 de la Constitución Nacional).',
      },
      {
        q: '¿Se puede pedir una medida urgente?',
        a: 'Sí. Se puede pedir una cautelar para que la cobertura empiece mientras se resuelve el caso, si hay riesgo para tu salud.',
      },
      {
        q: '¿Qué hago si la sentencia no se cumple?',
        a: 'Se puede pedir al juez que intime al cumplimiento y fije multas por cada día de demora (sanciones conminatorias, art. 804 del Código Civil y Comercial). Según el caso, hay otras medidas.',
      },
      {
        q: '¿Sirve el amparo contra IOMA?',
        a: 'Sí. IOMA es una obra social de la Provincia y las negativas o demoras de cobertura pueden reclamarse por esta vía cuando corresponde.',
      },
    ],
  },
]

export function obtenerArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug)
}

// Otras páginas de servicio que ya existían (están en su propia ruta).
export const OTROS_SERVICIOS = [
  {
    href: '/penal-urgente',
    titulo: 'Defensa penal urgente',
    texto: 'Denuncias, citaciones y medidas cautelares en la Provincia de Buenos Aires.',
  },
  {
    href: '/sucesiones',
    titulo: 'Sucesiones',
    texto: 'Sucesiones simples y particiones, incluso con herederos en desacuerdo.',
  },
]

// Qué página de servicio mostrar al final de cada nota según su "materia".
export const SERVICIO_POR_MATERIA: Record<string, { href: string; titulo: string; texto: string }> = {
  Penal: {
    href: '/penal-urgente',
    titulo: 'Abogado penal urgente en La Plata',
    texto: 'Defensa ante denuncias, medidas cautelares y citaciones en la Provincia de Buenos Aires.',
  },
  Sucesiones: {
    href: '/sucesiones',
    titulo: 'Abogado de sucesiones en La Plata',
    texto: 'Sucesiones simples y particiones con herederos en desacuerdo.',
  },
  ...Object.fromEntries(
    AREAS.map((a) => [a.materia, { href: `/${a.slug}`, titulo: a.h1, texto: a.cardText }])
  ),
}

// Categoría de tips que corresponde a cada materia del blog.
export const CATEGORIA_TIP_POR_MATERIA: Record<string, string> = Object.fromEntries(
  AREAS.map((a) => [a.materia, a.categoriaTips])
)
