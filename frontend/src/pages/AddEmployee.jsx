import { useNavigate } from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import { createEmployee } from "../api/employeeApi";

export default function AddEmployee() {
    const navigate = useNavigate();

    const handleSave = async (data) => {
        await createEmployee(data);

        navigate("/employees", {
            replace: true,
            state: {
                message: "Employee added successfully."
            }
        });
    };

    return (
        <main className="dashboard">
            <header className="page-header">
                <div>
                    <h1>Add Employee</h1>
                    <p>Create a new employee record.</p>
                </div>
            </header>

            <section className="table-card">
                <h2>Employee Information</h2>

                <EmployeeForm
                    onSave={handleSave}
                    buttonText="Add Employee"
                />
            </section>
        </main>
    );
}
