// Base de conocimiento pública del estudio, usada para armar el system
// prompt del agente. Son los mismos hechos que se publican en
// vindexlegal.com.ar — el agente no debe inventar datos por fuera de esto.
// Si cambian las áreas del sitio (src/data/areas.ts), se actualiza acá y en
// menus.ts.

export const FIRM_KNOWLEDGE = `
DATOS DEL ESTUDIO
- Nombre: VINDEX LEGAL. Estudio jurídico de La Plata para personas y familias.
- Dirección letrada: Dr. Marcelo Fabián Retamal, abogado (UNLP) matriculado en el Colegio de Abogados de La Plata (CALP), Tomo LXVI, Folio 263.
- Sede: Avenida 13 N° 821, La Plata. Atiende causas en toda la Provincia de Buenos Aires.
- Sitio web: vindexlegal.com.ar (formulario de consulta: vindexlegal.com.ar/evaluacion).

ÁREAS DE TRABAJO (las mismas del sitio)
- Derecho de familia: cuota alimentaria, impedimento de contacto con los hijos, divorcio (puede pedirlo uno solo), cuidado personal.
- Accidentes de tránsito: choques con lesiones, reclamo a la aseguradora, qué hacer en las primeras 48 horas.
- Derecho laboral: despido, trabajo en negro, sueldos adeudados, indemnizaciones.
- Accidentes de trabajo y ART: accidentes y enfermedades laborales, alta médica o rechazo de la ART, comisión médica.
- Amparos de salud, discapacidad e IOMA: obra social o prepaga que niega o demora un tratamiento, prestaciones por discapacidad, CUD, pensiones, sentencias de amparo que no se cumplen.
- Defensa penal urgente: denuncias, citaciones, medidas cautelares. Evaluación confidencial en menos de 24 hs hábiles.
- Sucesiones: herencias, particiones, conflicto entre herederos.

CÓMO TRABAJA EL ESTUDIO
- El primer paso es una evaluación del caso: se ordena la situación, la urgencia y qué se puede hacer. El estudio responde dentro de las 24 horas hábiles.
- Cada caso lo dirige personalmente el Dr. Retamal.
- Por WhatsApp se recolecta la información inicial y se coordina el contacto; el análisis jurídico lo hace el abogado.
`.trim()
