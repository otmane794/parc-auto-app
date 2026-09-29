import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth.jsx";
import { DataProvider } from "./lib/dataStore.jsx";
import { ToastProvider } from "./lib/toast.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vehicules from "./pages/Vehicules";
import Contrats from "./pages/Contrats";
import Conducteurs from "./pages/Conducteurs";
import Interventions from "./pages/Interventions";
import Entretiens from "./pages/Entretiens";
import Consommation from "./pages/Consommation";
import Charges from "./pages/Charges";
import Alertes from "./pages/Alertes";
import Evaluation from "./pages/Evaluation";
import Prestataires from "./pages/Prestataires";
import Reporting from "./pages/Reporting";
import Utilisateurs from "./pages/admin/Utilisateurs";
import FilialesSites from "./pages/admin/FilialesSites";
import ConducteurPortal from "./pages/ConducteurPortal";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vehicules" element={<Vehicules />} />
                <Route path="/contrats" element={<Contrats />} />
                <Route path="/conducteurs" element={<Conducteurs />} />
                <Route path="/interventions" element={<Interventions />} />
                <Route path="/entretiens" element={<Entretiens />} />
                <Route path="/consommation" element={<Consommation />} />
                <Route path="/charges" element={<Charges />} />
                <Route path="/alertes" element={<Alertes />} />
                <Route path="/evaluation" element={<Evaluation />} />
                <Route path="/prestataires" element={<Prestataires />} />
                <Route path="/reporting" element={<Reporting />} />
                <Route path="/admin/utilisateurs" element={<Utilisateurs />} />
                <Route path="/admin/filiales" element={<FilialesSites />} />
                <Route path="/mon-vehicule" element={<ConducteurPortal />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
