import type { ReactNode } from "react"

export type Column<T> = { header: string; cell: (row: T) => ReactNode; align?: "right"; nowrap?: boolean }

type Props<T> = { columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string; emptyMessage: string }

// Tabela do design system: container radius 16 com borda, cabeçalho surface 14/600, células 12px 16px.
export function DataTable<T>({ columns, rows, rowKey, emptyMessage }: Props<T>) {
    if (rows.length === 0) {
        return <p className="rounded-md border border-border bg-white p-8 text-center text-text-muted">{emptyMessage}</p>
    }

    return (
        <div className="overflow-x-auto rounded-md border border-border bg-white">
            <table className="w-full text-left text-sm">
                <thead className="bg-surface text-sm font-semibold">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.header} className={`px-4 py-3 ${column.align === "right" ? "text-right" : ""}`}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {rows.map((row) => (
                        <tr key={rowKey(row)} className="transition-colors hover:bg-surface-2">
                            {columns.map((column) => (
                                <td key={column.header} className={`px-4 py-3 ${column.align === "right" ? "text-right" : ""} ${column.nowrap ? "whitespace-nowrap" : ""}`}>
                                    {column.cell(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
