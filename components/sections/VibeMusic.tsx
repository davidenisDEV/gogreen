"use client";

import { Headphones } from "lucide-react";

export function VibeMusic() {
  return (
    <section className="py-20 bg-urban-black text-white relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-neon/10 rounded-full blur-[120px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex items-center gap-4 mb-12 justify-center md:justify-start">
          <div className="p-3 bg-green-neon rounded-full animate-pulse">
            <Headphones className="w-8 h-8 text-black" />
          </div>
          <div>
            <h2 className="font-display text-4xl text-white leading-none">
              SESSÃO <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-neon to-green-500">GOGREEN</span>
            </h2>
            <p className="text-zinc-400 font-sans">O som que a gente curte enquanto bola um.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* TRAP BRASILEIRO */}
          <div className="bg-zinc-900/50 p-4 rounded-[24px] border border-zinc-800 hover:border-green-neon transition-colors group">
            <h3 className="font-display text-xl mb-4 text-center group-hover:text-green-neon transition-colors">🔥 TRAP BRASILEIRO</h3>
            <iframe 
              data-testid="embed-iframe" 
              style={{ borderRadius: '12px' }} 
              src="https://open.spotify.com/embed/playlist/25oQpGLAzIxqqLsOmspUks?utm_source=generator&theme=0" 
              width="100%" 
              height="352" 
              frameBorder="0"  
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>

          {/* REGGAE ROOTS */}
          <div className="bg-zinc-900/50 p-4 rounded-[24px] border border-zinc-800 hover:border-yellow-400 transition-colors group">
            <h3 className="font-display text-xl mb-4 text-center group-hover:text-yellow-400 transition-colors">🦁 REGGAE ROOTS</h3>
            <iframe 
              data-testid="embed-iframe" 
              style={{ borderRadius: '12px' }} 
              src="https://open.spotify.com/embed/playlist/0g8FqbcJwqvuaoXnEMHULV?utm_source=generator&theme=0" 
              width="100%" 
              height="352" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>
        </div>

      </div>
    </section>
  );
}