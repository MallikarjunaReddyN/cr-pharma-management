import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "./AuthProvider";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { AppWrapper } from "@/context";
import { Toaster } from "sonner";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CR Management",
  description: "CR Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <Navbar />
            <AppWrapper>
              <Toaster richColors closeButton position="top-right" />
              {children}
            </AppWrapper>
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
