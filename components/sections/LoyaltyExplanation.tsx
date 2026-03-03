"use client";

import Link from "next/link";
import { Crown, Gift, QrCode, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function LoyaltyExplanation() {
  const { user } = useAuth();

  const steps = [
    {
      icon: <QrCode className="w-8 h-8 text-green-neon" />,
      title: "1. Acesso VIP",
      desc: "Faça o login com o seu e-mail ou Google. É rápido e 100% gratuito."
    },
    {
      icon: <Crown className="w-8 h-8 text-green-neon" />,
      title: "2. Acumule Pontos",
      desc: "Cada encomenda que faz no site ou via WhatsApp gera pontos automáticos na sua conta."
    },
    {
      icon: <Gift className="w-8 h-8 text-green-neon" />,
      title: "3. Resgate Brindes",
      desc: "Troque os seus pontos por sedas, isqueiros, descontos ou até kits completos!"
    }
  ];

  return (
    <section className="py-24 bg-urban-black relative overflow-hidden">
      {/* Efeito de brilho no fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-neon/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-green-neon/20 text-green-neon px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-flex items-center gap-2 border border-green-neon/30">
            <Crown className="w-4 h-4" /> GoGreen Club
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white uppercase italic mb-4">
            A sua lealdade <br/><span className="text-green-neon">vale muito.</span>
          </h2>
          <p className="text-zinc-400 font-medium">
            Junte-se ao nosso clube VIP. Compre, acumule pontos e troque por produtos exclusivos da nossa headshop.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div key={index} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-[32px] hover:border-green-neon/50 transition-colors group text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform border border-zinc-800 group-hover:border-green-neon/50">
                {step.icon}
              </div>
              <h3 className="text-xl font-display uppercase italic text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {!user && (
          <div className="flex justify-center">
            <Link 
              href="/login" 
              className="bg-green-neon text-black font-display text-lg px-8 py-4 rounded-full flex items-center gap-3 hover:bg-white transition-colors shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
            >
              ENTRAR PARA O CLUBE <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}