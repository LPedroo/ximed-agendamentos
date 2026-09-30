"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/Button"
import type { ActionResult } from "@/types/api"

type Props = {
    label: string
    // Server Action já com os argumentos (ex.: deleteRoom.bind(null, id)).
    action: () => Promise<ActionResult<unknown>>
    confirm?: string
    variant?: "secondary" | "danger"
}

// Botão de ação de linha: confirma (opcional), executa a action e mostra o erro da API logo abaixo.
export function RowActionButton({ label, action, confirm, variant = "secondary" }: Props) {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const onClick = () => {
        if (confirm && !window.confirm(confirm)) return
        setError(null)
        startTransition(async () => {
            const result = await action()
            if (!result.ok) setError(result.message)
        })
    }

    return (
        <span className="flex flex-col items-end gap-1">
            <Button type="button" variant={variant} size="sm" arrow={false} disabled={isPending} onClick={onClick}>{label}</Button>
            {error && <span role="alert" className="max-w-56 text-right text-[13px] text-error">{error}</span>}
        </span>
    )
}
