import type { Metadata } from "next";
import { Outfit, Dela_Gothic_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context"; // O Cérebro da Autenticação
import { CartDrawer } from "@/components/store/CartDrawer";
import { WelcomeModal } from "@/components/ui/WelcomeModal";
import { cn } from "@/lib/utils";

// Fonte do Corpo (Clean e Leitura Fácil)
const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  weight: ["300", "400", "500", "700"], 
});

// Fonte de Títulos (Arredondada / Street / Fun)
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
          "min-h-screen bg-white text-urban-black font-sans antialiased selection:bg-green-neon selection:text-black", 
          outfit.variable, 
          dela.variable 
        )}
      >
        {/* 1. AuthProvider: Gerencia usuário logado e perfil */}
        <AuthProvider>
          
          {/* 2. CartProvider: Gerencia o carrinho de compras */}
          <CartProvider>
            
            {/* 3. ThemeProvider: Gerencia temas (Dark/Light) */}
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              forcedTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              {/* O Conteúdo das Páginas */}
              {children}

              {/* Componentes Globais (Sobrepostos) */}
              <CartDrawer />
              <WelcomeModal />

            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}