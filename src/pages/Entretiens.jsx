import { Droplet, ClipboardCheck } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { Th, Td } from "../components/ui/Table";
import { useData } from "../lib/dataStore.jsx";
import { formatDate, formatMoney } from "../lib/utils";

export default function Entretiens() {
  const { getVehiculeById, interventions } = useData();
  const rows = interventions.filter((i) => i.type === "Entretien");

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Entretiens et contrôles</h1>
        <p className="text-sm text-slate-400">Vidanges, contrôles techniques — planification et alertes associées</p>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
          <Droplet size={16} className="text-blue-600" /> Enregistrer une vidange
        </button>
        <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
          <ClipboardCheck size={16} className="text-emerald-600" /> Enregistrer un contrôle technique
        </button>
      </div>

      {rows.length === 0 ? (
        <Card className="p-10 text-center text-sm text-slate-400">Aucun entretien enregistré.</Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full border-collapse">
            <thead><tr><Th>Entretien</Th><Th>Véhicule</Th><Th>Date demande</Th><Th>Date intervention</Th><Th>Coût</Th><Th>Statut</Th><Th>Alerte générée</Th></tr></thead>
            <tbody className="stagger">
              {rows.map((i) => {
                const v = getVehiculeById(i.vehiculeId);
                return (
                  <tr key={i.id} className="transition-colors hover:bg-slate-50/80">
                    <Td className="font-medium text-slate-900">{i.id}</Td>
                    <Td>{v?.immatriculation ?? "—"}</Td>
                    <Td>{formatDate(i.dateDemande)}</Td>
                    <Td>{i.dateIntervention ? formatDate(i.dateIntervention) : "—"}</Td>
                    <Td className="font-mono">{i.cout ? formatMoney(i.cout) : "—"}</Td>
                    <Td><Badge tone={i.statut === "Clôturée" ? "emerald" : "amber"}>{i.statut}</Badge></Td>
                    <Td><Badge tone="blue">include : créer alerte</Badge></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
