import { useState } from "react";
import { Download, Phone, Loader2, RefreshCw } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import RowActions from "../components/ui/RowActions";
import { Field, Input } from "../components/ui/Field";
import { Th, Td } from "../components/ui/Table";
import { useData } from "../lib/dataStore.jsx";
import { useAuth } from "../lib/auth.jsx";
import { useToast } from "../lib/toast.jsx";
import { fetchAgents } from "../lib/agirhApi";

export default function Conducteurs() {
  const { vehicules, conducteurs, updateConducteur, deleteConducteur, importConducteurs } = useData();
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [showImport, setShowImport] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Conducteurs</h1>
          <p className="text-sm text-slate-400">Synchronisés avec AGIRH · {conducteurs.length} conducteurs</p>
        </div>
        <button
          onClick={() => setShowImport(true)}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95"
        >
          <Download size={15} /> Importer depuis AGIRH
        </button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr><Th>Matricule</Th><Th>Nom</Th><Th>Téléphone</Th><Th>Véhicule affecté</Th>{isAdmin && <Th>Actions</Th>}</tr>
          </thead>
          <tbody className="stagger">
            {conducteurs.map((c) => {
              const v = vehicules.find((v) => v.conducteurId === c.id);
              return (
                <tr key={c.id} className="transition-colors hover:bg-slate-50/80">
                  <Td className="font-mono">{c.matricule}</Td>
                  <Td className="font-medium text-slate-900">{c.prenom} {c.nom}</Td>
                  <Td><span className="flex items-center gap-1.5 text-slate-600"><Phone size={13} /> {c.telephone}</span></Td>
                  <Td>{v ? <Badge tone="blue">{v.marque} {v.modele} — {v.immatriculation}</Badge> : <span className="text-slate-400">Non affecté</span>}</Td>
                  {isAdmin && <Td><RowActions onEdit={() => setEditing(c)} onDelete={() => setDeleting(c)} /></Td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {showImport && (
        <ImportAgirhModal
          existing={conducteurs}
          onClose={() => setShowImport(false)}
          onImport={(agents) => {
            const n = importConducteurs(agents);
            toast.success("Import AGIRH terminé", `${n} conducteur(s) ajouté(s)`);
          }}
        />
      )}
      {editing && (
        <ConducteurEditModal
          conducteur={editing}
          onClose={() => setEditing(null)}
          onSave={(changes) => { updateConducteur(editing.id, changes); toast.success("Conducteur modifié", `${changes.prenom} ${changes.nom}`); }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          message={`Supprimer ${deleting.prenom} ${deleting.nom} ? Le véhicule qui lui est affecté deviendra « Non affecté ».`}
          onClose={() => setDeleting(null)}
          onConfirm={() => { deleteConducteur(deleting.id); toast.success("Conducteur supprimé", `${deleting.prenom} ${deleting.nom}`); }}
        />
      )}
    </div>
  );
}

function ImportAgirhModal({ existing, onClose, onImport }) {
  const [state, setState] = useState("idle"); // idle | loading | ready | error
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const known = new Set(existing.map((c) => c.matricule));

  const load = async () => {
    setState("loading");
    try {
      const res = await fetchAgents();
      setAgents(res.data);
      setSelected(new Set(res.data.filter((a) => !known.has(a.matricule)).map((a) => a.matricule)));
      setState("ready");
    } catch {
      setState("error");
    }
  };

  const toggle = (m) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(m) ? next.delete(m) : next.add(m);
    return next;
  });

  return (
    <Modal title="Importer depuis AGIRH" subtitle="Connexion à l'API AGIRH (simulée)" onClose={onClose} maxWidth="max-w-xl">
      {state === "idle" && (
        <button onClick={load} className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          <RefreshCw size={15} /> Récupérer les agents AGIRH
        </button>
      )}
      {state === "loading" && (
        <p className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500"><Loader2 size={16} className="animate-spin" /> Appel de l'API AGIRH en cours…</p>
      )}
      {state === "error" && (
        <div className="text-center">
          <p className="mb-3 text-sm text-rose-600">L'API AGIRH n'a pas répondu.</p>
          <button onClick={load} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold">Réessayer</button>
        </div>
      )}
      {state === "ready" && (
        <>
          <div className="mb-4 max-h-80 space-y-1.5 overflow-y-auto">
            {agents.map((a) => {
              const already = known.has(a.matricule);
              return (
                <label key={a.matricule} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${already ? "bg-slate-50 opacity-60" : "bg-slate-50 hover:bg-slate-100"}`}>
                  <input type="checkbox" disabled={already} checked={selected.has(a.matricule)} onChange={() => toggle(a.matricule)} className="accent-slate-900" />
                  <span className="flex-1">
                    <span className="font-medium text-slate-900">{a.prenom} {a.nom}</span>
                    <span className="block text-xs text-slate-400">{a.matricule} · {a.fonction}</span>
                  </span>
                  {already && <Badge tone="slate">Déjà importé</Badge>}
                </label>
              );
            })}
          </div>
          <button
            disabled={selected.size === 0}
            onClick={() => { onImport(agents.filter((a) => selected.has(a.matricule))); onClose(); }}
            className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Importer {selected.size} agent(s)
          </button>
        </>
      )}
    </Modal>
  );
}

function ConducteurEditModal({ conducteur, onClose, onSave }) {
  const [form, setForm] = useState({ prenom: conducteur.prenom, nom: conducteur.nom, telephone: conducteur.telephone });
  const submit = (e) => { e.preventDefault(); onSave(form); onClose(); };
  return (
    <Modal title="Modifier le conducteur" subtitle={`Matricule ${conducteur.matricule} (issu d'AGIRH, non modifiable)`} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prénom"><Input required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></Field>
          <Field label="Nom"><Input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></Field>
        </div>
        <Field label="Téléphone"><Input required value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></Field>
        <button type="submit" className="mt-2 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800">Enregistrer</button>
      </form>
    </Modal>
  );
}
