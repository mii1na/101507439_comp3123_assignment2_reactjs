import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000
});

// Attach JWT to protected requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRequest = ["/user/login", "/user/signup"]
            .includes(error.config?.url);

        if (error.response?.status === 401 && !isAuthRequest) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.replace("/login");
        }

        return Promise.reject(error);
    }
);

export default api;
