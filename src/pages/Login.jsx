import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gauge, ArrowRight, Car, Loader2 } from "lucide-react";
import { useAuth, ROLES } from "../lib/auth.jsx";

export default function Login() {
  const [nom, setNom] = useState("Sara Belmokhtar");
  const [role, setRole] = useState("ResponsableParc");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(nom, role);
      navigate(role === "Conducteur" ? "/mon-vehicule" : "/dashboard", { replace: true });
    }, 450);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#f3f4f8] px-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_2px_30px_-6px_rgba(15,23,42,0.12)] md:grid-cols-2">
        {/* Left panel */}
        <div className="hidden flex-col justify-between bg-[#12141c] p-10 md:flex">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900">
              <Gauge size={18} />
            </div>
            <span className="text-sm font-bold text-white">FleetOps</span>
          </div>
          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-400">
              <Car size={24} />
            </div>
            <h1 className="text-2xl font-bold leading-snug text-white">
              Toute la gestion de votre parc automobile, un seul endroit.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Véhicules, contrats, interventions, consommation et prestataires —
              centralisés pour l'ensemble des filiales de Menara Holding.
            </p>
          </div>
          <p className="text-[11px] text-slate-500">© 2026 Menara Holding</p>
        </div>

        {/* Right panel — form */}
        <div className="p-8 sm:p-10">
          <h2 className="mb-1 text-xl font-bold text-slate-900">Connexion</h2>
          <p className="mb-6 text-sm text-slate-400">Accédez à votre espace FleetOps</p>

          <form onSubmit={submit}>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Nom d'utilisateur</label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="mb-4 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />

            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Profil (simulation de connexion)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mb-6 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              {Object.entries(ROLES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Connexion...
                </>
              ) : (
                <>
                  Se connecter <ArrowRight size={15} />
                </>
              )}
            </button>
            <p className="mt-4 text-center text-[11px] text-slate-400">
              Le menu s'adapte automatiquement au profil sélectionné.
            </p>
            <p className="mt-2 text-center text-xs text-slate-400">
              Pas encore de compte ? <a href="/register" className="font-semibold text-slate-700 hover:underline">Créer un compte</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
