import { useState } from "react";
import { Send, History, Gauge } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { CONDUCTEURS } from "../data/mockData";
import { useData } from "../lib/dataStore.jsx";
import { useToast } from "../lib/toast.jsx";
import { formatDate, TODAY } from "../lib/utils";
import { useAuth } from "../lib/auth.jsx";

export default function ConducteurPortal() {
  const { user } = useAuth();
  const { vehicules, interventions, addIntervention } = useData();
  const [openForm, setOpenForm] = useState(false);
  const toast = useToast();

  // Démo : on rattache le conducteur connecté au premier conducteur du référentiel
  const conducteur = CONDUCTEURS[0];
  const vehicule = vehicules.find((v) => v.conducteurId === conducteur.id);
  const historique = interventions.filter((i) => i.vehiculeId === vehicule?.id);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mon véhicule</h1>
        <p className="text-sm text-slate-400">Bienvenue {user?.nom} — accès conducteur (via AGIRH)</p>
      </div>

      {vehicule ? (
        <>
          <Card className="mb-4 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">{vehicule.id}</p>
                <h2 className="text-xl font-semibold text-slate-900">{vehicule.marque} {vehicule.modele}</h2>
                <p className="text-sm text-slate-500">{vehicule.immatriculation}</p>
              </div>
              <Badge tone={vehicule.statut === "En service" ? "emerald" : "amber"}>{vehicule.statut}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div className="flex items-center gap-2"><Gauge size={15} className="text-slate-400" /> {vehicule.kilometrage.toLocaleString("fr-FR")} km</div>
              <div>Visite technique : {formatDate(vehicule.dateVisiteTechnique)}</div>
              <div>Type de contrat : {vehicule.type}</div>
            </div>
          </Card>

          <button
            onClick={() => setOpenForm(true)}
            className="mb-4 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95"
          >
            <Send size={15} /> Faire une demande de réparation
          </button>

          <Card className="p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700"><History size={15} /> Mon historique</p>
            <div className="space-y-2">
              {historique.length === 0 && <p className="text-sm text-slate-400">Aucune intervention enregistrée.</p>}
              {historique.map((i) => (
                <div key={i.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <span>{i.type} — {formatDate(i.dateDemande)}</span>
                  <Badge tone={i.statut === "Clôturée" ? "emerald" : "amber"}>{i.statut}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-10 text-center text-sm text-slate-400">Aucun véhicule ne vous est actuellement affecté.</Card>
      )}

      {openForm && (
        <DemandeReparationModal
          onClose={() => setOpenForm(false)}
          onSubmitted={() => {
            addIntervention({
              id: `I-${Date.now().toString().slice(-6)}`,
              vehiculeId: vehicule.id,
              prestataireId: null,
              type: "Réparation",
              urgence: "Normale",
              statut: "En attente",
              dateDemande: TODAY,
              dateIntervention: null,
              cout: 0,
              tempsIndisponibilite: "—",
              origineDemandeConducteur: true,
              emailManuel: false,
            });
            toast.success("Demande envoyée", "Transmise au responsable du parc via AGIRH");
          }}
        />
      )}
    </div>
  );
}

function DemandeReparationModal({ onClose, onSubmitted }) {
  const [description, setDescription] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!description.trim()) return setError("Merci de décrire le problème avant d'envoyer la demande.");
    setSent(true);
    onSubmitted();
  };

  return (
    <Modal title="Demande de réparation" onClose={onClose}>
      {!sent ? (
        <form onSubmit={submit}>
          <label className="mb-1.5 block text-xs font-semibold text-slate-500">Description du problème</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => { setDescription(e.target.value); setError(""); }}
            className="mb-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            placeholder="Ex : bruit anormal au freinage..."
          />
          {error && <p className="mb-3 text-xs font-medium text-rose-600">{error}</p>}
          <button type="submit" className="mt-3 w-full rounded-full bg-slate-900 py-2.5 text-sm font-medium text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95">
            Envoyer via AGIRH
          </button>
        </form>
      ) : (
        <p className="rounded-xl bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
          Demande transmise au responsable du parc via AGIRH. Vous serez notifié de son traitement.
        </p>
      )}
    </Modal>
  );
}
