import { ChevronUp, ChevronDown, AlertTriangle } from "lucide-react";

const TONE = {
  slate: "bg-slate-800",
  blue: "bg-blue-500",
  orange: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

const ICON = {
  up: ChevronUp,
  down: ChevronDown,
  warn: AlertTriangle,
};

/** Pastille pleine, colorée — inspirée des badges de statut du dashboard de référence */
export default function Badge({ children, tone = "slate", icon }) {
  const Icon = ICON[icon];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${TONE[tone]}`}>
      {Icon && <Icon size={12} strokeWidth={3} />}
      {children}
    </span>
  );
}
