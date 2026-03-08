"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker"; 
import { Hero } from "@/components/sections/Hero";
import { QuickCategories } from "@/components/ui/QuickCategories"; 
import { ProductGrid } from "@/components/store/ProductGrid";
import { KitBuilder } from "@/components/store/KitBuilder"; 
import { SocialProof } from "@/components/sections/SocialProof"; 
import { PrivacyLoyalty } from "@/components/sections/PrivacyLoyalty";
import { Educational } from "@/components/sections/Educational";
import { DeliveryCalc } from "@/components/ui/DeliveryCalc";
import { CommunityWall } from "@/components/sections/CommunityWall"; 
import { FAQSection } from "@/components/sections/FAQSection"; 
import { VibeMusic } from "@/components/sections/VibeMusic";
import { AgeGate } from "@/components/ui/AgeGate";
import { WelcomeModal } from "@/components/ui/WelcomeModal"; 
import { WhatsAppBtn } from "@/components/floating/WhatsAppBtn";
import { LoyaltyCard } from "@/components/floating/LoyaltyCard"; 
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/config/site-config"; // PUXANDO CONFIGS

// --- SUB-COMPONENTE: TEXTURA DE CHUVISCO ULTRA SUAVE ---
const NoiseOverlay = () => (
  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noiseFilter)%27 opacity=%270.15%27/%3E%3C/svg%3E')] opacity-15 pointer-events-none mix-blend-overlay z-0"></div>
);

export default function Home() {
  const { svgs } = siteConfig.assets;
  const { altTexts } = siteConfig.ui;

  return (
    <main className="min-h-screen bg-transparent selection:bg-green-500 selection:text-black pb-20 pt-[73px] overflow-hidden"> 
      <AgeGate />
      <WelcomeModal />
      <Navbar />
      
      <MarqueeTicker />
      
      {/* --- 1. HERO SECTION --- */}
      <div className="relative w-full">
        <Hero />
        
        {/* Renderiza apenas se houver o caminho do SVG configurado */}
        {svgs.hero && (
          <motion.img 
            src={svgs.hero} 
            alt={altTexts.heroSvg}
            animate={{ y: [-10, 10, -10], rotate: [0, 3, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 right-10 md:right-32 w-48 md:w-64 opacity-50 z-0 pointer-events-none drop-shadow-xl hidden lg:block"
          />
        )}
      </div>

      <QuickCategories />

      {/* --- 2. KIT BUILDER --- */}
      <div className="relative py-16 w-full border-b border-zinc-900/50 glass-panel">
        <NoiseOverlay />
        
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[300px] h-[300px] bg-green-500/5 blur-[120px] rounded-full animate-breath pointer-events-none"></div>
        
        {svgs.kit && (
          <motion.img 
            src={svgs.kit} 
            alt={altTexts.kitSvg}
            animate={{ y: [-8, 8, -8], rotate: [-3, 3, -3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 xl:left-20 w-32 md:w-48 opacity-30 z-0 pointer-events-none hidden lg:block"
          />
        )}

        <div className="relative z-10">
          <ScrollReveal>
            <KitBuilder />
          </ScrollReveal>
        </div>
      </div>

      {/* --- 3. VITRINE DE PRODUTOS --- */}
      <div id="vitrine" className="relative py-16">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-green-600/5 blur-[150px] rounded-full animate-breath pointer-events-none" style={{ animationDelay: '2s' }}></div>
        
        {svgs.vitrine && (
          <motion.img 
            src={svgs.vitrine} 
            alt={altTexts.vitrineSvg}
            animate={{ y: [-15, 15, -15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-5 xl:right-10 w-24 md:w-40 opacity-20 z-0 pointer-events-none hidden lg:block"
          />
        )}

        <ScrollReveal>
          <ProductGrid />
        </ScrollReveal>
      </div>

      {/* --- 4. ÁREA EDUCACIONAL E FRETE --- */}
      <div className="relative w-full py-16 border-t border-zinc-900/50 glass-panel">
        <NoiseOverlay />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-500/5 blur-[150px] rounded-full animate-breath pointer-events-none"></div>
        
        <div className="relative z-10">
          <ScrollReveal delay={100}>
            <div className="container mx-auto px-6 mb-12">
               <Educational />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="container mx-auto px-6 mb-12 flex justify-center">
              <div className="w-full max-w-2xl">
                 <DeliveryCalc />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* --- 5. SOCIAL, PRIVACIDADE E FIDELIDADE --- */}
      <ScrollReveal delay={100}>
        <SocialProof />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <PrivacyLoyalty />
      </ScrollReveal>

      <CommunityWall />
      <FAQSection />
      <VibeMusic />

      <WhatsAppBtn />
      <LoyaltyCard />
    </main>
  );
}