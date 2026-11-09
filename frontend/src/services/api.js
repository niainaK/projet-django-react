
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export async function getAllPages(url) {
    let response = await api.get(url);

    if (Array.isArray(response.data)) {
        return response;
    }

    if (!Array.isArray(response.data?.results)) {
        throw new Error("La réponse paginée de l'API est invalide.");
    }

    const results = [...response.data.results];

    while (response.data.next) {
        response = await api.get(response.data.next);

        if (!Array.isArray(response.data?.results)) {
            throw new Error("La réponse paginée de l'API est invalide.");
        }

        results.push(...response.data.results);
    }

    return {
        ...response,
        data: results,
    };
}

// Ajouter automatiquement le JWT à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
