import { FILIALES } from "../data/mockData";
import { formatDate } from "./utils";


const num = (n) => Number(n).toLocaleString("fr-FR").replace(/[\u202F\u00A0]/g, " ");
const mad = (n) => `${num(n)} MAD`;


export function buildReport(report, { vehicules, contrats, interventions, prestataires, conducteurs }) {
  const filiale = FILIALES.find((f) => f.nom === report.filiale);
  const vs = filiale ? vehicules.filter((v) => v.filialeId === filiale.id) : vehicules;
  const ids = new Set(vs.map((v) => v.id));
  const cs = contrats.filter((c) => ids.has(c.vehiculeId));
  const is = interventions.filter((i) => ids.has(i.vehiculeId));
  const v = (id) => vehicules.find((x) => x.id === id);
  const cond = (id) => conducteurs.find((c) => c.id === id);
  const presta = (id) => prestataires.find((p) => p.id === id);

  const loyers = cs.reduce((s, c) => s + c.loyer, 0);
  const coutInterv = is.reduce((s, i) => s + (i.cout || 0), 0);

  return {
    title: `Rapport ${report.id}`,
    subtitle: `Période : ${report.periode} · Filiale : ${report.filiale} · Généré le ${formatDate(report.genereLe)}`,
    kpis: [
      ["Véhicules", String(vs.length)],
      ["Contrats actifs", String(cs.length)],
      ["Loyers mensuels", mad(loyers)],
      ["Interventions", String(is.length)],
      ["Coût des interventions", mad(coutInterv)],
    ],
    sections: [
      {
        title: "Parc automobile",
        head: ["Véhicule", "Immatriculation", "Famille", "Conducteur", "Km", "Statut"],
        rows: vs.map((x) => {
          const c = cond(x.conducteurId);
          return [`${x.marque} ${x.modele}`, x.immatriculation, x.type, c ? `${c.prenom} ${c.nom}` : "Non affecté", `${num(x.kilometrage)} km`, x.statut];
        }),
      },
      {
        title: "Contrats",
        head: ["Contrat", "Véhicule", "Type", "Début", "Fin", "Loyer"],
        rows: cs.map((c) => [c.id, v(c.vehiculeId)?.immatriculation ?? "—", c.typeContrat, formatDate(c.dateDebut), formatDate(c.dateFin), mad(c.loyer)]),
      },
      {
        title: "Interventions",
        head: ["N°", "Véhicule", "Type", "Urgence", "Prestataire", "Statut", "Coût"],
        rows: is.map((i) => [i.id, v(i.vehiculeId)?.immatriculation ?? "—", i.type, i.urgence, presta(i.prestataireId)?.nom ?? "—", i.statut, i.cout ? mad(i.cout) : "—"]),
      },
    ],
  };
}

function save(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportPdf(report, data) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const r = buildReport(report, data);
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(r.title, 40, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(r.subtitle, 40, 68);
  doc.setTextColor(0);

  autoTable(doc, {
    startY: 88,
    head: [["Indicateur", "Valeur"]],
    body: r.kpis,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42] },
    styles: { fontSize: 10 },
  });

  r.sections.forEach((sec) => {
    const y = doc.lastAutoTable.finalY + 26;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(sec.title, 40, y);
    autoTable(doc, {
      startY: y + 8,
      head: [sec.head],
      body: sec.rows.length ? sec.rows : [["Aucune donnée", ...Array(sec.head.length - 1).fill("")]],
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 9 },
    });
  });

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(`Page ${i} / ${pages}`, doc.internal.pageSize.getWidth() - 80, doc.internal.pageSize.getHeight() - 20);
  }
  doc.save(`${report.id}.pdf`);
}

export async function exportDocx(report, data) {
  const { Document, Packer, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, WidthType, ShadingType } = await import("docx");
  const r = buildReport(report, data);

  const cell = (text, header = false) =>
    new TableCell({
      shading: header ? { type: ShadingType.CLEAR, fill: "0F172A", color: "auto" } : undefined,
      margins: { top: 60, bottom: 60, left: 90, right: 90 },
      children: [new Paragraph({ children: [new TextRun({ text: String(text), bold: header, color: header ? "FFFFFF" : "000000", size: 18 })] })],
    });

  const table = (head, rows) =>
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ tableHeader: true, children: head.map((h) => cell(h, true)) }),
        ...(rows.length ? rows : [["Aucune donnée", ...Array(head.length - 1).fill("")]]).map((row) => new TableRow({ children: row.map((c) => cell(c)) })),
      ],
    });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: r.title })] }),
          new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: r.subtitle, color: "64748B" })] }),
          new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Indicateurs clés")] }),
          table(["Indicateur", "Valeur"], r.kpis),
          ...r.sections.flatMap((sec) => [
            new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360, after: 120 }, children: [new TextRun(sec.title)] }),
            table(sec.head, sec.rows),
          ]),
        ],
      },
    ],
  });

  save(await Packer.toBlob(doc), `${report.id}.docx`);
}
