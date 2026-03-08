"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push("/");
    } catch (err: any) {
      setError("Credenciais inválidas. Verifique o seu e-mail e palavra-passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080a09] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-green-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <Link href="/" className="absolute top-8 left-8 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors font-bold text-sm">
        <ArrowLeft className="w-4 h-4" /> Voltar à Loja
      </Link>

      <div className="w-full max-w-md bg-white/[0.02] border border-white/[0.05] p-8 md:p-10 rounded-[32px] backdrop-blur-md relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-zinc-400 text-sm">Entre na sua conta para aceder aos seus pontos.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">E-mail</label>
            <div className="relative">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="o-seu-email@exemplo.com" className="w-full bg-[#080a09] border border-zinc-800 text-white p-4 pl-12 rounded-xl outline-none focus:border-green-500 transition-colors text-sm" />
              <Mail className="absolute left-4 top-4 w-5 h-5 text-zinc-600 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Palavra-passe</label>
            <div className="relative">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-[#080a09] border border-zinc-800 text-white p-4 pl-12 rounded-xl outline-none focus:border-green-500 transition-colors text-sm" />
              <Lock className="absolute left-4 top-4 w-5 h-5 text-zinc-600 pointer-events-none" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-500 text-black font-bold py-4 rounded-xl mt-4 hover:bg-white transition-all flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.2)] disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar na Conta"}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Ainda não tem conta? <Link href="/register" className="text-green-500 font-bold hover:underline">Registe-se aqui</Link>
        </p>
      </div>
    </main>
  );
}