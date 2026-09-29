import { NavLink } from "react-router-dom";
import { Gauge, LogOut, ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "../../lib/nav";
import { useAuth, ROLES } from "../../lib/auth.jsx";
import { CHARGES, ALERTES } from "../../data/mockData";
import { useData } from "../../lib/dataStore.jsx";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { interventions } = useData();
  const items = NAV_ITEMS.filter((n) => n.roles.includes(user?.role));
  const totalMonth = CHARGES.reduce((s, c) => s + c.montant, 0);

  const counts = {
    "/alertes": ALERTES.length,
    "/interventions": interventions.filter((i) => i.statut === "En attente").length,
  };

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col overflow-hidden bg-white">
      {/* En-tete fixe (logo + profil) */}
      <div className="shrink-0 px-6 pb-4 pt-7">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Gauge size={17} />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">FleetOps</span>
        </div>

        <div className="animate-fade-in-up">
          <div className="mb-3 h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br from-blue-200 to-violet-200 ring-4 ring-slate-50">
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-600">
              {user?.nom?.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <p className="text-sm text-slate-400">Bienvenue,</p>
          <p className="text-base font-bold text-slate-900">{user?.nom}</p>
          <p className="mt-0.5 text-xs text-slate-400">{ROLES[user?.role]}</p>

          <p className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
            {totalMonth.toLocaleString("fr-FR")} <span className="text-lg font-semibold text-slate-400">MAD</span>
          </p>
          <p className="text-sm text-slate-400">Charges du mois</p>
        </div>
      </div>

      {/* Navigation — defile independamment si la liste depasse la hauteur visible */}
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-4 py-2">
        {items.map((n) => {
          const count = counts[n.path];
          return (
            <NavLink
              key={n.path}
              to={n.path}
              end={n.path === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <n.icon size={17} className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"} />
                  <span className="flex-1">{n.label}</span>
                  {!!count && (
                    <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-rose-100 text-rose-600"
                    }`}>
                      {count}
                    </span>
                  )}
                  {isActive && !count && <ChevronRight size={14} className="text-white/70" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Pied fixe (deconnexion) */}
      <div className="shrink-0 border-t border-slate-100 px-4 py-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
