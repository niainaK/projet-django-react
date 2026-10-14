import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/Layout";


function Dashboard() {

    const navigate = useNavigate();

    const [employes, setEmployes] = useState([]);
    const [demandes, setDemandes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");


    useEffect(() => {

        const chargerDonnees = async () => {

            try {

                const [
                    employesResponse,
                    demandesResponse
                ] = await Promise.all([
                    api.get("/employes/"),
                    api.get("/demandes/")
                ]);


                setEmployes(employesResponse.data);
                setDemandes(demandesResponse.data);

            } catch (error) {

                console.error(error);

                if (error.response?.status === 401) {

                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");

                    navigate("/");

                } else {

                    setMessage(
                        "Impossible de récupérer les données."
                    );
                }

            } finally {

                setLoading(false);

            }

        };


        chargerDonnees();

    }, [navigate]);


    const demandesEnAttente =
        demandes.filter(
            demande => demande.statut === "en_attente"
        ).length;


    const demandesApprouvees =
        demandes.filter(
            demande => demande.statut === "approuve"
        ).length;


    const demandesRefusees =
        demandes.filter(
            demande => demande.statut === "refuse"
        ).length;


    if (loading) {

        return (
            <div className="d-flex justify-content-center align-items-center vh-100">

                <div className="spinner-border text-primary">
                </div>

                <span className="ms-3">
                    Chargement...
                </span>

            </div>
        );

    }


    return (

        <Layout>

            {/* TITRE */}

            <div className="mb-4">

                <h2 className="fw-bold">
                    Tableau de bord
                </h2>

                <p className="text-muted">
                    Vue générale de la gestion des congés
                </p>

            </div>


            {/* MESSAGE */}

            {message && (

                <div className="alert alert-danger">
                    {message}
                </div>

            )}


            {/* STATISTIQUES */}

            <div className="row g-4 mb-4">


                {/* EMPLOYES */}

                <div className="col-md-6 col-xl-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <p className="text-muted mb-1">
                                        Employés
                                    </p>

                                    <h2 className="fw-bold">
                                        {employes.length}
                                    </h2>

                                </div>

                                <div className="fs-1">
                                    👥
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* DEMANDES */}

                <div className="col-md-6 col-xl-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <p className="text-muted mb-1">
                                        Demandes
                                    </p>

                                    <h2 className="fw-bold">
                                        {demandes.length}
                                    </h2>

                                </div>

                                <div className="fs-1">
                                    📋
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* EN ATTENTE */}

                <div className="col-md-6 col-xl-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <p className="text-muted mb-1">
                                        En attente
                                    </p>

                                    <h2 className="fw-bold">
                                        {demandesEnAttente}
                                    </h2>

                                </div>

                                <div className="fs-1">
                                    ⏳
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* APPROUVEES */}

                <div className="col-md-6 col-xl-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <p className="text-muted mb-1">
                                        Approuvées
                                    </p>

                                    <h2 className="fw-bold">
                                        {demandesApprouvees}
                                    </h2>

                                </div>

                                <div className="fs-1">
                                    ✅
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* DEUXIEME LIGNE */}

            <div className="row g-4">


                {/* EMPLOYES */}

                <div className="col-lg-8">

                    <div className="card border-0 shadow-sm">

                        <div className="card-header bg-white py-3">

                            <div className="d-flex justify-content-between align-items-center">

                                <h5 className="mb-0 fw-bold">
                                    Liste des employés
                                </h5>

                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => navigate("/employes")}
                                >
                                    Voir tous
                                </button>

                            </div>

                        </div>


                        <div className="card-body p-0">

                            {employes.length === 0 ? (

                                <div className="p-4 text-center text-muted">

                                    Aucun employé enregistré.

                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table table-hover mb-0">

                                        <thead className="table-light">

                                            <tr>

                                                <th>Matricule</th>
                                                <th>Nom</th>
                                                <th>Prénom</th>
                                                <th>Email</th>
                                                <th>Téléphone</th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {employes.slice(0, 5).map(
                                                employe => (

                                                    <tr key={employe.id}>

                                                        <td>
                                                            {employe.matricule}
                                                        </td>

                                                        <td>
                                                            {employe.nom}
                                                        </td>

                                                        <td>
                                                            {employe.prenom}
                                                        </td>

                                                        <td>
                                                            {employe.email}
                                                        </td>

                                                        <td>
                                                            {employe.telephone}
                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>

                </div>


                {/* RESUME DEMANDES */}

                <div className="col-lg-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-header bg-white py-3">

                            <h5 className="mb-0 fw-bold">
                                État des demandes
                            </h5>

                        </div>


                        <div className="card-body">


                            <div className="d-flex justify-content-between mb-3">

                                <span>
                                    ⏳ En attente
                                </span>

                                <span className="badge bg-warning">
                                    {demandesEnAttente}
                                </span>

                            </div>


                            <div className="d-flex justify-content-between mb-3">

                                <span>
                                    ✅ Approuvées
                                </span>

                                <span className="badge bg-success">
                                    {demandesApprouvees}
                                </span>

                            </div>


                            <div className="d-flex justify-content-between">

                                <span>
                                    ❌ Refusées
                                </span>

                                <span className="badge bg-danger">
                                    {demandesRefusees}
                                </span>

                            </div>


                        </div>

                    </div>

                </div>


            </div>

        </Layout>

    );
}


export default Dashboard;