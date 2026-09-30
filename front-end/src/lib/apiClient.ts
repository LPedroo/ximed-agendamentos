import "server-only"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { LOGIN_PATH, SESSION_COOKIE } from "@/constants/auth"
import type { ActionResult, ApiFailure } from "@/types/api"

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE"
    body?: unknown
    // false para rotas públicas (login) ou quando o 401 é esperado (ex.: getCurrentUser).
    authenticated?: boolean
    // Redireciona para o login quando a API responde 401 (padrão: true se autenticado).
    redirectOnUnauthorized?: boolean
}

const failure = (status: number, error: string, message: string): ApiFailure => ({ ok: false, status, error, message })

const buildHeaders = async (hasBody: boolean, authenticated: boolean) => {
    const requestHeaders = new Headers({ Accept: "application/json" })
    if (hasBody) requestHeaders.set("Content-Type", "application/json")

    // A chamada parte do servidor do Next, não do navegador: o cookie não viaja sozinho.
    if (authenticated) {
        const token = (await cookies()).get(SESSION_COOKIE)?.value
        if (token) requestHeaders.set("Cookie", `${SESSION_COOKIE}=${token}`)
    }

    // Repassa o IP real do cliente, senão o rate limit da API enxergaria só o IP do servidor do front.
    const forwardedFor = (await headers()).get("x-forwarded-for")
    if (forwardedFor) requestHeaders.set("X-Forwarded-For", forwardedFor)

    return requestHeaders
}

const parseResponse = async <T>(response: Response): Promise<ActionResult<T>> => {
    if (response.ok) {
        const data = response.status === 204 ? null : await response.json().catch(() => null)
        return { ok: true, data: data as T }
    }

    const body = await response.json().catch(() => null)
    return {
        ok: false,
        status: response.status,
        error: body?.error ?? "UNKNOWN_ERROR",
        message: body?.message ?? "Erro inesperado. Tente novamente.",
        ...(Array.isArray(body?.issues) && { issues: body.issues }),
    }
}

// Retorna o resultado tipado e a Response crua (o login precisa ler o Set-Cookie).
export const apiRequest = async <T>(
    url: string,
    { method = "GET", body, authenticated = true, redirectOnUnauthorized = authenticated }: RequestOptions = {},
): Promise<{ result: ActionResult<T>; response: Response | null }> => {
    // Fora do try: cookies()/headers() sinalizam "página dinâmica" ao Next lançando uma exceção interna
    // que não pode ser engolida aqui.
    const requestHeaders = await buildHeaders(body !== undefined, authenticated)

    let response: Response
    try {
        response = await fetch(url, {
            method,
            headers: requestHeaders,
            ...(body !== undefined && { body: JSON.stringify(body) }),
            cache: "no-store",
        })
    } catch {
        return {
            result: failure(503, "API_UNREACHABLE", "Não foi possível conectar ao servidor. Tente novamente em instantes."),
            response: null,
        }
    }

    if (response.status === 401 && redirectOnUnauthorized) redirect(`${LOGIN_PATH}?expired=1`)

    return { result: await parseResponse<T>(response), response }
}

export const apiFetch = async <T>(url: string, options?: RequestOptions) => (await apiRequest<T>(url, options)).result
