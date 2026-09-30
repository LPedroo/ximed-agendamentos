import { toDateKey } from "./date"

// Calendário mensal. "Mês" = "YYYY-MM"; "dia" = "YYYY-MM-DD". Só aritmética de datas (UTC), sem fuso envolvido.
export type CalendarDay = { key: string; day: number; inMonth: boolean }

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/
const pad = (n: number) => String(n).padStart(2, "0")
const dayKey = (date: Date) => `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`

export const currentMonth = () => toDateKey(new Date().toISOString()).slice(0, 7)

// Valida o parâmetro da URL; inválido ou ausente = mês atual.
export const parseMonth = (value: string | undefined) => (value && MONTH_PATTERN.test(value) ? value : currentMonth())

export const shiftMonth = (month: string, delta: number) => {
    const [year, m] = month.split("-").map(Number) as [number, number]
    const date = new Date(Date.UTC(year, m - 1 + delta, 1))
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`
}

export const formatMonthTitle = (month: string) => {
    const [year, m] = month.split("-").map(Number) as [number, number]
    const title = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, m - 1, 1)))
    return title.charAt(0).toUpperCase() + title.slice(1)
}

// Grade de semanas completas (domingo a sábado) que cobre o mês, incluindo dias dos meses vizinhos.
export const buildMonthGrid = (month: string): CalendarDay[] => {
    const [year, m] = month.split("-").map(Number) as [number, number]
    const first = new Date(Date.UTC(year, m - 1, 1))
    const last = new Date(Date.UTC(year, m, 0))
    const start = new Date(first)
    start.setUTCDate(first.getUTCDate() - first.getUTCDay())
    const end = new Date(last)
    end.setUTCDate(last.getUTCDate() + (6 - last.getUTCDay()))

    const days: CalendarDay[] = []
    for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
        days.push({ key: dayKey(cursor), day: cursor.getUTCDate(), inMonth: cursor.getUTCMonth() === m - 1 })
    }
    return days
}
