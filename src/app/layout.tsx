import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // Importation du Footer

// Configuration de la police artistique (Serif)
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
});

// Configuration de la police moderne épurée (Sans-Serif)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Animae Lumen | Photographie holistique",
  description: "Photographie naturelle, consciente et holistique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cormorantGaramond.variable} ${inter.variable}`}>
      <body className="font-sans bg-[#FAF9F6] text-neutral-800 antialiased min-h-screen flex flex-col justify-between">
        <LanguageProvider>
          <Header />
          
          {/* Wrapper principal qui pousse le footer vers le bas si la page est courte */}
          <div className="flex-grow">
            {children}
          </div>
          
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}