import { Navbar } from "@/components/layout/Navbar";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker"; 
import { Hero } from "@/components/sections/Hero";
import { QuickCategories } from "@/components/ui/QuickCategories"; 
import { ProductGrid } from "@/components/store/ProductGrid";
import { PrivacyGuarantee } from "@/components/sections/PrivacyGuarantee"; 
import { KitBuilder } from "@/components/store/KitBuilder"; 
import { SocialProof } from "@/components/sections/SocialProof"; 
import { LoyaltyExplanation } from "@/components/sections/LoyaltyExplanation"; 
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

export default function Home() {
  return (
    <main className="min-h-screen bg-urban-black selection:bg-green-neon selection:text-black pb-20 pt-[73px]"> 
      <AgeGate />
      <WelcomeModal />
      <Navbar />
      
      {/* O topo carrega instantaneamente, sem delay */}
      <MarqueeTicker />
      <Hero />
      <QuickCategories />

      <div id="vitrine">
        <ScrollReveal>
          <ProductGrid />
        </ScrollReveal>
      </div>

      <ScrollReveal delay={100}>
        <PrivacyGuarantee />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <KitBuilder />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <SocialProof />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <LoyaltyExplanation />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="container mx-auto px-6 mt-20 mb-12">
           <Educational />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="container mx-auto px-6 mb-24 flex justify-center">
          <div className="w-full max-w-2xl">
             <DeliveryCalc />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <CommunityWall />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <FAQSection />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <VibeMusic />
      </ScrollReveal>
      
      <WhatsAppBtn />
      <LoyaltyCard /> 
    </main>
  );
}