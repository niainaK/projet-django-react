import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employes from "./pages/Employes";
import Demandes from "./pages/Demandes";
import ProtectedRoute from "./components/ProtectedRoute";
import JoursFeries from "./pages/JoursFeries";
import TypesConges from "./pages/typesConges";
import Soldes from "./pages/Soldes";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employes"
                    element={
                        <ProtectedRoute>
                            <Employes />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/demandes"
                    element={
                        <ProtectedRoute>
                            <Demandes />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/jours-feries"
                    element={
                        <ProtectedRoute>
                            <JoursFeries />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/types-conges"
                    element={
                        <ProtectedRoute>
                            <TypesConges />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/soldes"
                    element={
                        <ProtectedRoute>
                            <Soldes />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;