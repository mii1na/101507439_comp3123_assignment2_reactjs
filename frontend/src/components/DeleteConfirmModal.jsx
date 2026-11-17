import { useEffect, useRef } from "react";

export default function DeleteConfirmModal({
    employee,
    onCancel,
    onConfirm,
    isDeleting
}) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        dialog.showModal();

        return () => dialog.close();
    }, []);

    return (
        <dialog
            ref={dialogRef}
            className="delete-modal"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            onCancel={(event) => {
                event.preventDefault();
                if (!isDeleting) onCancel();
            }}
        >
            <h2 id="delete-title">Delete Employee?</h2>

            <p id="delete-description">
                Are you sure you want to delete{" "}
                <strong>
                    {employee.first_name} {employee.last_name}
                </strong>?
                This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
                <button
                    type="button"
                    className="secondary-button"
                    onClick={onCancel}
                    disabled={isDeleting}
                    autoFocus
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="confirm-delete-button"
                    onClick={onConfirm}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete Employee"}
                </button>
            </div>
        </dialog>
    );
}
