import { PackageX, ShieldCheck } from "lucide-react";
export function PrivacyGuarantee() {
  return (
    <section className="py-12 border-y border-zinc-900 bg-zinc-950/50">
      <div className="container mx-auto px-6">
        <div className="bg-urban-black border border-zinc-800 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 opacity-5"><ShieldCheck className="w-64 h-64 text-green-neon" /></div>
          <div className="relative z-10 flex items-center gap-6 md:w-2/3">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-800"><PackageX className="w-8 h-8 text-green-neon" /></div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-white uppercase italic mb-2">O seu rolê é <span className="text-green-neon">100% sigiloso.</span></h2>
              <p className="text-zinc-400 font-medium text-sm md:text-base">Embalagens discretas, sem logotipos ou marcações externas. Só você sabe o que está a chegar.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}