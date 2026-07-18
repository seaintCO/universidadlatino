import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://cursocapital.com"),
  title: {
    default: "CursoCapital",
    template: "%s | CursoCapital",
  },
  description:
    "Cursos prácticos en español para construir habilidades digitales y oportunidades reales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}<SiteFooter /></body>
    </html>
  );
}
