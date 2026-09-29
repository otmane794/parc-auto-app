import { useState } from "react";
import { FileDown, FileText, Plus, Loader2 } from "lucide-react";
import Card from "../components/ui/Card";
import { Th, Td } from "../components/ui/Table";
import { REPORTING as INITIAL } from "../data/mockData";
import { useToast } from "../lib/toast.jsx";
import { formatDate, TODAY } from "../lib/utils";
import { useData } from "../lib/dataStore.jsx";
import { exportPdf, exportDocx } from "../lib/reportExport";

export default function Reporting() {
  const [reports, setReports] = useState(INITIAL);
  const toast = useToast();
  const data = useData();
  const [busy, setBusy] = useState(null); // "REP-1:pdf"

  const download = async (report, kind) => {
    setBusy(`${report.id}:${kind}`);
    try {
      await (kind === "pdf" ? exportPdf : exportDocx)(report, data);
      toast.success(`Export ${kind === "pdf" ? "PDF" : "Word"} téléchargé`, report.id);
    } catch (err) {
      console.error(err);
      toast.error("Échec de l'export", "Le document n'a pas pu être généré.");
    } finally {
      setBusy(null);
    }
  };

  const generate = () => {
    const rep = { id: `REP-${Date.now().toString().slice(-4)}`, periode: "Août 2026", filiale: "Toutes", genereLe: TODAY };
    setReports((prev) => [rep, ...prev]);
    toast.success("Rapport généré", rep.id);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reporting</h1>
          <p className="text-sm text-slate-400">Générer et exporter les rapports consolidés</p>
        </div>
        <button
          onClick={generate}
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95"
        >
          <Plus size={15} /> Générer un rapport
        </button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full border-collapse">
          <thead><tr><Th>Rapport</Th><Th>Période</Th><Th>Filiale</Th><Th>Généré le</Th><Th>Export</Th></tr></thead>
          <tbody className="stagger">
            {reports.map((r) => (
              <tr key={r.id} className="transition-colors hover:bg-slate-50/80">
                <Td className="font-medium text-slate-900">{r.id}</Td>
                <Td>{r.periode}</Td>
                <Td>{r.filiale}</Td>
                <Td>{formatDate(r.genereLe)}</Td>
                <Td>
                  <div className="flex gap-2">
                    {[["pdf", "PDF", FileDown], ["docx", "Word", FileText]].map(([kind, label, Icon]) => (
                      <button
                        key={kind}
                        disabled={busy !== null}
                        onClick={() => download(r, kind)}
                        className="flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50"
                      >
                        {busy === `${r.id}:${kind}` ? <Loader2 size={13} className="animate-spin" /> : <Icon size={13} />} {label}
                      </button>
                    ))}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
