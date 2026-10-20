import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";


function Soldes() {

    const navigate = useNavigate();

    const [soldes, setSoldes] = useState([]);
    const [employes, setEmployes] = useState([]);

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const paginationSoldes = usePagination(soldes);


    // =========================
    // CHARGER LES DONNÉES
    // =========================

    const chargerDonnees = async () => {

        try {

            const [soldesResponse, employesResponse] =
                await Promise.all([
                    api.get("/soldes/"),
                    api.get("/employes/")
                ]);

            setSoldes(soldesResponse.data);
            setEmployes(employesResponse.data);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                navigate("/");

            } else {

                setError(
                    "Impossible de récupérer les soldes de congés."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        chargerDonnees();

    }, []);


    // =========================
    // TROUVER UN EMPLOYÉ
    // =========================

    const trouverEmploye = (employeId) => {

        const employe = employes.find(
            emp => emp.id === employeId
        );

        if (!employe) {
            return `Employé #${employeId}`;
        }

        return `${employe.nom} ${employe.prenom}`;

    };


    // =========================
    // CALCUL DU POURCENTAGE
    // =========================

    const calculerPourcentage = (solde) => {

        if (!solde.jours_acquis) {
            return 0;
        }

        return Math.round(
            (solde.jours_pris / solde.jours_acquis) * 100
        );

    };


    // =========================
    // ACTUALISER
    // =========================

    const actualiser = async () => {

        setMessage("");
        setError("");

        setLoading(true);

        await chargerDonnees();

        setMessage(
            "Les soldes ont été actualisés."
        );

    };


    // =========================
    // CHARGEMENT
    // =========================

    if (loading) {

        return (

            <div className="d-flex justify-content-center align-items-center vh-100">

                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                </div>

                <span className="ms-3">
                    Chargement des soldes...
                </span>

            </div>

        );

    }


    return (

        <Layout>

            {/* =========================
                EN-TÊTE
            ========================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">
                        Soldes de congés
                    </h2>

                    <p className="text-muted mb-0">
                        Consulter les jours de congés disponibles
                        pour chaque employé.
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={actualiser}
                >
                    Actualiser
                </button>

            </div>


            {/* =========================
                MESSAGES
            ========================== */}

            {message && (

                <div
                    className="alert alert-success alert-dismissible fade show"
                    role="alert"
                >

                    {message}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage("")}
                    />

                </div>

            )}


            {error && (

                <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                >

                    {error}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError("")}
                    />

                </div>

            )}


            {/* =========================
                STATISTIQUES
            ========================== */}

            <div className="row g-4 mb-4">

                <div className="col-md-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <h6 className="text-muted">
                                        Nombre de soldes
                                    </h6>

                                    <h3 className="fw-bold">
                                        {soldes.length}
                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <h6 className="text-muted">
                                        Jours acquis
                                    </h6>

                                    <h3 className="fw-bold text-primary">

                                        {soldes.reduce(
                                            (total, solde) =>
                                                total +
                                                Number(solde.jours_acquis || 0),
                                            0
                                        )}

                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                <div className="col-md-4">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <div className="d-flex justify-content-between">

                                <div>

                                    <h6 className="text-muted">
                                        Jours restants
                                    </h6>

                                    <h3 className="fw-bold text-success">

                                        {soldes.reduce(
                                            (total, solde) =>
                                                total +
                                                Number(solde.jours_restants || 0),
                                            0
                                        )}

                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                TABLEAU
            ========================== */}

            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white py-3">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="fw-bold mb-0">
                            Liste des soldes
                        </h5>

                        <span className="badge bg-primary">
                            {soldes.length} solde(s)
                        </span>

                    </div>

                </div>


                <div className="card-body p-0">

                    {soldes.length === 0 ? (

                        <div className="text-center p-5">

                            <h5>
                                Aucun solde de congé
                            </h5>

                            <p className="text-muted">
                                Aucun solde n'est actuellement enregistré.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>ID</th>

                                        <th>Employé</th>

                                        <th>Année</th>

                                        <th>Jours acquis</th>

                                        <th>Jours pris</th>

                                        <th>Jours restants</th>

                                        <th>Utilisation</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {paginationSoldes.pageItems.map(solde => {

                                        const pourcentage =
                                            calculerPourcentage(solde);

                                        return (

                                            <tr key={solde.id}>

                                                <td>

                                                    <span className="badge bg-secondary">
                                                        #{solde.id}
                                                    </span>

                                                </td>


                                                <td>

                                                    <strong>
                                                        {trouverEmploye(
                                                            solde.employe
                                                        )}
                                                    </strong>

                                                </td>


                                                <td>

                                                    <span className="badge bg-dark">
                                                        {solde.annee}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="badge bg-primary">
                                                        {solde.jours_acquis} jour(s)
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="badge bg-warning text-dark">
                                                        {solde.jours_pris} jour(s)
                                                    </span>

                                                </td>


                                                <td>

                                                    {solde.jours_restants > 0 ? (

                                                        <span className="badge bg-success">
                                                            {solde.jours_restants} jour(s)
                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-danger">
                                                            0 jour
                                                        </span>

                                                    )}

                                                </td>


                                                <td style={{ minWidth: "180px" }}>

                                                    <div className="progress">

                                                        <div
                                                            className={
                                                                pourcentage >= 80
                                                                    ? "progress-bar bg-danger"
                                                                    : pourcentage >= 50
                                                                        ? "progress-bar bg-warning"
                                                                        : "progress-bar bg-success"
                                                            }
                                                            role="progressbar"
                                                            style={{
                                                                width: `${Math.min(
                                                                    pourcentage,
                                                                    100
                                                                )}%`
                                                            }}
                                                        >

                                                            {pourcentage}%

                                                        </div>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                <Pagination
                    currentPage={paginationSoldes.currentPage}
                    onPageChange={paginationSoldes.setPage}
                    pageSize={paginationSoldes.pageSize}
                    totalItems={paginationSoldes.totalItems}
                    totalPages={paginationSoldes.totalPages}
                />

            </div>

        </Layout>

    );

}


export default Soldes;
