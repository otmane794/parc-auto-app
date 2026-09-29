import { useState } from "react";
import { Plus } from "lucide-react";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";
import { Field, Input, Select } from "../../components/ui/Field";
import { FILIALES, SITES as INITIAL_SITES } from "../../data/mockData";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import RowActions from "../../components/ui/RowActions";
import { useToast } from "../../lib/toast.jsx";

export default function FilialesSites() {
  const [sites, setSites] = useState(INITIAL_SITES);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Filiales & sites</h1>
          <p className="text-sm text-slate-400">Structure organisationnelle du groupe</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95"
        >
          <Plus size={15} /> Ajouter un site
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {FILIALES.map((f) => (
          <Card key={f.id} className="p-4">
            <p className="mb-2 font-medium text-slate-900">{f.nom}</p>
            <div className="space-y-1.5">
              {sites.filter((s) => s.filialeId === f.id).length === 0 && (
                <p className="text-xs text-slate-400">Aucun site enregistré.</p>
              )}
              {sites.filter((s) => s.filialeId === f.id).map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <div>
                    <p className="text-slate-700">{s.nom}</p>
                    <p className="text-xs text-slate-400">{s.adresse}</p>
                  </div>
                  <RowActions onEdit={() => setEditing(s)} onDelete={() => setDeleting(s)} />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <SiteFormModal
          onClose={() => setShowForm(false)}
          onCreate={(s) => {
            setSites((prev) => [...prev, s]);
            toast.success("Site ajouté", s.nom);
          }}
        />
      )}
      {editing && (
        <SiteFormModal
          initial={editing}
          onClose={() => setEditing(null)}
          onCreate={(changes) => {
            setSites((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...changes } : x)));
            toast.success("Site modifié", changes.nom);
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          message={`Supprimer le site « ${deleting.nom} » ?`}
          onClose={() => setDeleting(null)}
          onConfirm={() => { setSites((prev) => prev.filter((x) => x.id !== deleting.id)); toast.success("Site supprimé", deleting.nom); }}
        />
      )}
    </div>
  );
}

function SiteFormModal({ initial, onClose, onCreate }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(initial
    ? { nom: initial.nom, adresse: initial.adresse, filialeId: initial.filialeId }
    : { nom: "", adresse: "", filialeId: FILIALES[0].id });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.nom.trim()) return setError("Le nom du site est obligatoire.");
    onCreate(isEdit ? form : { id: `S-${Date.now().toString().slice(-6)}`, ...form });
    onClose();
  };

  return (
    <Modal title={isEdit ? "Modifier le site" : "Ajouter un site"} subtitle={isEdit ? initial.id : "Rattacher un nouveau site à une filiale"} onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Filiale">
          <Select value={form.filialeId} onChange={(e) => setForm({ ...form, filialeId: e.target.value })}>
            {FILIALES.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
          </Select>
        </Field>
        <Field label="Nom du site">
          <Input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Ex : Site Dakhla" />
        </Field>
        <Field label="Adresse">
          <Input required value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="Adresse complète" />
        </Field>
        {error && <p className="-mt-2 mb-3 text-xs font-medium text-rose-600">{error}</p>}
        <button type="submit" className="mt-2 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-transform hover:bg-slate-800 active:scale-[0.98]">
          {isEdit ? "Enregistrer les modifications" : "Créer le site"}
        </button>
      </form>
    </Modal>
  );
}
