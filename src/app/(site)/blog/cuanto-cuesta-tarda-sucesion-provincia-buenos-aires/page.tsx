import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { ArticleShell } from '@/components/blog/ArticleShell'
import { getArticle } from '@/data/articles'

const article = getArticle('cuanto-cuesta-tarda-sucesion-provincia-buenos-aires')

export const metadata: Metadata = buildMetadata({
  title: article.title,
  description: article.description,
  path: `/blog/${article.slug}`,
})

export default function ArticlePage() {
  return (
    <ArticleShell article={article}>
      <p>
        Es la primera pregunta que hace todo heredero, y la que casi ningún estudio responde por escrito: ¿cuánto me va
        a costar y cuánto va a tardar? La respuesta honesta es "depende de qué bienes haya y de si los herederos se
        ponen de acuerdo" — pero eso no le sirve a nadie como respuesta completa. Acá está el desglose real de una
        sucesión en la Provincia de Buenos Aires: qué se paga, a quién, en qué momento, y qué plazos son realistas.
      </p>

      <h2>Primero, lo estructural: en la Provincia, la sucesión es siempre judicial</h2>
      <p>
        A diferencia de lo que muchos creen (o leen sobre otras jurisdicciones), en la Provincia de Buenos Aires la
        herencia se tramita mediante un <strong>proceso judicial sucesorio</strong>, con intervención de un juez y
        patrocinio letrado obligatorio. No existe la "sucesión ante escribano". Eso no significa que sea
        necesariamente lenta ni conflictiva: la enorme mayoría de las sucesiones son procesos voluntarios donde nadie
        pelea con nadie, y la diferencia entre una sucesión de meses y una de años suele estar en la gestión activa del
        expediente, no en el juzgado.
      </p>

      <h2>Los costos, uno por uno</h2>
      <p>Una sucesión tiene cinco componentes de costo. Conviene conocerlos por separado, porque no todos se pagan al mismo tiempo ni al mismo sujeto:</p>
      <ul>
        <li>
          <strong>Tasa de justicia.</strong> Es lo que cobra la Provincia por el servicio judicial. En los procesos
          sucesorios se calcula como un porcentaje sobre el valor de los bienes transmitidos (para los inmuebles, sobre
          su valuación fiscal), conforme la alícuota que fija la ley impositiva vigente. Se abona, en la práctica,
          antes de la inscripción de los bienes.
        </li>
        <li>
          <strong>Honorarios profesionales.</strong> Los honorarios del abogado se regulan judicialmente según la ley
          arancelaria provincial (Ley 14.967), en función del valor del acervo hereditario y expresados en{' '}
          <em>jus</em> (la unidad arancelaria que fija la Suprema Corte bonaerense). Nada impide, además, pactar por
          escrito con el profesional la forma y oportunidad de pago — en VINDEX ese acuerdo es siempre previo y por
          escrito, sin sorpresas al final.
        </li>
        <li>
          <strong>Aportes previsionales.</strong> Sobre los honorarios se calculan los aportes a la Caja de Previsión
          Social para Abogados de la Provincia (Ley 6716), que integran el costo final del trámite.
        </li>
        <li>
          <strong>Impuesto a la Transmisión Gratuita de Bienes (ITGB).</strong> La Provincia de Buenos Aires es una de
          las pocas jurisdicciones del país que grava las herencias. Aplica solo cuando el valor recibido supera el
          mínimo no imponible vigente (más alto para padres, hijos y cónyuge), con alícuotas progresivas que crecen con
          el monto y con la lejanía del parentesco. En muchas sucesiones de patrimonio medio directamente no se paga,
          por quedar bajo el mínimo; en patrimonios mayores, planificarlo a tiempo cambia el resultado.
        </li>
        <li>
          <strong>Gastos de trámite.</strong> Publicación de edictos, informes de dominio y de anotaciones personales,
          certificados (defunción, matrimonio, nacimiento), y la inscripción final de la declaratoria en el Registro de
          la Propiedad Inmueble o los registros que correspondan según el bien.
        </li>
      </ul>
      <p>
        Un consejo práctico: desconfíe de cualquier número cerrado ofrecido antes de conocer los bienes. El costo total
        depende de la valuación fiscal de los inmuebles, de la cantidad y tipo de bienes, y del grado de acuerdo entre
        herederos. Lo serio no es prometer una cifra por teléfono: es entregar un presupuesto desglosado después de un
        relevamiento patrimonial concreto.
      </p>

      <h2>Las etapas del trámite (y dónde se pierde el tiempo)</h2>
      <ol>
        <li>
          <strong>Reunión de documentación.</strong> Partidas, títulos de propiedad, datos de cuentas y vehículos. Es
          la etapa que más depende de la familia, y donde más expedientes quedan frenados antes de empezar.
        </li>
        <li>
          <strong>Inicio y apertura del proceso.</strong> Presentación de la demanda sucesoria con las partidas que
          acreditan el vínculo.
        </li>
        <li>
          <strong>Publicación de edictos y pedidos de informes</strong>, para citar a eventuales herederos y
          acreedores.
        </li>
        <li>
          <strong>Declaratoria de herederos.</strong> La resolución judicial que declara quiénes son los herederos. Es
          el hito central del proceso.
        </li>
        <li>
          <strong>Liquidación de tasa e impuestos, e inscripción de los bienes</strong> a nombre de los herederos.
          Recién con la inscripción los bienes quedan en condiciones plenas de venderse o dividirse.
        </li>
      </ol>
      <p>
        <strong>Plazos realistas:</strong> con la documentación completa y herederos que colaboran, la declaratoria
        puede obtenerse en pocos meses, y el trámite completo —con inscripción incluida— razonablemente dentro del
        año. Cuando hay bienes sin escriturar, herederos que no firman o desacuerdos sobre la partición, los tiempos se
        estiran a años. La variable que más acelera una sucesión no es el juzgado: es que alguien impulse el expediente
        cada semana en lugar de esperar que avance solo.
      </p>

      <h2>Las tres situaciones que encarecen todo</h2>
      <ul>
        <li>
          <strong>Inmuebles sin escriturar</strong> a nombre del fallecido: obligan a resolver primero la titularidad,
          con trámites adicionales previos a la sucesión misma.
        </li>
        <li>
          <strong>Un heredero que no colabora.</strong> El proceso no queda rehén de la voluntad de uno solo — existen
          vías procesales para avanzar —, pero cada incidencia suma tiempo y costo.
        </li>
        <li>
          <strong>Vender "de palabra" antes de inscribir.</strong> Los boletos firmados sobre bienes aún no inscriptos
          generan los conflictos más caros de destrabar después. El orden correcto es: declaratoria, inscripción, y
          recién entonces disposición de los bienes.
        </li>
      </ul>

      <h2>En resumen</h2>
      <p>
        Una sucesión en la Provincia de Buenos Aires tiene costos previsibles si se los releva antes de empezar, y
        plazos razonables si el expediente se gestiona activamente. En{' '}
        <Link href="/sucesiones">la página de sucesiones</Link> explicamos cómo trabajamos tanto las sucesiones simples
        como las particiones con herederos en desacuerdo, y puede solicitar una{' '}
        <Link href="/evaluacion">evaluación confidencial</Link> con el detalle de su caso para recibir un panorama
        concreto de costos y tiempos.
      </p>
    </ArticleShell>
  )
}
