import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
    { label: "Tableau de bord", path: "/dashboard", icon: "" },
    { label: "Employés", path: "/employes", icon: "" },
    { label: "Demandes", path: "/demandes", icon: "" },
    { label: "Jours fériés", path: "/jours-feries", icon: "" },
    { label: "Types de congés", path: "/types-conges", icon: "" },
    { label: "Soldes", path: "/soldes", icon: "" },
];

function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setMobileMenuOpen(false);
        navigate("/");
    };

    const handleNavigate = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const activeTitle =
        menuItems.find((item) => item.path === location.pathname)?.label || "Tableau de bord";

    return (
        <div className="app-shell">
            <aside className={`sidebar ${mobileMenuOpen ? "open" : ""}`}>
                <div className="brand-block">
                    <div className="brand-mark">D</div>
                    <div className="brand-text">
                        <span className="brand-name">Drivery</span>
                        <small>Gestion congés</small>
                    </div>
                </div>

                <nav className="sidebar-nav" aria-label="Menu principal">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            type="button"
                            className={`nav-button ${location.pathname === item.path ? "active" : ""}`}
                            onClick={() => handleNavigate(item.path)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button type="button" className="logout-button" onClick={handleLogout}>
                        Déconnexion
                    </button>
                </div>
            </aside>

            <div className="content-shell">
                <header className="topbar">
                    <button
                        type="button"
                        className="mobile-menu-button"
                        aria-label="Ouvrir le menu"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                    >
                        <span className="menu-glyph" aria-hidden="true" />
                    </button>

                    <div className="topbar-title">{activeTitle}</div>
                    <div className="topbar-meta">Administration</div>
                </header>

                <main className="page-main">{children}</main>
            </div>
        </div>
    );
}

export default Layout;