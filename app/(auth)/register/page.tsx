"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Lock, Mail, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FormAlert } from "@/components/ui/FormAlert";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  // --- LOGIN COM GOOGLE ---
  const handleGoogleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) {
        setError(error.message);
        setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email || !formData.password) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone
          }
        }
      });

      if (supabaseError) throw supabaseError;

      setSuccess("Cadastro realizado! Redirecionando...");
      setTimeout(() => router.push("/"), 2000);

    } catch (err: any) {
      let msg = err.message;
      if (msg.includes("weak_password")) msg = "A senha é muito fraca.";
      if (msg.includes("already registered")) msg = "Este e-mail já está cadastrado.";
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-full h-[500px] bg-gradient-to-t from-green-900/20 to-transparent opacity-50" />

      <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-2xl shadow-2xl relative z-10">
        
        <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3 mr-2" /> Voltar
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl text-white mb-2 tracking-tight">Criar Conta</h1>
          <p className="text-zinc-500 font-sans text-sm">Entre para o clube GoGreen.</p>
        </div>

        {error && <FormAlert type="error" message={error} onClose={() => setError(null)} />}
        {success && <FormAlert type="success" message={success} />}

        {/* BOTÃO GOOGLE */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full bg-white text-black font-bold py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-all mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Cadastrar com Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-zinc-500 text-xs uppercase">OU PREENCHA</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                <input type="text" placeholder="Nome" className="w-full bg-black/20 border border-zinc-800 text-white pl-10 pr-3 py-3 rounded-lg focus:border-green-500 outline-none text-sm" 
                  onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                <input type="text" placeholder="WhatsApp" className="w-full bg-black/20 border border-zinc-800 text-white pl-10 pr-3 py-3 rounded-lg focus:border-green-500 outline-none text-sm" 
                  onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
            <input type="email" placeholder="Seu melhor e-mail" className="w-full bg-black/20 border border-zinc-800 text-white pl-10 pr-3 py-3 rounded-lg focus:border-green-500 outline-none text-sm" 
              onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
            <input type="password" placeholder="Senha (mín 6 caracteres)" className="w-full bg-black/20 border border-zinc-800 text-white pl-10 pr-3 py-3 rounded-lg focus:border-green-500 outline-none text-sm" 
              onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-green-700" />
            <input type="password" placeholder="Confirme a senha" className="w-full bg-black/20 border border-green-900/30 text-white pl-10 pr-3 py-3 rounded-lg focus:border-green-500 outline-none text-sm" 
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-green-forest text-white font-bold text-sm uppercase tracking-widest py-4 rounded-lg hover:bg-green-600 transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "FINALIZAR CADASTRO"}
          </button>
        </form>
      </div>
    </div>
  );
}