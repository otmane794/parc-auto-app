import { useState } from "react";
import { Plus, Mail } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { Field, Select } from "../components/ui/Field";
import { Th, Td } from "../components/ui/Table";
import { EMAILS } from "../data/mockData";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import RowActions from "../components/ui/RowActions";
import { Input } from "../components/ui/Field";
import { useAuth } from "../lib/auth.jsx";
import { useData } from "../lib/dataStore.jsx";
import { useToast } from "../lib/toast.jsx";
import { formatDate, formatMoney, TODAY } from "../lib/utils";

const URGENCE_TONE = { Haute: "rose", Normale: "amber", Faible: "slate" };
const STATUT_TONE = { "En cours": "amber", Planifiée: "blue", Clôturée: "emerald", "En attente": "rose" };

export default function Interventions() {
  const { vehicules, prestataires, interventions, addIntervention, updateIntervention, deleteIntervention, getVehiculeById, getPrestataireById } = useData();
  const [filter, setFilter] = useState("Toutes");
  const [openNew, setOpenNew] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const { isAdmin } = useAuth();
  const toast = useToast();

  const rows = interventions.filter((i) => filter === "Toutes" || i.statut === filter);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Réparations et entretiens</h1>
          <p className="text-sm text-slate-400">{interventions.length} interventions enregistrées</p>
        </div>
        <button
          onClick={() => setOpenNew(true)}
          disabled={vehicules.length === 0}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={15} /> Créer une intervention
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {["Toutes", "En attente", "Planifiée", "En cours", "Clôturée"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
              filter === s ? "bg-slate-900 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-400">Aucune intervention {filter !== "Toutes" ? `« ${filter} »` : ""} pour le moment.</Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr><Th>Intervention</Th><Th>Véhicule</Th><Th>Type</Th><Th>Urgence</Th><Th>Prestataire</Th><Th>Demande</Th><Th>Coût</Th><Th>Statut</Th><Th>Email</Th>{isAdmin && <Th>Actions</Th>}</tr>
            </thead>
            <tbody className="stagger">
              {rows.map((i) => {
                const v = getVehiculeById(i.vehiculeId);
                const p = getPrestataireById(i.prestataireId);
                const email = EMAILS.find((e) => e.interventionId === i.id);
                return (
                  <tr key={i.id} className="transition-colors hover:bg-slate-50/80">
                    <Td className="font-medium text-slate-900">{i.id}</Td>
                    <Td>{v?.immatriculation ?? "—"}</Td>
                    <Td>{i.type}</Td>
                    <Td><Badge tone={URGENCE_TONE[i.urgence]}>{i.urgence}</Badge></Td>
                    <Td>{p?.nom ?? "—"}</Td>
                    <Td>{formatDate(i.dateDemande)}</Td>
                    <Td className="font-mono">{i.cout ? formatMoney(i.cout) : "—"}</Td>
                    <Td><Badge tone={STATUT_TONE[i.statut]}>{i.statut}</Badge></Td>
                    <Td>
                      {email ? (
                        <span className="flex items-center gap-1 text-xs text-slate-400" title={`Horodatage : ${email.horodatage}`}>
                          <Mail size={12} /> {formatDate(email.dateEnvoi)}
                        </span>
                      ) : i.emailManuel ? (
                        <span className="text-xs text-slate-400">Rédaction manuelle</span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </Td>
                    {isAdmin && <Td><RowActions onEdit={() => setEditing(i)} onDelete={() => setDeleting(i)} /></Td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {openNew && (
        <NewInterventionModal
          vehicules={vehicules}
          prestataires={prestataires}
          onClose={() => setOpenNew(false)}
          onCreate={(i) => {
            addIntervention(i);
            toast.success("Intervention créée", `${i.id} · ${i.emailManuel ? "e-mail à rédiger manuellement" : "demande envoyée au prestataire"}`);
          }}
        />
      )}
      {editing && (
        <EditInterventionModal
          intervention={editing}
          prestataires={prestataires}
          onClose={() => setEditing(null)}
          onSave={(changes) => { updateIntervention(editing.id, changes); toast.success("Intervention modifiée", editing.id); }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          message={`Supprimer l'intervention ${deleting.id} ? Cette action est définitive.`}
          onClose={() => setDeleting(null)}
          onConfirm={() => { deleteIntervention(deleting.id); toast.success("Intervention supprimée", deleting.id); }}
        />
      )}
    </div>
  );
}

function EditInterventionModal({ intervention, prestataires, onClose, onSave }) {
  const [form, setForm] = useState({
    type: intervention.type, urgence: intervention.urgence, statut: intervention.statut,
    prestataireId: intervention.prestataireId ?? "", cout: intervention.cout ?? 0,
    dateIntervention: intervention.dateIntervention ?? "",
  });
  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, prestataireId: form.prestataireId || null, cout: Number(form.cout), dateIntervention: form.dateIntervention || null });
    onClose();
  };
  return (
    <Modal title="Modifier l'intervention" subtitle={intervention.id} onClose={onClose}>
      <form onSubmit={submit} className="grid grid-cols-2 gap-x-4">
        <Field label="Type">
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Réparation</option><option>Entretien</option></Select>
        </Field>
        <Field label="Urgence">
          <Select value={form.urgence} onChange={(e) => setForm({ ...form, urgence: e.target.value })}><option>Haute</option><option>Normale</option><option>Faible</option></Select>
        </Field>
        <Field label="Statut">
          <Select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
            <option>En attente</option><option>Planifiée</option><option>En cours</option><option>Clôturée</option>
          </Select>
        </Field>
        <Field label="Prestataire">
          <Select value={form.prestataireId} onChange={(e) => setForm({ ...form, prestataireId: e.target.value })}>
            <option value="">Non défini</option>
            {prestataires.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </Select>
        </Field>
        <Field label="Coût (MAD)"><Input type="number" min={0} value={form.cout} onChange={(e) => setForm({ ...form, cout: e.target.value })} /></Field>
        <Field label="Date d'intervention"><Input type="date" value={form.dateIntervention} onChange={(e) => setForm({ ...form, dateIntervention: e.target.value })} /></Field>
        <div className="col-span-2">
          <button type="submit" className="mt-2 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800">Enregistrer les modifications</button>
        </div>
      </form>
    </Modal>
  );
}

function NewInterventionModal({ vehicules, prestataires, onClose, onCreate }) {
  const [vehiculeId, setVehiculeId] = useState(vehicules[0]?.id ?? "");
  const [demandeReparation, setDemandeReparation] = useState(false);
  const [urgente, setUrgente] = useState(false);
  const [prestataireId, setPrestataireId] = useState(prestataires[0]?.id ?? "");
  const [emailManuel, setEmailManuel] = useState(false);
  const [error, setError] = useState("");
  const cout = urgente ? 2500 : 900;

  const submit = (e) => {
    e.preventDefault();
    if (!vehiculeId) return setError("Sélectionnez un véhicule.");
    onCreate({
      id: `I-${Date.now().toString().slice(-6)}`,
      vehiculeId,
      prestataireId: prestataireId || null,
      type: "Réparation",
      urgence: urgente ? "Haute" : "Normale",
      statut: prestataireId ? "Planifiée" : "En attente",
      dateDemande: TODAY,
      dateIntervention: null,
      cout,
      tempsIndisponibilite: "—",
      origineDemandeConducteur: demandeReparation,
      emailManuel,
    });
    onClose();
  };

  return (
    <Modal title="Créer une intervention" subtitle="Inclut le choix du prestataire et le calcul du coût" onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Véhicule concerné">
          <Select value={vehiculeId} onChange={(e) => setVehiculeId(e.target.value)}>
            {vehicules.map((v) => (
              <option key={v.id} value={v.id}>{v.marque} {v.modele} — {v.immatriculation}</option>
            ))}
          </Select>
        </Field>

        <label className="mb-2 flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={demandeReparation} onChange={(e) => setDemandeReparation(e.target.checked)} className="accent-slate-900" />
          <span>Origine : demande de réparation du conducteur <Badge tone="amber">extend</Badge></span>
        </label>
        <label className="mb-4 flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={urgente} onChange={(e) => setUrgente(e.target.checked)} className="accent-slate-900" />
          <span>Intervention urgente <Badge tone="amber">extend</Badge></span>
        </label>

        <Field label={<span>Choisir un prestataire <Badge tone="blue">include</Badge></span>}>
          <Select value={prestataireId} onChange={(e) => setPrestataireId(e.target.value)}>
            <option value="">À définir plus tard</option>
            {prestataires.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </Select>
        </Field>

        <div className="mb-4 rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
          Coût estimé <Badge tone="blue">include : calculer le coût</Badge>
          <span className="ml-2 font-mono font-semibold text-slate-900">{formatMoney(cout)}</span>
        </div>

        <label className="mb-4 flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={emailManuel} onChange={(e) => setEmailManuel(e.target.checked)} className="accent-slate-900" />
          <span>Générer l'e-mail manuellement (aucun modèle ne correspond) <Badge tone="amber">extend</Badge></span>
        </label>

        {error && <p className="mb-3 text-xs font-medium text-rose-600">{error}</p>}

        <button type="submit" className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95">
          Créer l'intervention et {emailManuel ? "rédiger l'e-mail" : "envoyer la demande"}
        </button>
      </form>
    </Modal>
  );
}
