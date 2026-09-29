

export const FILIALES = [
  { id: "F1", nom: "Menara Prefa" },
  { id: "F2", nom: "Menara Distribution" },
  { id: "F3", nom: "Menara Immobilier" },
];

export const SITES = [
  { id: "S1", nom: "Site Laâyoune", adresse: "Zone Industrielle, Laâyoune", filialeId: "F1" },
  { id: "S2", nom: "Site Casablanca", adresse: "Aïn Sebaâ, Casablanca", filialeId: "F2" },
  { id: "S3", nom: "Site Rabat", adresse: "Technopolis, Rabat", filialeId: "F3" },
];

export const ROLES_LIST = [
  { id: "R1", nom: "Administrateur Système" },
  { id: "R2", nom: "Responsable Gestion Parc Automobile" },
  { id: "R3", nom: "Direction Capital Humain" },
  { id: "R4", nom: "Direction Générale Filiale" },
  { id: "R5", nom: "Responsable / Manager de Site" },
  { id: "R6", nom: "Conducteur" },
];

export const UTILISATEURS = [
  { id: "U1", nom: "El Amrani", prenom: "Yassine", email: "y.elamrani@menara.ma", role: "R1" },
  { id: "U2", nom: "Belmokhtar", prenom: "Sara", email: "s.belmokhtar@menara.ma", role: "R2" },
  { id: "U3", nom: "Rifi", prenom: "Hamza", email: "h.rifi@menara.ma", role: "R3" },
  { id: "U4", nom: "Ouahbi", prenom: "Nadia", email: "n.ouahbi@menara.ma", role: "R4" },
  { id: "U5", nom: "Idrissi", prenom: "Karim", email: "k.idrissi@menara.ma", role: "R5" },
];

export const CONDUCTEURS = [
  { id: "CD1", matricule: "AG-2210", nom: "Amrani", prenom: "Yassine", telephone: "0661-000111" },
  { id: "CD2", matricule: "AG-3081", nom: "Belmokhtar", prenom: "Sara", telephone: "0662-000112" },
  { id: "CD3", matricule: "AG-1187", nom: "Idrissi", prenom: "Karim", telephone: "0663-000113" },
  { id: "CD4", matricule: "AG-4520", nom: "Ouahbi", prenom: "Nadia", telephone: "0664-000114" },
  { id: "CD5", matricule: "AG-0932", nom: "Rifi", prenom: "Hamza", telephone: "0665-000115" },
];

export const VEHICULES = [
  { id: "V-102", immatriculation: "12345-A-27", chassis: "VF1RJA00X67890102", ww: "WW-102", marque: "Dacia", modele: "Duster", type: "LLD", kilometrage: 42500, kilometrageContractuel: 45000, statut: "En service", dateMiseService: "2024-08-18", dateVisiteTechnique: "2026-08-18", conducteurId: "CD1", filialeId: "F1", siteId: "S1" },
  { id: "V-103", immatriculation: "48210-B-6", chassis: "VF1KA000X67890103", ww: "WW-103", marque: "Renault", modele: "Kangoo", type: "Leasing", kilometrage: 61200, kilometrageContractuel: 60000, statut: "En service", dateMiseService: "2023-05-02", dateVisiteTechnique: "2026-08-22", conducteurId: "CD2", filialeId: "F2", siteId: "S2" },
  { id: "V-104", immatriculation: "77410-A-27", chassis: "VF3XXXXX67890104", ww: "WW-104", marque: "Peugeot", modele: "208", type: "LLD", kilometrage: 18300, kilometrageContractuel: 30000, statut: "En service", dateMiseService: "2025-02-10", dateVisiteTechnique: "2026-11-02", conducteurId: "CD3", filialeId: "F3", siteId: "S3" },
  { id: "V-105", immatriculation: "22190-C-6", chassis: "JTMHV05J...105", ww: "WW-105", marque: "Toyota", modele: "Hilux", type: "Leasing", kilometrage: 88400, kilometrageContractuel: 90000, statut: "En entretien", dateMiseService: "2022-09-01", dateVisiteTechnique: "2026-08-09", conducteurId: "CD4", filialeId: "F1", siteId: "S1" },
  { id: "V-106", immatriculation: "33501-A-1", chassis: "VF1LB000X67890106", ww: "WW-106", marque: "Dacia", modele: "Logan", type: "LLD", kilometrage: 25100, kilometrageContractuel: 45000, statut: "En service", dateMiseService: "2025-01-15", dateVisiteTechnique: "2027-01-15", conducteurId: "CD5", filialeId: "F2", siteId: "S2" },
  { id: "V-107", immatriculation: "51092-B-27", chassis: "VF1MA000X67890107", ww: "WW-107", marque: "Renault", modele: "Master", type: "Leasing", kilometrage: 5200, kilometrageContractuel: 40000, statut: "Disponible", dateMiseService: "2026-03-01", dateVisiteTechnique: "2027-03-01", conducteurId: null, filialeId: "F3", siteId: "S3" },
];

export const CONTRATS = [
  { id: "C-501", vehiculeId: "V-102", typeContrat: "LLD", dateDebut: "2024-08-18", dateFin: "2026-08-18", loyer: 3200, kilometrageContractuel: 45000 },
  { id: "C-502", vehiculeId: "V-103", typeContrat: "Leasing", dateDebut: "2023-05-02", dateFin: "2026-08-30", loyer: 2850, kilometrageContractuel: 60000 },
  { id: "C-503", vehiculeId: "V-104", typeContrat: "LLD", dateDebut: "2025-02-10", dateFin: "2028-02-10", loyer: 2400, kilometrageContractuel: 30000 },
  { id: "C-504", vehiculeId: "V-105", typeContrat: "Leasing", dateDebut: "2022-09-01", dateFin: "2026-09-05", loyer: 4100, kilometrageContractuel: 90000 },
  { id: "C-505", vehiculeId: "V-106", typeContrat: "LLD", dateDebut: "2025-01-15", dateFin: "2028-01-15", loyer: 2600, kilometrageContractuel: 45000 },
];

export const PRESTATAIRES = [
  {
    id: "P-1", nom: "Garage Atlas", type: "Maintenance mécanique", adresse: "Laâyoune", telephone: "0528-000001", email: "contact@garageatlas.ma",
    criteres: [
      { nom: "Compétences techniques", ponderation: 20, note: 9 },
      { nom: "Qualité des prestations", ponderation: 20, note: 8 },
      { nom: "Disponibilité", ponderation: 20, note: 8 },
      { nom: "Expérience et références", ponderation: 15, note: 9 },
      { nom: "Délai d'intervention", ponderation: 15, note: 7 },
      { nom: "Sécurité", ponderation: 5, note: 9 },
      { nom: "Service après-vente", ponderation: 5, note: 8 },
    ],
  },
  {
    id: "P-2", nom: "Speedy Laâyoune", type: "Maintenance mécanique", adresse: "Laâyoune", telephone: "0528-000002", email: "contact@speedy.ma",
    criteres: [
      { nom: "Compétences techniques", ponderation: 20, note: 7 },
      { nom: "Qualité des prestations", ponderation: 20, note: 7 },
      { nom: "Disponibilité", ponderation: 20, note: 8 },
      { nom: "Expérience et références", ponderation: 15, note: 6 },
      { nom: "Délai d'intervention", ponderation: 15, note: 7 },
      { nom: "Sécurité", ponderation: 5, note: 8 },
      { nom: "Service après-vente", ponderation: 5, note: 6 },
    ],
  },
  {
    id: "P-3", nom: "LLD Maroc Fleet", type: "Prestataire LLD", adresse: "Casablanca", telephone: "0522-000003", email: "contact@lldmaroc.ma",
    criteres: [
      { nom: "Prix de location", ponderation: 25, note: 8 },
      { nom: "Disponibilité des véhicules", ponderation: 20, note: 9 },
      { nom: "Assistance et dépannage", ponderation: 20, note: 9 },
      { nom: "État du parc", ponderation: 10, note: 9 },
      { nom: "Conditions contractuelles", ponderation: 10, note: 9 },
      { nom: "Qualité du service client", ponderation: 10, note: 9 },
      { nom: "Diversité du parc", ponderation: 5, note: 8 },
    ],
  },
];

export const INTERVENTIONS = [
  { id: "I-901", vehiculeId: "V-105", prestataireId: "P-1", type: "Réparation", urgence: "Haute", statut: "En cours", dateDemande: "2026-08-02", dateIntervention: null, cout: 3400, tempsIndisponibilite: "3 jours" },
  { id: "I-902", vehiculeId: "V-103", prestataireId: "P-2", type: "Entretien", urgence: "Normale", statut: "Planifiée", dateDemande: "2026-08-05", dateIntervention: "2026-08-10", cout: 850, tempsIndisponibilite: "1 jour" },
  { id: "I-903", vehiculeId: "V-102", prestataireId: "P-2", type: "Entretien", urgence: "Normale", statut: "Clôturée", dateDemande: "2026-07-20", dateIntervention: "2026-07-22", cout: 620, tempsIndisponibilite: "4 heures" },
  { id: "I-904", vehiculeId: "V-104", prestataireId: "P-1", type: "Réparation", urgence: "Faible", statut: "Clôturée", dateDemande: "2026-07-11", dateIntervention: "2026-07-13", cout: 1150, tempsIndisponibilite: "1 jour" },
  { id: "I-905", vehiculeId: "V-106", prestataireId: null, type: "Réparation", urgence: "Haute", statut: "En attente", dateDemande: "2026-08-04", dateIntervention: null, cout: 0, tempsIndisponibilite: "-" },
];

export const EMAILS = [
  { id: "E-1", interventionId: "I-901", dateEnvoi: "2026-08-02T09:14:00", objet: "Demande d'intervention - réparation V-105", horodatage: "2026-08-02T09:14:00" },
  { id: "E-2", interventionId: "I-902", dateEnvoi: "2026-08-05T11:02:00", objet: "Demande d'entretien - vidange V-103", horodatage: "2026-08-05T11:02:00" },
];

export const CONSO_MOIS = [
  { mois: "Mars", litres: 3120 }, { mois: "Avril", litres: 2980 }, { mois: "Mai", litres: 3340 },
  { mois: "Juin", litres: 3560 }, { mois: "Juillet", litres: 3810 }, { mois: "Août", litres: 2210 },
];

export const CONSOMMATIONS = [
  { id: "CO-1", vehiculeId: "V-102", conducteurId: "CD1", date: "2026-08-01", litres: 214, prix: 12.4, kilometrage: 1840 },
  { id: "CO-2", vehiculeId: "V-103", conducteurId: "CD2", date: "2026-08-01", litres: 301, prix: 12.4, kilometrage: 2210 },
  { id: "CO-3", vehiculeId: "V-104", conducteurId: "CD3", date: "2026-08-01", litres: 96, prix: 12.4, kilometrage: 940 },
  { id: "CO-4", vehiculeId: "V-105", conducteurId: "CD4", date: "2026-08-01", litres: 388, prix: 12.4, kilometrage: 2490 },
  { id: "CO-5", vehiculeId: "V-106", conducteurId: "CD5", date: "2026-08-01", litres: 178, prix: 12.4, kilometrage: 1610 },
];

export const CHARGES = [
  { id: "CH-1", vehiculeId: "V-102", type: "Loyer", categorie: "LLD", montant: 3200, date: "2026-08-01" },
  { id: "CH-2", vehiculeId: "V-104", type: "Km supplémentaire", categorie: "LLD", montant: 480, date: "2026-07-28" },
  { id: "CH-3", vehiculeId: "V-103", type: "Redevance", categorie: "Leasing", montant: 2850, date: "2026-08-01" },
  { id: "CH-4", vehiculeId: "V-105", type: "Entretien curatif", categorie: "Leasing", montant: 3400, date: "2026-08-02" },
  { id: "CH-5", vehiculeId: "V-106", type: "Franchise sinistre", categorie: "LLD", montant: 1500, date: "2026-07-15" },
  { id: "CH-6", vehiculeId: "V-103", type: "Valeur résiduelle", categorie: "Leasing", montant: 42000, date: "2026-06-30" },
];

export const DOCUMENTS = [
  { id: "D-1", vehiculeId: "V-102", nom: "Carte grise", type: "Carte grise", fichier: "carte_grise_V102.pdf" },
  { id: "D-2", vehiculeId: "V-102", nom: "Assurance 2026", type: "Assurance", fichier: "assurance_V102_2026.pdf" },
  { id: "D-3", vehiculeId: "V-103", nom: "Contrat leasing", type: "Contrat", fichier: "contrat_V103.pdf" },
  { id: "D-4", vehiculeId: "V-105", nom: "Vignette 2026", type: "Vignette", fichier: "vignette_V105_2026.pdf" },
];

export const ALERTES = [
  { id: "A-1", type: "Visite technique", niveau: "haute", vehiculeId: "V-105", message: "Visite technique dans 3 jours (09/08/2026)", date: "2026-08-05T08:12:00", statut: "Active" },
  { id: "A-2", type: "Visite technique", niveau: "moyenne", vehiculeId: "V-102", message: "Visite technique dans 12 jours (18/08/2026)", date: "2026-08-06T07:45:00", statut: "Active" },
  { id: "A-3", type: "Kilométrage", niveau: "haute", vehiculeId: "V-103", message: "Kilométrage dépassé de 1 200 km sur le contrat", date: "2026-08-04T16:30:00", statut: "Active" },
  { id: "A-4", type: "Fin de contrat", niveau: "moyenne", vehiculeId: "V-105", message: "Contrat leasing expire dans 30 jours", date: "2026-08-06T09:05:00", statut: "Active" },
  { id: "A-5", type: "Kilométrage", niveau: "basse", vehiculeId: "V-106", message: "Consommation carburant supérieure à la moyenne du parc", date: "2026-08-03T14:20:00", statut: "Active" },
];

export const REPORTING = [
  { id: "REP-1", periode: "Juillet 2026", filiale: "Toutes", genereLe: "2026-08-01" },
  { id: "REP-2", periode: "T2 2026", filiale: "Menara Prefa", genereLe: "2026-07-05" },
];

export function vehiculeById(id) {
  return VEHICULES.find((v) => v.id === id);
}
export function conducteurById(id) {
  return CONDUCTEURS.find((c) => c.id === id);
}
export function prestataireById(id) {
  return PRESTATAIRES.find((p) => p.id === id);
}
export function filialeById(id) {
  return FILIALES.find((f) => f.id === id);
}
