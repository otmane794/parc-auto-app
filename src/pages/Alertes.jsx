import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { ALERTES } from "../data/mockData";
import { formatDateTime } from "../lib/utils";

const ICON = { haute: AlertTriangle, moyenne: Clock, basse: CheckCircle2 };
const TONE = { haute: "rose", moyenne: "amber", basse: "slate" };

export default function Alertes() {
  const groups = ["Kilométrage", "Visite technique", "Fin de contrat"];
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alertes automatisées</h1>
        <p className="text-sm text-slate-400">Kilométrage, visite technique (J-15), fin de contrat (J-30)</p>
      </div>
      <div className="space-y-5">
        {groups.map((g) => {
          const items = ALERTES.filter((a) => a.type === g);
          if (!items.length) return null;
          return (
            <div key={g}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{g}</p>
              <div className="space-y-2">
                {items.map((a) => {
                  const Icon = ICON[a.niveau];
                  return (
                    <Card key={a.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <Icon size={17} className={a.niveau === "haute" ? "text-rose-600" : a.niveau === "moyenne" ? "text-amber-600" : "text-slate-400"} />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{a.message}</p>
                          <p className="text-xs text-slate-400">Véhicule {a.vehiculeId} · déclenchée le {formatDateTime(a.date)}</p>
                        </div>
                      </div>
                      <Badge tone={TONE[a.niveau]}>{a.niveau}</Badge>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
