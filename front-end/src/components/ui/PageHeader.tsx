import type { ReactNode } from "react"

// Título de seção centralizado em primary; ações (ex.: "Novo") ficam numa linha à direita abaixo.
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
    return (
        <header className="mb-8">
            <h1 className="text-center text-[clamp(30px,4vw,40px)] leading-[1.2] font-semibold tracking-[-0.02em] text-primary">{title}</h1>
            {subtitle && <p className="mx-auto mt-3 max-w-[720px] text-center leading-relaxed text-text-muted">{subtitle}</p>}
            {actions && <div className="mt-8 flex justify-end">{actions}</div>}
        </header>
    )
}
