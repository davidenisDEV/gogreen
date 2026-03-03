import { Navbar } from "@/components/layout/Navbar";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker"; // <-- IMPORT AQUI
import { Hero } from "@/components/sections/Hero";
import { ProductGrid } from "@/components/store/ProductGrid";
import { KitBuilder } from "@/components/store/KitBuilder"; 
import { Educational } from "@/components/sections/Educational";
import { VibeMusic } from "@/components/sections/VibeMusic";
import { DeliveryCalc } from "@/components/ui/DeliveryCalc";
import { AgeGate } from "@/components/ui/AgeGate";
import { WhatsAppBtn } from "@/components/floating/WhatsAppBtn";
import { LoyaltyCard } from "@/components/floating/LoyaltyCard"; 

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-green-neon selection:text-black pb-20 pt-[73px]"> 
      {/* Nota: Adicionei pt-[73px] no main para compensar a Navbar fixed, ajuste se necessário */}
      
      <AgeGate />
      <Navbar />
      
      {/* --- NOVA FAIXA ROTATIVA AQUI --- */}
      <MarqueeTicker />
      
      <Hero />
      
      {/* Vitrine Padrão */}
      <ProductGrid />

      {/* Montador de Kits */}
      <KitBuilder />

      {/* Seção Educativa e Calculadora */}
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 mb-20 mt-20">
        <div className="md:col-span-2">
           <Educational />
        </div>
        <div className="md:pt-20">
           <DeliveryCalc />
        </div>
      </div>

      <VibeMusic />
      
      {/* Botões Flutuantes */}
      <WhatsAppBtn />
      <LoyaltyCard /> 

    </main>
  );
}