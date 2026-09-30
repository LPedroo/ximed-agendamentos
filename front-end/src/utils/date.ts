// A clínica opera no horário de Brasília (sem horário de verão desde 2019).
// Toda data é exibida e digitada nesse fuso, independente do navegador,
// para o HTML do servidor e do navegador serem idênticos e a API receber sempre o mesmo instante.
const TIME_ZONE = "America/Sao_Paulo"
const UTC_OFFSET = "-03:00"

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, dateStyle: "short" })
const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, dateStyle: "short", timeStyle: "short" })
const partsFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
})

// ISO da API -> "30/09/2026"
export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))

// ISO da API -> "30/09/2026 14:30"
export const formatDateTime = (iso: string) => dateTimeFormatter.format(new Date(iso)).replace(",", "")

// ISO da API -> valor de <input type="datetime-local"> ("2026-09-30T14:30")
export const toDateTimeLocalValue = (iso: string) => {
    const parts = Object.fromEntries(partsFormatter.formatToParts(new Date(iso)).map((part) => [part.type, part.value]))
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}

// Valor de <input type="datetime-local"> -> ISO (UTC) que a API espera.
export const fromDateTimeLocalValue = (value: string) => new Date(`${value}:00${UTC_OFFSET}`).toISOString()

// Filtros por dia: "2026-09-30" -> início/fim desse dia no fuso da clínica.
export const startOfDayIso = (date: string) => new Date(`${date}T00:00:00${UTC_OFFSET}`).toISOString()
export const endOfDayIso = (date: string) => new Date(`${date}T23:59:59.999${UTC_OFFSET}`).toISOString()

const timeFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" })

// ISO da API -> "14:30"
export const formatTime = (iso: string) => timeFormatter.format(new Date(iso))

// ISO da API -> "2026-09-30" (dia no fuso da clínica)
export const toDateKey = (iso: string) => toDateTimeLocalValue(iso).slice(0, 10)
