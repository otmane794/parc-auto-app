import { Link } from "react-router-dom";
import { Gauge, Car, ShieldCheck, BarChart3, Wrench, ArrowRight, UserPlus } from "lucide-react";

const FEATURES = [
  { icon: Car, title: "Parc automobile", text: "Véhicules, contrats LLD et Leasing, documents et échéances en un coup d'œil." },
  { icon: Wrench, title: "Interventions", text: "Réparations, entretiens et prestataires suivis de bout en bout." },
  { icon: BarChart3, title: "Reporting", text: "Rapports consolidés exportables en PDF et Word par filiale." },
  { icon: ShieldCheck, title: "Rôles & accès", text: "Chaque profil voit exactement ce dont il a besoin, rien de plus." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0b0d14] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900">
            <Gauge size={18} />
          </div>
          <span className="text-sm font-bold">FleetOps</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10">
            Se connecter
          </Link>
          <Link to="/register" className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-transform hover:bg-slate-100 active:scale-95">
            <UserPlus size={15} /> Créer un compte
          </Link>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-10 sm:pt-20">
        <div
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-10 left-0 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }}
        />

        <div className="relative grid gap-14 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/70">
              Menara Holding — Gestion de parc
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              Toute la gestion de votre <span className="text-blue-400">parc automobile</span>, un seul endroit.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              Véhicules, contrats, conducteurs, interventions, consommation et prestataires — centralisés pour
              l'ensemble des filiales, avec des accès adaptés à chaque rôle.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-full bg-slate-900 border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-transform hover:bg-slate-100 active:scale-95"
              >
                Se connecter <ArrowRight size={15} />
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <UserPlus size={15} /> Créer un compte
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-blue-400">
                  <f.icon size={18} />
                </div>
                <p className="font-semibold text-white">{f.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="pb-8 text-center text-[11px] text-white/30">© 2026 Menara Holding — FleetOps</p>
    </div>
  );
}
