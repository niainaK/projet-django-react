
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/Layout";


function JoursFeries() {

    const navigate = useNavigate();

    const [joursFeries, setJoursFeries] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        nom: "",
        date: ""
    });


    // ==========================================
    // CHARGER LES JOURS FÉRIÉS
    // ==========================================

    const chargerJoursFeries = async () => {

        try {

            const response = await api.get("/jours-feries/");

            setJoursFeries(response.data);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                navigate("/");

            } else {

                setError(
                    "Impossible de récupérer les jours fériés."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // CHARGEMENT INITIAL
    // ==========================================

    useEffect(() => {

        chargerJoursFeries();

    }, []);


    // ==========================================
    // CHANGEMENT DU FORMULAIRE
    // ==========================================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // ==========================================
    // RÉINITIALISER LE FORMULAIRE
    // ==========================================

    const resetForm = () => {

        setForm({
            nom: "",
            date: ""
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

            if (editingId) {

                await api.put(
                    `/jours-feries/${editingId}/`,
                    form
                );

                setMessage(
                    "Jour férié modifié avec succès."
                );

            } else {

                await api.post(
                    "/jours-feries/",
                    form
                );

                setMessage(
                    "Jour férié ajouté avec succès."
                );

            }


            resetForm();

            await chargerJoursFeries();

        } catch (error) {

            console.error(error);

            if (error.response?.data) {

                /*
                 * Django peut retourner par exemple :
                 * {
                 *     "date": [
                 *         "Jour férié with this Date already exists."
                 *     ]
                 * }
                 */

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
                    messageErreur || "Erreur lors de l'opération."
                );

            } else {

                setError(
                    "Une erreur est survenue."
                );

            }

        }

    };


    // ==========================================
    // PRÉPARER LA MODIFICATION
    // ==========================================

    const handleEdit = (jour) => {

        setForm({
            nom: jour.nom,
            date: jour.date
        });

        setEditingId(jour.id);

        setShowForm(true);

        setMessage("");
        setError("");


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==========================================
    // SUPPRESSION
    // ==========================================

    const handleDelete = async (id) => {

        const confirmation = window.confirm(
            "Voulez-vous vraiment supprimer ce jour férié ?"
        );


        if (!confirmation) {

            return;

        }


        setMessage("");
        setError("");


        try {

            await api.delete(
                `/jours-feries/${id}/`
            );


            setMessage(
                "Jour férié supprimé avec succès."
            );


            await chargerJoursFeries();

        } catch (error) {

            console.error(error);

            setError(
                "Impossible de supprimer ce jour férié."
            );

        }

    };


    // ==========================================
    // FORMATTER LA DATE
    // ==========================================

    const formaterDate = (date) => {

        if (!date) {

            return "";

        }


        const [annee, mois, jour] = date.split("-");

        return `${jour}/${mois}/${annee}`;

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
                    Chargement des jours fériés...
                </span>

            </div>

        );

    }


    // ==========================================
    // INTERFACE
    // ==========================================

    return (

        <Layout>

            {/* ================================= */}
            {/* TITRE */}
            {/* ================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">
                        Gestion des jours fériés
                    </h2>

                    <p className="text-muted mb-0">
                        Gérer les jours fériés utilisés
                        dans le calcul des congés.
                    </p>

                </div>


                <button
                    className="btn btn-primary"
                    onClick={() => {

                        setMessage("");
                        setError("");

                        setForm({
                            nom: "",
                            date: ""
                        });

                        setEditingId(null);

                        setShowForm(true);

                    }}
                >
                    + Ajouter un jour férié
                </button>

            </div>


            {/* ================================= */}
            {/* MESSAGES */}
            {/* ================================= */}

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
                    >
                    </button>

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
                    >
                    </button>

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
                                ? "Modifier le jour férié"
                                : "Ajouter un jour férié"
                            }

                        </h5>

                    </div>


                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="row g-3">


                                {/* NOM */}

                                <div className="col-md-7">

                                    <label className="form-label fw-semibold">
                                        Nom du jour férié
                                    </label>

                                    <input
                                        type="text"
                                        name="nom"
                                        className="form-control"
                                        placeholder="Exemple : Fête de l'Indépendance"
                                        value={form.nom}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* DATE */}

                                <div className="col-md-5">

                                    <label className="form-label fw-semibold">
                                        Date
                                    </label>

                                    <input
                                        type="date"
                                        name="date"
                                        className="form-control"
                                        value={form.date}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                            </div>


                            {/* BOUTONS */}

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
                            Liste des jours fériés
                        </h5>


                        <span className="badge bg-primary">
                            {joursFeries.length} jour(s)
                        </span>

                    </div>

                </div>


                <div className="card-body p-0">

                    {joursFeries.length === 0 ? (

                        <div className="text-center p-5">

                            <div className="fs-1 mb-3">
                                📅
                            </div>

                            <h5>
                                Aucun jour férié
                            </h5>

                            <p className="text-muted">
                                Aucun jour férié n'est actuellement enregistré.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th style={{ width: "80px" }}>
                                            ID
                                        </th>

                                        <th>
                                            Nom
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th
                                            className="text-end"
                                            style={{ width: "250px" }}
                                        >
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {joursFeries.map(jour => (

                                        <tr key={jour.id}>

                                            <td>

                                                <span className="badge bg-secondary">
                                                    #{jour.id}
                                                </span>

                                            </td>


                                            <td>

                                                <strong>
                                                    {jour.nom}
                                                </strong>

                                            </td>


                                            <td>

                                                <span className="badge bg-info text-dark">

                                                    📅{" "}

                                                    {formaterDate(
                                                        jour.date
                                                    )}

                                                </span>

                                            </td>


                                            <td className="text-end">

                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() =>
                                                        handleEdit(jour)
                                                    }
                                                >
                                                    ✏️ Modifier
                                                </button>


                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() =>
                                                        handleDelete(
                                                            jour.id
                                                        )
                                                    }
                                                >
                                                    🗑️ Supprimer
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </Layout>

    );

}


export default JoursFeries;

