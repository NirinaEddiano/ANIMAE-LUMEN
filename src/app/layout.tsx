import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import TextureBackground from "@/components/TextureBackground";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Animae Lumen | Photographie spirituelle",
  description:
    "Photographie consciente, retraites spirituelles, cérémonies sacrées, portraits thérapeutiques — par Tina.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorantGaramond.variable} ${inter.variable}`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alex+Brush&family=Bebas+Neue&family=Bodoni+Moda&family=Caveat&family=Cinzel&family=Comfortaa&family=Cormorant+Garamond&family=Dancing+Script&family=EB+Garamond&family=Forum&family=Fraunces&family=Great+Vibes&family=Inter:wght@300;400;700&family=Italiana&family=Italianno&family=Josefin+Sans&family=Lato&family=Libre+Baskerville&family=Lora&family=Marcellus&family=Merriweather&family=Montserrat:wght@300;400;700&family=Mrs+Saint+Delafield&family=Nunito&family=Open+Sans&family=Oswald&family=Pacifico&family=Pinyon+Script&family=Playfair+Display:wght@400;700&family=Poppins&family=Prata&family=Quicksand&family=Raleway&family=Righteous&family=Roboto&family=Sacramento&family=Satisfy&family=Space+Grotesk&family=Spectral&family=Syne&family=Tenor+Sans&family=Ubuntu&family=Unbounded&family=Work+Sans&family=Yeseva+One&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans text-charcoal antialiased min-h-screen bg-sand">
        <TextureBackground />
        <div className="relative z-10">
          <LanguageProvider>{children}</LanguageProvider>
        </div>
      </body>
    </html>
  );
}
