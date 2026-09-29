import { createContext, useContext, useState } from "react";

export const ROLES = {
  Administrateur: "Administrateur Système",
  ResponsableParc: "Responsable Gestion Parc Automobile",
  DCH: "Direction Capital Humain",
  DirectionGenerale: "Direction Générale Filiale",
  ResponsableSite: "Responsable / Manager de Site",
  Conducteur: "Conducteur",
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { nom, role }

  const login = (nom, role) => setUser({ nom, role });
  const logout = () => setUser(null);


  const isAdmin = user?.role === "Administrateur";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
