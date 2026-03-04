"use client";

import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";

export function AgeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ageVerified = localStorage.getItem("gogreen_age_verified");
    if (!ageVerified) {
      setShow(true);
      // Trava o scroll da página enquanto o AgeGate estiver aberto
      document.body.style.overflow = "hidden";
    } else {
      // Dispara o evento imediatamente se o usuário já for verificado de visitas anteriores
      window.dispatchEvent(new Event('ageGatePassed'));
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem("gogreen_age_verified", "true");
    setShow(false);
    document.body.style.overflow = "auto"; // Libera o scroll
    
    // NOVIDADE: Avisa ao resto do site que a verificação passou
    window.dispatchEvent(new Event('ageGatePassed'));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-street text-center">
        <ShieldAlert className="w-16 h-16 text-green-neon mx-auto mb-6" />
        
        <h2 className="text-3xl font-display text-white mb-2">
          ACESSO RESTRITO
        </h2>
        <p className="text-zinc-400 mb-8 font-sans">
          Este site contém produtos destinados apenas para maiores de 18 anos.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleVerify}
            className="w-full bg-green-neon text-black font-bold py-4 rounded-xl hover:bg-green-400 transition-colors uppercase tracking-wide"
          >
            Tenho +18 Anos
          </button>
          <button 
            onClick={() => window.location.href = "https://google.com"}
            className="w-full bg-transparent text-zinc-500 font-bold py-3 hover:text-white transition-colors text-sm"
          >
            Sou menor de idade (Sair)
          </button>
        </div>
      </div>
    </div>
  );
}