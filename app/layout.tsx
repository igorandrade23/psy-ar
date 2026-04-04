import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Museu Virtual da Capoeira",
  description: "Experiencia em realidade aumentada do Museu Virtual da Capoeira."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
