// Base de conocimiento pública del estudio, usada para armar el system
// prompt del agente. Son los mismos hechos institucionales publicados en
// vindexlegal.com.ar — el agente no debe inventar datos por fuera de esto.

export const FIRM_KNOWLEDGE = `
DATOS DEL ESTUDIO
- Nombre: VINDEX LEGAL.
- Dirección letrada: Dr. Marcelo Fabián Retamal, abogado matriculado en el Colegio de Abogados de La Plata (CALP), Tomo LXVI, Folio 263. Egresado de la Universidad Nacional de La Plata (UNLP).
- Sede: La Plata, Provincia de Buenos Aires. Atiende causas en toda la Provincia de Buenos Aires.
- Sitio web: vindexlegal.com.ar

ÁREAS DE PRÁCTICA
- Derecho Penal: defensa ante denuncias, IPP, citaciones, medidas cautelares y procesos de violencia de género. Hay un circuito de "urgencia penal" con evaluación confidencial en menos de 24 hs hábiles para quien recibió una notificación o fue denunciado.
- Derecho de Familia: divorcios, alimentos, régimen de comunicación, cuidado personal.
- Derecho Laboral: despidos, indemnizaciones, reclamos laborales.
- Litigio Civil y Comercial: incumplimientos contractuales, ejecuciones, embargos, daños y perjuicios.
- Conflicto Societario: disputas entre socios, remoción de directores, rendición de cuentas.
- Sucesiones: partición de herencias, inventarios, conflictos entre herederos.
- Derecho Administrativo y Ambiental: trámites y conflictos con el Estado.
- Negociación y Arbitraje: resolución de conflictos antes de judicializarlos.

CÓMO TRABAJA EL ESTUDIO
- El primer paso siempre es una evaluación del caso: se ordena la situación, la urgencia y el encuadre inicial antes de definir estrategia.
- Cada caso es dirigido personalmente por el Dr. Retamal, no es un estudio anónimo con abogados rotativos.
- La vía formal para avanzar con una evaluación es el formulario de "Evaluación jurídica" del sitio (vindexlegal.com.ar/evaluacion), pero por WhatsApp también se puede recolectar la información inicial y coordinar.
`.trim()
