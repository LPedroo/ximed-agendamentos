import { ButtonLink } from "./Button"
import { withQuery, type ListParams } from "@/utils/query"

type Props = { page: number; totalPages: number; total: number; basePath: string; params: ListParams }

export function Pagination({ page, totalPages, total, basePath, params }: Props) {
    const href = (target: number) => withQuery(basePath, { ...params, page: target })

    return (
        <nav aria-label="Paginação" className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-text-muted">{total} registro(s) · página {page} de {Math.max(totalPages, 1)}</span>
            <div className="flex gap-2">
                {page > 1 && <ButtonLink href={href(page - 1)} variant="secondary" size="sm" arrow={false}>Anterior</ButtonLink>}
                {page < totalPages && <ButtonLink href={href(page + 1)} variant="secondary" size="sm">Próxima</ButtonLink>}
            </div>
        </nav>
    )
}
