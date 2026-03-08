"use client";

import Link from "next/link";
import { Instagram, Phone, MapPin, Clock, ShieldAlert } from "lucide-react";
import { siteConfig } from "@/config/site-config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080a09] border-t border-white/[0.05] pt-16 pb-8 relative overflow-hidden mt-auto">
      {/* Efeito de Luz Inferior */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-green-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* COLUNA 1: A Marca */}
          <div className="md:col-span-1">
            <Link href="/" className="flex flex-col leading-none group mb-6 inline-block">
              <span className="font-display text-3xl text-white group-hover:text-green-500 transition-colors">GoGreen</span>
              <span className="font-sans text-[10px] font-bold tracking-widest text-zinc-500 uppercase">HEADSHOP</span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {siteConfig.description}
            </p>
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-500 uppercase tracking-widest backdrop-blur-md">
              <ShieldAlert className="w-4 h-4" /> Proibido para menores de 18 anos
            </div>
          </div>

          {/* COLUNA 2: Links Rápidos */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Navegação</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/#shop" className="text-zinc-400 hover:text-green-500 transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span> Vitrine
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-zinc-400 hover:text-green-500 transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span> Meus Favoritos
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-zinc-400 hover:text-green-500 transition-colors text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span> Minha Conta
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUNA 3: Atendimento & Horários */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Atendimento</h4>
            <ul className="space-y-4">
              <li>
                <a href={siteConfig.links.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-zinc-400 hover:text-green-500 transition-colors text-sm">
                  <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]"><Phone className="w-4 h-4" /></div>
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]"><Clock className="w-4 h-4" /></div>
                  {siteConfig.business.openHours}
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-zinc-400 text-sm">
                  <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] shrink-0 mt-0.5"><MapPin className="w-4 h-4" /></div>
                  <span>Entregas via flash em <br/><span className="text-white font-bold">{siteConfig.business.deliveryArea}</span></span>
                </div>
              </li>
            </ul>
          </div>

          {/* COLUNA 4: Comunidade */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Siga a Vibe</h4>
            <a 
              href={siteConfig.links.instagram} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] hover:border-green-500 px-5 py-3 rounded-xl text-zinc-300 hover:text-green-500 transition-all text-sm mb-6 group backdrop-blur-md"
            >
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" /> @{siteConfig.community.instagramHandle}
            </a>
          </div>

        </div>

        {/* BOTTOM: Direitos Autorais */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">
          <p>© {currentYear} {siteConfig.name}.</p>
          <p className="flex items-center gap-2">
            Cultura Urbana & Redução de Danos <span className="text-green-500 text-base leading-none">🌿</span>
          </p>
        </div>
      </div>
    </footer>
  );
}