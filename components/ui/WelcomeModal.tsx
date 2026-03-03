"use client";

import { useState, useEffect } from "react";
import { X, Gift, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Verifica se já viu o modal ou se já está logado
    const hasSeen = localStorage.getItem("gogreen_welcome_seen");
    const isAdmin = localStorage.getItem("gogreen_admin_token");
    
    if (!hasSeen && !isAdmin) {
      // Pequeno delay para não chocar com o AgeGate
      setTimeout(() => setIsOpen(true), 1500);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("gogreen_welcome_seen", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-green-neon/30 rounded-[32px] p-8 text-center shadow-[0_0_50px_rgba(57,255,20,0.15)] overflow-hidden">
        
        {/* Fundo Decorativo */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-neon/10 to-transparent"></div>
        
        <button onClick={handleClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-green-neon rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-neon/30 animate-bounce">
            <Gift className="w-10 h-10 text-black" />
          </div>

          <h2 className="font-display text-3xl text-white mb-2">SALVE, CHEGOU AGORA?</h2>
          <p className="text-zinc-400 mb-8 font-sans leading-relaxed">
            Faça parte do <strong className="text-green-neon">Clube GoGreen</strong>. <br/>
            Quem tem cadastro ganha descontos exclusivos, acumula pontos e participa de sorteios.
          </p>

          <div className="grid gap-4">
            <Link href="/register" onClick={handleClose}>
              <button className="w-full bg-green-neon text-black font-display text-lg py-4 rounded-xl hover:bg-green-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-neon/20 hover:scale-[1.02]">
                <UserPlus className="w-5 h-5" /> QUERO ME CADASTRAR (GANHAR BRINDES)
              </button>
            </Link>
            
            <Link href="/login" onClick={handleClose}>
              <button className="w-full bg-zinc-800 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 border border-zinc-700">
                <LogIn className="w-5 h-5" /> Já tenho conta
              </button>
            </Link>
          </div>

          <button onClick={handleClose} className="mt-6 text-zinc-500 text-xs hover:text-white underline">
            Só quero dar uma olhadinha
          </button>
        </div>
      </div>
    </div>
  );
}