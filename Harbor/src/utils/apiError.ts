export async function readApiJson<T>(response: Response): Promise<T | null> {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text) as T;
    } catch {
        return null;
    }
};

export const isBackendUnavailable = (status: number): boolean =>
    status === 502 || status === 503 || status === 504;

type ApiErrorMessages = {
    connectionError: string;
    serverError: string;
    fallback: string;
};

export const getApiErrorMessage = (
    response: Response,
    data: { error?: string } | null,
    messages: ApiErrorMessages,
): string => {
    if (data?.error) {
        return data.error;
    }

    if (isBackendUnavailable(response.status)) {
        return messages.connectionError;
    }

    if (response.status >= 500) {
        return messages.serverError;
    }

    return messages.fallback;
};
