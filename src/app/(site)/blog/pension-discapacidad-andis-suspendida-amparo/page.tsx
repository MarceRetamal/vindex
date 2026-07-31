import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { ArticleShell } from '@/components/blog/ArticleShell'
import { getArticle } from '@/data/articles'

const article = getArticle('pension-discapacidad-andis-suspendida-amparo')

export const metadata: Metadata = buildMetadata({
  title: article.title,
  description: article.description,
  path: `/blog/${article.slug}`,
})

export default function ArticlePage() {
  return (
    <ArticleShell article={article}>
      <p>
        Un mes la pensión estaba depositada como siempre. Al siguiente, no. Sin carta, sin resolución, sin nadie que
        atienda el teléfono para explicar por qué una prestación de la que depende un tratamiento, un alquiler o la
        comida de una familia simplemente dejó de existir. Esa escena se repitió decenas de miles de veces en los
        últimos dos años, y generó una de las batallas judiciales más intensas que se recuerden contra un organismo
        del Estado. Si usted o un familiar están en esa situación, o llevan meses esperando que ANDIS resuelva una
        solicitud que no avanza, este artículo le cuenta el estado real de las cosas, sin promesas infladas y sin
        resignación anticipada. Porque el mapa judicial cambió varias veces en pocos meses, y conviene entenderlo antes
        de decidir qué hacer.
      </p>

      <h2>Cómo se llegó hasta acá</h2>
      <p>
        El origen está en las auditorías dispuestas por el decreto 843/2024 sobre las pensiones no contributivas por
        invalidez. En su aplicación, una enorme cantidad de prestaciones fueron suspendidas o dadas de baja, muchas
        veces por citaciones que nunca llegaron a destino o por criterios de revisión que endurecieron los requisitos.
        En paralelo, las solicitudes nuevas quedaron durmiendo en cajones administrativos durante meses o años. La
        respuesta llegó por dos vías: la política, con la sanción de la ley 27.793 de Emergencia Nacional en
        Discapacidad, reglamentada en 2026 tras una intimación judicial; y la judicial, con una ola de amparos en todo
        el país.
      </p>

      <h2>Qué pasó con el famoso amparo colectivo</h2>
      <p>
        Quizás escuchó las dos noticias, que parecen contradictorias. Las dos son ciertas. A fines de 2025, la justicia
        federal de Catamarca, en un amparo colectivo iniciado por el Defensor del Pueblo de esa provincia junto a
        organizaciones de la sociedad civil, ordenó a ANDIS restituir las pensiones suspendidas con alcance para todo
        el país; el organismo llegó a dictar la resolución 13901/2025 restableciendo los pagos en cumplimiento de la
        medida cautelar, y en noviembre la sentencia de fondo reconoció el derecho de todo el colectivo, calificando
        las suspensiones masivas como una vía de hecho de la administración. Pero en febrero de 2026 la Cámara Federal
        de Tucumán revocó esa sentencia, entendiendo que la ley de emergencia y su reglamentación habían cambiado el
        marco normativo. Las organizaciones anunciaron que llevarán la discusión a la Corte Suprema, de modo que la
        palabra final todavía no está dicha.
      </p>
      <p>
        La traducción práctica de todo esto es lo que importa: la vía colectiva quedó, por ahora, en suspenso. Lo que
        no se detuvo, y esto es lo que casi no se cuenta, son los reclamos individuales.
      </p>

      <h2>Los reclamos individuales siguen ganando</h2>
      <p>
        Mientras el expediente colectivo sube y baja por las instancias, los juzgados federales del país siguen
        resolviendo casos concretos, con nombre y apellido, y los vienen resolviendo a favor de las personas con
        discapacidad. En abril de 2026, la Cámara Federal de Resistencia confirmó un embargo contra ANDIS por no
        restituir las pensiones de dos hermanas cuya situación se había vuelto desesperante tras la baja del
        beneficio. En mayo, la justicia federal de Entre Ríos ordenó devolver una pensión en un fallo que los propios
        abogados de la zona señalaron como puerta de entrada para miles de casos similares. La lógica de fondo se
        repite en estas sentencias: una prestación de la seguridad social otorgada no puede suprimirse sin un
        procedimiento serio, con notificación real y derecho a defenderse, y las personas con discapacidad gozan de
        una protección constitucional reforzada que el Estado no puede esquivar con argumentos de gestión.
      </p>
      <p>
        Hay además una segunda situación, distinta de la suspensión, que tiene su propia herramienta: la del que pidió
        la pensión, cumple los requisitos, y el expediente lleva una eternidad sin respuesta. Para eso existe el amparo
        por mora, un mecanismo pensado precisamente para que un juez le ordene a la administración resolver de una vez,
        en un plazo concreto. No le garantiza que la respuesta sea favorable, pero termina con el limbo del silencio,
        que es muchas veces la peor de las respuestas.
      </p>

      <h2>Qué conviene hacer, concretamente</h2>
      <p>
        Lo primero es ordenar los papeles, porque estos reclamos se ganan con documentación. El Certificado Único de
        Discapacidad vigente, la historia clínica y los estudios que acreditan la condición, toda notificación o
        constancia que tenga de ANDIS, los comprobantes de cuándo cobró por última vez, y si hizo presentaciones o
        reclamos, sus números de trámite. Segundo, dejar asentado el reclamo administrativo, que además de ser un paso
        a veces necesario, construye la prueba de la demora o de la arbitrariedad. Y tercero, con eso en la mano,
        evaluar la vía judicial que corresponde a su caso: no es lo mismo una suspensión sin notificación, una baja
        tras una auditoría a la que no pudo presentarse, o una solicitud nueva cajoneada. Cada escenario tiene su
        estrategia y sus plazos, y los plazos en materia de amparo son cortos, así que la consulta temprana no es un
        detalle.
      </p>
      <p>
        Una aclaración que corresponde hacer: estos reclamos tramitan ante la justicia federal, y nuestro estudio
        cuenta con matrícula federal para llevarlos, con base en La Plata y alcance en la región.
      </p>

      <p>
        Este es el estado de situación a julio de 2026, en una materia que sigue moviéndose: lo que resuelva la Corte
        Suprema, y la forma en que se aplique el nuevo régimen de pensiones de la reglamentación de la ley de
        emergencia, pueden volver a cambiar el tablero. Si le suspendieron la pensión, se la denegaron o su trámite no
        avanza, puede contarnos su situación a través de la{' '}
        <Link href="/evaluacion">evaluación confidencial</Link>: revisamos su documentación y le decimos con franqueza
        qué vía tiene sentido en su caso y cuál no.
      </p>
    </ArticleShell>
  )
}
