"use client"

import { useState, useTransition } from "react"
import { login } from "@/actions/auth"
import { Button } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Field, inputClass } from "@/components/ui/Field"

export function LoginForm({ expired }: { expired: boolean }) {
    const [error, setError] = useState<string | null>(expired ? "Sua sessão expirou. Entre novamente." : null)
    const [isPending, startTransition] = useTransition()

    const onSubmit = (formData: FormData) => {
        setError(null)
        startTransition(async () => {
            const result = await login({
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
            })
            // Em caso de sucesso o action redireciona; só chega aqui se houve falha.
            if (result && !result.ok) setError(result.message)
        })
    }

    return (
        <form action={onSubmit} className="flex flex-col gap-5">
            <Field label="E-mail">
                <input name="email" type="email" required autoComplete="username" className={inputClass} />
            </Field>

            <Field label="Senha">
                <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
            </Field>

            {error && <ErrorMessage message={error} />}

            <Button type="submit" arrow={false} fullWidth disabled={isPending}>
                {isPending ? "Entrando..." : "Entrar"}
            </Button>
        </form>
    )
}
