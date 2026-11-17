import { useState } from "react";

export default function EmployeeSearch({ onSearch, onClear }) {
    const [department, setDepartment] = useState("");
    const [position, setPosition] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const filters = {};

        if (department.trim()) {
            filters.department = department.trim();
        }

        if (position.trim()) {
            filters.position = position.trim();
        }

        if (Object.keys(filters).length === 0) {
            onClear();
            return;
        }

        onSearch(filters);
    };

    const handleClear = () => {
        setDepartment("");
        setPosition("");
        onClear();
    };

    return (
        <form className="employee-search" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="search-department">
                    Department
                </label>

                <input
                    id="search-department"
                    type="text"
                    placeholder="e.g. Engineering"
                    value={department}
                    maxLength={100}
                    onChange={(event) =>
                        setDepartment(event.target.value)
                    }
                />
            </div>

            <div className="form-group">
                <label htmlFor="search-position">
                    Position
                </label>

                <input
                    id="search-position"
                    type="text"
                    placeholder="e.g. Developer"
                    value={position}
                    maxLength={100}
                    onChange={(event) =>
                        setPosition(event.target.value)
                    }
                />
            </div>

            <button type="submit" className="action-button">
                Search
            </button>

            <button
                type="button"
                className="secondary-button"
                onClick={handleClear}
            >
                Clear
            </button>
        </form>
    );
}
