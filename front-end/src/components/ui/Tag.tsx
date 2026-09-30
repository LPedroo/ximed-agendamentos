import type { ReactNode } from "react"

// Tag do design system: fundo navy, texto branco.
export function Tag({ children }: { children: ReactNode }) {
    return <span className="inline-block whitespace-nowrap rounded-xs bg-secondary px-3 py-1 text-[13px] font-medium text-white">{children}</span>
}

// Situação ativo/inativo (contraste AA).
export function ActiveBadge({ active }: { active: boolean }) {
    return (
        <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-medium ${active ? "bg-tint text-primary" : "bg-surface text-text-muted"}`}>
            {active ? "Ativo" : "Inativo"}
        </span>
    )
}
