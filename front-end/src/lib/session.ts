import "server-only"
import { cache } from "react"
import { cookies } from "next/headers"
import { DEFAULT_SESSION_MAX_AGE_SECONDS, SESSION_COOKIE } from "@/constants/auth"
import type { UserResponse } from "@shared/schemas/userSchema"
import { ApiRoutes } from "./apiRoutes"
import { apiFetch } from "./apiClient"

const readSetCookie = (response: Response, name: string) => {
    const header = response.headers.getSetCookie().find((cookie) => cookie.startsWith(`${name}=`))
    if (!header) return null

    const [pair, ...attributes] = header.split(";").map((part) => part.trim())
    const maxAge = attributes.find((attr) => attr.toLowerCase().startsWith("max-age="))?.split("=")[1]
    return { value: pair!.slice(name.length + 1), maxAge: maxAge ? Number(maxAge) : undefined }
}

// Copia o JWT que a API enviou em Set-Cookie para um cookie do domínio do FRONT.
// Sem isso o navegador nunca recebe a sessão (a chamada à API é feita pelo servidor do Next).
export const storeSessionFromApi = async (response: Response) => {
    const session = readSetCookie(response, SESSION_COOKIE)
    if (!session) return false

    ;(await cookies()).set(SESSION_COOKIE, session.value, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: session.maxAge ?? DEFAULT_SESSION_MAX_AGE_SECONDS,
    })
    return true
}

export const clearSession = async () => {
    ;(await cookies()).delete(SESSION_COOKIE)
}

// Usuário logado, ou null se não há sessão válida (401). Memoizado por requisição; nunca redireciona.
// Qualquer outra falha (API fora do ar, rate limit...) NÃO significa sessão expirada: lança erro
// para cair no error boundary em vez de deslogar o usuário.
export const getCurrentUser = cache(async (): Promise<UserResponse | null> => {
    const result = await apiFetch<UserResponse>(ApiRoutes.auth.me(), { redirectOnUnauthorized: false })
    if (result.ok) return result.data
    if (result.status === 401) return null
    throw new Error(result.message)
})
