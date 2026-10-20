import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";


function TypesConges() {

    const navigate = useNavigate();

    const [typesConges, setTypesConges] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        nom: "",
        description: "",
        nombre_jours_max: 10,
        actif: true
    });

    const paginationTypes = usePagination(typesConges);


    // ==========================================
    // CHARGER LES TYPES DE CONGÉS
    // ==========================================

    const chargerTypesConges = async () => {

        try {

            const response = await api.get("/types-conges/");

            setTypesConges(response.data);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                navigate("/");

            } else {

                setError(
                    "Impossible de récupérer les types de congés."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        chargerTypesConges();

    }, []);


    // ==========================================
    // CHANGEMENT DU FORMULAIRE
    // ==========================================

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox"
                ? checked
                : value
        });

    };


    // ==========================================
    // RESET
    // ==========================================

    const resetForm = () => {

        setForm({
            nom: "",
            description: "",
            nombre_jours_max: 10,
            actif: true
        });

        setEditingId(null);

        setShowForm(false);

    };


    // ==========================================
    // AJOUT / MODIFICATION
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const donnees = {
                ...form,
                nombre_jours_max: Number(
                    form.nombre_jours_max
                )
            };


            if (editingId) {

                await api.put(
                    `/types-conges/${editingId}/`,
                    donnees
                );

                setMessage(
                    "Type de congé modifié avec succès."
                );

            } else {

                await api.post(
                    "/types-conges/",
                    donnees
                );

                setMessage(
                    "Type de congé ajouté avec succès."
                );

            }


            resetForm();

            await chargerTypesConges();

        } catch (error) {

            console.error(error);

            if (error.response?.data) {

                const erreurs = error.response.data;

                const messageErreur = Object.entries(erreurs)
                    .map(([champ, messages]) => {

                        if (Array.isArray(messages)) {

                            return `${champ} : ${messages.join(", ")}`;

                        }

                        return `${champ} : ${messages}`;

                    })
                    .join(" | ");


                setError(
                    messageErreur ||
                    "Erreur lors de l'opération."
                );

            } else {

                setError(
                    "Une erreur est survenue."
                );

            }

        }

    };


    // ==========================================
    // MODIFIER
    // ==========================================

    const handleEdit = (type) => {

        setForm({
            nom: type.nom,
            description: type.description || "",
            nombre_jours_max: type.nombre_jours_max,
            actif: type.actif
        });

        setEditingId(type.id);

        setShowForm(true);

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==========================================
    // SUPPRIMER
    // ==========================================

    const handleDelete = async (id) => {

        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer ce type de congé ?"
        );

        if (!confirmation) {
            return;
        }

        setMessage("");
        setError("");

        try {

            await api.delete(
                `/types-conges/${id}/`
            );

            setMessage(
                "Type de congé supprimé avec succès."
            );

            await chargerTypesConges();

        } catch (error) {

            console.error(error);

            setError(
                "Impossible de supprimer ce type de congé. " +
                "Il est peut-être utilisé par une demande de congé."
            );

        }

    };


    // ==========================================
    // ACTIVATION / DÉSACTIVATION
    // ==========================================

    const toggleActif = async (type) => {

        try {

            await api.patch(
                `/types-conges/${type.id}/`,
                {
                    actif: !type.actif
                }
            );

            setMessage(
                type.actif
                    ? "Type de congé désactivé."
                    : "Type de congé activé."
            );

            await chargerTypesConges();

        } catch (error) {

            console.error(error);

            setError(
                "Impossible de modifier l'état du type de congé."
            );

        }

    };


    // ==========================================
    // CHARGEMENT
    // ==========================================

    if (loading) {

        return (

            <div className="d-flex justify-content-center align-items-center vh-100">

                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                </div>

                <span className="ms-3">
                    Chargement des types de congés...
                </span>

            </div>

        );

    }


    return (

        <Layout>

            {/* ================================= */}
            {/* TITRE */}
            {/* ================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">
                        Types de congés
                    </h2>

                    <p className="text-muted mb-0">
                        Configurer les différents types de congés.
                    </p>

                </div>


                <button
                    className="btn btn-primary"
                    onClick={() => {

                        setMessage("");
                        setError("");

                        setForm({
                            nom: "",
                            description: "",
                            nombre_jours_max: 10,
                            actif: true
                        });

                        setEditingId(null);

                        setShowForm(true);

                    }}
                >
                    + Ajouter un type
                </button>

            </div>


            {/* ================================= */}
            {/* MESSAGES */}
            {/* ================================= */}

            {message && (

                <div className="alert alert-success alert-dismissible fade show">

                    {message}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage("")}
                    />

                </div>

            )}


            {error && (

                <div className="alert alert-danger alert-dismissible fade show">

                    {error}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError("")}
                    />

                </div>

            )}


            {/* ================================= */}
            {/* FORMULAIRE */}
            {/* ================================= */}

            {showForm && (

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white py-3">

                        <h5 className="fw-bold mb-0">

                            {editingId
                                ? "Modifier le type de congé"
                                : "Ajouter un type de congé"
                            }

                        </h5>

                    </div>


                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="row g-3">


                                {/* NOM */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Nom
                                    </label>

                                    <input
                                        type="text"
                                        name="nom"
                                        className="form-control"
                                        placeholder="Exemple : Congé annuel"
                                        value={form.nom}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* NOMBRE MAX */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Nombre maximum de jours
                                    </label>

                                    <input
                                        type="number"
                                        name="nombre_jours_max"
                                        className="form-control"
                                        min="1"
                                        max="365"
                                        value={form.nombre_jours_max}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* DESCRIPTION */}

                                <div className="col-12">

                                    <label className="form-label fw-semibold">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="3"
                                        placeholder="Description du type de congé..."
                                        value={form.description}
                                        onChange={handleChange}
                                    />

                                </div>


                                {/* ACTIF */}

                                <div className="col-12">

                                    <div className="form-check">

                                        <input
                                            type="checkbox"
                                            name="actif"
                                            className="form-check-input"
                                            id="actif"
                                            checked={form.actif}
                                            onChange={handleChange}
                                        />

                                        <label
                                            className="form-check-label"
                                            htmlFor="actif"
                                        >
                                            Type de congé actif
                                        </label>

                                    </div>

                                </div>


                            </div>


                            <div className="mt-4">

                                <button
                                    type="submit"
                                    className="btn btn-success me-2"
                                >

                                    {editingId
                                        ? "Enregistrer les modifications"
                                        : "Ajouter"
                                    }

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


            {/* ================================= */}
            {/* TABLEAU */}
            {/* ================================= */}

            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white py-3">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="fw-bold mb-0">
                            Liste des types de congés
                        </h5>

                        <span className="badge bg-primary">
                            {typesConges.length} type(s)
                        </span>

                    </div>

                </div>


                <div className="card-body p-0">

                    {typesConges.length === 0 ? (

                        <div className="text-center p-5">

                            <h5>
                                Aucun type de congé
                            </h5>

                            <p className="text-muted">
                                Ajoutez votre premier type de congé.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>ID</th>
                                        <th>Nom</th>
                                        <th>Description</th>
                                        <th>Maximum</th>
                                        <th>État</th>
                                        <th className="text-end">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {paginationTypes.pageItems.map(type => (

                                        <tr key={type.id}>

                                            <td>
                                                #{type.id}
                                            </td>


                                            <td>

                                                <strong>
                                                    {type.nom}
                                                </strong>

                                            </td>


                                            <td>

                                                <span className="text-muted">

                                                    {type.description
                                                        ? type.description
                                                        : "Aucune description"
                                                    }

                                                </span>

                                            </td>


                                            <td>

                                                <span className="badge bg-info text-dark">

                                                    {type.nombre_jours_max} jour(s)

                                                </span>

                                            </td>


                                            <td>

                                                {type.actif ? (

                                                    <span className="badge bg-success">
                                                        Actif
                                                    </span>

                                                ) : (

                                                    <span className="badge bg-secondary">
                                                        Inactif
                                                    </span>

                                                )}

                                            </td>


                                            <td className="text-end">

                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() =>
                                                        handleEdit(type)
                                                    }
                                                >
                                                    Modifier
                                                </button>


                                                <button
                                                    className={
                                                        type.actif
                                                            ? "btn btn-sm btn-outline-warning me-2"
                                                            : "btn btn-sm btn-outline-success me-2"
                                                    }
                                                    onClick={() =>
                                                        toggleActif(type)
                                                    }
                                                >
                                                    {type.actif
                                                        ? "Désactiver"
                                                        : "Activer"
                                                    }
                                                </button>


                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        handleDelete(type.id)
                                                    }
                                                >
                                                    Supprimer
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                <Pagination
                    currentPage={paginationTypes.currentPage}
                    onPageChange={paginationTypes.setPage}
                    pageSize={paginationTypes.pageSize}
                    totalItems={paginationTypes.totalItems}
                    totalPages={paginationTypes.totalPages}
                />

            </div>

        </Layout>

    );

}


export default TypesConges;
