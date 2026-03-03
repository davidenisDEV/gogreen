"use client";

import { useState, useEffect } from "react";
import { X, Trophy, Star } from "lucide-react";

export function LoyaltyCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [points, setPoints] = useState(0);

  // Simulação: Recupera pontos do localStorage (num cenário real viria do banco)
  useEffect(() => {
    const savedPoints = localStorage.getItem("gogreen_points");
    if (savedPoints) {
      setPoints(parseInt(savedPoints));
    } else {
      // Dá 1 ponto de boas-vindas se for novo
      setPoints(1);
      localStorage.setItem("gogreen_points", "1");
    }
  }, []);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-6 z-40 bg-urban-black text-green-neon px-4 py-2 rounded-full shadow-lg border border-green-neon/30 flex items-center gap-2 font-bold text-xs hover:scale-105 transition-transform"
      >
        <Trophy className="w-4 h-4" /> MEUS PONTOS
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 left-6 z-40 w-72 bg-urban-black rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden animate-in slide-in-from-left-5">
      {/* Cabeçalho do Cartão */}
      <div className="bg-gradient-to-r from-green-forest to-black p-4 relative">
        <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-white/50 hover:text-white">
          <X className="w-4 h-4" />
        </button>
        <h3 className="font-display text-white text-lg italic">GREEN CARD</h3>
        <p className="text-xs text-green-neon font-bold uppercase tracking-widest">Membro Oficial</p>
      </div>

      {/* Corpo com Selos */}
      <div className="p-4 bg-zinc-900">
        <p className="text-zinc-400 text-xs mb-3">Complete 5 selos para ganhar um <strong className="text-white">Kit Start Grátis</strong>.</p>
        
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((slot) => (
            <div 
              key={slot} 
              className={`aspect-square rounded-full flex items-center justify-center border-2 ${
                slot <= points 
                  ? "bg-green-neon border-green-neon text-black" 
                  : "bg-transparent border-zinc-700 text-zinc-700"
              }`}
            >
              {slot <= points ? <Star className="w-4 h-4 fill-black" /> : <span className="text-xs">{slot}</span>}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
          {points >= 5 ? (
            <button className="w-full bg-green-neon text-black font-bold text-xs py-2 rounded animate-pulse">
              RESGATAR PRÊMIO AGORA!
            </button>
          ) : (
            <p className="text-[10px] text-zinc-500">Faça um pedido para ganhar +1 selo.</p>
          )}
        </div>
      </div>
    </div>
  );
}