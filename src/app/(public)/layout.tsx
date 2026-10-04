import Header from "@/components/Header";
import FooterWrapper from "@/components/FooterWrapper";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {children}
      <FooterWrapper />
    </div>
  );
}
