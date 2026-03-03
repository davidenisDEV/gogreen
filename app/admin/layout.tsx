"use client";

import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-panel min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      {children}
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