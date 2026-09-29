import { useState } from "react";
import Card from "../components/ui/Card";
import { Th, Td } from "../components/ui/Table";
import { CHARGES } from "../data/mockData";
import { formatDate, formatMoney } from "../lib/utils";

export default function Charges() {
  const [tab, setTab] = useState("LLD");
  const rows = CHARGES.filter((c) => c.categorie === tab);
  const total = rows.reduce((s, c) => s + c.montant, 0);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Charges</h1>
        <p className="text-sm text-slate-400">Coûts rattachés aux contrats LLD et Leasing</p>
      </div>
      <div className="mb-3 flex gap-2">
        {["LLD", "Leasing"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              tab === t ? "border-transparent bg-slate-900 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Charges {t}
          </button>
        ))}
      </div>
      <Card className="overflow-hidden">
        <table className="w-full border-collapse">
          <thead><tr><Th>Type de charge</Th><Th>Véhicule</Th><Th>Date</Th><Th>Montant</Th></tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-slate-50/80">
                <Td className="font-medium text-slate-900">{c.type}</Td>
                <Td>{c.vehiculeId}</Td>
                <Td>{formatDate(c.date)}</Td>
                <Td className="font-mono">{formatMoney(c.montant)}</Td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <Td colSpan={3} className="text-right font-semibold text-slate-500">Total {tab}</Td>
              <Td className="font-mono text-base font-bold text-slate-900">{formatMoney(total)}</Td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  );
}
