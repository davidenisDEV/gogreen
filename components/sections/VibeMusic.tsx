"use client";

import { Headphones, Music } from "lucide-react";
import { siteConfig } from "@/config/site-config";

export function VibeMusic() {
  // Puxa as configurações do Spotify do arquivo global
  const { playlists } = siteConfig;

  return (
    <section className="py-24 bg-[#080a09] relative overflow-hidden border-t border-white/[0.05]">
      {/* Efeito de Luzes */}
      <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[60vw] h-[60vw] bg-green-500/5 blur-[150px] rounded-full animate-breath pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-16 justify-center md:justify-start">
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl animate-pulse backdrop-blur-md">
            <Headphones className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-display text-4xl md:text-5xl text-white uppercase mb-2">
              Sessão <span className="text-green-500">GoGreen</span>
            </h2>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">
              A playlist perfeita para o seu momento.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* PLAYLIST 1 (Verde) */}
          <div className="bg-white/[0.02] backdrop-blur-md p-6 rounded-[32px] border border-white/[0.05] hover:border-green-500/30 transition-all duration-500 group hover:shadow-[0_0_30px_rgba(34,197,94,0.05)] hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6 justify-center group-hover:text-green-500 transition-colors">
              <Music className="w-5 h-5 text-zinc-500 group-hover:text-green-500 transition-colors" />
              <h3 className="font-display text-2xl text-white group-hover:text-green-500 transition-colors">
                {playlists[0].title}
              </h3>
            </div>
            <div className="rounded-[20px] overflow-hidden border border-white/[0.05] bg-[#080a09]">
              <iframe 
                data-testid="embed-iframe" 
                style={{ borderRadius: '20px' }} 
                src={playlists[0].src} 
                width="100%" 
                height="352" 
                frameBorder="0"  
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              ></iframe>
            </div>
          </div>

          {/* PLAYLIST 2 (Amarelo) */}
          <div className="bg-white/[0.02] backdrop-blur-md p-6 rounded-[32px] border border-white/[0.05] hover:border-yellow-400/30 transition-all duration-500 group hover:shadow-[0_0_30px_rgba(250,204,21,0.05)] hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6 justify-center group-hover:text-yellow-400 transition-colors">
              <Music className="w-5 h-5 text-zinc-500 group-hover:text-yellow-400 transition-colors" />
              <h3 className="font-display text-2xl text-white group-hover:text-yellow-400 transition-colors">
                {playlists[1].title}
              </h3>
            </div>
            <div className="rounded-[20px] overflow-hidden border border-white/[0.05] bg-[#080a09]">
              <iframe 
                data-testid="embed-iframe" 
                style={{ borderRadius: '20px' }} 
                src={playlists[1].src} 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}