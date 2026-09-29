import { useState } from "react";
import { Car, Search, Plus, X, ChevronRight, FileUp } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { Field, Input, Select } from "../components/ui/Field";
import { Th, Td } from "../components/ui/Table";
import { DOCUMENTS, FILIALES, filialeById } from "../data/mockData";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import RowActions from "../components/ui/RowActions";
import { useAuth } from "../lib/auth.jsx";
import { useData } from "../lib/dataStore.jsx";
import { useToast } from "../lib/toast.jsx";
import { daysUntil, formatDate, addDays, TODAY } from "../lib/utils";

export default function Vehicules() {
  const { vehicules, addVehicule, updateVehicule, deleteVehicule, contrats, interventions, conducteurs, getConducteurById } = useData();
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [famille, setFamille] = useState("Toutes");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const rows = vehicules.filter(
    (v) =>
      (famille === "Toutes" || v.type === famille) &&
      (v.immatriculation.toLowerCase().includes(q.toLowerCase()) ||
        v.modele.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestion du parc</h1>
          <p className="text-sm text-slate-400">{vehicules.length} véhicules enregistrés</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95"
        >
          <Plus size={15} /> Ajouter un véhicule
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 shadow-sm transition-shadow focus-within:shadow-md">
          <Search size={14} className="text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Immatriculation, modèle..."
            className="w-64 text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        {["Toutes", "LLD", "Leasing"].map((f) => (
          <button
            key={f}
            onClick={() => setFamille(f)}
            className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
              famille === f ? "bg-slate-900 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-400">Aucun véhicule ne correspond à cette recherche.</Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <Th>Véhicule</Th><Th>Famille</Th><Th>Conducteur</Th><Th>Filiale</Th><Th>Km</Th><Th>Visite technique</Th><Th>Statut</Th>{isAdmin && <Th>Actions</Th>}<Th></Th>
              </tr>
            </thead>
            <tbody className="stagger">
              {rows.map((v) => {
                const dleft = daysUntil(v.dateVisiteTechnique);
                const conducteur = getConducteurById(v.conducteurId);
                const filiale = filialeById(v.filialeId);
                return (
                  <tr key={v.id} className="group cursor-pointer transition-colors hover:bg-slate-50/80" onClick={() => setSelected(v)}>
                    <Td className="font-medium text-slate-900">
                      {v.marque} {v.modele}
                      <div className="text-xs font-normal text-slate-400">{v.immatriculation}</div>
                    </Td>
                    <Td><Badge tone={v.type === "LLD" ? "blue" : "orange"}>{v.type}</Badge></Td>
                    <Td>{conducteur ? `${conducteur.prenom} ${conducteur.nom}` : "Non affecté"}</Td>
                    <Td>{filiale?.nom ?? "—"}</Td>
                    <Td className="font-mono tabular-nums">{v.kilometrage.toLocaleString("fr-FR")} km</Td>
                    <Td>
                      <span className={dleft <= 15 ? "font-medium text-rose-600" : "text-slate-600"}>
                        {formatDate(v.dateVisiteTechnique)} {dleft <= 15 && `(J-${dleft})`}
                      </span>
                    </Td>
                    <Td>
                      <Badge tone={v.statut === "En service" ? "emerald" : v.statut === "En entretien" ? "amber" : "slate"}>{v.statut}</Badge>
                    </Td>
                    {isAdmin && <Td><RowActions onEdit={() => setEditing(v)} onDelete={() => setDeleting(v)} /></Td>}
                    <Td><ChevronRight size={15} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-slate-500" /></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {selected && <VehicleDrawer vehicule={selected} contrats={contrats} interventions={interventions} onClose={() => setSelected(null)} />}
      {showForm && (
        <VehicleFormModal
          existing={vehicules}
          conducteurs={conducteurs}
          onClose={() => setShowForm(false)}
          onCreate={(v) => {
            addVehicule(v);
            toast.success("Véhicule ajouté", `${v.marque} ${v.modele} · ${v.immatriculation}`);
          }}
        />
      )}
      {editing && (
        <VehicleFormModal
          initial={editing}
          existing={vehicules.filter((x) => x.id !== editing.id)}
          conducteurs={conducteurs}
          onClose={() => setEditing(null)}
          onCreate={(changes) => {
            updateVehicule(editing.id, changes);
            toast.success("Véhicule modifié", `${changes.marque} ${changes.modele} · ${changes.immatriculation}`);
          }}
        />
      )}
      {deleting && (
        <ConfirmDialog
          message={`Supprimer ${deleting.marque} ${deleting.modele} (${deleting.immatriculation}) ? Ses contrats et interventions seront aussi supprimés.`}
          onClose={() => setDeleting(null)}
          onConfirm={() => { deleteVehicule(deleting.id); toast.success("Véhicule supprimé", deleting.immatriculation); }}
        />
      )}
    </div>
  );
}

function VehicleFormModal({ existing, conducteurs, initial, onClose, onCreate }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    isEdit
      ? {
          marque: initial.marque, modele: initial.modele, immatriculation: initial.immatriculation, chassis: initial.chassis,
          type: initial.type, kilometrageContractuel: initial.kilometrageContractuel, conducteurId: initial.conducteurId ?? "",
          filialeId: initial.filialeId, kilometrage: initial.kilometrage, statut: initial.statut,
          dateVisiteTechnique: initial.dateVisiteTechnique,
        }
      : { marque: "", modele: "", immatriculation: "", chassis: "", type: "LLD", kilometrageContractuel: 45000, conducteurId: "", filialeId: FILIALES[0].id }
  );
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const immat = form.immatriculation.trim();
    if (!immat) return setError("L'immatriculation est obligatoire.");
    if (existing.some((v) => v.immatriculation.toLowerCase() === immat.toLowerCase())) {
      return setError("Un véhicule avec cette immatriculation existe déjà.");
    }
    if (isEdit) {
      onCreate({ ...form, immatriculation: immat, conducteurId: form.conducteurId || null });
      onClose();
      return;
    }
    onCreate({
      id: `V-${Date.now().toString().slice(-6)}`,
      ...form,
      immatriculation: immat,
      kilometrage: 0,
      statut: "Disponible",
      dateMiseService: TODAY,
      dateVisiteTechnique: addDays(TODAY, 365),
      ww: `WW-${Math.floor(100 + Math.random() * 900)}`,
      siteId: null,
    });
    onClose();
  };

  return (
    <Modal title={isEdit ? "Modifier le véhicule" : "Ajouter un véhicule"} subtitle={isEdit ? `Fiche ${initial.id}` : "Créer une fiche véhicule dans le parc"} onClose={onClose} maxWidth="max-w-xl">
      <form onSubmit={submit} className="grid grid-cols-2 gap-x-4">
        <Field label="Marque">
          <Input required value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} placeholder="Ex : Dacia" />
        </Field>
        <Field label="Modèle">
          <Input required value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })} placeholder="Ex : Duster" />
        </Field>
        <Field label="Immatriculation">
          <Input required value={form.immatriculation} onChange={(e) => setForm({ ...form, immatriculation: e.target.value })} placeholder="12345-A-27" />
        </Field>
        <Field label="Châssis">
          <Input required value={form.chassis} onChange={(e) => setForm({ ...form, chassis: e.target.value })} placeholder="VF1..." />
        </Field>
        <Field label="Famille de contrat">
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>LLD</option>
            <option>Leasing</option>
          </Select>
        </Field>
        <Field label="Km contractuel">
          <Input type="number" min={0} value={form.kilometrageContractuel} onChange={(e) => setForm({ ...form, kilometrageContractuel: Number(e.target.value) })} />
        </Field>
        <Field label="Conducteur">
          <Select value={form.conducteurId} onChange={(e) => setForm({ ...form, conducteurId: e.target.value })}>
            <option value="">Non affecté</option>
            {conducteurs.map((c) => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
          </Select>
        </Field>
        <Field label="Filiale">
          <Select value={form.filialeId} onChange={(e) => setForm({ ...form, filialeId: e.target.value })}>
            {FILIALES.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
          </Select>
        </Field>
        {isEdit && (
          <>
            <Field label="Kilométrage actuel">
              <Input type="number" min={0} value={form.kilometrage} onChange={(e) => setForm({ ...form, kilometrage: Number(e.target.value) })} />
            </Field>
            <Field label="Statut">
              <Select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
                <option>En service</option><option>En entretien</option><option>Disponible</option>
              </Select>
            </Field>
            <Field label="Visite technique">
              <Input type="date" value={form.dateVisiteTechnique} onChange={(e) => setForm({ ...form, dateVisiteTechnique: e.target.value })} />
            </Field>
          </>
        )}
        {error && <p className="col-span-2 -mt-2 mb-3 text-xs font-medium text-rose-600">{error}</p>}
        <div className="col-span-2">
          <button type="submit" className="mt-2 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-transform hover:bg-slate-800 active:scale-[0.98]">
            {isEdit ? "Enregistrer les modifications" : "Créer le véhicule"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function VehicleDrawer({ vehicule, contrats, interventions, onClose }) {
  const contrat = contrats.find((c) => c.vehiculeId === vehicule.id);
  const hist = interventions.filter((i) => i.vehiculeId === vehicule.id);
  const docs = DOCUMENTS.filter((d) => d.vehiculeId === vehicule.id);

  return (
    <div className="fixed inset-0 z-20 flex justify-end bg-slate-900/30 animate-fade-in" onClick={onClose}>
      <div className="h-full w-full max-w-md animate-pop-in overflow-y-auto bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">{vehicule.id}</p>
            <h2 className="text-xl font-semibold text-slate-900">{vehicule.marque} {vehicule.modele}</h2>
            <p className="text-sm text-slate-500">{vehicule.immatriculation} · châssis {vehicule.chassis}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-xs text-slate-400">Kilométrage</p><p className="font-mono font-medium text-slate-800">{vehicule.kilometrage.toLocaleString("fr-FR")} km</p></div>
          <div><p className="text-xs text-slate-400">Km contractuel</p><p className="font-mono font-medium text-slate-800">{vehicule.kilometrageContractuel.toLocaleString("fr-FR")} km</p></div>
          <div><p className="text-xs text-slate-400">Mise en service</p><p className="font-medium text-slate-800">{formatDate(vehicule.dateMiseService)}</p></div>
          <div><p className="text-xs text-slate-400">Statut</p><p className="font-medium text-slate-800">{vehicule.statut}</p></div>
        </div>

        {contrat ? (
          <div className="mt-5 rounded-2xl border border-slate-100 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Contrat {contrat.typeContrat}</p>
            <p className="text-sm text-slate-700">Du {formatDate(contrat.dateDebut)} au {formatDate(contrat.dateFin)}</p>
            <p className="text-sm text-slate-700">Loyer : <span className="font-mono font-medium">{contrat.loyer.toLocaleString("fr-FR")} MAD/mois</span></p>
          </div>
        ) : (
          <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">Aucun contrat associé à ce véhicule.</p>
        )}

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Documents véhicule</p>
            <button className="flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900">
              <FileUp size={13} /> Ajouter
            </button>
          </div>
          <div className="space-y-1.5">
            {docs.length === 0 && <p className="text-sm text-slate-400">Aucun document ajouté.</p>}
            {docs.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <span className="text-slate-700">{d.nom}</span>
                <Badge tone="slate">{d.type}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Historique des interventions</p>
          <div className="space-y-2">
            {hist.length === 0 && <p className="text-sm text-slate-400">Aucune intervention enregistrée.</p>}
            {hist.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <span>{i.type}</span>
                <Badge tone={i.statut === "Clôturée" ? "emerald" : "amber"}>{i.statut}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
