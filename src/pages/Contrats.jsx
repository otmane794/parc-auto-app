import { useState } from "react";
import { FileText, Plus } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { Field, Input, Select } from "../components/ui/Field";
import { Th, Td } from "../components/ui/Table";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import RowActions from "../components/ui/RowActions";
import { useAuth } from "../lib/auth.jsx";
import { useData } from "../lib/dataStore.jsx";
import { useToast } from "../lib/toast.jsx";
import { daysUntil, formatDate, formatMoney } from "../lib/utils";

export default function Contrats() {
  const { contrats, addContrat, updateContrat, deleteContrat, vehicules, getVehiculeById } = useData();
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState("Tous");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const rows = contrats.filter((c) => tab === "Tous" || c.typeContrat === tab);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Contrats</h1>
          <p className="text-sm text-slate-400">LLD et Leasing — suivi des échéances</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={vehicules.length === 0}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={15} /> Nouveau contrat
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {["Tous", "LLD", "Leasing"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
              tab === t ? "bg-slate-900 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-400">Aucun contrat {tab !== "Tous" ? tab : ""} enregistré.</Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr><Th>Contrat</Th><Th>Véhicule</Th><Th>Type</Th><Th>Début</Th><Th>Fin</Th><Th>Loyer</Th><Th>Échéance</Th>{isAdmin && <Th>Actions</Th>}</tr>
            </thead>
            <tbody className="stagger">
              {rows.map((c) => {
                const v = getVehiculeById(c.vehiculeId);
                const dleft = daysUntil(c.dateFin);
                return (
                  <tr key={c.id} className="transition-colors hover:bg-slate-50/80">
                    <Td className="font-medium text-slate-900">{c.id}</Td>
                    <Td>{v ? `${v.marque} ${v.modele}` : "Véhicule inconnu"} <span className="text-xs text-slate-400">{v ? `(${v.immatriculation})` : ""}</span></Td>
                    <Td><Badge tone={c.typeContrat === "LLD" ? "blue" : "orange"}>{c.typeContrat}</Badge></Td>
                    <Td>{formatDate(c.dateDebut)}</Td>
                    <Td>{formatDate(c.dateFin)}</Td>
                    <Td className="font-mono">{formatMoney(c.loyer)}</Td>
                    <Td>{dleft <= 30 ? <Badge tone="rose">Expire dans {dleft} j</Badge> : <span className="text-slate-500">{dleft} j restants</span>}</Td>
                    {isAdmin && <Td><RowActions onEdit={() => setEditing(c)} onDelete={() => setDeleting(c)} /></Td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {showForm && (
        <ContratFormModal
          vehicules={vehicules}
          onClose={() => setShowForm(false)}
          onCreate={(c) => {
            addContrat(c);
            const v = getVehiculeById(c.vehiculeId);
            toast.success("Contrat créé", `${c.id} · ${v ? `${v.marque} ${v.modele}` : "véhicule"} (${c.typeContrat})`);
          }}
        />
      )}
      {editing && (
        <ContratFormModal
          initial={editing}
          vehicules={vehicules}
          onClose={() => setEditing(null)}
          onCreate={(changes) => { updateContrat(editing.id, changes); toast.success("Contrat modifié", editing.id); }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          message={`Supprimer le contrat ${deleting.id} ? Cette action est définitive.`}
          onClose={() => setDeleting(null)}
          onConfirm={() => { deleteContrat(deleting.id); toast.success("Contrat supprimé", deleting.id); }}
        />
      )}
    </div>
  );
}

function ContratFormModal({ vehicules, initial, onClose, onCreate }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(initial ? {
    vehiculeId: initial.vehiculeId, typeContrat: initial.typeContrat, dateDebut: initial.dateDebut, dateFin: initial.dateFin,
    loyer: initial.loyer, kilometrageContractuel: initial.kilometrageContractuel,
  } : {
    vehiculeId: vehicules[0]?.id ?? "", typeContrat: "LLD", dateDebut: "", dateFin: "", loyer: 2500, kilometrageContractuel: 45000,
  });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.dateDebut || !form.dateFin) return setError("Les dates de début et de fin sont obligatoires.");
    if (form.dateFin <= form.dateDebut) return setError("La date de fin doit être postérieure à la date de début.");
    if (Number(form.loyer) <= 0) return setError("Le loyer doit être supérieur à 0.");
    const data = { ...form, loyer: Number(form.loyer), kilometrageContractuel: Number(form.kilometrageContractuel) };
    onCreate(isEdit ? data : { id: `C-${Date.now().toString().slice(-6)}`, ...data });
    onClose();
  };

  return (
    <Modal title={isEdit ? "Modifier le contrat" : "Nouveau contrat"} subtitle={isEdit ? initial.id : "Associer un contrat à un véhicule"} onClose={onClose} maxWidth="max-w-xl">
      <form onSubmit={submit} className="grid grid-cols-2 gap-x-4">
        <div className="col-span-2">
          <Field label="Véhicule">
            <Select value={form.vehiculeId} onChange={(e) => setForm({ ...form, vehiculeId: e.target.value })}>
              {vehicules.map((v) => <option key={v.id} value={v.id}>{v.marque} {v.modele} — {v.immatriculation}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Type de contrat">
          <Select value={form.typeContrat} onChange={(e) => setForm({ ...form, typeContrat: e.target.value })}>
            <option>LLD</option>
            <option>Leasing</option>
          </Select>
        </Field>
        <Field label="Loyer mensuel (MAD)">
          <Input type="number" min={1} value={form.loyer} onChange={(e) => setForm({ ...form, loyer: Number(e.target.value) })} />
        </Field>
        <Field label="Date de début">
          <Input type="date" required value={form.dateDebut} onChange={(e) => setForm({ ...form, dateDebut: e.target.value })} />
        </Field>
        <Field label="Date de fin">
          <Input type="date" required value={form.dateFin} onChange={(e) => setForm({ ...form, dateFin: e.target.value })} />
        </Field>
        <div className="col-span-2">
          <Field label="Kilométrage contractuel">
            <Input type="number" min={0} value={form.kilometrageContractuel} onChange={(e) => setForm({ ...form, kilometrageContractuel: Number(e.target.value) })} />
          </Field>
        </div>
        {error && <p className="col-span-2 -mt-2 mb-3 text-xs font-medium text-rose-600">{error}</p>}
        <div className="col-span-2">
          <button type="submit" className="mt-2 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-transform hover:bg-slate-800 active:scale-[0.98]">
            {isEdit ? "Enregistrer les modifications" : "Créer le contrat"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
