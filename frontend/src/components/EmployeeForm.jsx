import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApiError } from "../utils/apiError";

const EMPTY_FORM = {
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    salary: "",
    date_of_joining: "",
    department: ""
};

const fields = [
    { name: "first_name", label: "First Name", type: "text" },
    { name: "last_name", label: "Last Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "position", label: "Position", type: "text" },
    { name: "salary", label: "Salary", type: "number" },
    { name: "date_of_joining", label: "Date of Joining", type: "date" },
    { name: "department", label: "Department", type: "text" }
];

export default function EmployeeForm({
    initialValues = {},
    existingPicture = "",
    onSave,
    buttonText = "Add Employee"
}) {
    const [form, setForm] = useState({
        ...EMPTY_FORM,
        ...initialValues
    });

    const [picture, setPicture] = useState(null);
    const [preview, setPreview] = useState("");
    const [fileError, setFileError] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    };

    const handlePicture = (event) => {
        const file = event.target.files[0];

        setFileError("");
        setPicture(null);
        setPreview("");

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            setFileError("Only JPEG, PNG and WebP images are allowed.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setFileError("Profile picture must not exceed 2 MB.");
            return;
        }

        setPicture(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (fileError) {
            setError("Please select a valid profile picture.");
            return;
        }

        const data = Object.fromEntries(
            Object.keys(EMPTY_FORM).map(key => [
                key,
                String(form[key] ?? "").trim()
            ])
        );

        if (Object.values(data).some(value => !value)) {
            setError("All employee fields are required.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!Number.isFinite(Number(data.salary)) ||
            Number(data.salary) <= 0) {
            setError("Salary must be a positive number.");
            return;
        }

        setLoading(true);

        try {
            if (picture) {
                const formData = new FormData();

                Object.entries(data).forEach(([key, value]) => {
                    formData.append(key, value);
                });

                formData.append("profile_picture", picture);

                await onSave(formData);
            } else {
                await onSave({
                    ...data,
                    salary: Number(data.salary)
                });
            }
        } catch (error) {
            setError(getApiError(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="employee-form"
            onSubmit={handleSubmit}
            noValidate
        >
            {error && (
                <div className="alert alert-error" role="alert">
                    {error}
                </div>
            )}

            <div className="picture-section">
                {preview || existingPicture ? (
                    <img
                        className="picture-preview"
                        src={preview || existingPicture}
                        alt="Employee profile preview"
                    />
                ) : (
                    <div className="picture-preview picture-placeholder">
                        No Picture
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="profile_picture">
                        Profile Picture
                    </label>

                    <input
                        id="profile_picture"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePicture}
                    />

                    <small>JPEG, PNG or WebP. Maximum 2 MB.</small>

                    {fileError && (
                        <div className="alert alert-error" role="alert">
                            {fileError}
                        </div>
                    )}
                </div>
            </div>

            <div className="form-grid">
                {fields.map(field => (
                    <div className="form-group" key={field.name}>
                        <label htmlFor={field.name}>
                            {field.label}
                        </label>

                        <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={form[field.name]}
                            onChange={handleChange}
                            step={field.type === "number" ? "any" : undefined}
                            required
                        />
                    </div>
                ))}
            </div>

            <div className="form-actions">
                <Link to="/employees" className="secondary-button">
                    Cancel
                </Link>

                <button
                    type="submit"
                    className="action-button"
                    disabled={loading}
                >
                    {loading ? "Saving..." : buttonText}
                </button>
            </div>
        </form>
    );
}
