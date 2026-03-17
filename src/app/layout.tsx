import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contador de Tarefas",
  description: "Gerencie suas tarefas de forma simples.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
