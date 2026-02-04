type FetchOptions = RequestInit & {
    params?: Record<string, string>;
};

const BASE_URL = (() => {
    let url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000/api";
    if (typeof window === 'undefined' && url.startsWith('/')) {
        return "http://localhost:5000/api";
    }
    return url;
})();

async function fetcher<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...init } = options;

    // Construct URL with query params
    const path = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const url = (typeof window !== 'undefined' && path.startsWith('/'))
        ? new URL(path, window.location.origin)
        : new URL(path);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value);
            }
        });
    }

    const headers = {
        "Content-Type": "application/json",
        ...init.headers,
    };

    const response = await fetch(url.toString(), {
        ...init,
        headers,
    });

    if (!response.ok) {
        // Try to parse error message from JSON response
        let errorMessage = `API Error: ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // If parsing fails, stick to default error message
        }
        throw new Error(errorMessage);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, options?: FetchOptions) =>
        fetcher<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body: any, options?: FetchOptions) =>
        fetcher<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),

    put: <T>(endpoint: string, body: any, options?: FetchOptions) =>
        fetcher<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),

    patch: <T>(endpoint: string, body: any, options?: FetchOptions) =>
        fetcher<T>(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),

    delete: <T>(endpoint: string, options?: FetchOptions) =>
        fetcher<T>(endpoint, { ...options, method: "DELETE" }),
};
