import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { ArticleShell } from '@/components/blog/ArticleShell'
import { getArticle } from '@/data/articles'

const article = getArticle('cuota-alimentaria-cuanto-corresponde-hasta-cuando')

export const metadata: Metadata = buildMetadata({
  title: article.title,
  description: article.description,
  path: `/blog/${article.slug}`,
})

export default function ArticlePage() {
  return (
    <ArticleShell article={article}>
      <p>
        Tres preguntas concentran casi todas las consultas sobre alimentos de hijos: <strong>cuánto corresponde,
        hasta cuándo se paga, y qué se puede hacer cuando no pagan</strong>. Las tres tienen respuesta legal precisa en
        el Código Civil y Comercial — y varias de esas respuestas desmienten lo que se repite en los grupos de
        WhatsApp. Vamos una por una.
      </p>

      <h2>Primero, una aclaración que cambia el enfoque: los dos progenitores deben alimentos</h2>
      <p>
        La obligación alimentaria es de <strong>ambos</strong> progenitores, conforme a su condición y fortuna (art.
        658 CCyC). Y el Código dice algo más, que dignifica una realidad histórica: <strong>las tareas cotidianas de
        cuidado que realiza el progenitor que convive con el hijo tienen valor económico y constituyen un aporte</strong>{' '}
        (art. 660). Quien cría, cocina, lleva a la escuela y se levanta de madrugada ya está pagando su parte — en
        especie. Por eso la cuota en dinero recae, en la práctica, principalmente sobre el progenitor no conviviente.
      </p>
      <p>
        Y "alimentos" no significa comida: la ley incluye manutención, educación, esparcimiento, vestimenta,
        habitación, asistencia, gastos por enfermedad y los necesarios para adquirir una profesión u oficio (art. 659).
        El club, el transporte, los anteojos y la cuota del colegio son alimentos.
      </p>

      <h2>Hasta cuándo: el mito de los 18 años</h2>
      <p>El error más extendido es creer que la obligación termina con la mayoría de edad. La ley dice otra cosa:</p>
      <ul>
        <li>
          <strong>Hasta los 21 años</strong> como regla (art. 658). Entre los 18 y los 21 el hijo no tiene que probar
          que necesita: es el progenitor obligado quien debe acreditar, si pretende dejar de pagar, que el hijo cuenta
          con recursos propios suficientes.
        </li>
        <li>
          <strong>Hasta los 25 años</strong> si el hijo estudia o se prepara en un arte u oficio, y esa formación le
          impide sostenerse por sí mismo (art. 663). Un hijo cursando una carrera universitaria con dedicación real
          entra, típicamente, en este supuesto.
        </li>
      </ul>

      <h2>Cuánto: lo que la ley dice (y lo que no dice)</h2>
      <p>
        La ley <strong>no fija un porcentaje</strong>. La cuota se determina en función de dos variables: las
        necesidades del hijo — según su edad y el nivel de vida que llevaba — y la capacidad económica del obligado. A
        partir de ahí, algunas referencias honestas sobre cómo se resuelve en la práctica:
      </p>
      <ul>
        <li>
          <strong>Porcentaje de ingresos.</strong> Cuando el obligado tiene sueldo registrado, los tribunales suelen
          fijar la cuota como un porcentaje de sus ingresos — con franjas orientativas que varían según la cantidad de
          hijos y las circunstancias de cada caso; no hay una tabla legal, y quien le prometa un número exacto por
          teléfono está improvisando.
        </li>
        <li>
          <strong>La Canasta de Crianza del INDEC.</strong> Desde 2023 el INDEC publica mensualmente cuánto cuesta
          criar un hijo según su edad, incluyendo bienes, servicios y el valor del tiempo de cuidado. Los juzgados la
          usan cada vez más como piso objetivo, especialmente cuando el obligado tiene ingresos informales o los
          oculta. Es, hoy, la herramienta más poderosa para discutir cuotas con base en datos y no en regateos.
        </li>
        <li>
          <strong>Trabajadores informales o que "no tienen nada".</strong> La falta de recibo de sueldo no libera de la
          obligación: el nivel de vida visible, los movimientos bancarios y de billeteras virtuales, los vehículos y
          los viajes permiten presumir capacidad económica. La informalidad complica la prueba; no borra el derecho del
          hijo.
        </li>
      </ul>
      <p>
        Un punto de técnica que evita volver a tribunales cada seis meses: la cuota debe pactarse o pedirse{' '}
        <strong>con mecanismo de actualización</strong> (por índice), porque una suma fija en pesos se licúa con la
        inflación y condena a renegociar permanentemente.
      </p>

      <h2>Desde cuándo se debe: el detalle que vale meses de cuota</h2>
      <p>
        Los alimentos se deben <strong>desde el día de la demanda — o desde la interpelación fehaciente al obligado,
        si la demanda se presenta dentro de los seis meses de esa interpelación</strong> (art. 669). Traducción
        práctica: una carta documento o el inicio formal del reclamo <em>fija la fecha</em> desde la cual se acumula lo
        adeudado. Cada mes que se deja pasar "esperando que recapacite" es un mes que, en principio, no se recupera.
        Reclamar temprano no es agresividad: es proteger el derecho del hijo.
      </p>

      <h2>Qué hacer si no paga: las herramientas reales</h2>
      <p>Contra el incumplimiento hay un arsenal concreto, escalable según la gravedad:</p>
      <ul>
        <li>
          <strong>Ejecución de lo adeudado</strong>, con intereses: si la cuota está fijada por sentencia o por acuerdo
          homologado, es un título que permite embargar sueldo, cuentas y bienes. De ahí la regla de oro: los arreglos
          "de palabra" no protegen a nadie — el acuerdo se homologa judicialmente, siempre.
        </li>
        <li>
          <strong>Registro de Deudores Alimentarios Morosos.</strong> En la Provincia de Buenos Aires (Ley 13.074), la
          inscripción del deudor le bloquea en la práctica trámites cotidianos: licencia de conducir, habilitaciones,
          contrataciones con el Estado, entre otros. Es una presión silenciosa y muy efectiva.
        </li>
        <li>
          <strong>Medidas conminatorias.</strong> Los juzgados de familia han convalidado medidas creativas para forzar
          el cumplimiento, desde intereses agravados hasta restricciones específicas adaptadas al caso.
        </li>
        <li>
          <strong>La vía penal.</strong> El incumplimiento deliberado de los deberes de asistencia familiar es delito
          (Ley 13.944). Es la última carta, no la primera — pero existe, y su sola mención suele reordenar prioridades.
        </li>
      </ul>

      <h2>Cómo se reclama en la Provincia de Buenos Aires</h2>
      <p>
        El reclamo tramita ante la justicia de familia, con una instancia inicial orientada a lograr un acuerdo antes
        del pleito. Si hay acuerdo, se homologa y adquiere fuerza ejecutoria; si no lo hay, el juez fija la cuota —
        pudiendo establecer <strong>alimentos provisorios</strong> mientras el proceso avanza, para que el hijo no
        quede desprotegido durante la discusión. La documentación útil: partida de nacimiento, constancias de gastos
        del hijo (colegio, salud, actividades) y todo indicio de la capacidad económica del obligado.
      </p>

      <h2>En resumen</h2>
      <p>
        La cuota alimentaria no es un favor ni una negociación entre adultos: es un derecho del hijo, con reglas
        precisas — hasta los 21 o 25 años, con parámetros objetivos de cálculo, retroactividad desde el reclamo y
        herramientas reales de cobro. Si necesita fijar una cuota, actualizarla o ejecutar lo adeudado, puede solicitar
        una <Link href="/evaluacion">evaluación confidencial del caso</Link> con la documentación disponible para
        conocer el camino concreto en su situación.
      </p>
    </ArticleShell>
  )
}
