import axios from "axios";
import { getToken } from "../utils/token-jwt";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      console.log("Token récupéré:", token); // Pour le débogage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Erreur lors de la récupération du token:", error);
      return config;
    }
  },
  (error) => {
    console.error("Erreur dans l'intercepteur de requête:", error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log("Erreur 401 détectée, token invalide ou expiré");
      // Vous pouvez ajouter ici la logique pour rediriger vers la page de connexion
    }
    return Promise.reject(error);
  }
);

export default api;
