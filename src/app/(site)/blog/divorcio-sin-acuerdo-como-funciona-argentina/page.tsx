import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { ArticleShell } from '@/components/blog/ArticleShell'
import { getArticle } from '@/data/articles'

const article = getArticle('divorcio-sin-acuerdo-como-funciona-argentina')

export const metadata: Metadata = buildMetadata({
  title: article.title,
  description: article.description,
  path: `/blog/${article.slug}`,
})

export default function ArticlePage() {
  return (
    <ArticleShell article={article}>
      <p>
        "No te voy a dar el divorcio." La frase se sigue usando como amenaza en discusiones de pareja, y sigue
        funcionando — pero solo porque mucha gente no sabe que, jurídicamente, está vacía desde 2015. Con el Código
        Civil y Comercial vigente, <strong>el divorcio no se "da": se pide, y el juez debe decretarlo</strong>. Nadie
        puede oponerse, nadie puede frenarlo y no hay que explicarle al Estado por qué un matrimonio se termina. Esta
        guía explica cómo funciona realmente, qué se divide y qué no, y un plazo de seis meses que hace perder derechos
        valiosos a quien no lo conoce.
      </p>

      <h2>El divorcio es incausado: no hay culpables que probar</h2>
      <p>
        Desde agosto de 2015 no existen las "causales" de divorcio. No hay que probar adulterio, abandono ni injurias;
        no hay juicio sobre quién arruinó el matrimonio. Basta la voluntad de <strong>uno solo</strong> de los cónyuges
        (arts. 437 y 438 del Código Civil y Comercial): puede pedirse de común acuerdo o unilateralmente, y el
        resultado es el mismo. Tampoco hay plazos de espera: no se exige un tiempo mínimo de matrimonio ni una
        separación previa. Casados hace tres meses o hace treinta años, el derecho a divorciarse es idéntico.
      </p>
      <p>
        Esto tiene una consecuencia que sorprende a muchos consultantes: <strong>la infidelidad no tiene efectos
        patrimoniales</strong>. Quien fue engañado no recibe "más" en la división de bienes, y quien engañó no pierde
        nada por eso. El reproche moral quedó fuera del expediente; lo que se discute es solamente cómo se ordenan los
        efectos de la ruptura.
      </p>

      <h2>El único requisito real: la propuesta reguladora</h2>
      <p>
        Lo que la ley sí exige (art. 438) es que quien pide el divorcio acompañe una <strong>propuesta que regule los
        efectos</strong>: qué pasa con la vivienda, cómo se distribuyen los bienes, el cuidado de los hijos y sus
        alimentos, y una eventual compensación económica. Si el pedido es unilateral, el otro cónyuge puede presentar
        una propuesta distinta. Y acá viene el dato central, que la propia norma dice de manera expresa: <strong>el
        desacuerdo sobre esos temas no suspende el dictado de la sentencia de divorcio</strong>. Traducido: el divorcio
        sale igual, y lo que no se acordó se sigue discutiendo después, por vías separadas. Por eso "trabar" un
        divorcio discutiendo la casa o los bienes es una estrategia condenada de antemano.
      </p>

      <h2>Qué se divide y qué no</h2>
      <p>
        Salvo que el matrimonio haya optado por el régimen de separación de bienes mediante convención, rige la{' '}
        <strong>comunidad de ganancias</strong>. La regla práctica:
      </p>
      <ul>
        <li>
          <strong>Bienes gananciales</strong> — los adquiridos a título oneroso durante el matrimonio — se dividen{' '}
          <strong>por mitades</strong>, sin importar a nombre de quién estén ni quién ganaba más. El aporte del hogar y
          del cuidado vale igual que el sueldo.
        </li>
        <li>
          <strong>Bienes propios</strong> — los que cada uno tenía antes de casarse, y los recibidos por herencia o
          donación incluso durante el matrimonio — <strong>no se dividen</strong>: siguen siendo de su titular.
        </li>
      </ul>
      <p>
        Un detalle técnico con impacto real: la comunidad se extingue con <strong>efecto retroactivo al día de la
        notificación de la demanda o de la petición conjunta</strong> (art. 480). Lo que cada uno adquiere después de
        ese momento ya es suyo, no ganancial — otra razón para no dilatar la presentación.
      </p>

      <h2>La compensación económica y el plazo que casi nadie conoce</h2>
      <p>
        El Código creó una herramienta pensada para un escenario muy concreto: el cónyuge que resignó su desarrollo
        profesional para sostener el proyecto familiar — típicamente quien dejó de trabajar o estudió a medias para
        criar — y queda, tras la ruptura, en un <strong>desequilibrio manifiesto</strong> respecto del otro. Es la{' '}
        <strong>compensación económica</strong> (arts. 441 y 442): puede consistir en una suma única, una renta por
        tiempo determinado o la entrega de un bien.
      </p>
      <p>
        Ahora, el dato que hace la diferencia entre cobrarla y perderla: la acción <strong>caduca a los seis meses de
        dictada la sentencia de divorcio</strong> (art. 442, último párrafo). Caducidad, no prescripción: pasado el
        plazo, el derecho se extingue sin remedio. Es probablemente el derecho más valioso que se pierde por
        desconocimiento en los divorcios argentinos, y la razón por la que conviene planificar el divorcio completo —
        no solo "firmar los papeles".
      </p>
      <p>
        Distinto es el régimen de alimentos entre ex cónyuges: después del divorcio son <strong>excepcionales</strong>{' '}
        (art. 434) — proceden, básicamente, a favor de quien padece una enfermedad grave preexistente o de quien carece
        de recursos y de posibilidad razonable de procurárselos, con límites temporales. La regla es la
        autosuficiencia; la protección amplia quedó reservada para los hijos.
      </p>

      <h2>Tres mitos que conviene enterrar</h2>
      <ul>
        <li>
          <strong>"Si me voy de casa, pierdo todo."</strong> Falso. El "abandono de hogar" dejó de existir como causal
          porque ya no existen causales. Irse del hogar no hace perder los derechos sobre los bienes gananciales ni los
          derechos sobre los hijos. Dicho esto, cómo y cuándo retirarse puede tener consecuencias prácticas (vivienda,
          cuidado de los hijos), así que conviene ordenarlo con asesoramiento — pero no por miedo a una sanción que ya
          no existe.
        </li>
        <li>
          <strong>"Me corresponde la mitad de todo."</strong> Impreciso. La mitad es de los gananciales; los bienes
          propios del otro (lo anterior al matrimonio, lo heredado, lo donado) no entran en la división.
        </li>
        <li>
          <strong>"Necesito que firme."</strong> No. La firma del otro no es un requisito. Su silencio o su negativa no
          impiden la sentencia.
        </li>
      </ul>

      <h2>Cómo es el trámite en la Provincia de Buenos Aires</h2>
      <p>
        El divorcio tramita ante la justicia de familia, con patrocinio letrado obligatorio. La presentación conjunta —
        con un convenio regulador ya acordado — es la vía más rápida y económica: en esos casos el proceso se reduce,
        esencialmente, a la homologación de lo acordado. La documentación de base es simple: acta de matrimonio,
        partidas de nacimiento de los hijos y el detalle de los bienes. Cuando hay acuerdo en lo grueso pero diferencias
        en puntos específicos, suele convenir divorciarse ya y canalizar esas diferencias por su vía propia, en lugar de
        dejar todo el proyecto de vida en suspenso.
      </p>

      <h2>En resumen</h2>
      <p>
        Nadie queda casado contra su voluntad en la Argentina. La discusión real de un divorcio no es "si" sino "cómo":
        cómo se divide lo ganancial, cómo se organiza la vida de los hijos, y si corresponde una compensación económica
        — con un reloj de seis meses corriendo desde la sentencia. Si está evaluando divorciarse, o le dijeron que "no
        le van a dar el divorcio", puede solicitar una{' '}
        <Link href="/evaluacion">evaluación confidencial del caso</Link> para conocer su posición concreta antes de dar
        cualquier paso.
      </p>
    </ArticleShell>
  )
}
