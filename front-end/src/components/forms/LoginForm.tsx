"use client"

import { useState, useTransition } from "react"
import { Eye, EyeOff } from "lucide-react"
import { login } from "@/actions/auth"
import { Button } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Field, inputClass } from "@/components/ui/Field"

export function LoginForm({ expired }: { expired: boolean }) {
    const [error, setError] = useState<string | null>(expired ? "Sua sessão expirou. Entre novamente." : null)
    const [showPassword, setShowPassword] = useState(false)
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
                <div className="relative">
                    <input name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" className={`${inputClass} pr-11`} />
                    <button
                        type="button"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-text-muted hover:text-primary"
                    >
                        {showPassword ? <EyeOff className="size-5" strokeWidth={1.75} /> : <Eye className="size-5" strokeWidth={1.75} />}
                    </button>
                </div>
            </Field>

            {error && <ErrorMessage message={error} />}

            <Button type="submit" arrow={false} fullWidth disabled={isPending}>
                {isPending ? "Entrando..." : "Entrar"}
            </Button>
        </form>
    )
}
