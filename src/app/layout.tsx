import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "./providers/Web3Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TuneCent - BudayaGO",
  description: "Platform crowdfunding musik tradisional Indonesia berbasis blockchain. Dukung musisi lokal, lestarikan budaya Nusantara, dan dapatkan royalti dari lagu favorit Anda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jakarta.variable} antialiased`}
        suppressHydrationWarning
      >
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
