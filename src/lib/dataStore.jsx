import { createContext, useContext, useState, useCallback } from "react";
import {
  VEHICULES as INITIAL_VEHICULES,
  CONTRATS as INITIAL_CONTRATS,
  PRESTATAIRES as INITIAL_PRESTATAIRES,
  INTERVENTIONS as INITIAL_INTERVENTIONS,
  CONDUCTEURS as INITIAL_CONDUCTEURS,
} from "../data/mockData";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [vehicules, setVehicules] = useState(INITIAL_VEHICULES);
  const [contrats, setContrats] = useState(INITIAL_CONTRATS);
  const [prestataires, setPrestataires] = useState(INITIAL_PRESTATAIRES);
  const [interventions, setInterventions] = useState(INITIAL_INTERVENTIONS);
  const [conducteurs, setConducteurs] = useState(INITIAL_CONDUCTEURS);

  const patch = (id, changes) => (list) => list.map((x) => (x.id === id ? { ...x, ...changes } : x));
  const without = (id) => (list) => list.filter((x) => x.id !== id);

  // Ajout
  const addVehicule = useCallback((v) => setVehicules((p) => [v, ...p]), []);
  const addContrat = useCallback((c) => setContrats((p) => [c, ...p]), []);
  const addPrestataire = useCallback((p) => setPrestataires((prev) => [p, ...prev]), []);
  const addIntervention = useCallback((i) => setInterventions((p) => [i, ...p]), []);

  // Modification
  const updateVehicule = useCallback((id, c) => setVehicules(patch(id, c)), []);
  const updateContrat = useCallback((id, c) => setContrats(patch(id, c)), []);
  const updatePrestataire = useCallback((id, c) => setPrestataires(patch(id, c)), []);
  const updateIntervention = useCallback((id, c) => setInterventions(patch(id, c)), []);
  const updateConducteur = useCallback((id, c) => setConducteurs(patch(id, c)), []);

  // Suppression (avec nettoyage des données liées)
  const deleteVehicule = useCallback((id) => {
    setVehicules(without(id));
    setContrats((p) => p.filter((c) => c.vehiculeId !== id));
    setInterventions((p) => p.filter((i) => i.vehiculeId !== id));
  }, []);
  const deleteContrat = useCallback((id) => setContrats(without(id)), []);
  const deletePrestataire = useCallback((id) => {
    setPrestataires(without(id));
    setInterventions((p) => p.map((i) => (i.prestataireId === id ? { ...i, prestataireId: null } : i)));
  }, []);
  const deleteIntervention = useCallback((id) => setInterventions(without(id)), []);
  const deleteConducteur = useCallback((id) => {
    setConducteurs(without(id));
    setVehicules((p) => p.map((v) => (v.conducteurId === id ? { ...v, conducteurId: null } : v)));
  }, []);

 
  const importConducteurs = useCallback((agents) => {
    let added = 0;
    setConducteurs((prev) => {
      const known = new Set(prev.map((c) => c.matricule));
      const fresh = agents
        .filter((a) => !known.has(a.matricule))
        .map((a) => ({ id: `CD-${a.matricule}`, matricule: a.matricule, nom: a.nom, prenom: a.prenom, telephone: a.telephone }));
      added = fresh.length;
      return [...prev, ...fresh];
    });
    return added;
  }, []);

  const getVehiculeById = useCallback((id) => vehicules.find((v) => v.id === id), [vehicules]);
  const getPrestataireById = useCallback((id) => prestataires.find((p) => p.id === id), [prestataires]);
  const getConducteurById = useCallback((id) => conducteurs.find((c) => c.id === id), [conducteurs]);

  return (
    <DataContext.Provider
      value={{
        vehicules, addVehicule, updateVehicule, deleteVehicule, getVehiculeById,
        contrats, addContrat, updateContrat, deleteContrat,
        prestataires, addPrestataire, updatePrestataire, deletePrestataire, getPrestataireById,
        interventions, addIntervention, updateIntervention, deleteIntervention,
        conducteurs, updateConducteur, deleteConducteur, importConducteurs, getConducteurById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
