'use client'
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import "../globals.css";
import Navbar from "@/Navigation/Navbar";
import Footer from "@/Navigation/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  const hideFooterRoutes = ['/login', '/register'];
  const shouldHideFooter = hideFooterRoutes.includes(pathname);
  
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        {!isAuthPage && <Navbar />}
        <main className={!isAuthPage ? "min-h-screen pt-4" : ""}>
          {children}
        </main>
        {!shouldHideFooter && <Footer />}
      </body>
    </html>
  );
}