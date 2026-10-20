import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("/token/", {
                username: username,
                password: password,
            });

            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);

            setMessage("Connexion réussie !");
            navigate("/dashboard");
        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                setMessage("Nom d'utilisateur ou mot de passe incorrect.");
            } else {
                setMessage("Erreur de connexion au serveur.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <aside className="auth-visual">
                    <div className="auth-brand">
                        <span className="auth-brand-mark">D</span>
                        <div>
                            <span className="auth-brand-name">Drivery</span>
                            <small>Gestion des congés</small>
                        </div>
                    </div>

                    <div className="auth-visual-copy">
                        <p className="eyebrow">Plateforme RH</p>
                        <h1>Gérez les congés avec clarté.</h1>
                        <p>
                            Suivez les demandes, les soldes et les équipes depuis un tableau de bord moderne.
                        </p>
                    </div>
                </aside>

                <section className="auth-panel">
                    <div className="auth-panel-header">
                        <p className="eyebrow">Bienvenue</p>
                        <h2>Connectez-vous</h2>
                    </div>

                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="form-field">
                            <label htmlFor="username">Nom d'utilisateur</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Entrez votre identifiant"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">Mot de passe</label>
                            <div className="password-wrap">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Entrez votre mot de passe"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                >
                                    {showPassword ? "Masquer" : "Afficher"}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="primary-button" disabled={loading}>
                            {loading ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

                    {message && <p className="auth-message">{message}</p>}
                </section>
            </div>
        </div>
    );
}

export default Login;