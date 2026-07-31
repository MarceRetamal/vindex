import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { ArticleShell } from '@/components/blog/ArticleShell'
import { getArticle } from '@/data/articles'

const article = getArticle('citacion-penal-provincia-buenos-aires-que-hacer')

export const metadata: Metadata = buildMetadata({
  title: article.title,
  description: article.description,
  path: `/blog/${article.slug}`,
})

export default function ArticlePage() {
  return (
    <ArticleShell article={article}>
      <p>
        Recibir una cédula de notificación de una fiscalía desordena a cualquiera. La reacción típica es alguna de
        estas tres: entrar en pánico, ignorarla esperando que "se caiga sola", o —la peor— presentarse a "aclarar todo"
        sin abogado. Las tres son errores. Esta guía explica qué significa esa notificación en la Provincia de Buenos
        Aires, qué derechos tiene y qué conviene hacer, en orden, en las primeras 48 horas.
      </p>

      <h2>Qué significa que le llegue una citación de la fiscalía</h2>
      <p>
        En la Provincia de Buenos Aires, las causas penales comienzan con una <strong>Investigación Penal
        Preparatoria (IPP)</strong>, dirigida por un agente fiscal (las UFI, Unidades Funcionales de Instrucción). Que
        exista una IPP con su nombre no significa que haya una condena en camino: significa que alguien presentó una
        denuncia o que hubo una actuación policial, y que el fiscal está reuniendo elementos para decidir si la causa
        avanza, se archiva o se desestima.
      </p>
      <p>
        El dato más importante de la cédula es <strong>en qué carácter lo citan</strong>. No es lo mismo ser citado
        como <strong>testigo</strong> (declarar es, en principio, una carga pública) que ser citado a prestar{' '}
        <strong>declaración como imputado</strong> —la audiencia que en la práctica bonaerense todos conocen como "la
        del artículo 308", por el artículo del Código Procesal Penal provincial que la regula—. Si lo citan en los
        términos del art. 308, el fiscal considera que existen elementos para sospechar de su participación en un
        delito. Ese es el momento exacto en el que necesita defensa técnica, no después.
      </p>

      <h2>Lo que no hay que hacer bajo ningún concepto</h2>
      <ul>
        <li>
          <strong>No declare sin abogado.</strong> Ni en la fiscalía, ni en la comisaría, ni "informalmente". Todo lo
          que diga puede incorporarse al expediente. En sede policial, además, el imputado no presta declaración sobre
          los hechos: solo pueden requerirle sus datos identificatorios.
        </li>
        <li>
          <strong>No contacte al denunciante.</strong> Llamarlo "para aclarar el malentendido" es de los errores más
          frecuentes y más caros: cualquier mensaje, audio o llamada puede terminar leído en un sentido que usted no
          previó, e incluso generar una imputación nueva (amenazas, desobediencia si hay medidas de restricción).
        </li>
        <li>
          <strong>No ignore la citación.</strong> No presentarse sin justificación puede derivar en que lo hagan
          comparecer por la fuerza pública. La incomparecencia no archiva nada: solo empeora su posición.
        </li>
        <li>
          <strong>No destruya mensajes ni documentación.</strong> Aunque crea que algo lo perjudica, elimínelo de la
          ecuación con estrategia, no borrándolo: la prueba que hoy le parece dañina puede ser, bien encuadrada, la que
          lo desvincule. Consérvelo todo y muéstreselo a su defensor.
        </li>
      </ul>

      <h2>Lo que sí conviene hacer, en orden</h2>
      <ol>
        <li>
          <strong>Lea la cédula completa y fotografíela.</strong> Identifique el número de IPP, la UFI interviniente,
          el carácter en que lo citan, la fecha de audiencia y la carátula (el delito que se investiga).
        </li>
        <li>
          <strong>Designe un defensor antes de la audiencia.</strong> Puede ser un defensor particular de su confianza
          o, si no puede afrontarlo, el defensor oficial que el Estado provee gratuitamente. Lo que no conviene es
          llegar a la audiencia a conocer a su defensa cinco minutos antes: la estrategia se construye con el
          expediente leído, no improvisando en el pasillo.
        </li>
        <li>
          <strong>Deje que su defensor lea la IPP antes de decidir si declara.</strong> Declarar es un derecho, no una
          obligación: puede abstenerse, y la ley es expresa en que el silencio no puede tomarse como presunción de
          culpabilidad. A veces declarar temprano es la mejor jugada; otras veces es regalarle al fiscal la hoja de
          ruta. Esa decisión es estratégica y se toma con el expediente a la vista, nunca antes.
        </li>
        <li>
          <strong>Reconstruya su prueba en frío.</strong> Mensajes, ubicaciones, testigos, comprobantes, cámaras.
          Cuanto antes se preserva, más vale: las cámaras de seguridad, por ejemplo, suelen regrabarse en días.
        </li>
      </ol>

      <h2>Si hubo detención o es un caso de flagrancia</h2>
      <p>
        Cuando hay aprehensión en flagrancia, la Provincia aplica un procedimiento especial acelerado, con plazos mucho
        más cortos y audiencias orales tempranas. Ahí las primeras horas no se miden en días sino en horas: el detenido
        tiene derecho a que se informe de inmediato a su familia y a su defensor, y a no declarar hasta contar con
        asistencia técnica. Si un familiar suyo fue detenido, el paso urgente es que un defensor tome intervención en
        la causa antes de la primera audiencia.
      </p>

      <h2>Una mención aparte: causas con medidas de protección</h2>
      <p>
        Si la causa penal coexiste con medidas de protección dictadas en el fuero de familia (prohibición de
        acercamiento, exclusión del hogar), el cumplimiento estricto de esas medidas es innegociable mientras estén
        vigentes, aunque las considere injustas: su discusión tiene canales procesales propios, y violarlas convierte
        un problema en dos. La defensa técnica en estos casos se lleva coordinadamente en ambos fueros.
      </p>

      <h2>En resumen</h2>
      <p>
        Una citación penal no se resuelve con explicaciones voluntariosas ni se cae sola con el tiempo: se resuelve con
        lectura técnica del expediente y una decisión estratégica sobre cada paso, empezando por el primero. Si recibió
        una notificación en La Plata o en cualquier punto de la Provincia de Buenos Aires, en{' '}
        <Link href="/penal-urgente">la página de defensa penal urgente</Link> explicamos cómo intervenimos, y puede
        solicitar una <Link href="/evaluacion">evaluación confidencial del caso</Link> antes de la audiencia.
      </p>
    </ArticleShell>
  )
}
