import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Layout from "../components/Layout";


function Employes() {

    const navigate = useNavigate();


    // =========================
    // DONNÉES
    // =========================

    const [employes, setEmployes] = useState([]);
    const [roles, setRoles] = useState([]);
    const [services, setServices] = useState([]);


    // =========================
    // ÉTATS
    // =========================

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =========================
    // RECHERCHE
    // =========================

    const [recherche, setRecherche] = useState("");

    const [filtreService, setFiltreService] = useState("tous");

    const [filtreRole, setFiltreRole] = useState("tous");


    // =========================
    // FORMULAIRE
    // =========================

    const [form, setForm] = useState({

        matricule: "",
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        service: "",
        role: "",
        date_embauche: ""

    });


    // =========================
    // CHARGER LES DONNÉES
    // =========================

    const chargerDonnees = async () => {

        try {

            const [
                employesResponse,
                rolesResponse,
                servicesResponse
            ] = await Promise.all([

                api.get("/employes/"),

                api.get("/roles/"),

                api.get("/services/")

            ]);


            setEmployes(
                employesResponse.data
            );

            setRoles(
                rolesResponse.data
            );

            setServices(
                servicesResponse.data
            );

        } catch (error) {

            console.error(error);


            if (error.response?.status === 401) {

                localStorage.removeItem("access");

                localStorage.removeItem("refresh");

                navigate("/");

            } else {

                setError(
                    "Impossible de récupérer les employés."
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
    // FORMULAIRE
    // =========================

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };


    // =========================
    // RESET
    // =========================

    const resetForm = () => {

        setForm({

            matricule: "",
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            service: "",
            role: "",
            date_embauche: ""

        });

        setEditingId(null);

        setShowForm(false);

    };


    // =========================
    // AJOUT / MODIFICATION
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");


        try {

            const donnees = {

                ...form,

                service: Number(form.service),

                role: Number(form.role)

            };


            if (editingId) {

                await api.put(
                    `/employes/${editingId}/`,
                    donnees
                );


                setMessage(
                    "Employé modifié avec succès."
                );

            } else {

                await api.post(
                    "/employes/",
                    donnees
                );


                setMessage(
                    "Employé ajouté avec succès."
                );

            }


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
                    "Erreur lors de l'opération."
                );

            } else {

                setError(
                    "Une erreur est survenue."
                );

            }

        }

    };


    // =========================
    // MODIFIER
    // =========================

    const handleEdit = (employe) => {

        setForm({

            matricule: employe.matricule,

            nom: employe.nom,

            prenom: employe.prenom,

            email: employe.email,

            telephone: employe.telephone || "",

            service: employe.service,

            role: employe.role,

            date_embauche: employe.date_embauche

        });


        setEditingId(employe.id);

        setShowForm(true);

        setMessage("");

        setError("");


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };


    // =========================
    // SUPPRIMER
    // =========================

    const handleDelete = async (id) => {

        const confirmation =
            window.confirm(
                "Voulez-vous vraiment supprimer cet employé ?"
            );


        if (!confirmation) {

            return;

        }


        setMessage("");

        setError("");


        try {

            await api.delete(
                `/employes/${id}/`
            );


            setMessage(
                "Employé supprimé avec succès."
            );


            await chargerDonnees();


        } catch (error) {

            console.error(error);


            setError(
                "Impossible de supprimer cet employé."
            );

        }

    };


    // =========================
    // FILTRAGE
    // =========================

    const employesFiltres = employes.filter(
        (employe) => {

            const texte =
                recherche
                    .toLowerCase()
                    .trim();


            const correspondRecherche =

                employe.matricule
                    ?.toLowerCase()
                    .includes(texte)

                ||

                employe.nom
                    ?.toLowerCase()
                    .includes(texte)

                ||

                employe.prenom
                    ?.toLowerCase()
                    .includes(texte)

                ||

                employe.email
                    ?.toLowerCase()
                    .includes(texte);


            const correspondService =

                filtreService === "tous"

                ||

                String(employe.service) ===
                String(filtreService);


            const correspondRole =

                filtreRole === "tous"

                ||

                String(employe.role) ===
                String(filtreRole);


            return (

                correspondRecherche &&

                correspondService &&

                correspondRole

            );

        }
    );


    // =========================
    // CHARGEMENT
    // =========================

    if (loading) {

        return (

            <div className="d-flex justify-content-center align-items-center vh-100">

                <div
                    className="spinner-border text-primary"
                    role="status"
                />

                <span className="ms-3">
                    Chargement des employés...
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
                        Gestion des employés
                    </h2>

                    <p className="text-muted mb-0">
                        Gérer les employés, leurs services et leurs rôles.
                    </p>

                </div>


                <button
                    className="btn btn-primary"
                    onClick={() => {

                        setMessage("");

                        setError("");

                        setEditingId(null);

                        setShowForm(true);

                    }}
                >
                    + Nouvel employé
                </button>

            </div>


            {/* =========================
                MESSAGES
            ========================== */}

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


            {/* =========================
                FORMULAIRE
            ========================== */}

            {showForm && (

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-header bg-white py-3">

                        <h5 className="fw-bold mb-0">

                            {editingId
                                ? "Modifier l'employé"
                                : "Ajouter un employé"
                            }

                        </h5>

                    </div>


                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="row g-3">


                                {/* MATRICULE */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Matricule
                                    </label>

                                    <input
                                        type="text"
                                        name="matricule"
                                        className="form-control"
                                        value={form.matricule}
                                        onChange={handleChange}
                                        placeholder="EMP001"
                                        required
                                    />

                                </div>


                                {/* NOM */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Nom
                                    </label>

                                    <input
                                        type="text"
                                        name="nom"
                                        className="form-control"
                                        value={form.nom}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* PRÉNOM */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Prénom
                                    </label>

                                    <input
                                        type="text"
                                        name="prenom"
                                        className="form-control"
                                        value={form.prenom}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* EMAIL */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                {/* TÉLÉPHONE */}

                                <div className="col-md-6">

                                    <label className="form-label fw-semibold">
                                        Téléphone
                                    </label>

                                    <input
                                        type="text"
                                        name="telephone"
                                        className="form-control"
                                        value={form.telephone}
                                        onChange={handleChange}
                                    />

                                </div>


                                {/* SERVICE */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Service
                                    </label>

                                    <select
                                        name="service"
                                        className="form-select"
                                        value={form.service}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Sélectionner un service
                                        </option>


                                        {services.map(
                                            service => (

                                                <option
                                                    key={service.id}
                                                    value={service.id}
                                                >
                                                    {service.nom}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* RÔLE */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Rôle
                                    </label>

                                    <select
                                        name="role"
                                        className="form-select"
                                        value={form.role}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Sélectionner un rôle
                                        </option>


                                        {roles.map(
                                            role => (

                                                <option
                                                    key={role.id}
                                                    value={role.id}
                                                >
                                                    {role.nom}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* DATE */}

                                <div className="col-md-4">

                                    <label className="form-label fw-semibold">
                                        Date d'embauche
                                    </label>

                                    <input
                                        type="date"
                                        name="date_embauche"
                                        className="form-control"
                                        value={form.date_embauche}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            <div className="mt-4">

                                <button
                                    type="submit"
                                    className="btn btn-success me-2"
                                >

                                    {editingId
                                        ? "Enregistrer"
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


            {/* =========================
                RECHERCHE
            ========================== */}

            <div className="card border-0 shadow-sm mb-4">

                <div className="card-body">

                    <div className="row g-3">


                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Rechercher
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Matricule, nom, prénom ou email..."
                                value={recherche}
                                onChange={(e) =>
                                    setRecherche(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="col-md-3">

                            <label className="form-label fw-semibold">
                                Service
                            </label>

                            <select
                                className="form-select"
                                value={filtreService}
                                onChange={(e) =>
                                    setFiltreService(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="tous">
                                    Tous les services
                                </option>


                                {services.map(
                                    service => (

                                        <option
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.nom}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="col-md-3">

                            <label className="form-label fw-semibold">
                                Rôle
                            </label>

                            <select
                                className="form-select"
                                value={filtreRole}
                                onChange={(e) =>
                                    setFiltreRole(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="tous">
                                    Tous les rôles
                                </option>


                                {roles.map(
                                    role => (

                                        <option
                                            key={role.id}
                                            value={role.id}
                                        >
                                            {role.nom}
                                        </option>

                                    )
                                )}

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
                            Liste des employés
                        </h5>

                        <span className="badge bg-primary">
                            {employesFiltres.length} employé(s)
                        </span>

                    </div>

                </div>


                <div className="card-body p-0">

                    {employesFiltres.length === 0 ? (

                        <div className="text-center p-5">

                            <div className="fs-1 mb-3">
                                👥
                            </div>

                            <h5>
                                Aucun employé trouvé
                            </h5>

                            <p className="text-muted">
                                Aucun employé ne correspond aux critères.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>Matricule</th>

                                        <th>Employé</th>

                                        <th>Email</th>

                                        <th>Téléphone</th>

                                        <th>Service</th>

                                        <th>Rôle</th>

                                        <th>Embauche</th>

                                        <th className="text-end">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {employesFiltres.map(
                                        employe => (

                                            <tr key={employe.id}>


                                                <td>

                                                    <span className="badge bg-secondary">
                                                        {employe.matricule}
                                                    </span>

                                                </td>


                                                <td>

                                                    <strong>
                                                        {employe.nom}{" "}
                                                        {employe.prenom}
                                                    </strong>

                                                </td>


                                                <td>

                                                    {employe.email}

                                                </td>


                                                <td>

                                                    {employe.telephone ||
                                                        "—"}

                                                </td>


                                                <td>

                                                    <span className="badge bg-info text-dark">
                                                        {employe.service_nom}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="badge bg-primary">
                                                        {employe.role_nom}
                                                    </span>

                                                </td>


                                                <td>

                                                    {employe.date_embauche}

                                                </td>


                                                <td className="text-end">

                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() =>
                                                            handleEdit(
                                                                employe
                                                            )
                                                        }
                                                    >
                                                        ✏️
                                                    </button>


                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                employe.id
                                                            )
                                                        }
                                                    >
                                                        🗑️
                                                    </button>

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


        </Layout>

    );

}


export default Employes;
