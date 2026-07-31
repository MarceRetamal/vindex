import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { ArticleShell } from '@/components/blog/ArticleShell'
import { getArticle } from '@/data/articles'

const article = getArticle('canasta-crianza-cuota-alimentaria-fallos')

export const metadata: Metadata = buildMetadata({
  title: article.title,
  description: article.description,
  path: `/blog/${article.slug}`,
})

export default function ArticlePage() {
  return (
    <ArticleShell article={article}>
      <p>
        Durante décadas, las discusiones por la cuota alimentaria fueron una pulseada a ciegas. Uno decía que no le
        alcanzaba, el otro que no podía pagar más, y en el medio un juez trataba de adivinar cuánto cuesta realmente
        criar un chico. Eso cambió. Desde hace un tiempo, el INDEC publica todos los meses un número que le puso fin a
        la adivinanza: la canasta de crianza, que mide cuánto cuesta mantener a un hijo según su edad, sumando dos
        cosas que antes se discutían por separado. Los gastos visibles, como comida, salud, educación y vivienda. Y
        algo que durante generaciones se hizo gratis y sin recibo: el valor económico del tiempo de cuidado. Los
        tribunales de todo el país la adoptaron rápido, y los fallos recientes dejaron dos definiciones que cualquiera
        que pase o reciba una cuota necesita conocer.
      </p>

      <h2>Primera definición: la canasta es un piso, no un techo</h2>
      <p>
        Como toda herramienta nueva, la canasta empezó a usarse también para lo contrario de su propósito. Algunos
        alimentantes, y algunos abogados, comenzaron a agitarla como si fuera un límite: la cuota no puede superar la
        canasta, dicen, como si el INDEC hubiera fijado el precio máximo de un hijo. En abril de 2026, la Suprema Corte
        de Justicia de Jujuy salió a cortar esa lectura de raíz, en un caso donde la cámara había reducido una cuota ya
        fijada usando la canasta como referencia hacia abajo. El máximo tribunal provincial calificó esa reducción de
        arbitraria y recordó un principio central del derecho alimentario: la no regresividad. Una cuota establecida no
        se baja sin acreditar un cambio real y sustancial de circunstancias, y la canasta funciona como referencia de
        mínima, nunca como tope.
      </p>
      <p>
        La lógica es simple si se la piensa un minuto. La canasta mide el costo de crianza promedio, de subsistencia
        digna. Pero el derecho alimentario argentino ordena mirar también el nivel de vida del alimentante y el que el
        chico tenía antes de la ruptura. El hijo de alguien con buenos ingresos no tiene por qué vivir en el promedio
        estadístico mientras su progenitor vive holgado. Por eso hay fallos que fijan cuotas muy por encima del
        índice: en Bariloche, la Cámara de Apelaciones confirmó en abril de 2026 una cuota equivalente a dos canastas
        y media de crianza para un chico de doce años, y lo hizo con un argumento que merece leerse dos veces.
      </p>

      <h2>Segunda definición: cuidar también es pagar</h2>
      <p>
        En ese caso de Bariloche, el tribunal valoró especialmente que el cuidado cotidiano del chico recaía de manera
        exclusiva sobre uno de los progenitores, y sostuvo lo que el Código Civil y Comercial dice desde 2015 en su
        artículo 660, pero que en la práctica costó años hacer valer: las tareas diarias de quien cría tienen valor
        económico y constituyen un aporte a la manutención. Llevar a la escuela, acompañar al médico, cocinar, ayudar
        con la tarea, estar. Todo eso es plata, aunque no figure en ningún recibo. La consecuencia práctica es directa:
        cuando el cuidado está claramente desbalanceado, la cuota en dinero del otro progenitor tiene que compensar ese
        desbalance, y los jueces lo están escribiendo en las sentencias con todas las letras.
      </p>

      <h2>Y la tercera, que sorprende a muchos: los abuelos pueden tener que pagar</h2>
      <p>
        Cuando el progenitor obligado no paga, se esconde, trabaja en negro o directamente no tiene con qué, el
        reclamo no muere ahí. El Código prevé que la obligación alcance a los ascendientes, y el artículo 668 permite
        incluso demandar a los abuelos en el mismo proceso, acreditando la dificultad de cobrarle al obligado
        principal. No es teoría de manual: en fallos de este mismo año se fijaron cuotas equivalentes a la canasta de
        crianza a cargo del progenitor y, en subsidio, del abuelo. La obligación de los abuelos es subsidiaria, no
        automática, y los tribunales la manejan con prudencia, pero existe y se está aplicando. Para el progenitor que
        lleva años persiguiendo a un deudor fantasma, saber que la cadena de obligados no se corta en él puede cambiar
        el resultado del caso. Y para los abuelos, conviene decirlo con la misma franqueza, es una contingencia real
        que merece asesoramiento propio.
      </p>

      <h2>Cómo se usa todo esto en un caso concreto</h2>
      <p>
        Si va a reclamar una cuota, o a pedir el aumento de una que quedó vieja, la canasta de crianza es hoy su punto
        de partida: un piso objetivo, publicado por un organismo oficial, contra el que ninguna chicana probatoria
        puede discutir demasiado. Sobre esa base se construye el resto, acreditando las necesidades concretas del hijo
        y la capacidad económica real del obligado, que cuando hay informalidad se prueba por indicios: el nivel de
        vida, los movimientos, los bienes. Si en cambio le reclaman a usted, la canasta también lo protege de pedidos
        sin sustento, porque ordena la discusión alrededor de datos y no de enojos. Y en cualquiera de las dos
        posiciones, la cuota debe preverse con actualización periódica, porque un monto fijo en pesos nace muerto.
      </p>
      <p>
        Sobre las reglas de base de la obligación alimentaria, desde qué edad hasta qué edad se debe, desde cuándo se
        computa la deuda y qué herramientas hay contra el incumplidor, puede leer nuestra guía completa sobre{' '}
        <Link href="/blog/cuota-alimentaria-cuanto-corresponde-hasta-cuando">
          cuota alimentaria: cuánto corresponde, hasta cuándo y qué hacer si no pagan
        </Link>
        .
      </p>

      <p>
        Los criterios descriptos corresponden a fallos y valores vigentes a julio de 2026; los montos de la canasta se
        actualizan todos los meses y la jurisprudencia sigue afinándose. Si necesita fijar, aumentar o defenderse de
        una cuota en La Plata o en la Provincia de Buenos Aires, la{' '}
        <Link href="/evaluacion">evaluación confidencial</Link> nos permite ver sus números concretos y decirle qué
        puede esperar de manera realista.
      </p>
    </ArticleShell>
  )
}
