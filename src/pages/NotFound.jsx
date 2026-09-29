import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-full min-h-[70vh] flex-col items-center justify-center gap-4 text-center animate-fade-in-up">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Compass size={28} />
      </div>
      <div>
        <p className="font-mono text-5xl font-extrabold tracking-tight text-slate-200">404</p>
        <h1 className="mt-1 text-lg font-bold text-slate-900">Page introuvable</h1>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Cette page n'existe pas ou vous n'y avez pas acces avec votre profil actuel.
        </p>
      </div>
      <Link
        to="/"
        className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
      >
        <ArrowLeft size={15} /> Retour au tableau de bord
      </Link>
    </div>
  );
}
