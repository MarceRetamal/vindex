<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Política de Privacidad — VINDEX | Estrategia Jurídica</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syne:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --negro: #0a0a0a;
      --negro-suave: #111111;
      --oro: #b8975a;
      --oro-claro: #d4af7a;
      --blanco: #f5f0eb;
      --blanco-suave: #e8e0d5;
      --gris: #888880;
      --borde: rgba(184, 151, 90, 0.2);
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background-color: var(--negro);
      color: var(--blanco-suave);
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 18px;
      line-height: 1.8;
      min-height: 100vh;
    }

    /* HEADER */
    header {
      border-bottom: 1px solid var(--borde);
      padding: 2.5rem 4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      background: rgba(10,10,10,0.97);
      backdrop-filter: blur(12px);
      z-index: 100;
    }

    .logo {
      font-family: 'Syne', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      color: var(--blanco);
      text-decoration: none;
      text-transform: uppercase;
    }

    .logo span {
      color: var(--oro);
    }

    .header-tag {
      font-family: 'Syne', sans-serif;
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gris);
    }

    /* HERO */
    .hero {
      padding: 7rem 4rem 5rem;
      border-bottom: 1px solid var(--borde);
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(ellipse, rgba(184,151,90,0.06) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-label {
      font-family: 'Syne', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--oro);
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .hero-label::before {
      content: '';
      display: inline-block;
      width: 2rem;
      height: 1px;
      background: var(--oro);
    }

    h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.8rem, 6vw, 5rem);
      font-weight: 300;
      line-height: 1.1;
      color: var(--blanco);
      margin-bottom: 2rem;
      max-width: 700px;
    }

    h1 em {
      font-style: italic;
      color: var(--oro-claro);
    }

    .hero-meta {
      font-family: 'Syne', sans-serif;
      font-size: 0.72rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--gris);
      display: flex;
      gap: 3rem;
    }

    .hero-meta span {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .hero-meta strong {
      color: var(--blanco-suave);
      font-weight: 500;
    }

    /* LAYOUT */
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 4rem;
    }

    /* CONTENT */
    .content {
      padding: 5rem 0;
    }

    .section {
      margin-bottom: 4rem;
      padding-bottom: 4rem;
      border-bottom: 1px solid var(--borde);
    }

    .section:last-child {
      border-bottom: none;
    }

    .section-number {
      font-family: 'Syne', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: var(--oro);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    .section-number::after {
      content: '';
      display: inline-block;
      width: 1.5rem;
      height: 1px;
      background: var(--oro);
      opacity: 0.5;
    }

    h2 {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      font-weight: 400;
      color: var(--blanco);
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    h3 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--blanco-suave);
      margin: 2rem 0 0.8rem;
    }

    p {
      color: rgba(232, 224, 213, 0.8);
      margin-bottom: 1.2rem;
      font-size: 1rem;
    }

    ul, ol {
      padding-left: 1.5rem;
      margin-bottom: 1.2rem;
    }

    li {
      color: rgba(232, 224, 213, 0.8);
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    li::marker {
      color: var(--oro);
    }

    a {
      color: var(--oro-claro);
      text-decoration: none;
      border-bottom: 1px solid rgba(212, 175, 122, 0.3);
      transition: border-color 0.2s;
    }

    a:hover {
      border-color: var(--oro-claro);
    }

    /* HIGHLIGHT BOX */
    .highlight {
      border-left: 2px solid var(--oro);
      padding: 1.5rem 2rem;
      background: rgba(184, 151, 90, 0.05);
      margin: 2rem 0;
      font-style: italic;
      font-size: 1.05rem;
      color: var(--blanco-suave);
    }

    /* TABLE */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-size: 0.9rem;
    }

    .data-table th {
      font-family: 'Syne', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--oro);
      text-align: left;
      padding: 0.8rem 1rem;
      border-bottom: 1px solid var(--borde);
    }

    .data-table td {
      padding: 0.8rem 1rem;
      color: rgba(232, 224, 213, 0.75);
      border-bottom: 1px solid rgba(184, 151, 90, 0.08);
      vertical-align: top;
    }

    .data-table tr:last-child td {
      border-bottom: none;
    }

    /* CONTACT CARD */
    .contact-card {
      border: 1px solid var(--borde);
      padding: 2.5rem;
      margin-top: 2rem;
      position: relative;
    }

    .contact-card::before {
      content: 'CONTACTO';
      position: absolute;
      top: -0.5rem;
      left: 2rem;
      background: var(--negro);
      padding: 0 0.8rem;
      font-family: 'Syne', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.3em;
      color: var(--oro);
    }

    .contact-card p {
      margin-bottom: 0.5rem;
    }

    /* FOOTER */
    footer {
      border-top: 1px solid var(--borde);
      padding: 3rem 4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-logo {
      font-family: 'Syne', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      color: var(--gris);
      text-transform: uppercase;
    }

    .footer-logo span { color: var(--oro); }

    .footer-copy {
      font-family: 'Syne', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--gris);
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      header { padding: 1.5rem 1.5rem; }
      .hero { padding: 4rem 1.5rem 3rem; }
      .container { padding: 0 1.5rem; }
      footer { padding: 2rem 1.5rem; }
      .hero-meta { flex-direction: column; gap: 1rem; }
    }
  </style>
</head>
<body>

  <header>
    <a href="https://vindex.website" class="logo">V<span>I</span>NDEX <span style="color:var(--gris);font-weight:400">|</span> Estrategia Jurídica</a>
    <span class="header-tag">Política de Privacidad</span>
  </header>

  <div class="hero">
    <div class="container">
      <div class="hero-label">Documento Legal</div>
      <h1>Política de <em>Privacidad</em></h1>
      <div class="hero-meta">
        <span><strong>Última actualización</strong>Mayo 2026</span>
        <span><strong>Jurisdicción</strong>Argentina — Pcia. Buenos Aires</span>
        <span><strong>Versión</strong>2.0</span>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="content">

      <div class="section">
        <div class="section-number">01</div>
        <h2>Introducción y Responsable del Tratamiento</h2>
        <p>VINDEX | Estrategia Jurídica (en adelante, "VINDEX", "nosotros" o "el Estudio") es un estudio jurídico con sede en La Plata, Provincia de Buenos Aires, República Argentina, que presta servicios de asesoramiento, representación y estrategia legal.</p>
        <p>La presente Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos, protegemos y compartimos la información personal de quienes interactúan con nuestros canales de comunicación, incluyendo el sitio web <a href="https://vindex.website">vindex.website</a>, el canal de WhatsApp Business y cualquier otro medio digital habilitado por el Estudio.</p>
        <div class="highlight">
          VINDEX actúa como Responsable del Tratamiento de los datos personales en los términos de la Ley N° 25.326 de Protección de los Datos Personales de la República Argentina y la normativa complementaria aplicable.
        </div>
      </div>

      <div class="section">
        <div class="section-number">02</div>
        <h2>Datos que Recopilamos</h2>
        <p>En función del canal de comunicación utilizado y la naturaleza de la consulta, podemos recopilar los siguientes datos personales:</p>

        <table class="data-table">
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Datos específicos</th>
              <th>Canal de recopilación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Identificación</td>
              <td>Nombre completo, DNI/CUIT</td>
              <td>Formularios, WhatsApp, correo</td>
            </tr>
            <tr>
              <td>Contacto</td>
              <td>Teléfono, correo electrónico, domicilio</td>
              <td>Todos los canales</td>
            </tr>
            <tr>
              <td>Comunicaciones</td>
              <td>Mensajes de WhatsApp, correos, registros de llamadas</td>
              <td>WhatsApp Business, correo</td>
            </tr>
            <tr>
              <td>Datos jurídicos</td>
              <td>Información vinculada a la situación legal del consultante</td>
              <td>Consultas y mandatos</td>
            </tr>
            <tr>
              <td>Datos técnicos</td>
              <td>IP, dispositivo, navegador, cookies</td>
              <td>Sitio web</td>
            </tr>
          </tbody>
        </table>

        <p>No recopilamos datos sensibles (salud, origen racial, creencias religiosas o afiliación política) salvo que resulten estrictamente necesarios para la prestación del servicio jurídico encomendado y con consentimiento expreso del titular.</p>
      </div>

      <div class="section">
        <div class="section-number">03</div>
        <h2>Finalidades del Tratamiento</h2>
        <p>Los datos personales recopilados son utilizados exclusivamente para las siguientes finalidades:</p>
        <ul>
          <li>Gestionar y responder consultas jurídicas recibidas por cualquier canal habilitado.</li>
          <li>Prestar los servicios legales contratados y administrar la relación cliente-estudio.</li>
          <li>Enviar comunicaciones relacionadas con el estado de expedientes, plazos procesales y novedades del caso.</li>
          <li>Atención automatizada de consultas a través del canal de WhatsApp Business, mediante sistemas de inteligencia artificial.</li>
          <li>Cumplir obligaciones legales, reglamentarias y deontológicas aplicables al ejercicio de la abogacía en la Provincia de Buenos Aires (Ley N° 5.177 y normativa del CAJLP).</li>
          <li>Mejora continua de los servicios digitales prestados por el Estudio.</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-number">04</div>
        <h2>Canal de WhatsApp Business e Inteligencia Artificial</h2>
        <p>VINDEX utiliza WhatsApp Business API (Meta Platforms, Inc.) como canal oficial de comunicación. Las interacciones realizadas a través de este canal pueden ser procesadas por sistemas de inteligencia artificial para:</p>
        <ul>
          <li>Clasificar y priorizar consultas entrantes.</li>
          <li>Brindar orientación general de carácter informativo sobre el ordenamiento jurídico argentino.</li>
          <li>Derivar la comunicación al profesional responsable cuando corresponda.</li>
        </ul>
        <div class="highlight">
          Las respuestas automatizadas tienen carácter meramente orientativo e informativo. No constituyen asesoramiento jurídico, no crean relación abogado-cliente y no reemplazan la consulta profesional personalizada.
        </div>
        <p>Los mensajes intercambiados a través de WhatsApp están sujetos adicionalmente a la <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener">Política de Privacidad de WhatsApp</a> y las condiciones de Meta Platforms, Inc.</p>
      </div>

      <div class="section">
        <div class="section-number">05</div>
        <h2>Base Legal del Tratamiento</h2>
        <p>El tratamiento de datos personales por parte de VINDEX se fundamenta en alguna de las siguientes bases legales:</p>
        <ul>
          <li><strong>Consentimiento del titular:</strong> otorgado de forma libre, expresa e informada al iniciar una comunicación.</li>
          <li><strong>Ejecución de un contrato:</strong> cuando el tratamiento es necesario para la prestación del servicio jurídico encomendado.</li>
          <li><strong>Obligación legal:</strong> cuando el tratamiento resulta exigido por el ordenamiento jurídico aplicable.</li>
          <li><strong>Interés legítimo:</strong> para la gestión interna del Estudio y la mejora de los servicios.</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-number">06</div>
        <h2>Conservación de los Datos</h2>
        <p>Los datos personales serán conservados durante el tiempo estrictamente necesario para cumplir con la finalidad para la que fueron recopilados y, en todo caso, durante los plazos de prescripción legalmente establecidos para las acciones derivadas de la relación jurídica.</p>
        <p>Los datos vinculados a expedientes judiciales o extrajudiciales se conservarán conforme a los plazos previstos por la normativa procesal y las disposiciones deontológicas del Colegio de Abogados de la Provincia de Buenos Aires.</p>
      </div>

      <div class="section">
        <div class="section-number">07</div>
        <h2>Compartición con Terceros</h2>
        <p>VINDEX no comercializa ni cede datos personales a terceros con fines comerciales. Los datos podrán ser compartidos únicamente en los siguientes supuestos:</p>
        <ul>
          <li>Con proveedores tecnológicos que actúan como encargados del tratamiento (plataformas de gestión, servicios en la nube, herramientas de automatización), bajo acuerdos de confidencialidad y seguridad.</li>
          <li>Con organismos judiciales o administrativos cuando sea requerido por mandato legal o resolución judicial.</li>
          <li>Con peritos, mediadores u otros profesionales intervinientes en el proceso, cuando resulte necesario para la defensa del cliente.</li>
        </ul>
        <p>Los proveedores tecnológicos utilizados incluyen, entre otros: Meta Platforms Inc. (WhatsApp Business API), Google LLC (servicios de inteligencia artificial) y servicios de infraestructura en la nube. Todos ellos operan bajo marcos de protección de datos reconocidos internacionalmente.</p>
      </div>

      <div class="section">
        <div class="section-number">08</div>
        <h2>Derechos del Titular de los Datos</h2>
        <p>De conformidad con la Ley N° 25.326 y demás normativa aplicable, el titular de los datos personales tiene derecho a:</p>
        <ul>
          <li><strong>Acceso:</strong> conocer qué datos personales trata VINDEX y con qué finalidad.</li>
          <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
          <li><strong>Cancelación / Supresión:</strong> solicitar la eliminación de datos cuando ya no resulten necesarios.</li>
          <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos en determinadas circunstancias.</li>
          <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado y legible.</li>
        </ul>
        <p>Para ejercer cualquiera de estos derechos, el titular puede dirigirse a VINDEX a través de los medios indicados en la sección de Contacto. La solicitud será atendida dentro de los plazos previstos por la normativa vigente.</p>
        <p>El titular tiene derecho a presentar una reclamación ante la <strong>Dirección Nacional de Protección de Datos Personales</strong> (<a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noopener">www.argentina.gob.ar/aaip</a>) si considera que el tratamiento de sus datos vulnera la normativa aplicable.</p>
      </div>

      <div class="section">
        <div class="section-number">09</div>
        <h2>Seguridad de la Información</h2>
        <p>VINDEX implementa medidas técnicas y organizativas adecuadas para garantizar la seguridad de los datos personales y prevenir su pérdida, alteración, acceso no autorizado o divulgación indebida.</p>
        <p>No obstante, ningún sistema de transmisión de datos por internet puede garantizar una seguridad absoluta. En caso de detectar una brecha de seguridad que pueda afectar sus datos, VINDEX lo comunicará conforme a los procedimientos previstos por la normativa vigente.</p>
      </div>

      <div class="section">
        <div class="section-number">10</div>
        <h2>Transferencias Internacionales</h2>
        <p>Algunos de nuestros proveedores tecnológicos están ubicados fuera de Argentina. En tales casos, VINDEX verifica que dichas transferencias se realicen hacia países o entidades que garanticen un nivel adecuado de protección, o bajo las garantías contractuales previstas por la normativa de protección de datos personales.</p>
      </div>

      <div class="section">
        <div class="section-number">11</div>
        <h2>Modificaciones a esta Política</h2>
        <p>VINDEX se reserva el derecho de actualizar la presente Política de Privacidad cuando resulte necesario por cambios normativos, tecnológicos o en los servicios prestados. La versión actualizada estará siempre disponible en esta página con indicación de la fecha de última modificación.</p>
      </div>

      <div class="section">
        <div class="section-number">12</div>
        <h2>Contacto</h2>
        <p>Para cualquier consulta, solicitud de ejercicio de derechos o comunicación relacionada con el tratamiento de datos personales:</p>
        <div class="contact-card">
          <p><strong>VINDEX | Estrategia Jurídica</strong></p>
          <p>La Plata, Provincia de Buenos Aires, Argentina</p>
          <p>Sitio web: <a href="https://vindex.website">vindex.website</a></p>
          <p>WhatsApp Business: Canal oficial habilitado en el sitio web</p>
        </div>
      </div>

    </div>
  </div>

  <footer>
    <div class="footer-logo">V<span>I</span>NDEX <span style="color:rgba(136,136,128,0.4)">|</span> Estrategia Jurídica</div>
    <div class="footer-copy">© 2026 VINDEX — Todos los derechos reservados</div>
  </footer>

</body>
</html>
