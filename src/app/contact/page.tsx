import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Contacto", description: "Contacta al equipo de soporte de CursoCapital para ayuda con tu cuenta, compra o acceso.", alternates: { canonical: "/contact" }, openGraph: { title: "Contacto | CursoCapital", description: "Canal oficial de soporte de CursoCapital." } };

export default function ContactPage() { return <LegalPage title="Contacto" description="Estamos disponibles para ayudarte con preguntas sobre tu cuenta, acceso, compras o el funcionamiento de la plataforma.">
  <section><h2>Soporte de CursoCapital</h2><p>Escríbenos a <a href="mailto:support@cursocapital.com">support@cursocapital.com</a>. Para proteger tu cuenta, contáctanos desde el mismo correo que utilizaste al registrarte.</p></section>
  <section><h2>Información que debes incluir</h2><ul><li>Nombre completo y correo de la cuenta.</li><li>Curso o producto relacionado.</li><li>Descripción clara del problema.</li><li>Identificador o recibo de Stripe cuando se trate de un pago.</li></ul><p>No envíes números completos de tarjeta, contraseñas ni códigos de seguridad.</p></section>
  <section><h2>Solicitudes de pago</h2><p>Para pagos duplicados o transacciones no reconocidas, incluye la fecha, importe y recibo correspondiente. Estas solicitudes se revisan conforme a nuestra <a href="/refund-policy">Política de Reembolsos</a>.</p></section>
  <section><h2>Tiempo de respuesta</h2><p>Procuramos responder las solicitudes legítimas en un plazo razonable durante días laborables. Los tiempos pueden variar según el volumen y la complejidad de la consulta.</p></section>
  </LegalPage>; }
