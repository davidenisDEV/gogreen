"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Lock, Mail, Loader2, LayoutDashboard, BookOpen, Gift, ShoppingCart, LogOut, ShieldCheck, PackageSearch, TrendingUp, DollarSign, AlertCircle, Users, Download, Home, PackagePlus, CheckCircle2
} from "lucide-react";

import { AdminEscolinha } from "./components/AdminEscolinha";
import { AdminRewards } from "./components/AdminRewards"; 
import { AdminProducts } from "./components/AdminProducts";
import { AdminCRM } from "./components/AdminCRM"; 
import { AdminOrders } from "./components/AdminOrders";
import { AdminKit } from "./components/AdminKit";
import { AdminDashboard } from "./components/AdminDashboard"; 
import { MonitorSmartphone } from "lucide-react";
import { AdminPOS } from "./components/AdminPOS";

export default function AdminPage() {
  const { user, profile, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // ESTADOS DE DADOS DA DASHBOARD (Inteligência de Negócio)
  const [metricsData, setMetricsData] = useState({
    lowStockCount: 0,
    totalMembers: 0,
    totalRevenue: 0,
    salesCount: 0,
    totalStockValue: 0,
    stockHealth: 0,
    topProducts: [] as any[]
  });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [inventoryData, setInventoryData] = useState<any[]>([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [toast, setToast] = useState<{type: 'success' | 'error', msg: string} | null>(null);
  
  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadMetrics() {
      try {
        const { data: products } = await supabase.from("products").select("*");
        const { data: orders } = await supabase.from("orders").select("total_amount");
        const { count: membersCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });

        if (isMounted && products) {
          // Cálculos Financeiros
          const lowStock = products.filter(p => p.stock < 5);
          const totalRevenue = orders?.reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0) || 0;
          const stockValue = products.reduce((acc, curr) => acc + (Number(curr.price) * Number(curr.stock)), 0);
          const healthPercent = Math.round(((products.length - lowStock.length) / products.length) * 100) || 0;

          // Agrupamento por Categoria para o Gráfico
          const categoryList = ["kits", "papelaria", "fogo", "fumos", "acessorios"];
          const sData = categoryList.map(cat => {
            const count = products.filter(p => p.category === cat).length;
            return { label: cat, count, percent: (count / products.length) * 100 || 0 };
          });

          setMetricsData({
            lowStockCount: lowStock.length,
            totalMembers: membersCount || 0,
            totalRevenue: totalRevenue,
            salesCount: orders?.length || 0,
            totalStockValue: stockValue,
            stockHealth: healthPercent,
            topProducts: [...products].sort((a,b) => b.stock - a.stock).slice(0, 3)
          });

          setSalesData(sData as any);
          setInventoryData(products as any);
        }
      } catch (error) {
        console.error("Erro ao carregar inteligência da dashboard:", error);
      }
    }

    if (profile?.role === 'admin') loadMetrics();
    return () => { isMounted = false; };
  }, [profile]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError("Acesso negado.");
    setLoginLoading(false);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-zinc-50"><Loader2 className="w-8 h-8 text-zinc-900 animate-spin" /></div>;

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 relative admin-panel">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl z-10">
          <ShieldCheck className="w-12 h-12 text-zinc-900 mx-auto mb-4" />
          <h1 className="font-display text-2xl text-zinc-900 text-center mb-2">Painel de Controle</h1>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input type="email" required placeholder="E-mail Corporativo" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 rounded-xl outline-none bg-zinc-50 border border-zinc-200" />
            <input type="password" required placeholder="Senha de Acesso" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 rounded-xl outline-none bg-zinc-50 border border-zinc-200" />
            {loginError && <p className="text-red-500 text-xs text-center font-medium">{loginError}</p>}
            <button disabled={loginLoading} type="submit" className="w-full bg-zinc-900 text-white font-bold py-4 rounded-xl flex justify-center hover:bg-black transition-colors">
              {loginLoading ? <Loader2 className="animate-spin" /> : "ACESSAR PLATAFORMA"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "pos", label: "Venda de Balcão (PDV)", icon: <MonitorSmartphone className="w-5 h-5" /> },
    { id: "crm", label: "Clientes & CRM", icon: <Users className="w-5 h-5" /> },
    { id: "escolinha", label: "Escolinha GoGreen", icon: <BookOpen className="w-5 h-5" /> },
    { id: "orders", label: "Pedidos & Vendas", icon: <ShoppingCart className="w-5 h-5" /> },
    { id: "products", label: "Produtos & Estoque", icon: <PackageSearch className="w-5 h-5" /> },
    { id: "kit", label: "Config. Monte seu Kit", icon: <PackagePlus className="w-5 h-5" /> },
    { id: "rewards", label: "Prémios Clube VIP", icon: <Gift className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-900 relative overflow-hidden admin-panel">
      <aside className="hidden md:flex flex-col w-72 bg-white h-screen sticky top-0 border-r border-zinc-200 shadow-sm z-10">
        <div className="p-8 border-b border-zinc-100">
          <h1 className="font-display text-2xl text-zinc-900 uppercase tracking-tighter">GoGreen <span className="text-zinc-400">Admin</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold ${activeTab === item.id ? "bg-zinc-900 text-white shadow-md shadow-zinc-200/50" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-100 space-y-2">
          <Link href="/" className="w-full flex items-center gap-3 p-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors text-sm font-bold"><Home className="w-4 h-4" /> Ir para a Loja</Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 p-3 text-red-500 rounded-xl hover:bg-red-50 font-bold transition-colors text-sm"><LogOut className="w-4 h-4" /> Encerrar Sessão</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl mx-auto w-full pb-24">
        <header className="mb-10 border-b border-zinc-200 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <h2 className="font-display text-3xl text-zinc-900 uppercase tracking-tight">{menuItems.find(m => m.id === activeTab)?.label || activeTab}</h2>
             <p className="text-zinc-500 text-sm mt-1">Dados reais extraídos diretamente do Supabase.</p>
           </div>
        </header>

        {activeTab === "dashboard" && (
          <AdminDashboard 
            metrics={metricsData} 
            salesData={salesData} 
            inventoryData={inventoryData} 
          />
        )}
        {activeTab === "crm" && <AdminCRM showToast={showToast} />}
        {activeTab === "pos" && <AdminPOS showToast={showToast} />}
        {activeTab === "products" && <AdminProducts showToast={showToast} />}
        {activeTab === "kit" && <AdminKit showToast={showToast} />}
        {activeTab === "escolinha" && <AdminEscolinha showToast={showToast} />}
        {activeTab === "rewards" && <AdminRewards showToast={showToast} />}
        {activeTab === "orders" && <AdminOrders showToast={showToast} />}
        
      </main>

      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 z-[100] ${
          toast.type === 'success' ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-red-50 text-red-600 border-red-200'
        }`}>
           {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5" />}
           <span className="font-bold text-sm">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}