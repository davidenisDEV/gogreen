import type { Metadata } from "next";
import { Outfit, Dela_Gothic_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { CartDrawer } from "@/components/store/CartDrawer";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site-config"; // Importando Config

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
  title: `${siteConfig.name} | Urban Culture`,
  description: siteConfig.description,
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
          "min-h-screen text-white font-sans antialiased", 
          outfit.variable, 
          dela.variable 
        )}
      >
        {/* --- LUZES DE FUNDO RESPIRANDO (ULTRA SUTIS) --- */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-green-600/5 blur-[150px] rounded-full animate-breath"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-green-500/5 blur-[120px] rounded-full animate-breath" style={{ animationDelay: '4s' }}></div>
        </div>

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
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}