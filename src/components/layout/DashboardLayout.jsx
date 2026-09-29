import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import GeoBanner from "./GeoBanner";
import CommandPalette from "../CommandPalette";
import { NAV_ITEMS } from "../../lib/nav";

export default function DashboardLayout() {
  const mainRef = useRef(null);
  const { pathname } = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [booting, setBooting] = useState(true);

  // Repart toujours du haut de la page a chaque changement de route.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  // Titre d'onglet reflete la page active.
  useEffect(() => {
    const current = NAV_ITEMS.find((n) => n.path === pathname);
    document.title = current ? `${current.label} · FleetOps` : "FleetOps";
  }, [pathname]);

  // Bref ecran de chargement au premier montage (ressenti "chargement de donnees").
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 420);
    return () => clearTimeout(t);
  }, []);

  // Raccourci global Ctrl/Cmd+K pour la recherche.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f3f4f8] font-sans text-slate-800">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <GeoBanner />
        <Topbar onSearchClick={() => setPaletteOpen(true)} />
        <main ref={mainRef} className="flex-1 overflow-y-auto px-6 pb-6">
          {booting ? <BootSkeleton /> : <Outlet />}
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

function BootSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-56 rounded-lg bg-slate-200/70" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-[28px] bg-white/70" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-48 rounded-[28px] bg-white/70" />
        ))}
      </div>
    </div>
  );
}
