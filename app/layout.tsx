import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Psy AR Timeline",
  description:
    "Linha do tempo interativa em AR sobre a passagem do estruturalismo ao behaviorismo."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
