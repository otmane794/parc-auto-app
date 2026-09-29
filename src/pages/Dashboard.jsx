import { useState } from "react";
import {
  ChevronRight, ChevronDown, Plus, Car, Wrench, ShieldAlert,
  ShoppingCart, Home, Ticket,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, Tooltip, CartesianGrid,
} from "recharts";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { Field, Input, Select } from "../components/ui/Field";
import { CHARGES, ALERTES } from "../data/mockData";
import { useData } from "../lib/dataStore.jsx";
import { useToast } from "../lib/toast.jsx";
import { formatDate } from "../lib/utils";
import { useAuth } from "../lib/auth.jsx";

const WEEK = [
  { day: "Lun", conso: 62000, cout: 34000 },
  { day: "Mar", conso: 78000, cout: 41000 },
  { day: "Mer", conso: 55000, cout: 38000 },
  { day: "Jeu", conso: 90000, cout: 52000 },
  { day: "Ven", conso: 72000, cout: 47000 },
  { day: "Sam", conso: 60000, cout: 30000 },
  { day: "Dim", conso: 40000, cout: 22000 },
];

function Sparkline({ tone }) {
  const stroke = { emerald: "#10b981", rose: "#f43f5e" }[tone];
  return (
    <svg viewBox="0 0 80 24" className="h-6 w-16">
      <path
        d="M0 16 Q8 4 16 14 T32 12 T48 6 T64 15 T80 8"
        fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round"
      />
    </svg>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
      {payload[0].value.toLocaleString("fr-FR")} MAD
    </div>
  );
}

const ECHEANCE_STYLE = [
  { tone: "bg-rose-500", icon: ShieldAlert },
  { tone: "bg-teal-500", icon: Wrench },
  { tone: "bg-slate-900", icon: Car },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { vehicules, contrats, prestataires, addPrestataire, getVehiculeById } = useData();
  const toast = useToast();
  const [vueLLD, setVueLLD] = useState(false);
  const [showPrestataireForm, setShowPrestataireForm] = useState(false);
  const [range, setRange] = useState("Semaine");
  const [rangeOpen, setRangeOpen] = useState(false);

  const totalKm = vehicules.reduce((s, v) => s + v.kilometrage, 0);
  const totalKmContractuel = vehicules.reduce((s, v) => s + v.kilometrageContractuel, 0) || 1;
  const kmPct = Math.min(100, Math.round((totalKm / totalKmContractuel) * 100));
  const budgetDispo = contrats
    .filter((c) => (vueLLD ? c.typeContrat === "LLD" : true))
    .reduce((s, c) => s + c.loyer, 0) * 3;
  const enService = vehicules.filter((v) => v.statut === "En service").length;
  const enEntretien = vehicules.filter((v) => v.statut === "En entretien").length;

  const echeances = [
    { label: "Contrat expire", vehicule: "V-105", date: "05 sept.", key: "c1" },
    { label: "Visite technique", vehicule: "V-102", date: "18 août", key: "c2" },
    { label: "Entretien planifié", vehicule: "V-103", date: "10 août", key: "c3" },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tableau de bord</h1>
        <button className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:bg-slate-800 active:scale-95">
          Exporter le rapport
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        {/* LEFT COLUMN */}
        <div className="stagger space-y-4 xl:col-span-3">
          <Card className="p-6 transition-shadow hover:shadow-[0_8px_30px_-8px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Budget flotte disponible</span>
              <label className="flex items-center gap-2 text-xs text-slate-400">
                Vue LLD uniquement
                <button
                  type="button"
                  onClick={() => setVueLLD((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${vueLLD ? "bg-slate-900" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${vueLLD ? "translate-x-0.5" : "translate-x-5"}`} />
                </button>
              </label>
            </div>
            <p className="mt-2 text-5xl font-extrabold tracking-tight text-slate-900">
              {budgetDispo.toLocaleString("fr-FR")} <span className="text-2xl text-slate-400">MAD</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">Estimation sur 3 mois, {vueLLD ? "contrats LLD uniquement" : "tous contrats confondus"}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-mono text-sm tracking-widest text-slate-400">•••• 4532 · Menara Fleet</span>
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full bg-rose-500 opacity-90" />
                <div className="h-7 w-7 rounded-full bg-amber-400 opacity-90" />
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-500">Kilométrage utilisé sur le parc</span>
              <span className="font-bold text-slate-900">{totalKm.toLocaleString("fr-FR")} / {totalKmContractuel.toLocaleString("fr-FR")} km</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-900 transition-all duration-700 ease-out" style={{ width: `${kmPct}%` }} />
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="flex items-center justify-between p-4 transition-transform hover:-translate-y-0.5">
              <div>
                <p className="text-sm text-slate-400">En service</p>
                <p className="text-xl font-bold text-slate-900">{enService}</p>
              </div>
              <Sparkline tone="emerald" />
            </Card>
            <Card className="flex items-center justify-between p-4 transition-transform hover:-translate-y-0.5">
              <div>
                <p className="text-sm text-slate-400">En entretien</p>
                <p className="text-xl font-bold text-slate-900">{enEntretien}</p>
              </div>
              <Sparkline tone="rose" />
            </Card>
          </div>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-800">Dernières charges</p>
              <button className="text-xs font-semibold text-slate-400 hover:text-slate-700">Voir tout</button>
            </div>
            <div className="divide-y divide-slate-50">
              {CHARGES.slice(0, 3).map((c) => {
                const v = getVehiculeById(c.vehiculeId);
                const Icon = c.type.includes("Loyer") || c.type.includes("Redevance") ? Home : c.type.includes("Km") ? Ticket : ShoppingCart;
                return (
                  <div key={c.id} className="group flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                        <Icon size={15} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{c.type}</p>
                        <p className="text-xs text-slate-400">{formatDate(c.date)} · {v?.immatriculation ?? "véhicule supprimé"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">- {c.montant.toLocaleString("fr-FR")} MAD</span>
                      <ChevronRight size={15} className="text-slate-300 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="stagger space-y-4 xl:col-span-2">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-800">Statistiques de coûts</p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRangeOpen((o) => !o)}
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                >
                  {range} <ChevronDown size={12} className={`transition-transform ${rangeOpen ? "rotate-180" : ""}`} />
                </button>
                {rangeOpen && (
                  <div className="absolute right-0 top-8 z-10 w-32 animate-pop-in overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
                    {["Semaine", "Mois"].map((r) => (
                      <button key={r} type="button" onClick={() => { setRange(r); setRangeOpen(false); }} className="block w-full px-3 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-50">
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={WEEK}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F7" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="conso" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="cout" stroke="#0f172a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-800">Envoyer une demande à</p>
              <ChevronRight size={15} className="text-slate-300" />
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setShowPrestataireForm(true)}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition-transform hover:scale-105 active:scale-95"
                title="Ajouter un prestataire"
              >
                <Plus size={20} />
              </button>
              {prestataires.length === 0 ? (
                <p className="text-xs text-slate-400">Aucun prestataire enregistré.</p>
              ) : (
                prestataires.map((p) => (
                  <div
                    key={p.id}
                    title={p.nom}
                    className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-bold text-slate-600 ring-2 ring-transparent transition-all hover:-translate-y-1 hover:ring-slate-900"
                  >
                    {p.nom.slice(0, 2).toUpperCase()}
                  </div>
                ))
              )}
            </div>
          </Card>

          <div>
            <p className="mb-3 text-sm font-bold text-slate-800">Échéances à venir</p>
            <div className="grid grid-cols-3 gap-3">
              {echeances.map((e, idx) => {
                const style = ECHEANCE_STYLE[idx];
                const Icon = style.icon;
                return (
                  <div
                    key={e.key}
                    className={`flex aspect-[3/4] flex-col justify-between rounded-3xl p-4 text-white shadow-sm transition-transform hover:-translate-y-1 ${style.tone}`}
                  >
                    <Icon size={20} className="opacity-90" />
                    <div>
                      <p className="text-xs font-semibold leading-tight opacity-80">{e.label}</p>
                      <p className="mt-1 text-sm font-bold">{e.vehicule}</p>
                      <p className="text-[11px] opacity-70">{e.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showPrestataireForm && (
        <PrestataireFormModal
          existing={prestataires}
          onClose={() => setShowPrestataireForm(false)}
          onCreate={(p) => { addPrestataire(p); toast.success("Prestataire ajouté", p.nom); }}
        />
      )}
    </div>
  );
}

function PrestataireFormModal({ existing, onClose, onCreate }) {
  const [form, setForm] = useState({ nom: "", type: "Maintenance mécanique", adresse: "", email: "" });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const nom = form.nom.trim();
    if (!nom) return setError("Le nom du prestataire est obligatoire.");
    if (existing.some((p) => p.nom.toLowerCase() === nom.toLowerCase())) {
      return setError("Un prestataire porte déjà ce nom.");
    }
    onCreate({ id: `P-${Date.now().toString().slice(-6)}`, ...form, nom, criteres: [] });
    onClose();
  };

  return (
    <Modal title="Nouveau prestataire" subtitle="Ajouter un garage, loueur ou centre agréé" onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Nom du prestataire">
          <Input required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Ex : Garage Al Massira" />
        </Field>
        <Field label="Type">
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option>Maintenance mécanique</option>
            <option>Prestataire LLD</option>
          </Select>
        </Field>
        <Field label="Ville">
          <Input required value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} placeholder="Ex : Laâyoune" />
        </Field>
        <Field label="Email de contact">
          <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contact@prestataire.ma" />
        </Field>
        {error && <p className="-mt-2 mb-3 text-xs font-medium text-rose-600">{error}</p>}
        <button type="submit" className="mt-2 w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition-transform hover:bg-slate-800 active:scale-[0.98]">
          Ajouter le prestataire
        </button>
      </form>
    </Modal>
  );
}
