import type { Metadata } from "next";
import { Outfit, Sora, Inter } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/layout/AppWrapper";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LLDM RODEO - Tablero Digital",
  description: "Sistema de proyección y control para la iglesia LLDM RODEO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} ${sora.variable} ${inter.variable} antialiased`}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
