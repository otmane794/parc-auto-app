import { useState } from "react";
import { Plus } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { Field, Input, Select } from "../../components/ui/Field";
import { Th, Td } from "../../components/ui/Table";
import { UTILISATEURS as INITIAL, ROLES_LIST } from "../../data/mockData";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import RowActions from "../../components/ui/RowActions";
import { useToast } from "../../lib/toast.jsx";

function roleName(id) {
  return ROLES_LIST.find((r) => r.id === id)?.nom ?? id;
}

export default function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState(INITIAL);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const toast = useToast();

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Utilisateurs & rôles</h1>
          <p className="text-sm text-slate-400">Paramétrage des accès — réservé à l'administrateur système</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95"
        >
          <Plus size={15} /> Nouvel utilisateur
        </button>
      </div>

      <Card className="mb-4 overflow-hidden">
        <table className="w-full border-collapse">
          <thead><tr><Th>Utilisateur</Th><Th>Email</Th><Th>Rôle</Th><Th>Actions</Th></tr></thead>
          <tbody className="stagger">
            {utilisateurs.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-slate-50/80">
                <Td className="font-medium text-slate-900">{u.prenom} {u.nom}</Td>
                <Td>{u.email}</Td>
                <Td><Badge tone="blue">{roleName(u.role)}</Badge></Td>
                <Td><RowActions onEdit={() => setEditing(u)} onDelete={() => setDeleting(u)} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Rôles disponibles</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES_LIST.map((r) => (
          <Card key={r.id} className="p-4">
            <p className="font-medium text-slate-900">{r.nom}</p>
            <p className="mt-1 text-xs text-slate-400">Permissions gérées via la matrice d'accès</p>
          </Card>
        ))}
      </div>

      {showForm && (
        <UtilisateurFormModal
          existing={utilisateurs}
          onClose={() => setShowForm(false)}
          onCreate={(u) => {
            setUtilisateurs((prev) => [u, ...prev]);
            toast.success("Utilisateur créé", `${u.prenom} ${u.nom}`);
          }}
        />
      )}
      {editing && (
        <UtilisateurFormModal
          initial={editing}
          existing={utilisateurs.filter((x) => x.id !== editing.id)}
          onClose={() => setEditing(null)}
          onCreate={(changes) => {
            setUtilisateurs((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...changes } : x)));
            toast.success("Utilisateur modifié", `${changes.prenom} ${changes.nom}`);
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          message={`Supprimer le compte de ${deleting.prenom} ${deleting.nom} ?`}
          onClose={() => setDeleting(null)}
          onConfirm={() => { setUtilisateurs((prev) => prev.filter((x) => x.id !== deleting.id)); toast.success("Utilisateur supprimé", `${deleting.prenom} ${deleting.nom}`); }}
        />
      )}
    </div>
  );
}

function UtilisateurFormModal({ existing, initial, onClose, onCreate }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(initial
    ? { prenom: initial.prenom, nom: initial.nom, email: initial.email, role: initial.role }
    : { prenom: "", nom: "", email: "", role: ROLES_LIST[0].id });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (!email) return setError("L'email est obligatoire.");
    if (existing.some((u) => u.email.toLowerCase() === email)) {
      return setError("Un utilisateur avec cet email existe déjà.");
    }
    onCreate(isEdit ? { ...form, email } : { id: `U-${Date.now().toString().slice(-6)}`, ...form, email });
    onClose();
  };

  return (
    <Modal title={isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"} subtitle={isEdit ? initial.email : "Créer un compte et lui attribuer un rôle"} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prénom">
            <Input required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
          </Field>
          <Field label="Nom">
            <Input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          </Field>
        </div>
        <Field label="Email professionnel">
          <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="prenom.nom@menara.ma" />
        </Field>
        <Field label="Rôle">
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {ROLES_LIST.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}
          </Select>
        </Field>
        {error && <p className="-mt-2 mb-3 text-xs font-medium text-rose-600">{error}</p>}
        <button type="submit" className="mt-2 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-transform hover:bg-slate-800 active:scale-[0.98]">
          {isEdit ? "Enregistrer les modifications" : "Créer l'utilisateur"}
        </button>
      </form>
    </Modal>
  );
}
