export type ListParams = Record<string, string | number | boolean | null | undefined>

// Anexa à URL apenas os parâmetros preenchidos.
export const withQuery = (url: string, params?: ListParams) => {
    if (!params) return url
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") query.set(key, String(value))
    }
    const qs = query.toString()
    return qs ? `${url}?${qs}` : url
}
