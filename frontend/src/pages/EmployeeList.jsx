import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    getEmployees,
    deleteEmployee,
    searchEmployees
} from "../api/employeeApi";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmployeeSearch from "../components/EmployeeSearch";
import { getApiError } from "../utils/apiError";

export default function EmployeeList() {
    const location = useLocation();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [success, setSuccess] = useState("");
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [searchActive, setSearchActive] = useState(false);

    useEffect(() => {
        let active = true;

        const loadEmployees = async () => {
            try {
                const response = await getEmployees();

                if (active) {
                    setEmployees(response.data);
                }
            } catch (error) {
                if (active) {
                    setError(getApiError(error));
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadEmployees();

        return () => {
            active = false;
        };
    }, []);

    const getPictureUrl = (picture) => {
        return new URL(
            picture,
            import.meta.env.VITE_API_BASE_URL
        ).href;
    };

    const handleDelete = async () => {
        if (!employeeToDelete || deletingId) return;

        const employeeId = employeeToDelete._id;

        setDeletingId(employeeId);
        setError("");
        setSuccess("");

        try {
            await deleteEmployee(employeeId);

            setEmployees((previous) =>
                previous.filter((item) => item._id !== employeeId)
            );

            setSuccess("Employee deleted successfully.");
        } catch (error) {
            setError(getApiError(error));
        } finally {
            setDeletingId(null);
            setEmployeeToDelete(null);
        }
    };

    const handleSearch = async (filters) => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await searchEmployees(filters);

            setEmployees(response.data);
            setSearchActive(true);
        } catch (error) {
            setError(getApiError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleClearSearch = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await getEmployees();

            setEmployees(response.data);
            setSearchActive(false);
        } catch (error) {
            setError(getApiError(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="dashboard">
            <header className="page-header">
                <div>
                    <h1>Employees</h1>
                    <p>View and manage your employee records.</p>
                </div>

                <Link to="/employees/add" className="action-button">
                    + Add Employee
                </Link>
            </header>

            <EmployeeSearch
                onSearch={handleSearch}
                onClear={handleClearSearch}
            />

            {location.state?.message && (
                <div className="alert alert-success" role="status">
                    {location.state.message}
                </div>
            )}

            {success && (
                <div className="alert alert-success" role="status">
                    {success}
                </div>
            )}

            {loading && <p role="status">Loading employees...</p>}

            {error && (
                <div className="alert alert-error" role="alert">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <section className="table-card">
                    <h2>Employee Directory</h2>

                    {employees.length === 0 ? (
                        <div className="empty-state">
                            <h3>
                                {searchActive ? "No matching employees" : "No employees yet"}
                            </h3>

                            <p>
                                {searchActive
                                    ? "Try a different department or position."
                                    : "Add your first employee to get started."}
                            </p>

                            <Link
                                to="/employees/add"
                                className="action-button"
                            >
                                Add Employee
                            </Link>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="employee-table">
                                <thead>
                                    <tr>
                                        <th>Profile</th>
                                        <th>Name</th>
                                        <th>Position</th>
                                        <th>Department</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {employees.map((employee) => (
                                        <tr key={employee._id}>
                                            <td>
                                                {employee.profile_picture ? (
                                                    <img
                                                        className="employee-avatar"
                                                        src={getPictureUrl(employee.profile_picture)}
                                                        alt={`${employee.first_name} ${employee.last_name}`}
                                                    />
                                                ) : (
                                                    <div className="avatar-placeholder">
                                                        {employee.first_name[0]}
                                                        {employee.last_name[0]}
                                                    </div>
                                                )}
                                            </td>

                                            <td>
                                                {employee.first_name}{" "}
                                                {employee.last_name}
                                            </td>
                                            <td>{employee.position}</td>
                                            <td>{employee.department}</td>

                                            <td>
                                                <div className="table-actions">
                                                    <Link to={`/employees/${employee._id}`}>
                                                        View
                                                    </Link>

                                                    <Link to={`/employees/${employee._id}/edit`}>
                                                        Edit
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="delete-button"
                                                        onClick={() => setEmployeeToDelete(employee)}
                                                        disabled={deletingId !== null}
                                                    >
                                                        {deletingId === employee._id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            )}

            {employeeToDelete && (
                <DeleteConfirmModal
                    employee={employeeToDelete}
                    onCancel={() => setEmployeeToDelete(null)}
                    onConfirm={handleDelete}
                    isDeleting={deletingId !== null}
                />
            )}
        </main>
    );
}
