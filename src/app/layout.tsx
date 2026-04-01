import type { Metadata } from "next";
import { Outfit, Sora, Inter, Orbitron, Black_Ops_One, Montserrat, JetBrains_Mono, Saira, Noto_Sans, Poppins, Barlow } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/layout/AppWrapper";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
});

const saira = Saira({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-saira",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const blackOps = Black_Ops_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-black-ops",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lldmrodeo.org"),
  title: "LLDM RODEO - Tablero Digital",
  description: "Sistema de proyección y control para la iglesia LLDM RODEO",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${saira.variable} ${outfit.variable} ${sora.variable} ${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${blackOps.variable} ${notoSans.variable} ${poppins.variable} ${barlow.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('admin_theme_choice') || 'tactile';
                  var mode = localStorage.getItem('admin_theme_mode') || 'dark';
                  var themeClass = 'admin-theme-' + theme;
                  document.body.classList.add(themeClass);
                  if (mode === 'light') document.body.classList.add('light-mode');
                  else document.body.classList.add('dark-mode');
                } catch (e) {}
              })();
            `,
          }}
        />
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
