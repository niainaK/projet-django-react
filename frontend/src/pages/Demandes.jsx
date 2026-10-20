import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";


function Demandes() {

    const navigate = useNavigate();


    // =========================
    // DONNÉES
    // =========================

    const [demandes, setDemandes] = useState([]);
    const [employes, setEmployes] = useState([]);
    const [typesConges, setTypesConges] = useState([]);


    // =========================
    // ÉTATS
    // =========================

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [processingId, setProcessingId] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =========================
    // RECHERCHE / FILTRE
    // =========================

    const [recherche, setRecherche] = useState("");

    const [filtreStatut, setFiltreStatut] = useState("tous");


    // =========================
    // FORMULAIRE
    // =========================

    const [form, setForm] = useState({

        employe: "",
        type_conge: "",
        date_debut: "",
        date_fin: "",
        motif: ""

    });


    // =========================
    // CHARGER LES DONNÉES
    // =========================

    const chargerDonnees = async () => {

        try {

            const [
                demandesResponse,
                employesResponse,
                typesResponse
            ] = await Promise.all([

                api.get("/demandes/"),

                api.get("/employes/"),

                api.get("/types-conges/")
            ]);


            setDemandes(demandesResponse.data);

            setEmployes(employesResponse.data);

            setTypesConges(typesResponse.data);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                localStorage.removeItem("access");

                localStorage.removeItem("refresh");

                navigate("/");

            } else {

                setError(
                    "Impossible de récupérer les données."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // CHARGEMENT INITIAL
    // =========================

    useEffect(() => {

        chargerDonnees();

    }, []);


    // =========================
    // CHANGEMENT FORMULAIRE
    // =========================

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };


    // =========================
    // RESET FORMULAIRE
    // =========================

    const resetForm = () => {

        setForm({

            employe: "",
            type_conge: "",
            date_debut: "",
            date_fin: "",
            motif: ""

        });

        setShowForm(false);

    };


    // =========================
    // CRÉER UNE DEMANDE
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");


        try {

            await api.post(
                "/demandes/",
                form
            );


            setMessage(
                "Demande de congé créée avec succès."
            );


            resetForm();


            await chargerDonnees();


        } catch (error) {

            console.error(error);


            if (error.response?.data) {

                const erreurs =
                    error.response.data;


                const messageErreur =
                    Object.entries(erreurs)
                        .map(([champ, messages]) => {

                            if (Array.isArray(messages)) {

                                return `${champ} : ${messages.join(", ")}`;

                            }

                            return `${champ} : ${messages}`;

                        })
                        .join(" | ");


                setError(
                    messageErreur ||
                    "Impossible de créer la demande."
                );

            } else {

                setError(
                    "Une erreur est survenue."
                );

            }

        }

    };


    // =========================
    // APPROUVER
    // =========================

    const approuver = async (id) => {

        const confirmation = window.confirm(
            "Voulez-vous vraiment approuver cette demande ?"
        );


        if (!confirmation) {

            return;

        }


        setProcessingId(id);

        setMessage("");

        setError("");


        try {

            const response =
                await api.post(
                    `/demandes/${id}/approuver/`
                );


            setMessage(
                response.data.message ||
                "Demande approuvée avec succès."
            );


            await chargerDonnees();


        } catch (error) {

            console.error(error);


            setError(
                error.response?.data?.erreur ||
                "Impossible d'approuver cette demande."
            );

        } finally {

            setProcessingId(null);

        }

    };


    // =========================
    // REFUSER
    // =========================

    const refuser = async (id) => {

        const confirmation = window.confirm(
            "Voulez-vous vraiment refuser cette demande ?"
        );


        if (!confirmation) {

            return;

        }


        setProcessingId(id);

        setMessage("");

        setError("");


        try {

            const response =
                await api.post(
                    `/demandes/${id}/refuser/`
                );


            setMessage(
                response.data.message ||
                "Demande refusée."
            );


            await chargerDonnees();


        } catch (error) {

            console.error(error);


            setError(
                error.response?.data?.erreur ||
                "Impossible de refuser cette demande."
            );

        } finally {

            setProcessingId(null);

        }

    };


    // =========================
    // FORMAT DATE
    // =========================

    const formaterDate = (date) => {

        if (!date) {

            return "";

        }


        const [
            annee,
            mois,
            jour
        ] = date.split("-");


        return `${jour}/${mois}/${annee}`;

    };


    // =========================
    // STATUT
    // =========================

    const afficherStatut = (statut) => {

        switch (statut) {

            case "en_attente":

                return (
                    <span className="badge bg-warning text-dark">
                        En attente
                    </span>
                );


            case "approuve":

                return (
                    <span className="badge bg-success">
                        Approuvée
                    </span>
                );


            case "refuse":

                return (
                    <span className="badge bg-danger">
                        Refusée
                    </span>
                );


            default:

                return (
                    <span className="badge bg-secondary">
                        {statut}
                    </span>
                );

        }

    };


    // =========================
    // FILTRAGE
    // =========================

    const demandesFiltrees = demandes.filter(
        (demande) => {

            const rechercheMinuscule =
                recherche.toLowerCase().trim();


            const correspondRecherche =

                demande.employe_nom
                    ?.toLowerCase()
                    .includes(rechercheMinuscule)

                ||

                demande.type_conge_nom
                    ?.toLowerCase()
                    .includes(rechercheMinuscule)

                ||

                demande.motif
                    ?.toLowerCase()
                    .includes(rechercheMinuscule);


            const correspondStatut =

                filtreStatut === "tous"

                ||

                demande.statut === filtreStatut;


            return (
                correspondRecherche &&
                correspondStatut
            );

        }
    );

    const paginationDemandes = usePagination(demandesFiltrees);


    // =========================
    // STATISTIQUES
    // =========================

    const totalDemandes =
        demandes.length;


    const demandesEnAttente =
        demandes.filter(
            demande =>
                demande.statut === "en_attente"
        ).length;


    const demandesApprouvees =
        demandes.filter(
            demande =>
                demande.statut === "approuve"
        ).length;


    const demandesRefusees =
        demandes.filter(
            demande =>
                demande.statut === "refuse"
        ).length;


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
                    Chargement des demandes...
                </span>

            </div>

        );

    }


    // =========================
    // AFFICHAGE
    // =========================

    return (

        <Layout>


            {/* =========================
                EN-TÊTE
            ========================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Gestion des demandes
                    </h2>

                    <p className="text-muted mb-0">
                        Gérer les demandes de congés des employés.
                    </p>

                </div>


                <button
                    className="btn btn-primary"
                    onClick={() => {

                        setMessage("");

                        setError("");

                        setShowForm(true);

                    }}
                >
                    + Nouvelle demande
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
                        onClick={() =>
                            setMessage("")
                        }
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
                        onClick={() =>
                            setError("")
                        }
                    />

                </div>

            )}


            {/* =========================
                STATISTIQUES
            ========================== */}

            <div className="row g-3 mb-4">


                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <small className="text-muted">
                                Total
                            </small>

                            <h3 className="fw-bold mb-0">
                                {totalDemandes}
                            </h3>

                        </div>

                    </div>

                </div>


                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <small className="text-muted">
                                En attente
                            </small>

                            <h3 className="fw-bold text-warning mb-0">
                                {demandesEnAttente}
                            </h3>

                        </div>

                    </div>

                </div>


                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <small className="text-muted">
                                Approuvées
                            </small>

                            <h3 className="fw-bold text-success mb-0">
                                {demandesApprouvees}
                            </h3>

                        </div>

                    </div>

                </div>


                <div className="col-md-3">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">

                            <small className="text-muted">
                                Refusées
                            </small>

                            <h3 className="fw-bold text-danger mb-0">
                                {demandesRefusees}
                            </h3>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                FORMULAIRE
            ========================== */}

            {showForm && (

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white py-3">

                        <h5 className="fw-bold mb-0">
                            Nouvelle demande de congé
                        </h5>

                    </div>


                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="row g-3">


                                {/* EMPLOYÉ */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Employé
                                    </label>

                                    <select
                                        name="employe"
                                        className="form-select"
                                        value={form.employe}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Sélectionner un employé
                                        </option>


                                        {employes.map(
                                            employe => (

                                                <option
                                                    key={employe.id}
                                                    value={employe.id}
                                                >

                                                    {employe.nom}{" "}
                                                    {employe.prenom}

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* TYPE */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Type de congé
                                    </label>

                                    <select
                                        name="type_conge"
                                        className="form-select"
                                        value={form.type_conge}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Sélectionner un type
                                        </option>


                                        {typesConges
                                            .filter(
                                                type =>
                                                    type.actif
                                            )
                                            .map(
                                                type => (

                                                    <option
                                                        key={type.id}
                                                        value={type.id}
                                                    >

                                                        {type.nom}

                                                    </option>

                                                )
                                            )}

                                    </select>

                                </div>


                                {/* DATE DÉBUT */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Date de début
                                    </label>

                                    <input
                                        type="date"
                                        name="date_debut"
                                        className="form-control"
                                        value={form.date_debut}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* DATE FIN */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Date de fin
                                    </label>

                                    <input
                                        type="date"
                                        name="date_fin"
                                        className="form-control"
                                        value={form.date_fin}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* MOTIF */}

                                <div className="col-12">

                                    <label className="form-label fw-semibold">
                                        Motif
                                    </label>

                                    <textarea
                                        name="motif"
                                        className="form-control"
                                        rows="3"
                                        placeholder="Motif de la demande..."
                                        value={form.motif}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>


                            <div className="mt-4">

                                <button
                                    type="submit"
                                    className="btn btn-success me-2"
                                >
                                    Créer la demande
                                </button>


                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetForm}
                                >
                                    Annuler
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =========================
                RECHERCHE + FILTRE
            ========================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="row g-3">


                        <div className="col-md-8">

                            <label className="form-label fw-semibold">
                                Rechercher
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher par employé, type ou motif..."
                                value={recherche}
                                onChange={(e) => {
                                    paginationDemandes.setPage(1);
                                    setRecherche(
                                        e.target.value
                                    );
                                }}
                            />

                        </div>


                        <div className="col-md-4">

                            <label className="form-label fw-semibold">
                                Statut
                            </label>

                            <select
                                className="form-select"
                                value={filtreStatut}
                                onChange={(e) => {
                                    paginationDemandes.setPage(1);
                                    setFiltreStatut(
                                        e.target.value
                                    );
                                }}
                            >

                                <option value="tous">
                                    Tous les statuts
                                </option>

                                <option value="en_attente">
                                    En attente
                                </option>

                                <option value="approuve">
                                    Approuvées
                                </option>

                                <option value="refuse">
                                    Refusées
                                </option>

                            </select>

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
                            Liste des demandes
                        </h5>

                        <span className="badge bg-primary">
                            {demandesFiltrees.length} demande(s)
                        </span>

                    </div>

                </div>


                <div className="card-body p-0">


                    {demandesFiltrees.length === 0 ? (

                        <div className="text-center p-5">

                            <h5>
                                Aucune demande trouvée
                            </h5>

                            <p className="text-muted">
                                Aucune demande ne correspond aux critères.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">


                                <thead className="table-light">

                                    <tr>

                                        <th>ID</th>

                                        <th>Employé</th>

                                        <th>Type</th>

                                        <th>Période</th>

                                        <th>Jours</th>

                                        <th>Motif</th>

                                        <th>Statut</th>

                                        <th className="text-end">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {paginationDemandes.pageItems.map(
                                        demande => (

                                            <tr key={demande.id}>


                                                <td>

                                                    <span className="badge bg-secondary">
                                                        #{demande.id}
                                                    </span>

                                                </td>


                                                <td>

                                                    <strong>
                                                        {demande.employe_nom}
                                                    </strong>

                                                </td>


                                                <td>

                                                    {demande.type_conge_nom}

                                                </td>


                                                <td>

                                                    <div>
                                                        <strong>
                                                            {formaterDate(
                                                                demande.date_debut
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <small className="text-muted">
                                                        au{" "}
                                                        {formaterDate(
                                                            demande.date_fin
                                                        )}
                                                    </small>

                                                </td>


                                                <td>

                                                    <span className="badge bg-info text-dark">
                                                        {demande.nombre_jours} jour(s)
                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className="text-muted"
                                                        title={
                                                            demande.motif
                                                        }
                                                    >

                                                        {demande.motif
                                                            ? demande.motif.length > 30
                                                                ? `${demande.motif.substring(0, 30)}...`
                                                                : demande.motif
                                                            : "—"
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    {afficherStatut(
                                                        demande.statut
                                                    )}

                                                </td>


                                                <td className="text-end">


                                                    {demande.statut ===
                                                        "en_attente" && (

                                                        <div className="d-flex justify-content-end gap-2">


                                                            <button
                                                                className="btn btn-sm btn-outline-success"
                                                                onClick={() =>
                                                                    approuver(
                                                                        demande.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    processingId ===
                                                                    demande.id
                                                                }
                                                            >

                                                                {processingId ===
                                                                demande.id
                                                                    ? "..."
                                                                    : "Approuver"}

                                                            </button>


                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() =>
                                                                    refuser(
                                                                        demande.id
                                                                    )
                                                                }
                                                                disabled={
                                                                    processingId ===
                                                                    demande.id
                                                                }
                                                            >

                                                                {processingId ===
                                                                demande.id
                                                                    ? "..."
                                                                    : "Refuser"}

                                                            </button>

                                                        </div>

                                                    )}


                                                    {demande.statut !==
                                                        "en_attente" && (

                                                        <span className="text-muted">
                                                            Traitée
                                                        </span>

                                                    )}

                                                </td>


                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                <Pagination
                    currentPage={paginationDemandes.currentPage}
                    onPageChange={paginationDemandes.setPage}
                    pageSize={paginationDemandes.pageSize}
                    totalItems={paginationDemandes.totalItems}
                    totalPages={paginationDemandes.totalPages}
                />

            </div>


        </Layout>

    );

}


export default Demandes;
