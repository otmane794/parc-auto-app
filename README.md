# FleetOps — Gestion du parc automobile

Version finale — frontend React pour l'application de gestion du parc automobile
de Menara Holding, conforme au cahier des charges (acteurs, cas d'utilisation,
diagramme de classes) et bâtie sur les meilleurs éléments de toutes les itérations
précédentes de ce projet.

## Stack technique

- **React 18** + **Vite** (build ultra-rapide, HMR)
- **React Router** — navigation par rôle, page 404, routes protégées
- **Tailwind CSS** — design system cohérent (cartes, badges, boutons)
- **Recharts** — graphiques (aires, barres, lignes, camemberts)
- **lucide-react** — iconographie

Aucune dépendance superflue : le projet reste léger et lisible de bout en bout.

## Démarrer en local

```bash
npm install
npm run dev
```

Connectez-vous via la page `/login` en choisissant n'importe quel profil
(Administrateur, Responsable Parc, DCH, Direction Générale, Responsable de
Site, Conducteur) — le menu, les compteurs et les pages accessibles s'adaptent
automatiquement au rôle sélectionné.

## Ce qui fait de cette version la version "élite"

### Cohérence des données de bout en bout
Un store partagé (`DataProvider`) centralise véhicules, contrats, prestataires
et interventions. Tout ce qui est créé dans un formulaire est immédiatement
visible partout ailleurs dans l'app — y compris dans la recherche globale et
les compteurs de la sidebar. Une demande de réparation soumise depuis l'espace
conducteur crée une véritable intervention "en attente", visible instantanément
par le Responsable Parc : la relation `<<extend>>` du cahier des charges entre
*Faire une demande de réparation* et *Créer une intervention* est donc **réellement
fonctionnelle**, pas seulement illustrée sur un diagramme.

### Recherche globale (Ctrl/Cmd + K)
Une palette de commandes façon éditeur de code permet de sauter instantanément
vers n'importe quelle page, ou de retrouver un véhicule, un contrat ou un
prestataire par son nom.

### Notifications
Chaque action importante (création de véhicule, de contrat, de prestataire,
d'intervention, d'utilisateur, de site, envoi d'une demande, modification
d'une note d'évaluation...) déclenche une notification claire — l'utilisateur
n'est jamais laissé dans le doute sur ce qui vient de se passer.

### Compteurs en direct dans la navigation
Le nombre d'alertes actives et d'interventions en attente s'affiche directement
sur les liens du menu, et se met à jour en temps réel.

### Robustesse
- Page 404 pour les routes inconnues ou inaccessibles au rôle courant
- Périmètre d'erreur (`ErrorBoundary`) pour éviter un écran blanc en cas de bug
- Formulaires validés (doublons d'immatriculation/nom, dates de contrat
  cohérentes, champs obligatoires)
- Modales toujours défilables, même sur petit écran, même avec un formulaire
  long (le piège classique du centrage flex sans overflow a été corrigé)

### Finitions
- Écran de chargement au démarrage, titres d'onglet dynamiques, favicon
- Micro-interactions cohérentes partout (effet d'appui, survol, apparition en
  fondu des listes)
- Design inspiré d'un dashboard fintech moderne : bandeau décoratif, cartes
  blanches épurées, badges pleins colorés, sidebar avec profil et budget du mois

## Structure

```
src/
  data/mockData.js            données simulées (à remplacer par des appels API)
  lib/auth.jsx                  authentification + rôles
  lib/dataStore.jsx           store partagé (véhicules, contrats, prestataires, interventions)
  lib/toast.jsx                  système de notifications
  lib/nav.js                     menu filtré par rôle
  lib/utils.js                    formatage dates/montants + date de référence TODAY
  components/ui/               Card, Badge, Modal, Field/Input/Select, Table
  components/layout/          Sidebar, Topbar, GeoBanner, DashboardLayout
  components/                    CommandPalette, ErrorBoundary, ProtectedRoute
  pages/                            une page par cas d'utilisation principal
  pages/admin/                    pages réservées à l'administrateur système
```

## Prochaines étapes (backend)

- Remplacer `src/data/mockData.js` et `src/lib/dataStore.jsx` par des appels
  à une API REST/GraphQL (les formulaires sont déjà prêts à être branchés)
- Authentification réelle (JWT / SSO) à la place du sélecteur de rôle
- Interfaçage AGIRH, imports RimTrack / Afriquia
- Envoi réel des e-mails de demande d'intervention (SMTP) + horodatage
- Génération des exports PDF / Excel du module Reporting (actuellement des
  notifications honnêtes indiquent que ces boutons ne sont pas encore branchés)
