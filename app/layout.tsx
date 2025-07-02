import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ecommerce website",
  description: "ecommerce website for a fictional outfit brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="eng">
      <body className={outfit.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
