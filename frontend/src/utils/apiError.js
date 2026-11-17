export function getApiError(error) {
    const response = error.response;

    if (!response) {
        return "Unable to connect to the server. Please try again.";
    }

    if (response.status === 429) {
        return "Too many requests. Please try again after 15 minutes.";
    }

    if (response.data?.errors?.length) {
        return response.data.errors
            .map((item) => item.message)
            .join(". ");
    }

    return response.data?.message || "Something went wrong.";
}
