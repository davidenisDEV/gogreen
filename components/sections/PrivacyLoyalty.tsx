"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { PackageX, ShieldCheck, Crown, Gift, QrCode, ArrowRight } from "lucide-react";

export function PrivacyLoyalty() {
  const { user } = useAuth();

  const steps = [
    {
      icon: <QrCode className="w-8 h-8 text-green-500" />,
      title: "1. Acesso VIP",
      desc: "Faça o login com o seu e-mail ou Google. É rápido e 100% gratuito."
    },
    {
      icon: <Crown className="w-8 h-8 text-green-500" />,
      title: "2. Acumule Pontos",
      desc: "Cada encomenda que faz no site ou via WhatsApp gera pontos automáticos na sua conta."
    },
    {
      icon: <Gift className="w-8 h-8 text-green-500" />,
      title: "3. Resgate Brindes",
      desc: "Troque os seus pontos por sedas, isqueiros, descontos ou até kits completos!"
    }
  ];

  return (
    <section className="py-24 bg-[#080a09] relative overflow-hidden border-t border-zinc-900/50">
      {/* Luzes de Fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">

        {/* --- BLOCO 1: GARANTIA DE PRIVACIDADE --- */}
        <div className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-24 relative overflow-hidden shadow-lg">
          <div className="absolute -right-20 -top-20 opacity-5">
            <ShieldCheck className="w-64 h-64 text-green-500" />
          </div>
          <div className="relative z-10 flex items-center gap-6 md:w-2/3">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-800">
              <PackageX className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-white uppercase mb-2">
                O seu rolê é <span className="text-green-500 italic">100% sigiloso.</span>
              </h2>
              <p className="text-zinc-400 font-medium text-sm md:text-base">
                Embalagens discretas, sem logotipos ou marcações externas. Só você sabe o que está a chegar.
              </p>
            </div>
          </div>
        </div>

        {/* --- BLOCO 2: CLUBE DE FIDELIDADE --- */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-flex items-center gap-2 border border-green-500/20">
            <Crown className="w-4 h-4" /> GoGreen Club
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-white uppercase mb-4">
            A sua lealdade <br/><span className="text-green-500 italic">vale muito.</span>
          </h2>
          <p className="text-zinc-400 font-medium">
            Junte-se ao nosso clube VIP. Compre, acumule pontos e troque por produtos exclusivos da nossa headshop.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div key={index} className="bg-white/[0.02] backdrop-blur-md border border-white/[0.05] p-8 rounded-[32px] hover:border-green-500/50 transition-colors group text-center hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)]">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform border border-zinc-800 group-hover:border-green-500/50">
                {step.icon}
              </div>
              <h3 className="text-xl font-display uppercase text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {!user && (
          <div className="flex justify-center">
            <Link 
              href="/login" 
              className="bg-green-500 text-black font-bold text-sm px-8 py-4 rounded-full flex items-center gap-3 hover:bg-white transition-colors shadow-[0_0_15px_rgba(34,197,94,0.2)] uppercase tracking-widest"
            >
              ENTRAR PARA O CLUBE <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}