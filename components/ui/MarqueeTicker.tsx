"use client";

import { Zap, Leaf, CreditCard, Star } from "lucide-react";

export function MarqueeTicker() {
  // O conteúdo que vai se repetir
  const content = (
    <div className="flex items-center gap-8 mx-4">
      <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> ENTREGA FLASH EM 30 MINUTOS</span>
      <span className="text-black/30">•</span>
      <span className="flex items-center gap-2"><Leaf className="w-4 h-4" /> KITS SALVA-ROLÊ</span>
      <span className="text-black/30">•</span>
      <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> ACEITAMOS PIX</span>
      <span className="text-black/30">•</span>
      <span className="flex items-center gap-2"><Star className="w-4 h-4" /> ACESSO VIP PARA MEMBROS</span>
      <span className="text-black/30">•</span>
    </div>
  );

  return (
    <div className="w-full bg-green-neon text-urban-black py-2.5 overflow-hidden border-y border-urban-black flex z-40 relative">
      {/* Container da animação */}
      <div className="animate-marquee font-display text-xs md:text-sm uppercase tracking-widest font-black whitespace-nowrap">
        {/* Repetimos o conteúdo várias vezes para preencher telas largas e fazer o loop perfeito */}
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
}