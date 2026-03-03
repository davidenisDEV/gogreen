"use client";

import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-urban-black text-white p-6 flex flex-col fixed h-full z-10">
        <Link href="/" className="flex items-center gap-2 mb-10 group">
             <h2 className="font-display text-2xl text-green-neon group-hover:text-white transition-colors">GO.ADMIN</h2>
        </Link>
        
        <nav className="flex-1 space-y-2">
          {/* Links fictícios para navegação visual */}
          <NavItem href="/admin" icon={<LayoutDashboard />} label="Dashboard" active />
          <NavItem href="/admin/products" icon={<Package />} label="Produtos" />
          <NavItem href="/admin/sales" icon={<ShoppingCart />} label="Vendas" />
          <NavItem href="/admin/users" icon={<Users />} label="Clientes" />
        </nav>

        <div className="mt-auto space-y-2">
            <Link href="/" className="flex items-center gap-3 text-zinc-400 hover:text-green-neon transition-colors px-4 py-2">
                <Home className="w-5 h-5" /> Ir para Loja
            </Link>
            <button className="flex items-center gap-3 text-zinc-400 hover:text-red-400 transition-colors w-full px-4 py-2">
                <LogOut className="w-5 h-5" /> Sair
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active ? "bg-green-neon text-black font-bold" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}