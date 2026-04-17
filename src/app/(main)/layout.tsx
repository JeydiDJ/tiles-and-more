import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ScrollToTopButton } from "@/components/layout/scroll-to-top-button";
import { SiteIntro } from "@/components/layout/site-intro";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SiteIntro>
      <div className="page-shell flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <ScrollToTopButton />
        <Footer />
      </div>
    </SiteIntro>
  );
}
