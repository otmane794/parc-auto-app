import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmDialog({ title = "Confirmer la suppression", message, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose} maxWidth="max-w-md">
      <div className="mb-5 flex gap-3 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <p>{message}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Annuler
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className="flex-1 rounded-full bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Supprimer
        </button>
      </div>
    </Modal>
  );
}
