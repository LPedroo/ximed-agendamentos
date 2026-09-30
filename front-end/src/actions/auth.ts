"use server"

import { redirect } from "next/navigation"
import { loginSchema } from "@shared/schemas/userSchema"
import { LOGIN_PATH } from "@/constants/auth"
import { ApiRoutes } from "@/lib/apiRoutes"
import { apiFetch, apiRequest } from "@/lib/apiClient"
import { clearSession, storeSessionFromApi } from "@/lib/session"
import type { ApiFailure } from "@/types/api"

export async function login(input: { email: string; password: string }): Promise<ApiFailure> {
    const parsed = loginSchema.safeParse(input)
    if (!parsed.success) {
        return {
            ok: false,
            status: 400,
            error: "VALIDATION_ERROR",
            message: "Dados inválidos.",
            issues: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
        }
    }

    const { result, response } = await apiRequest<null>(ApiRoutes.auth.login(), {
        method: "POST",
        body: parsed.data,
        authenticated: false,
    })
    if (!result.ok) return result

    if (!response || !(await storeSessionFromApi(response))) {
        return { ok: false, status: 502, error: "SESSION_NOT_ISSUED", message: "A API não iniciou a sessão." }
    }

    redirect("/")
}

export async function logout() {
    await apiFetch(ApiRoutes.auth.logout(), { method: "POST", authenticated: false })
    await clearSession()
    redirect(LOGIN_PATH)
}
