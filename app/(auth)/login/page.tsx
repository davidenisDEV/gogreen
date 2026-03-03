"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`, // Força volta para Home
      },
    });
    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert("Credenciais inválidas");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-[32px] shadow-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-green-neon mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para a Loja
        </Link>
        
        <h1 className="font-display text-3xl text-white uppercase italic mb-2 text-center">GoGreen VIP</h1>
        <p className="text-zinc-500 text-sm text-center mb-8">Acesse sua conta para gerenciar seu kit.</p>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all mb-6"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          ENTRAR COM GOOGLE
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500">Ou use seu e-mail</span></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600" />
              <input 
                type="email" 
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-green-neon transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600" />
              <input 
                type="password" 
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-green-neon transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-green-neon text-black font-display text-lg py-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ACESSAR CONTA"}
          </button>
        </form>
      </div>
    </div>
  );
}