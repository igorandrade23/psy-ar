import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capoeira em corpo e historia",
  description: "Experiencia web e em realidade aumentada sobre capoeira, corpo, memoria e historia."
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
