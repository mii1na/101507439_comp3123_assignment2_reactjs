export function formatSalary(salary) {
    return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0
    }).format(salary);
}

export function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC"
    });
}

export function getPictureUrl(picture) {
    if (!picture) return null;

    return new URL(
        picture,
        import.meta.env.VITE_API_BASE_URL
    ).href;
}
