import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        const message = "You have been logged out successfully.";

        // Survives ProtectedRoute's redirect race that can clear location.state
        sessionStorage.setItem("flashMessage", message);

        logout();

        navigate("/login", {
            replace: true,
            state: { message }
        });
    };

    return (
        <nav className="navbar">
            <Link className="navbar-brand" to="/">
                Employee Management System
            </Link>

            <div className="navbar-links">
                {isAuthenticated ? (
                    <>
                        <Link to="/employees">Employees</Link>
                        <Link to="/employees/add">Add Employee</Link>
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
