import type { Metadata } from "next";
import "./globals.css";

// Nota de diseno: el template de create-next-app trae por defecto la fuente "Geist" de
// Google Fonts (via next/font/google), que se descarga en tiempo de build. La quitamos
// a proposito y usamos la fuente del sistema operativo (font-sans de Tailwind) - una
// dependencia menos de red en el build, y una carga inicial de pagina mas rapida.

export const metadata: Metadata = {
  title: "ClearDraft",
  description: "Genera contenido de negocio con una revisión automática de gobernanza",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}
