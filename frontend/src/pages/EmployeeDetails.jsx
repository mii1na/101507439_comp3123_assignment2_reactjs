import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEmployeeById } from "../api/employeeApi";
import { getApiError } from "../utils/apiError";
import {
    formatSalary,
    formatDate,
    getPictureUrl
} from "../utils/formatters";

export default function EmployeeDetails() {
    const { id } = useParams();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadEmployee = async () => {
            try {
                const response = await getEmployeeById(id);

                if (active) {
                    setEmployee(response.data);
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

        loadEmployee();

        return () => {
            active = false;
        };
    }, [id]);

    return (
        <main className="dashboard">
            <header className="page-header">
                <div>
                    <h1>Employee Details</h1>
                    <p>View complete employee information.</p>
                </div>

                <Link to="/employees" className="secondary-button">
                    Back to Employees
                </Link>
            </header>

            {loading && (
                <p role="status">Loading employee details...</p>
            )}

            {error && (
                <div className="alert alert-error" role="alert">
                    {error}
                </div>
            )}

            {!loading && !error && employee && (
                <section className="table-card">
                    <div className="details-header">
                        {employee.profile_picture ? (
                            <img
                                className="details-avatar"
                                src={getPictureUrl(employee.profile_picture)}
                                alt={`${employee.first_name} ${employee.last_name}`}
                            />
                        ) : (
                            <div className="details-avatar details-placeholder">
                                {employee.first_name?.[0]}
                                {employee.last_name?.[0]}
                            </div>
                        )}

                        <div>
                            <h2>
                                {employee.first_name} {employee.last_name}
                            </h2>
                            <p>{employee.position}</p>
                            <p>{employee.department}</p>
                        </div>
                    </div>

                    <h3>Employee Information</h3>

                    <div className="details-grid">
                        <div>
                            <strong>First Name</strong>
                            <p>{employee.first_name}</p>
                        </div>

                        <div>
                            <strong>Last Name</strong>
                            <p>{employee.last_name}</p>
                        </div>

                        <div>
                            <strong>Email</strong>
                            <p>{employee.email}</p>
                        </div>

                        <div>
                            <strong>Position</strong>
                            <p>{employee.position}</p>
                        </div>

                        <div>
                            <strong>Department</strong>
                            <p>{employee.department}</p>
                        </div>

                        <div>
                            <strong>Salary</strong>
                            <p>{formatSalary(employee.salary)}</p>
                        </div>

                        <div>
                            <strong>Date of Joining</strong>
                            <p>{formatDate(employee.date_of_joining)}</p>
                        </div>
                    </div>

                    <div className="form-actions">
                        <Link
                            to="/employees"
                            className="secondary-button"
                        >
                            Back
                        </Link>

                        <Link
                            to={`/employees/${employee._id}/edit`}
                            className="action-button"
                        >
                            Edit Employee
                        </Link>
                    </div>
                </section>
            )}
        </main>
    );
}
