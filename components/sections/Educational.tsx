"use client";

import { useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";

const tips = [
  {
    title: "Como bolar sem pastelar? 🥟",
    content: "O segredo tá na piteira, meu chapa. Faça uma base firme, espalhe o recheio por igual (sem morros) e use os polegares para 'tombar' o papel antes de lamber."
  },
  {
    title: "Bong sujo = Pulmão triste 🧽",
    content: "Álcool isopropílico + Sal grosso. Joga tudo dentro, chacoalha igual maraca e enxágua bem. A água do bong deve ser trocada a cada sessão."
  },
  {
    title: "Redução de Danos 101 🧠",
    content: "Piteira longa resfria a fumaça. Filtro de carvão segura o alcatrão. E seda brown tem menos química. Fume melhor."
  }
];

export function Educational() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-green-soft">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        
        <div>
          <span className="text-green-forest font-bold tracking-widest text-sm uppercase mb-2 block font-sans">
            DICA DO MESTRE
          </span>
          {/* TÍTULO AJUSTADO: Removido bg-black, mantido neon com borda para legibilidade */}
          <h2 className="font-display text-4xl md:text-5xl text-green-forest mb-6 leading-tight">
            ESCOLINHA DO <span className="text-green-neon border-b-4 border-green-neon/30 pb-1">GREEN</span>
          </h2>
          <p className="text-zinc-600 mb-8 text-lg font-sans">
            Informação também chapante. Aprenda a cuidar do seu kit e melhorar sua sessão com quem entende.
          </p>
          <div className="w-24 h-24 bg-green-neon rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-green-neon/20">
            <Lightbulb className="w-12 h-12 text-black" />
          </div>
        </div>

        <div className="space-y-4 font-sans">
          {tips.map((tip, index) => (
            <div 
              key={index} 
              className="bg-white border-2 border-green-forest/10 rounded-2xl overflow-hidden transition-all hover:border-green-forest/30 hover:shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-display text-xl text-green-forest">{tip.title}</span>
                <ChevronDown className={`w-6 h-6 text-green-forest/50 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 text-zinc-600 leading-relaxed animate-in slide-in-from-top-2">
                  {tip.content}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}