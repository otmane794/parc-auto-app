import {
  LayoutDashboard, Car, FileText, Users, Wrench, Settings2, Fuel, Wallet,
  Bell, Star, Building2, BarChart3, ShieldCheck, MapPin,
} from "lucide-react";


export const NAV_ITEMS = [
  { path: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, roles: ["Administrateur", "ResponsableParc", "DCH", "DirectionGenerale", "ResponsableSite"] },
  { path: "/vehicules", label: "Parc automobile", icon: Car, roles: ["Administrateur", "ResponsableParc", "ResponsableSite", "DCH"] },
  { path: "/contrats", label: "Contrats", icon: FileText, roles: ["Administrateur", "ResponsableParc"] },
  { path: "/conducteurs", label: "Conducteurs", icon: Users, roles: ["Administrateur", "ResponsableParc", "DCH"] },
  { path: "/interventions", label: "Réparations", icon: Wrench, roles: ["Administrateur", "ResponsableParc", "ResponsableSite"] },
  { path: "/entretiens", label: "Entretiens", icon: Settings2, roles: ["Administrateur", "ResponsableParc"] },
  { path: "/consommation", label: "Consommation", icon: Fuel, roles: ["Administrateur", "ResponsableParc"] },
  { path: "/charges", label: "Charges", icon: Wallet, roles: ["Administrateur", "ResponsableParc", "DirectionGenerale"] },
  { path: "/alertes", label: "Alertes", icon: Bell, roles: ["Administrateur", "ResponsableParc", "ResponsableSite"] },
  { path: "/evaluation", label: "Évaluation", icon: Star, roles: ["Administrateur", "ResponsableParc"] },
  { path: "/prestataires", label: "Prestataires", icon: Building2, roles: ["Administrateur", "ResponsableParc"] },
  { path: "/reporting", label: "Reporting", icon: BarChart3, roles: ["Administrateur", "ResponsableParc", "DCH", "DirectionGenerale", "ResponsableSite"] },
  { path: "/admin/utilisateurs", label: "Utilisateurs & rôles", icon: ShieldCheck, roles: ["Administrateur"] },
  { path: "/admin/filiales", label: "Filiales & sites", icon: MapPin, roles: ["Administrateur"] },
  { path: "/mon-vehicule", label: "Mon véhicule", icon: Car, roles: ["Conducteur"] },
];
