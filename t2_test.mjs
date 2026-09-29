import { exportPdf, exportDocx, buildReport } from "./rx_test.mjs";
import * as m from "./src/data/mockData.js";
let saved=[];
globalThis.URL.createObjectURL=(b)=>{saved.push(b);return "blob:x"};
globalThis.document={body:{appendChild(){}},createElement:()=>({click(){},remove(){}})};
const data={vehicules:m.VEHICULES,contrats:m.CONTRATS,interventions:m.INTERVENTIONS,prestataires:m.PRESTATAIRES,conducteurs:m.CONDUCTEURS};

// Rapport "Toutes filiales"
const rep1={id:"REP-ALL",periode:"Août 2026",filiale:"Toutes",genereLe:"2026-08-06"};
const r1 = buildReport(rep1, data);
console.log("=== Toutes filiales ===");
console.log("KPIs:", JSON.stringify(r1.kpis));
r1.sections.forEach(s=>console.log(s.title, "->", s.rows.length, "lignes"));

// Rapport filiale spécifique
const rep2={id:"REP-F1",periode:"Août 2026",filiale:"Menara Prefa",genereLe:"2026-08-06"};
const r2 = buildReport(rep2, data);
console.log("=== Menara Prefa ===");
console.log("KPIs:", JSON.stringify(r2.kpis));
r2.sections.forEach(s=>console.log(s.title, "->", s.rows.length, "lignes", JSON.stringify(s.rows[0])));

import fs from "fs";
import { jsPDF } from "jspdf";
jsPDF.prototype.save = function(n){ fs.writeFileSync(n, Buffer.from(this.output("arraybuffer"))); };
await exportPdf(rep1, data);
await exportDocx(rep2, data);
fs.writeFileSync("REP-F1.docx", saved[saved.length-1]);
