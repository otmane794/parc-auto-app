import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gauge, ArrowRight, Car, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth, ROLES } from "../lib/auth.jsx";

export default function Register() {
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", motDePasse: "", role: "ResponsableParc" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!form.prenom.trim() || !form.nom.trim()) return setError("Le prénom et le nom sont obligatoires.");
    if (!form.email.trim()) return setError("L'email est obligatoire.");
    if (form.motDePasse.length < 6) return setError("Le mot de passe doit contenir au moins 6 caractères.");
    setError("");
    setLoading(true);
   
    setTimeout(() => {
      login(`${form.prenom} ${form.nom}`, form.role);
      navigate(form.role === "Conducteur" ? "/mon-vehicule" : "/dashboard", { replace: true });
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f4f8] px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-[0_2px_30px_-6px_rgba(15,23,42,0.12)] md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-[#12141c] p-10 md:flex">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900">
              <Gauge size={18} />
            </div>
            <span className="text-sm font-bold text-white">FleetOps</span>
          </Link>
          <div>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-400">
              <Car size={24} />
            </div>
            <h1 className="text-2xl font-bold leading-snug text-white">Créez votre compte FleetOps</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Choisissez votre profil : le menu et les droits d'accès s'adaptent automatiquement au rôle sélectionné.
            </p>
          </div>
          <p className="text-[11px] text-slate-500">© 2026 Menara Holding</p>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="mb-1 text-xl font-bold text-slate-900">Inscription</h2>
          <p className="mb-6 text-sm text-slate-400">Créer un compte et choisir un profil</p>

          <form onSubmit={submit}>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">Prénom</label>
                <input
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">Nom</label>
                <input
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>
            </div>

            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Email professionnel</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="prenom.nom@menara.ma"
              className="mb-4 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />

            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Mot de passe</label>
            <input
              type="password"
              value={form.motDePasse}
              onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
              placeholder="6 caractères minimum"
              className="mb-4 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />

            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Profil (simulation d'inscription)</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mb-6 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              {Object.entries(ROLES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {error && <p className="mb-4 text-xs font-medium text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (<><Loader2 size={15} className="animate-spin" /> Création du compte...</>) : (<><CheckCircle2 size={15} /> Créer mon compte</>)}
            </button>

            <p className="mt-5 text-center text-xs text-slate-400">
              Déjà un compte ? <Link to="/login" className="font-semibold text-slate-700 hover:underline">Se connecter</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
