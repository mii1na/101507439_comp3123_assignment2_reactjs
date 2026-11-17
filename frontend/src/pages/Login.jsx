import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login as loginRequest } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../utils/apiError";

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [statusMessage] = useState(() => {
        const flashMessage = sessionStorage.getItem("flashMessage");

        if (flashMessage) {
            sessionStorage.removeItem("flashMessage");
            return flashMessage;
        }

        return location.state?.message || "";
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const value = identifier.trim();

        if (!value || !password) {
            setError("Username or email and password are required.");
            return;
        }

        const isEmail = value.includes("@");

        if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const credentials = isEmail
                ? { email: value, password }
                : { username: value, password };

            const response = await loginRequest(credentials);

            login(response.data.token);
            navigate("/employees", { replace: true });
        } catch (error) {
            setError(getApiError(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card">
                <span className="auth-brand">
                    Employee Management System
                </span>

                <h1>Welcome back</h1>
                <p>Sign in to manage your employees.</p>

                {statusMessage && (
                    <div className="alert alert-success" role="status">
                        {statusMessage}
                    </div>
                )}

                {error && (
                    <div className="alert alert-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="identifier">
                            Username or Email
                        </label>

                        <input
                            id="identifier"
                            type="text"
                            placeholder="Enter your username or email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/signup">Create an account</Link>
                </p>
            </section>
        </main>
    );
}
