// import "./globals.css";
import Footer from "@/Navigation/Footer";
import Navbar from "@/Navigation/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Navbar stays at the top */}
        <Navbar />

        {/* main with flex-1 expands to fill all available space 
          between the navbar and footer 
        */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Footer stays at the bottom */}
        <Footer />
      </body>
    </html>
  );
}