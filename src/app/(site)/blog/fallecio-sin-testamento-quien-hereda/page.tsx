import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { ArticleShell } from '@/components/blog/ArticleShell'
import { getArticle } from '@/data/articles'

const article = getArticle('fallecio-sin-testamento-quien-hereda')

export const metadata: Metadata = buildMetadata({
  title: article.title,
  description: article.description,
  path: `/blog/${article.slug}`,
})

export default function ArticlePage() {
  return (
    <ArticleShell article={article}>
      <p>
        Cuando alguien fallece sin testamento aparecen dos miedos opuestos, y los dos suelen estar equivocados. El
        primero: "¿el Estado se queda con todo?" (casi nunca). El segundo, más silencioso: "algo me va a tocar, estuve
        toda la vida con él" — y a veces la respuesta es <strong>nada</strong>. La verdad es que{' '}
        <strong>cuando no hay testamento, la ley ya escribió uno</strong>: el Código Civil y Comercial define con
        precisión quién hereda, en qué orden y en qué proporción. A veces coincide con lo que la familia espera. Otras
        veces, deja afuera exactamente a quien compartió la vida con el fallecido.
      </p>

      <h2>El orden que fija la ley</h2>
      <p>
        La sucesión "intestada" (sin testamento) sigue un orden de llamamiento (arts. 2424 y siguientes del CCyC):
        primero los <strong>descendientes</strong> (hijos y, por representación, nietos), luego los{' '}
        <strong>ascendientes</strong> (padres), el <strong>cónyuge</strong> — que concurre con unos y otros, como
        veremos — y, a falta de todos ellos, los <strong>colaterales hasta el cuarto grado</strong>: hermanos,
        sobrinos, tíos, primos. Recién si no existe ninguno de ellos la herencia se declara vacante y pasa al Fisco.
        Con que exista un primo, el Estado no ve un peso.
      </p>
      <p>Veamos los escenarios concretos, que es donde están las sorpresas.</p>

      <h2>Escenario 1: hay hijos</h2>
      <p>
        Los hijos heredan <strong>por partes iguales</strong> (art. 2426). Todos: los del matrimonio, los de parejas
        anteriores, los nacidos fuera de toda pareja — la ley no distingue, siempre que la filiación esté establecida.
        Si un hijo falleció antes que el causante, su parte pasa a sus propios hijos (los nietos), que "lo
        representan".
      </p>

      <h2>Escenario 2: hay cónyuge e hijos — la regla de los gananciales que confunde a todos</h2>
      <p>
        Acá está el malentendido más frecuente de todo el derecho sucesorio argentino. Cuando el cónyuge concurre con
        hijos, hay que separar dos masas de bienes:
      </p>
      <ul>
        <li>
          <strong>Sobre los bienes gananciales</strong> (los adquiridos durante el matrimonio), el cónyuge{' '}
          <strong>no hereda</strong> (art. 2433): retira la mitad que ya le pertenecía por la disolución de la
          comunidad — como en un divorcio — y la otra mitad, la que era del fallecido, se reparte{' '}
          <strong>solo entre los hijos</strong>.
        </li>
        <li>
          <strong>Sobre los bienes propios</strong> del fallecido (lo que tenía antes de casarse, lo heredado, lo
          donado), el cónyuge hereda <strong>como un hijo más</strong>: misma parte que cada uno de ellos.
        </li>
      </ul>
      <p>
        Ejemplo simple: matrimonio con dos hijos, único bien una casa comprada durante el matrimonio. Fallece uno de
        los cónyuges. El supérstite conserva el 50% que ya era suyo por la comunidad, y el otro 50% se divide entre los
        dos hijos (25% cada uno). El cónyuge <em>no</em> recibe "la mitad más una parte": recibe su mitad de siempre, y
        nada por herencia sobre ese bien. Cuando la familia es ensamblada — hijos de un matrimonio anterior — esta
        regla explica la mayoría de los conflictos entre "la viuda y los hijos del primer matrimonio".
      </p>
      <p>
        Una protección importante que sí tiene el cónyuge: el <strong>derecho real de habitación vitalicio y
        gratuito</strong> sobre el inmueble que fue sede del hogar (art. 2383). Aunque los hijos hereden su parte de la
        casa, no pueden echar al viudo o viuda de la vivienda familiar.
      </p>

      <h2>Escenario 3: cónyuge separado de hecho — el dato que pocos conocen</h2>
      <p>
        Estar casado "en los papeles" no siempre alcanza. El cónyuge <strong>separado de hecho sin voluntad de unirse
        pierde la vocación hereditaria</strong> (art. 2437), igual que el divorciado. Quien se separó hace quince años
        y nunca tramitó el divorcio no hereda a su ex — aunque el acta de matrimonio siga vigente. La contracara
        también importa: mientras la separación de hecho no se configure o no se pruebe, el vínculo formal sigue
        produciendo efectos. En patrimonios importantes, esta zona gris es un semillero de litigios.
      </p>

      <h2>Escenario 4: la pareja conviviente — la respuesta que nadie quiere escuchar</h2>
      <p>
        El conviviente <strong>no hereda</strong>. No está en el orden sucesorio del Código: ni con cinco, ni con
        veinte, ni con cuarenta años de convivencia; ni siquiera registrando la unión convivencial. Lo único que la ley
        le reconoce ante la muerte de su pareja es un <strong>derecho real de habitación gratuito sobre la vivienda
        común, por un máximo de dos años</strong>, si carece de vivienda propia (art. 527). Después de eso, los
        herederos — hijos, padres o hasta los hermanos del fallecido — pueden disponer del inmueble.
      </p>
      <p>
        Esto no es una opinión sobre cómo debería ser la ley: es cómo es. Y tiene una sola solución, que es{' '}
        <strong>planificar en vida</strong>: testamento a favor del conviviente (dentro de la porción que la ley
        permite), donaciones, seguros de vida con beneficiario designado, o estructuras patrimoniales adecuadas al
        caso. Para las parejas no casadas con patrimonio en común, la planificación sucesoria no es un lujo de ricos:
        es la diferencia entre que la pareja conserve su vida o quede en la calle a los dos años.
      </p>

      <h2>¿Y si hubiera habido testamento? Los límites que igual aplican</h2>
      <p>
        Un apunte para completar el mapa: en Argentina el testamento tampoco es un cheque en blanco. Existe la{' '}
        <strong>legítima</strong> (art. 2445): los hijos tienen asegurados dos tercios del patrimonio, los ascendientes
        y el cónyuge la mitad, según quién herede. El testador solo dispone libremente de la <strong>porción
        disponible</strong> — un tercio habiendo hijos. Con una excepción valiosa y poco conocida: puede destinarse
        además un tercio de la legítima a <strong>mejorar a un heredero con discapacidad</strong> (art. 2448), una
        herramienta central para padres que quieren proteger especialmente a ese hijo.
      </p>

      <h2>Haya o no testamento, el trámite es el mismo</h2>
      <p>
        En la Provincia de Buenos Aires, la herencia se materializa a través del <strong>proceso sucesorio
        judicial</strong>: hasta la declaratoria de herederos y la inscripción, los bienes quedan a nombre del
        fallecido — no se pueden vender ni transferir regularmente. Los costos y plazos reales del trámite los
        desglosamos en la guía{' '}
        <Link href="/blog/cuanto-cuesta-tarda-sucesion-provincia-buenos-aires">
          cuánto cuesta y cuánto tarda una sucesión en la Provincia de Buenos Aires
        </Link>
        .
      </p>

      <h2>En resumen</h2>
      <p>
        Sin testamento, hereda quien la ley dice — y la ley tiene reglas que sorprenden: el cónyuge no hereda los
        gananciales cuando hay hijos, el separado de hecho queda afuera, y el conviviente no hereda nunca. Si acaba de
        perder a un familiar y necesita ordenar la sucesión, o si quiere planificar en vida para que su patrimonio
        termine donde usted decide, en <Link href="/sucesiones">la página de sucesiones</Link> explicamos cómo
        intervenimos, y puede solicitar una <Link href="/evaluacion">evaluación confidencial del caso</Link>.
      </p>
    </ArticleShell>
  )
}
