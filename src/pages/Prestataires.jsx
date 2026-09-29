import { useState } from "react";
import { Users, Plus, Building2, Mail } from "lucide-react";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { Field, Input, Select } from "../components/ui/Field";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import RowActions from "../components/ui/RowActions";
import { useData } from "../lib/dataStore.jsx";
import { useToast } from "../lib/toast.jsx";

export default function Prestataires() {
  const { prestataires, addPrestataire, updatePrestataire, deletePrestataire } = useData();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Prestataires</h1>
          <p className="text-sm text-slate-400">Garages, loueurs et centres agréés</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95"
        >
          <Plus size={15} /> Nouveau prestataire
        </button>
      </div>

      {prestataires.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-400">Aucun prestataire enregistré pour le moment.</Card>
      ) : (
        <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prestataires.map((p) => {
            const note = p.criteres?.length
              ? p.criteres.reduce((s, c) => s + (c.note * c.ponderation) / 100, 0)
              : null;
            return (
              <Card key={p.id} className="p-5 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-8px_rgba(15,23,42,0.15)]">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Building2 size={18} /></div>
                  {note !== null ? (
                    <span className="font-mono text-lg font-bold text-slate-900">{note.toFixed(1)}</span>
                  ) : (
                    <span className="text-xs font-medium text-slate-300">Non évalué</span>
                  )}
                </div>
                <p className="font-semibold text-slate-900">{p.nom}</p>
                <p className="text-sm text-slate-400">{p.type}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><Mail size={12} /> {p.email || "—"}</p>
                <p className="text-xs text-slate-400">{p.adresse}{p.telephone ? ` · ${p.telephone}` : ""}</p>
                <div className="mt-3"><RowActions onEdit={() => setEditing(p)} onDelete={() => setDeleting(p)} /></div>
              </Card>
            );
          })}
        </div>
      )}

      {showForm && (
        <PrestataireFormModal
          existing={prestataires}
          onClose={() => setShowForm(false)}
          onCreate={(p) => { addPrestataire(p); toast.success("Prestataire ajouté", p.nom); }}
        />
      )}
      {editing && (
        <PrestataireFormModal
          initial={editing}
          existing={prestataires.filter((x) => x.id !== editing.id)}
          onClose={() => setEditing(null)}
          onCreate={(changes) => { updatePrestataire(editing.id, changes); toast.success("Prestataire modifié", changes.nom); }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          message={`Supprimer ${deleting.nom} ? Les interventions associées resteront mais sans prestataire.`}
          onClose={() => setDeleting(null)}
          onConfirm={() => { deletePrestataire(deleting.id); toast.success("Prestataire supprimé", deleting.nom); }}
        />
      )}
    </div>
  );
}

function PrestataireFormModal({ existing, initial, onClose, onCreate }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(initial
    ? { nom: initial.nom, type: initial.type, adresse: initial.adresse, telephone: initial.telephone ?? "", email: initial.email ?? "" }
    : { nom: "", type: "Maintenance mécanique", adresse: "", telephone: "", email: "" });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const nom = form.nom.trim();
    if (!nom) return setError("Le nom du prestataire est obligatoire.");
    if (existing.some((p) => p.nom.toLowerCase() === nom.toLowerCase())) {
      return setError("Un prestataire porte déjà ce nom.");
    }
    onCreate(isEdit ? { ...form, nom } : { id: `P-${Date.now().toString().slice(-6)}`, ...form, nom, criteres: [] });
    onClose();
  };

  return (
    <Modal title={isEdit ? "Modifier le prestataire" : "Nouveau prestataire"} subtitle={isEdit ? initial.id : "Garage, loueur ou centre agréé"} onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Nom du prestataire">
          <Input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Ex : Garage Al Massira" />
        </Field>
        <Field label="Type">
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>Maintenance mécanique</option>
            <option>Prestataire LLD</option>
          </Select>
        </Field>
        <Field label="Adresse / ville">
          <Input required value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="Ex : Laâyoune" />
        </Field>
        <Field label="Téléphone">
          <Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="05XX-XXXXXX" />
        </Field>
        <Field label="Email de contact">
          <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contact@prestataire.ma" />
        </Field>
        {error && <p className="-mt-2 mb-3 text-xs font-medium text-rose-600">{error}</p>}
        <button type="submit" className="mt-2 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-transform hover:bg-slate-800 active:scale-[0.98]">
          {isEdit ? "Enregistrer les modifications" : "Ajouter le prestataire"}
        </button>
      </form>
    </Modal>
  );
}
