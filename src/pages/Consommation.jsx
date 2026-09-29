import { Upload } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { Th, Td } from "../components/ui/Table";
import { CONSOMMATIONS, conducteurById } from "../data/mockData";

const chartData = CONSOMMATIONS.map((c) => {
  const cd = conducteurById(c.conducteurId);
  return { conducteur: `${cd.prenom} ${cd.nom}`, ratio: Number(((c.litres / c.kilometrage) * 100).toFixed(1)) };
});

export default function Consommation() {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Consommation</h1>
          <p className="text-sm text-slate-400">Import cartes carburant (Afriquia) et tag Jawaz — extension du suivi kilométrique</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            <Upload size={15} /> Importer cartes carburant
          </button>
          <button className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            <Upload size={15} /> Importer Jawaz
          </button>
        </div>
      </div>

      <Card className="mb-4 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-700">Litres consommés / km parcouru par conducteur</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="fillRatio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F7" vertical={false} />
            <XAxis dataKey="conducteur" tick={{ fontSize: 10, fill: "#94A3B8" }} interval={0} angle={-12} textAnchor="end" height={50} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} width={40} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
            <Bar dataKey="ratio" name="L / 100km" fill="url(#fillRatio)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full border-collapse">
          <thead><tr><Th>Conducteur</Th><Th>Véhicule</Th><Th>Litres</Th><Th>Prix/L</Th><Th>Kilométrage</Th><Th>Ratio L/100km</Th></tr></thead>
          <tbody className="stagger">
            {CONSOMMATIONS.map((c) => {
              const cd = conducteurById(c.conducteurId);
              const ratio = (c.litres / c.kilometrage) * 100;
              return (
                <tr key={c.id} className="transition-colors hover:bg-slate-50/80">
                  <Td className="font-medium text-slate-900">{cd.prenom} {cd.nom}</Td>
                  <Td>{c.vehiculeId}</Td>
                  <Td className="font-mono">{c.litres} L</Td>
                  <Td className="font-mono">{c.prix.toFixed(2)} MAD</Td>
                  <Td className="font-mono">{c.kilometrage.toLocaleString("fr-FR")} km</Td>
                  <Td><Badge tone={ratio > 14 ? "rose" : "emerald"}>{ratio.toFixed(1)}</Badge></Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
