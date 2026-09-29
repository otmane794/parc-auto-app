import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, CornerDownLeft, Car, FileText, Building2 } from "lucide-react";
import { NAV_ITEMS } from "../lib/nav";
import { useAuth } from "../lib/auth.jsx";
import { useData } from "../lib/dataStore.jsx";

export default function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicules, contrats, prestataires } = useData();

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const pages = NAV_ITEMS.filter((n) => n.roles.includes(user?.role)).map((n) => ({
      kind: "page", icon: n.icon, label: n.label, sub: "Page", action: () => navigate(n.path),
    }));
    const veh = vehicules.map((v) => ({
      kind: "vehicule", icon: Car, label: `${v.marque} ${v.modele}`, sub: v.immatriculation,
      action: () => navigate("/vehicules"),
    }));
    const ctr = contrats.map((c) => ({
      kind: "contrat", icon: FileText, label: c.id, sub: `Contrat ${c.typeContrat}`,
      action: () => navigate("/contrats"),
    }));
    const pre = prestataires.map((p) => ({
      kind: "prestataire", icon: Building2, label: p.nom, sub: p.type,
      action: () => navigate("/prestataires"),
    }));
    const all = [...pages, ...veh, ...ctr, ...pre];
    if (!term) return pages.slice(0, 8);
    return all.filter((r) => r.label.toLowerCase().includes(term) || r.sub?.toLowerCase().includes(term)).slice(0, 8);
  }, [q, vehicules, contrats, prestataires, user, navigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && results[0]) {
        results[0].action();
        onClose();
      }
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-900/40 pt-[12vh] animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-lg animate-pop-in overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
          <Search size={17} className="text-slate-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher une page, un véhicule, un contrat, un prestataire..."
            className="w-full text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-slate-400">Aucun résultat pour « {q} »</p>
          )}
          {results.map((r, i) => (
            <button
              key={`${r.kind}-${r.label}-${i}`}
              onClick={() => { r.action(); onClose(); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <r.icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{r.label}</p>
                <p className="truncate text-xs text-slate-400">{r.sub}</p>
              </div>
              {i === 0 && <CornerDownLeft size={13} className="shrink-0 text-slate-300" />}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
