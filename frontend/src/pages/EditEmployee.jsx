import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import { getEmployeeById, updateEmployee } from "../api/employeeApi";
import { getApiError } from "../utils/apiError";
import { getPictureUrl } from "../utils/formatters";

export default function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();

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
            } catch (err) {
                if (active) {
                    setError(getApiError(err));
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

    const handleSave = async (data) => {
        await updateEmployee(id, data);

        navigate("/employees", {
            replace: true,
            state: {
                message: "Employee updated successfully."
            }
        });
    };

    const initialValues = employee
        ? {
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            position: employee.position,
            salary: employee.salary,
            date_of_joining: employee.date_of_joining?.slice(0, 10) || "",
            department: employee.department
        }
        : {};

    return (
        <main className="dashboard">
            <header className="page-header">
                <div>
                    <h1>Edit Employee</h1>
                    <p>Update employee information and profile picture.</p>
                </div>

                <Link to="/employees" className="secondary-button">
                    Back to Employees
                </Link>
            </header>

            {loading && (
                <p role="status">Loading employee information...</p>
            )}

            {error && (
                <div className="alert alert-error" role="alert">
                    {error}
                </div>
            )}

            {!loading && !error && employee && (
                <section className="table-card">
                    <h2>Edit Employee Information</h2>

                    <EmployeeForm
                        initialValues={initialValues}
                        existingPicture={getPictureUrl(employee.profile_picture)}
                        onSave={handleSave}
                        buttonText="Save Changes"
                    />
                </section>
            )}
        </main>
    );
}
