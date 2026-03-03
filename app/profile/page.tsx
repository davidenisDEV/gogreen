"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { 
  Save, 
  LogOut, 
  MapPin, 
  User, 
  Phone, 
  Loader2, 
  Camera, 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  Plus, 
  Trash2,
  Home,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, profile, isLoading, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{type: 'success' | 'error', msg: string} | null>(null);
  
  // Estados de formulário
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  // Estados para Endereços
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Minha Casa",
    street: "",
    number: "",
    neighborhood: "",
    city: "Fortaleza",
    state: "CE",
    cep: "",
    complement: ""
  });

  // FUNÇÃO PARA BUSCAR CEP
  const handleCepBlur = async () => {
    const cleanCep = newAddress.cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setNewAddress(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
        // Feedback visual de sucesso no preenchimento
        showMessage('success', "Endereço localizado!");
      } else {
        showMessage('error', "CEP não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP", err);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
      loadAddresses();
    }
  }, [user, profile, isLoading]);

  async function loadAddresses() {
    if (!user) return;
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setAddresses(data || []);
  }

  const showMessage = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      showMessage('error', "Erro ao atualizar perfil.");
    } else {
      await refreshProfile();
      showMessage('success', "Perfil atualizado com sucesso!");
    }
    setSaving(false);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    // Garantimos que todos os campos esperados pelo banco estão aqui
    const { error } = await supabase
      .from("addresses")
      .insert([{ 
        label: newAddress.label,
        street: newAddress.street,
        number: newAddress.number,
        neighborhood: newAddress.neighborhood,
        cep: newAddress.cep,
        complement: newAddress.complement,
        city: newAddress.city,
        state: newAddress.state,
        user_id: user.id 
      }]);

    if (error) {
      console.error("Erro Supabase:", error);
      showMessage('error', "Erro ao salvar: Verifique os campos.");
    } else {
      setShowAddAddress(false);
      setNewAddress({ label: "Minha Casa", street: "", number: "", neighborhood: "", city: "Fortaleza", state: "CE", cep: "", complement: "" });
      loadAddresses();
      showMessage('success', "Endereço cadastrado com sucesso!");
    }
    setSaving(false);
  };

  const handleDeleteAddress = async (id: string) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (!error) {
      loadAddresses();
      showMessage('success', "Endereço removido.");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      await refreshProfile();
      showMessage('success', "Foto atualizada!");
    } catch (error) {
      showMessage('error', "Erro no upload da imagem.");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 animate-spin text-green-neon" />
    </div>
  );

  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      <Navbar />

      <div className="container mx-auto px-6 pt-32 max-w-4xl">
        {/* Header de Perfil */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-zinc-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-soft/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-neon shadow-xl bg-zinc-100">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 bg-urban-black text-white p-2.5 rounded-full hover:bg-green-forest transition-colors shadow-lg"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="font-display text-3xl text-urban-black uppercase italic leading-none mb-2">
                {profile?.full_name || "Membro GoGreen"}
              </h1>
              <p className="text-zinc-500 font-medium mb-4">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-green-soft text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Status: VIP 🍁
                </span>
                <button onClick={signOut} className="text-red-500 text-xs font-bold uppercase hover:underline flex items-center gap-1">
                  <LogOut className="w-3 h-3" /> Sair da conta
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Coluna de Dados */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm">
              <h2 className="font-display text-xl uppercase italic mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-green-forest" /> Meus Dados
              </h2>
              <form onSubmit={handleUpdateProfile} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">Nome Completo</label>
                  <input 
                    className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none focus:border-green-neon transition-all font-medium"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase ml-1">WhatsApp</label>
                  <input 
                    className="w-full bg-zinc-50 border border-zinc-100 p-4 rounded-2xl outline-none focus:border-green-neon transition-all font-medium"
                    value={formData.phone}
                    placeholder="(85) 9..."
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="md:col-span-2 bg-urban-black text-green-neon font-display py-4 rounded-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> SALVAR ALTERAÇÕES</>}
                </button>
              </form>
            </section>

            {/* Endereços */}
            <section className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl uppercase italic flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-forest" /> Moradas de Entrega
                </h2>
                <button 
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="p-2 bg-green-soft text-green-forest rounded-full hover:bg-green-neon transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="bg-zinc-50 p-6 rounded-[24px] mb-6 grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4">
                   <input className="col-span-2 md:col-span-1 p-3 rounded-xl border border-zinc-200 text-sm" placeholder="Apelido (Ex: Casa)" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} required />
                   <input className="col-span-2 p-3 rounded-xl border border-zinc-200 text-sm" placeholder="Rua / Logradouro" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required />
                   <input className="p-3 rounded-xl border border-zinc-200 text-sm" placeholder="Nº" value={newAddress.number} onChange={e => setNewAddress({...newAddress, number: e.target.value})} required />
                   <input className="p-3 rounded-xl border border-zinc-200 text-sm" placeholder="Bairro" value={newAddress.neighborhood} onChange={e => setNewAddress({...newAddress, neighborhood: e.target.value})} required />
                   <input 
                        className="p-3 rounded-xl border border-zinc-200 text-sm" 
                        placeholder="CEP (00000-000)" 
                        value={newAddress.cep} 
                        onChange={e => setNewAddress({...newAddress, cep: e.target.value})}
                        onBlur={handleCepBlur} // DISPARA A BUSCA AO SAIR DO CAMPO
                        required 
                    />
                   <button type="submit" className="col-span-full bg-green-forest text-white py-3 rounded-xl font-bold text-sm">CADASTRAR ENDEREÇO</button>
                </form>
              )}

              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-center text-zinc-400 text-sm py-4 italic">Nenhuma morada cadastrada.</p>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className="flex items-center justify-between p-5 bg-zinc-50 rounded-2xl border border-zinc-100 group">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm"><Home className="w-5 h-5 text-zinc-400" /></div>
                        <div>
                          <p className="font-bold text-urban-black">{addr.label}</p>
                          <p className="text-xs text-zinc-500">{addr.street}, {addr.number} - {addr.neighborhood}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-zinc-300 hover:text-red-500 p-2 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Atalhos Laterais */}
          <div className="space-y-4">
            <Link href="/orders" className="block bg-urban-black p-6 rounded-[32px] text-white hover:scale-[1.02] transition-transform shadow-lg group">
              <Package className="w-8 h-8 text-green-neon mb-4 group-hover:rotate-12 transition-transform" />
              <p className="font-display text-lg uppercase italic leading-tight">Meus Pedidos</p>
            </Link>
            <Link href="/favorites" className="block bg-white border border-zinc-100 p-6 rounded-[32px] hover:scale-[1.02] transition-transform shadow-sm group">
              <Heart className="w-8 h-8 text-red-500 mb-4 fill-red-500/10 group-hover:fill-red-500 transition-colors" />
              <p className="font-display text-lg uppercase italic leading-tight">Favoritos</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Toast de Notificação */}
      {toast && (
        <div className={cn(
          "fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-[100]",
          toast.type === 'success' ? "bg-green-600 text-white" : "bg-red-600 text-white"
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-bold text-sm tracking-wide">{toast.msg}</span>
        </div>
      )}
    </main>
  );
}