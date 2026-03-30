import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Psy AR Demo",
  description: "Demo simples em AR com uma imagem fixa sobre o marcador Hiro."
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
