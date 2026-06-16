import Header from "@/components/Header";
import BurgerMenu from "@/components/BurgerMenu";
import FooterWrapper from "@/components/FooterWrapper";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BurgerMenu />
      {children}
      <FooterWrapper />
    </div>
  );
}
