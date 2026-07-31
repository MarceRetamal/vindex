import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { ArticleShell } from '@/components/blog/ArticleShell'
import { getArticle } from '@/data/articles'

const article = getArticle('despido-sin-causa-como-se-calcula-indemnizacion')

export const metadata: Metadata = buildMetadata({
  title: article.title,
  description: article.description,
  path: `/blog/${article.slug}`,
})

export default function ArticlePage() {
  return (
    <ArticleShell article={article}>
      <p>
        Desde la reforma laboral de 2024 circula mucha confusión: hay quien cree que "ya no hay más indemnización" y
        quien sigue calculando multas que ya no existen. Ninguna de las dos cosas es cierta. Esta guía explica qué
        rubros integran hoy la indemnización por despido sin causa de un trabajador registrado, cómo se calcula cada
        uno, qué cambió efectivamente con la reforma y qué pasos dar antes de reclamar.
      </p>

      <h2>Lo primero: la indemnización por despido sigue plenamente vigente</h2>
      <p>
        La reforma (Ley 27.742, "Ley Bases") <strong>no eliminó la indemnización por antigüedad</strong> del artículo
        245 de la Ley de Contrato de Trabajo. Lo que sí eliminó, principalmente, fueron las <strong>multas e
        indemnizaciones agravadas</strong> vinculadas al empleo no registrado o mal registrado y a la falta de entrega
        de certificados, que en la práctica anterior podían duplicar o triplicar un reclamo. También habilitó que los
        convenios colectivos reemplacen el régimen indemnizatorio por un <strong>fondo de cese laboral</strong> — pero
        eso solo aplica si el convenio de su actividad efectivamente lo adoptó; si no, rige el régimen general que
        explicamos acá.
      </p>

      <h2>Los rubros, uno por uno</h2>
      <ul>
        <li>
          <strong>Indemnización por antigüedad (art. 245 LCT).</strong> Es el rubro central: un mes de sueldo por cada
          año de servicio o fracción mayor a tres meses. La base de cálculo es la <em>mejor remuneración mensual,
          normal y habitual</em> del último año (o del tiempo trabajado, si es menor). Existe un tope según el convenio
          colectivo aplicable, pero la Corte Suprema fijó hace años un piso de protección: la base no puede reducirse
          por el tope en más de un tercio (doctrina del caso "Vizzoti"). Si su sueldo supera holgadamente los promedios
          de convenio, este punto puede cambiar mucho el número final y requiere cálculo fino.
        </li>
        <li>
          <strong>Indemnización sustitutiva de preaviso.</strong> Si el empleador despide sin avisar con la antelación
          legal (un mes con antigüedad de hasta cinco años, dos meses si es mayor; quince días durante el período de
          prueba), debe pagar los sueldos equivalentes a ese plazo no otorgado.
        </li>
        <li>
          <strong>Integración del mes de despido.</strong> Si el despido no coincide con el último día del mes,
          corresponden además los días que faltan para completarlo.
        </li>
        <li>
          <strong>Aguinaldo (SAC) proporcional</strong>, por la parte del semestre trabajada, más su incidencia sobre
          el preaviso y la integración.
        </li>
        <li>
          <strong>Vacaciones proporcionales no gozadas</strong>, calculadas según los días que correspondan por
          antigüedad y la fracción del año trabajada.
        </li>
        <li>
          <strong>Salarios adeudados</strong>: días trabajados del último mes, horas extras impagas, y todo concepto
          pendiente.
        </li>
      </ul>

      <h2>Un ejemplo simple del esqueleto del cálculo</h2>
      <p>
        Un trabajador con 4 años y 6 meses de antigüedad, despedido sin causa y sin preaviso a mitad de mes: le
        corresponden 5 períodos de antigüedad (los 4 años más la fracción que supera los 3 meses), un mes de preaviso
        con su SAC, la integración del mes con su SAC, el aguinaldo proporcional del semestre y las vacaciones
        proporcionales. El número exacto depende de cuál fue su mejor remuneración normal y habitual y del convenio
        aplicable — por eso dos casos con el mismo sueldo de bolsillo pueden arrojar indemnizaciones distintas.
      </p>

      <h2>Qué cambió (y qué no) con la reforma</h2>
      <ul>
        <li>
          <strong>Ya no rigen</strong> las indemnizaciones agravadas por empleo no registrado de la Ley 24.013, ni los
          incrementos de la Ley 25.323, ni la multa por falta de entrega del certificado de trabajo. Los reclamos
          iniciados hoy no pueden apoyarse en esos rubros.
        </li>
        <li>
          <strong>El período de prueba se amplió</strong> (seis meses como regla, con posibilidad de extensión por
          convenio según el tamaño de la empresa). Durante ese período, el despido no genera indemnización por
          antigüedad, aunque sí preaviso de quince días.
        </li>
        <li>
          <strong>Siguen intactos</strong>: la indemnización por antigüedad, el preaviso, la integración, el SAC, las
          vacaciones proporcionales, y las protecciones agravadas por despidos discriminatorios o durante embarazo y
          matrimonio.
        </li>
        <li>
          <strong>El trabajo no registrado sigue generando derechos.</strong> Que hayan desaparecido las multas no
          significa que el empleo "en negro" quede sin consecuencias: la relación puede probarse por otros medios y la
          indemnización se calcula sobre la remuneración real, no sobre la declarada.
        </li>
      </ul>

      <h2>Los pasos correctos antes de reclamar</h2>
      <ol>
        <li>
          <strong>No firme nada que no entienda</strong>, en especial acuerdos de desvinculación o recibos "por saldo
          total". Pida llevarse copia y consultarla: es su derecho.
        </li>
        <li>
          <strong>Guarde todo</strong>: recibos de sueldo, telegramas, mensajes con superiores, registros horarios. La
          prueba del vínculo y del salario real es la mitad del caso.
        </li>
        <li>
          <strong>Intime por telegrama laboral.</strong> El trabajador cuenta con el telegrama gratuito (Ley 23.789)
          para intimar el pago de la liquidación o aclarar la situación laboral. Su redacción no es un detalle: un
          telegrama mal planteado puede debilitar el reclamo posterior, por eso conviene redactarlo con asesoramiento.
        </li>
        <li>
          <strong>No deje pasar el tiempo.</strong> Los créditos laborales prescriben a los dos años. Parece mucho;
          entre intentos de arreglo y esperas, se va rápido.
        </li>
      </ol>

      <h2>En resumen</h2>
      <p>
        El despido sin causa sigue teniendo un costo legal claro y calculable; lo que cambió es el mapa de rubros, y
        calcular con el mapa viejo lleva a reclamar mal — por exceso o por defecto. Si lo despidieron o le proponen
        firmar una desvinculación en La Plata o en la Provincia de Buenos Aires, puede solicitar una{' '}
        <Link href="/evaluacion">evaluación confidencial del caso</Link> con su documentación para conocer el cálculo
        concreto de su liquidación antes de tomar cualquier decisión.
      </p>
    </ArticleShell>
  )
}
