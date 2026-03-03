"use client";

import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site-config"; 

// ATENÇÃO: É "export function", NÃO "export default function"
export function Hero() {
  return (
    <section className="pt-32 pb-12 px-6 overflow-hidden bg-white">
      <div className="container mx-auto">
        
        <div className="bg-urban-black rounded-[32px] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[500px]">
          
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-neon rounded-full blur-[100px] opacity-20 animate-pulse"></div>

          <div className="relative z-10 max-w-xl text-center md:text-left mb-10 md:mb-0">
            <span className="inline-block bg-green-neon text-black font-sans font-bold px-3 py-1 rounded-full text-xs mb-4 animate-bounce">
              🔥 O MAIS VENDIDO
            </span>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-6 leading-tight">
              KIT <span className="text-green-neon">SALVA</span><br/> ROLE.
            </h1>
            <p className="text-zinc-400 text-lg mb-8 max-w-md font-sans">
              Tudo o que você precisa em um só lugar. Seda, piteira e isqueiro pra você não passar sufoco na sessão.
            </p>
            <a 
              href={siteConfig.links.whatsapp}
              target="_blank"
              className="bg-green-neon text-black font-display text-xl px-8 py-4 rounded-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto md:mx-0 shadow-[0_0_20px_rgba(57,255,20,0.4)] w-fit"
            >
              GARANTIR O MEU <ArrowRight className="w-6 h-6" />
            </a>
          </div>

          <div className="relative z-10 w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
            <div className="w-64 h-80 md:w-80 md:h-96 bg-gradient-to-br from-green-forest to-black rounded-street border-2 border-green-neon/30 flex items-center justify-center rotate-3 shadow-2xl relative animate-float">
              <span className="text-green-neon font-display text-9xl opacity-10">GG</span>
              <div className="absolute bottom-4 right-4 bg-white text-black font-sans font-bold px-4 py-2 rounded-lg transform rotate-[-3deg] shadow-lg">
                R$ 19,40
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}