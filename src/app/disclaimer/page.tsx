import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Aviso Legal", description: "Aviso sobre fines educativos, riesgos y ausencia de garantías financieras en CursoCapital.", alternates: { canonical: "/disclaimer" }, openGraph: { title: "Aviso Legal | CursoCapital", description: "Información importante sobre resultados, riesgos y responsabilidad del usuario." } };

export default function DisclaimerPage() { return <LegalPage title="Aviso Legal" description="La información y los cursos de CursoCapital se ofrecen exclusivamente con fines educativos e informativos.">
  <section><h2>Fines educativos únicamente</h2><p>CursoCapital proporciona formación general y no presta asesoramiento financiero, de inversión, legal, fiscal, contable o profesional individualizado. El contenido no sustituye la consulta con un profesional cualificado que conozca tus circunstancias.</p></section>
  <section><h2>Sin garantías de ingresos o resultados</h2><p>No garantizamos ganancias, ingresos, ventas, rentabilidad, empleo, crecimiento de audiencia ni ningún resultado específico. Los ejemplos, testimonios y escenarios son ilustrativos y no deben interpretarse como promesas o resultados típicos.</p></section>
  <section><h2>Riesgos de trading</h2><p>El trading y las inversiones implican riesgo sustancial, incluida la pérdida parcial o total del capital. La rentabilidad pasada no predice ni garantiza resultados futuros. Nunca operes con dinero que no puedas permitirte perder y realiza tu propia investigación.</p></section>
  <section><h2>E-commerce y TikTok Shop</h2><p>Los resultados en comercio electrónico y TikTok Shop varían según experiencia, esfuerzo, mercado, producto, audiencia, competencia, políticas de terceros, inversión y otros factores fuera de nuestro control. Las plataformas externas pueden modificar sus reglas, algoritmos, comisiones o disponibilidad en cualquier momento.</p></section>
  <section><h2>Responsabilidad personal</h2><p>Tú eres responsable de evaluar la información, cumplir las leyes y políticas aplicables y tomar tus propias decisiones comerciales y financieras. CursoCapital no responde por pérdidas derivadas de decisiones tomadas basándose en el contenido educativo.</p></section>
  <section><h2>Información y enlaces externos</h2><p>Procuramos mantener información útil, pero no garantizamos que sea completa, actual o libre de errores. Los enlaces y referencias a terceros no constituyen respaldo; el uso de sus servicios se rige por sus propios términos.</p></section>
  <section><h2>Contacto</h2><p>Para preguntas sobre este aviso, escribe a <a href="mailto:support@cursocapital.com">support@cursocapital.com</a>.</p></section>
  </LegalPage>; }
