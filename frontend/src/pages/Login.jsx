    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import api from "../services/api";

    function Login() {
        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
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
            <div className="card d-flex flex-column justify-content-center align-items-center min-vh-100 gap-3 bg-dark">
                <div class="container d-flex flex-column justify-content-center align-items-center min-vh-100 gap-3 bg-dark">
                    <h1 class="text-center text-light -emphasis">Gestion des congés</h1>

                    <h2 class="text-light">Connexion</h2>

                    <form onSubmit={handleLogin} class="d-flex flex-column gap-3 w-25">

                        <div class="form-group d-flex flex-column gap-1">
                            <label class="form-label text-light">Nom d'utilisateur</label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div class="form-group d-flex flex-column gap-1">
                            <label class="form-label text-light">Mot de passe</label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} class="btn btn-outline-secondary">
                            {loading ? "Connexion..." : "Se connecter"}
                        </button>

                    </form>

                    {message && <p>{message}</p>}
                </div>
            </div>
        );
    }

    export default Login;