import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
    const { isAuthenticated } = useAuth();

    return (
        <main className="not-found-page">
            <section className="not-found-card">
                <h1>404</h1>
                <h2>Page Not Found</h2>

                <p>
                    The page you are looking for does not exist.
                </p>

                <Link
                    to={isAuthenticated ? "/employees" : "/login"}
                    className="action-button"
                >
                    {isAuthenticated
                        ? "Back to Employees"
                        : "Back to Login"}
                </Link>
            </section>
        </main>
    );
}
