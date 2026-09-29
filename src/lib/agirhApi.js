

const AGIRH_AGENTS = [
  { matricule: "AG-2210", nom: "Amrani", prenom: "Yassine", telephone: "0661-000111", fonction: "Technicien" },
  { matricule: "AG-3081", nom: "Belmokhtar", prenom: "Sara", telephone: "0662-000112", fonction: "Commerciale" },
  { matricule: "AG-1187", nom: "Idrissi", prenom: "Karim", telephone: "0663-000113", fonction: "Chef de chantier" },
  { matricule: "AG-4520", nom: "Ouahbi", prenom: "Nadia", telephone: "0664-000114", fonction: "Responsable achats" },
  { matricule: "AG-0932", nom: "Rifi", prenom: "Hamza", telephone: "0665-000115", fonction: "Ingénieur" },
  { matricule: "AG-5107", nom: "Bennani", prenom: "Omar", telephone: "0666-000116", fonction: "Logisticien" },
  { matricule: "AG-6342", nom: "Cherkaoui", prenom: "Salma", telephone: "0667-000117", fonction: "Comptable" },
  { matricule: "AG-7719", nom: "El Fassi", prenom: "Mehdi", telephone: "0668-000118", fonction: "Commercial" },
  { matricule: "AG-8026", nom: "Tazi", prenom: "Imane", telephone: "0669-000119", fonction: "Chargée RH" },
  { matricule: "AG-9154", nom: "Lahlou", prenom: "Anass", telephone: "0670-000120", fonction: "Chauffeur" },
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** GET /agirh/agents — renvoie { status, data } comme une réponse HTTP. */
export async function fetchAgents() {
  await wait(900 + Math.random() * 500);
  return { status: 200, data: AGIRH_AGENTS.map((a) => ({ ...a })) };
}
