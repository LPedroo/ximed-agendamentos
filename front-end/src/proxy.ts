import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { LOGIN_PATH, SESSION_COOKIE } from "@/constants/auth"

// Guarda de navegação: só checa se existe o cookie de sessão. Quem valida o JWT e
// a role de verdade é a API. Não redireciona /login -> app para evitar loop com cookie expirado.
export function proxy(request: NextRequest) {
    const hasSession = request.cookies.has(SESSION_COOKIE)

    if (!hasSession && request.nextUrl.pathname !== LOGIN_PATH) {
        return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
