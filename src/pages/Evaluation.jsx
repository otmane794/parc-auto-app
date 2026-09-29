import { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { Th, Td } from "../components/ui/Table";
import { useData } from "../lib/dataStore.jsx";
import { useToast } from "../lib/toast.jsx";

function noteLabel(n) {
  if (n < 3) return { l: "Très insuffisant", t: "rose" };
  if (n < 5) return { l: "Insuffisant", t: "rose" };
  if (n < 7) return { l: "Acceptable", t: "amber" };
  if (n < 9) return { l: "Bon", t: "emerald" };
  return { l: "Excellent", t: "emerald" };
}

export default function Evaluation() {
  const { prestataires } = useData();
  const toast = useToast();
  const [selectedId, setSelectedId] = useState(prestataires[0]?.id ?? null);
  const selected = prestataires.find((p) => p.id === selectedId) ?? prestataires[0] ?? null;

  const [notes, setNotes] = useState({});
  const [overrideInput, setOverrideInput] = useState("");
  const [appliedOverride, setAppliedOverride] = useState(null);
  const [justification, setJustification] = useState("");

  // Réinitialise les notes quand on change de prestataire
  useEffect(() => {
    if (!selected) return;
    setNotes(Object.fromEntries(selected.criteres.map((c) => [c.nom, c.note])));
    setOverrideInput("");
    setAppliedOverride(null);
    setJustification("");
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const computed = useMemo(() => {
    if (!selected || selected.criteres.length === 0) return 0;
    return selected.criteres.reduce((s, c) => s + ((notes[c.nom] ?? c.note) * c.ponderation) / 100, 0);
  }, [notes, selected]);

  const finalNote = appliedOverride !== null ? appliedOverride : computed;
  const status = noteLabel(finalNote);

  const canApplyOverride = overrideInput !== "" && justification.trim().length > 0;

  const applyOverride = () => {
    const val = Math.min(10, Math.max(0, Number(overrideInput)));
    setAppliedOverride(val);
    toast.success("Note modifiée", `${selected.nom} · nouvelle note ${val.toFixed(1)}/10`);
  };

  if (!selected) {
    return (
      <div className="animate-fade-in-up">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Évaluation des prestataires</h1>
        </div>
        <Card className="p-10 text-center text-sm text-slate-400">Aucun prestataire à évaluer pour le moment.</Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Évaluation des prestataires</h1>
        <p className="text-sm text-slate-400">Note pondérée automatique — calculer note (include), modifier manuellement (extend)</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-3 lg:col-span-1">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Prestataires</p>
          <div className="space-y-1.5">
            {prestataires.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  selected.id === p.id ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div>
                  <p className="font-medium">{p.nom}</p>
                  <p className={`text-xs ${selected.id === p.id ? "text-slate-300" : "text-slate-400"}`}>{p.type}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">{selected.nom}</h3>
              <p className="text-sm text-slate-500">{selected.type}</p>
            </div>
            {selected.criteres.length > 0 && (
              <div className="text-right">
                <p className="font-mono text-3xl font-bold text-slate-900">{finalNote.toFixed(1)}<span className="text-base text-slate-400">/10</span></p>
                <Badge tone={status.t}>{status.l}</Badge>
              </div>
            )}
          </div>

          {selected.criteres.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">
              Aucune grille d'évaluation n'a encore été renseignée pour ce prestataire.
            </p>
          ) : (
            <>
              <table className="w-full border-collapse">
                <thead><tr><Th>Critère</Th><Th>Pondération</Th><Th>Note</Th></tr></thead>
                <tbody>
                  {selected.criteres.map((c) => (
                    <tr key={c.nom}>
                      <Td>{c.nom}</Td>
                      <Td className="font-mono">{c.ponderation}%</Td>
                      <Td>
                        <input
                          type="range" min={0} max={10}
                          value={notes[c.nom] ?? c.note}
                          onChange={(e) => { setNotes({ ...notes, [c.nom]: Number(e.target.value) }); setAppliedOverride(null); }}
                          className="w-32 accent-slate-900"
                        />
                        <span className="ml-2 font-mono text-sm">{notes[c.nom] ?? c.note}</span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700">
                  <ShieldCheck size={13} /> Modifier manuellement (justification obligatoire)
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number" min={0} max={10} step={0.1}
                    placeholder={computed.toFixed(1)}
                    value={overrideInput}
                    onChange={(e) => setOverrideInput(e.target.value)}
                    className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  <input
                    type="text" placeholder="Justification obligatoire du changement"
                    value={justification} onChange={(e) => setJustification(e.target.value)}
                    className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    type="button"
                    disabled={!canApplyOverride}
                    onClick={applyOverride}
                    className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white transition-transform hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Appliquer
                  </button>
                </div>
                {appliedOverride !== null && (
                  <p className="mt-2 text-xs text-amber-700">
                    Note forcée à <strong>{appliedOverride.toFixed(1)}</strong> — motif : « {justification} »
                  </p>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
