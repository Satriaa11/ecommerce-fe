"use client";

import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { usePathname } from "next/navigation";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  const pathname = usePathname();

  // Daftar halaman yang tidak memerlukan header dan footer
  const authPages = ["/login", "/register", "/forgot-password"];
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  if (isAuthPage) {
    return <div className="size-full">{children}</div>;
  }

  return (
    <div className="size-full py-3">
      <Header />
      {children}
      <Footer />
    </div>
  );
};
