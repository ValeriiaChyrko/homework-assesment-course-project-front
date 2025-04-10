type FetchMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

interface FetchWithAuthParams<TPayload = unknown> {
    method: FetchMethod;
    token: string;
    url: string;
    payload?: TPayload;
}

interface FetchWithAuthResult<TResponse> {
    data: TResponse | null;
    status: number;
    error?: string;
}

export async function fetchWithAuth<TResponse, TPayload = unknown>(
    params: FetchWithAuthParams<TPayload>
): Promise<FetchWithAuthResult<TResponse>> {
    const { method, token, url, payload } = params;

    try {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: method !== "GET" ? JSON.stringify(payload) : undefined,
        });

        const status = res.status;

        if (status === 204) {
            return { data: null, status };
        }

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`fetchWithAuth: ${method} ${url} failed`, status, errorText);
            return { data: null, status, error: errorText };
        }

        const data = (await res.json()) as TResponse;
        return { data, status };
    } catch (error) {
        console.error("fetchWithAuth: Unexpected error", error);
        return { data: null, status: 500, error: "Unexpected error" };
    }
}