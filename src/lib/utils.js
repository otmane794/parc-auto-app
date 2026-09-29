
export const TODAY = "2026-08-06";

export function formatDate(d) {
  return new Date(d).toLocaleDateString("fr-FR");
}

export function formatTime(d) {
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function formatDateTime(d) {
  return `${formatDate(d)} à ${formatTime(d)}`;
}

export function formatMoney(n) {
  return `${Number(n).toLocaleString("fr-FR")} MAD`;
}

export function daysUntil(dateStr, today = TODAY) {
  return Math.round((new Date(dateStr) - new Date(today)) / 86400000);
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
