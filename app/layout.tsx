import type { Metadata } from "next";
import { Outfit, Dela_Gothic_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { CartDrawer } from "@/components/store/CartDrawer";
import { WelcomeModal } from "@/components/ui/WelcomeModal";
import { cn } from "@/lib/utils";

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  weight: ["300", "400", "500", "700"], 
});

const dela = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dela",
});

export const metadata: Metadata = {
  title: "GoGreen Headshop | Urban Culture",
  description: "Sua headshop favorita. Kits, Sedas e Acessórios com entrega rápida via Uber Flash.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-urban-black text-white font-sans antialiased selection:bg-green-neon selection:text-black", 
          outfit.variable, 
          dela.variable 
        )}
      >
        <AuthProvider>
          <CartProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              forcedTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
              <CartDrawer />
              <WelcomeModal />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}