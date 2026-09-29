import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../lib/auth.jsx";


export default function RowActions({ onEdit, onDelete }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  const stop = (fn) => (e) => { e.stopPropagation(); fn(); };
  return (
    <div className="flex gap-1.5">
      <button onClick={stop(onEdit)} title="Modifier" className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
        <Pencil size={13} />
      </button>
      <button onClick={stop(onDelete)} title="Supprimer" className="rounded-full border border-rose-100 p-1.5 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700">
        <Trash2 size={13} />
      </button>
    </div>
  );
}
