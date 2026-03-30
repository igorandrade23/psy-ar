import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AR",
  description: "Experiencia em realidade aumentada com AR.js e A-Frame."
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
