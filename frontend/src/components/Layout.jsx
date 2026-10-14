import { useNavigate } from "react-router-dom";

function Layout({ children }) {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        navigate("/");
    };

    return (
        <div className="d-flex min-vh-100 bg-light">

            {/* SIDEBAR */}
            <aside
                className="bg-dark text-white p-3"
                style={{ width: "250px" }}
            >

                <h4 className="text-center mb-4">
                    Gestion Congés
                </h4>

                <hr />

                <ul className="nav nav-pills flex-column gap-2">

                    <li className="nav-item">
                        <button
                            className="nav-link active w-100 text-start"
                            onClick={() => navigate("/dashboard")}
                        >
                            🏠 Dashboard
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className="nav-link text-white w-100 text-start"
                            onClick={() => navigate("/employes")}
                        >
                            👥 Employés
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className="nav-link text-white w-100 text-start"
                            onClick={() => navigate("/demandes")}
                        >
                            📋 Demandes
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className="nav-link text-white w-100 text-start"
                            onClick={() => navigate("/jours-feries")}
                        >
                            📅 Jours fériés
                        </button>
                    </li>

                    <li className="nav-item">
                        <button
                            className="nav-link text-white w-100 text-start"
                            onClick={() => navigate("/types-conges")}
                        >
                            🏷️ Types de congés
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className="nav-link text-white w-100 text-start"
                            onClick={() => navigate("/soldes")}
                        >
                            📊 Soldes de congés
                        </button>
                    </li>

                </ul>

                <div className="mt-auto pt-5">

                    <hr />

                    <button
                        className="btn btn-danger w-100"
                        onClick={handleLogout}
                    >
                        🚪 Déconnexion
                    </button>

                </div>

            </aside>


            {/* CONTENU PRINCIPAL */}
            <div className="flex-grow-1">

                {/* NAVBAR */}
                <nav className="navbar navbar-light bg-white shadow-sm px-4">

                    <span className="navbar-brand mb-0 h5">
                        Tableau de bord
                    </span>

                    <span className="text-muted">
                        Administration
                    </span>

                </nav>


                {/* PAGE */}
                <main className="p-4">

                    {children}

                </main>

            </div>

        </div>
    );
}

export default Layout;