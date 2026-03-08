"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Lock, Mail, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  const validateStrongPassword = (password: string) => {
    if (password.length < 10) return "A senha deve ter pelo menos 10 caracteres.";
    if (!/[A-Z]/.test(password)) return "A senha deve conter pelo menos uma letra maiúscula.";
    if (!/[a-z]/.test(password)) return "A senha deve conter pelo menos uma letra minúscula.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "A senha deve conter pelo menos um caractere especial (!@#$...).";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    
   // Validação de senhas iguais
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem. Verifique a confirmação.");
      return;
    }

    // Validação de força da senha  <--- Esta era a frase que a barra solta ia formar
    const passwordError = validateStrongPassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
          }
        }
      });

      if (error) throw error;

      
      if (data.session) {
        setSuccess("Conta criada com segurança! A carregar a loja...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        
        setSuccess("Conta criada! Por favor, verifique o seu e-mail para confirmar o acesso.");
        setLoading(false);
      }

    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Verifique os seus dados.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080a09] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/login" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar para o Login
        </Link>

        <div className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[32px] backdrop-blur-md shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-white mb-2">Criar Conta Segura</h1>
            <p className="text-zinc-400 text-sm">Preencha os seus dados para aceder aos benefícios da GoGreen.</p>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl mb-6 text-center">{error}</div>}
          {success && <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-sm p-4 rounded-xl mb-6 text-center">{success}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600 pointer-events-none" />
              <input type="text" required placeholder="Nome Completo" className="w-full bg-[#080a09] border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-green-500 transition-colors text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600 pointer-events-none" />
              <input type="email" required placeholder="E-mail" className="w-full bg-[#080a09] border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-green-500 transition-colors text-sm" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600 pointer-events-none" />
              <input type="tel" placeholder="WhatsApp (Opcional)" className="w-full bg-[#080a09] border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-green-500 transition-colors text-sm" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600 pointer-events-none" />
              <input type="password" required placeholder="Senha Forte (Mín. 10 caracteres)" className="w-full bg-[#080a09] border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-green-500 transition-colors text-sm" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-600 pointer-events-none" />
              <input type="password" required placeholder="Confirme a senha" className="w-full bg-[#080a09] border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl outline-none focus:border-green-500 transition-colors text-sm" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center mt-2">
              A senha deve conter letras (A-a), números e símbolos!
            </p>

            <button type="submit" disabled={loading} className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.2)] disabled:opacity-50 mt-6">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar Conta"}
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-500 text-sm">
            Já possui uma conta? <Link href="/login" className="text-green-500 font-bold hover:underline">Faça Login aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
}