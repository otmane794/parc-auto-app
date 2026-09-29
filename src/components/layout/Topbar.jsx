import { useState } from "react";
import { ChevronDown, Bell, Search } from "lucide-react";
import { FILIALES, ALERTES } from "../../data/mockData";
import { formatTime } from "../../lib/utils";

const ALERTES_RECENTES = [...ALERTES].sort((a, b) => new Date(b.date) - new Date(a.date));

export default function Topbar({ onSearchClick }) {
  const [filiale, setFiliale] = useState("Toutes les filiales");
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-3">
      <button
        onClick={onSearchClick}
        className="flex w-full max-w-xs items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-400 shadow-sm transition-colors hover:bg-slate-50 sm:max-w-sm"
      >
        <Search size={14} />
        <span className="flex-1 text-left">Rechercher...</span>
        <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">Ctrl K</kbd>
      </button>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
          >
            {filiale}
            <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute right-0 top-11 z-20 w-56 animate-pop-in overflow-hidden rounded-2xl border border-slate-100 bg-white py-1.5 shadow-xl">
              {["Toutes les filiales", ...FILIALES.map((f) => f.nom)].map((f) => (
                <button
                  key={f}
                  onClick={() => { setFiliale(f); setOpen(false); }}
                  className="block w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-800"
          >
            <Bell size={16} />
            {ALERTES.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                {ALERTES.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-11 z-20 w-80 animate-pop-in overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-bold text-slate-800">Alertes actives ({ALERTES.length})</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {ALERTES_RECENTES.slice(0, 5).map((a) => (
                  <div key={a.id} className="border-b border-slate-50 px-4 py-2.5 last:border-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-slate-700">{a.message}</p>
                      <span className="shrink-0 whitespace-nowrap text-[10px] font-semibold text-slate-400">{formatTime(a.date)}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400">Véhicule {a.vehiculeId}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
