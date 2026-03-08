"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { 
  LogOut, MapPin, User, Loader2, Package, Heart, Trophy, Star, ShieldCheck,
  Settings, Plus, Trash2, CheckCircle2, Edit2, Save, X, Camera
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, profile, isLoading, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  
  // Estados para as Moradas
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  
  // Formulário ViaCEP
  const [addressForm, setAddressForm] = useState({
    zip_code: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: ""
  });

  // Estados de Edição de Perfil
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "" });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVIP = profile?.role === 'vip';
  const isAdmin = profile?.role === 'admin';
  const points = profile?.points || 0;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user) {
      loadAddresses();
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || "",
        phone: profile.phone || ""
      });
    }
  }, [profile]);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user?.id).order("is_default", { ascending: false });
    setAddresses(data || []);
    setLoadingAddresses(false);
  };

  const handleSignOut = async () => await signOut();

  // --- LÓGICA VIA CEP ---
  const handleCepBlur = async () => {
    const cep = addressForm.zip_code.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddressForm(prev => ({ ...prev, street: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf }));
      }
    } catch (err) { console.error("Erro ao buscar CEP", err); }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    const isFirstAddress = addresses.length === 0;
    const { error } = await supabase.from("addresses").insert([{ user_id: user?.id, ...addressForm, is_default: isFirstAddress }]);
    if (!error) {
      setShowForm(false);
      setAddressForm({ zip_code: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "" });
      loadAddresses();
    }
    setSavingAddress(false);
  };

  const handleDeleteAddress = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    loadAddresses();
  };

  const handleSetDefault = async (id: string) => {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user?.id);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    loadAddresses();
  };

  // --- LÓGICA DE EDIÇÃO DE IDENTIDADE ---
  const handleSaveIdentity = async () => {
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({
      full_name: editForm.full_name,
      phone: editForm.phone
    }).eq("id", user?.id);

    if (!error) {
      await refreshProfile();
      setIsEditing(false);
    }
    setSavingProfile(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      const file = e.target.files?.[0];
      if (!file || !user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      // Upload para o bucket "avatars"
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      // Pega a URL pública
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Atualiza a tabela profile
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
      await refreshProfile();

    } catch (error) {
      console.error("Erro no upload do avatar:", error);
      alert("Erro ao enviar foto. Certifique-se de que o bucket 'avatars' existe e é público.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#080a09] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#080a09] selection:bg-green-500 selection:text-black pb-20 pt-[90px] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-green-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <Navbar />

      <div className="container mx-auto px-6 relative z-10 max-w-4xl mt-8">
        
        {/* HEADER DO PERFIL E IDENTIDADE */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 bg-white/[0.02] border border-white/[0.05] p-8 rounded-[32px] backdrop-blur-md relative">
          
          {/* Botão de Editar Canto Superior */}
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
              <Edit2 className="w-4 h-4" /> Editar
            </button>
          ) : (
            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
              <X className="w-4 h-4" /> Cancelar
            </button>
          )}

          {/* Avatar com Upload */}
          <div className="relative group">
            <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
              {uploadingAvatar ? (
                <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
              ) : profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-zinc-500" />
              )}
            </div>
            
            {/* Overlay de Hover para upload */}
            {isEditing && !uploadingAvatar && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-green-500"
              >
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden"/>

            {isVIP && !isEditing && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-black p-1.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
          </div>
          
          <div className="text-center md:text-left flex-1 w-full">
            {isEditing ? (
               <div className="space-y-3 max-w-sm mx-auto md:mx-0">
                 <input 
                    type="text" value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} 
                    placeholder="Nome de Exibição" className="w-full bg-[#080a09] border border-zinc-800 text-white px-4 py-2 rounded-xl text-lg font-display focus:border-green-500 outline-none" 
                 />
                 <input 
                    type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} 
                    placeholder="WhatsApp / Telefone" className="w-full bg-[#080a09] border border-zinc-800 text-white px-4 py-2 rounded-xl text-sm focus:border-green-500 outline-none" 
                 />
                 <button onClick={handleSaveIdentity} disabled={savingProfile} className="bg-green-500 text-black font-bold px-6 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-white transition-colors">
                   {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar Alterações
                 </button>
               </div>
            ) : (
              <>
                <h1 className="font-display text-3xl text-white mb-1">
                  {profile?.full_name || "Membro GoGreen"}
                </h1>
                <p className="text-zinc-400 text-sm mb-4">
                  {user.email} {profile?.phone && `• ${profile.phone}`}
                </p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border flex items-center gap-2",
                    isAdmin ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : isVIP ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-white/[0.05] text-zinc-300 border-white/[0.1]"
                  )}>
                    {isAdmin ? "Administrador" : isVIP ? "Membro VIP" : "Membro Oficial"}
                  </span>
                  {isAdmin && (
                    <Link href="/admin" className="text-blue-400 border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-colors flex items-center gap-2">
                      <Settings className="w-3 h-3" /> Painel Admin
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 px-4 py-1.5 rounded-full transition-colors flex items-center gap-2">
                    <LogOut className="w-3 h-3" /> Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ... Restante do código igual (Green Card, Atalhos, Moradas) ... */}
        
        {/* GREEN CARD E ATALHOS RÁPIDOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Green Card */}
          <div className="bg-gradient-to-br from-zinc-900 to-[#080a09] border border-green-500/20 p-6 rounded-[32px] shadow-[0_0_30px_rgba(34,197,94,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] rounded-full pointer-events-none"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h2 className="font-display text-xl text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-green-500" /> Green Card
                </h2>
                <p className="text-zinc-400 text-xs mt-1">Acumule pontos e troque por brindes.</p>
              </div>
              <div className="text-right">
                <span className="block font-display text-3xl text-green-500">{points}</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 relative z-10">
              {[1, 2, 3, 4, 5].map((slot) => (
                <div key={slot} className={cn("aspect-square rounded-2xl flex items-center justify-center border-2", points >= slot ? "bg-green-500 border-green-500" : "bg-white/[0.02] border-white/[0.05] text-zinc-700")}>
                  {points >= slot ? <Star className="w-4 h-4 text-black fill-black" /> : <span className="text-xs font-bold opacity-30">{slot}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Atalhos */}
          <div className="flex flex-col gap-4">
            <Link href="/orders" className="flex items-center p-5 bg-white/[0.02] border border-white/[0.05] rounded-[24px] hover:bg-white/[0.04] transition-all group flex-1">
              <div className="p-3 bg-zinc-900 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Meus Pedidos</h4>
                <p className="text-zinc-500 text-xs">Acompanhar status da entrega</p>
              </div>
            </Link>
            <Link href="/favorites" className="flex items-center p-5 bg-white/[0.02] border border-white/[0.05] rounded-[24px] hover:bg-white/[0.04] transition-all group flex-1">
              <div className="p-3 bg-zinc-900 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Favoritos</h4>
                <p className="text-zinc-500 text-xs">Itens salvos para depois</p>
              </div>
            </Link>
          </div>
        </div>

        {/* SECÇÃO DE MORADAS */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" /> As Minhas Moradas
            </h3>
            {addresses.length < 3 && !showForm && (
              <button onClick={() => setShowForm(true)} className="text-xs font-bold text-green-500 uppercase tracking-widest hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Adicionar
              </button>
            )}
          </div>

          {/* Lista de Moradas */}
          {loadingAddresses ? (
            <Loader2 className="w-6 h-6 text-green-500 animate-spin mx-auto my-8" />
          ) : addresses.length === 0 && !showForm ? (
            <div className="text-center py-10 bg-white/[0.02] border border-white/[0.05] rounded-[24px]">
              <p className="text-zinc-500 text-sm mb-4">Nenhuma morada cadastrada.</p>
              <button onClick={() => setShowForm(true)} className="bg-green-500 text-black px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-white transition-all">
                Adicionar Primeira Morada
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {addresses.map((addr) => (
                <div key={addr.id} className={cn("p-5 rounded-[24px] border relative transition-all", addr.is_default ? "bg-green-500/5 border-green-500/30" : "bg-white/[0.02] border-white/[0.05]")}>
                  {addr.is_default && (
                    <span className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-md">
                      <CheckCircle2 className="w-3 h-3" /> Padrão
                    </span>
                  )}
                  <h4 className="font-bold text-white text-base mb-1">{addr.street}, {addr.number}</h4>
                  <p className="text-zinc-400 text-sm mb-4">{addr.neighborhood} - {addr.city}/{addr.state} <br/> CEP: {addr.zip_code}</p>
                  
                  <div className="flex gap-2">
                    {!addr.is_default && (
                      <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-zinc-400 hover:text-white border border-white/[0.1] px-3 py-1.5 rounded-full transition-colors">
                        Definir como Padrão
                      </button>
                    )}
                    <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs text-red-500 hover:bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulário de Adicionar Morada */}
          {showForm && (
            <form onSubmit={handleSaveAddress} className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-[24px] animate-in fade-in slide-in-from-top-4">
              <h4 className="font-display text-lg text-white mb-4">Nova Morada</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">CEP</label>
                  <input type="text" required value={addressForm.zip_code} onChange={e => setAddressForm({...addressForm, zip_code: e.target.value})} onBlur={handleCepBlur} placeholder="00000-000" className="w-full bg-[#080a09] border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-green-500 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Rua / Logradouro</label>
                  <input type="text" required value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full bg-[#080a09] border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-green-500 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Número</label>
                    <input type="text" required value={addressForm.number} onChange={e => setAddressForm({...addressForm, number: e.target.value})} className="w-full bg-[#080a09] border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-green-500 text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Complemento</label>
                    <input type="text" value={addressForm.complement} onChange={e => setAddressForm({...addressForm, complement: e.target.value})} placeholder="Apto, Bloco..." className="w-full bg-[#080a09] border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-green-500 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Bairro</label>
                  <input type="text" required value={addressForm.neighborhood} onChange={e => setAddressForm({...addressForm, neighborhood: e.target.value})} className="w-full bg-[#080a09] border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-green-500 text-sm" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Cidade</label>
                    <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-[#080a09] border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-green-500 text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Estado (UF)</label>
                    <input type="text" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} maxLength={2} className="w-full bg-[#080a09] border border-zinc-800 text-white p-3 rounded-xl outline-none focus:border-green-500 text-sm uppercase" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-full text-sm font-bold text-zinc-400 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" disabled={savingAddress} className="bg-green-500 text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white transition-all disabled:opacity-50">
                  {savingAddress ? "Salvando..." : "Salvar Morada"}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}