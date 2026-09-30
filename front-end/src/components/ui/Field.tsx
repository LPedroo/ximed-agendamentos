import type { ReactNode } from "react"

const fieldBase =
    "w-full rounded-xs border border-border-strong bg-white px-3 py-2.5 text-sm text-text transition-colors duration-200 " +
    "placeholder:text-text-subtle focus:border-primary focus:shadow-focus focus:outline-none disabled:bg-surface"

export const inputClass = `${fieldBase} h-11`
export const textareaClass = `${fieldBase} min-h-24`

export function Field({ label, error, children }: { label: string; error?: string | undefined; children: ReactNode }) {
    return (
        <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">{label}</span>
            {children}
            {error && <span role="alert" className="text-[13px] text-error">{error}</span>}
        </label>
    )
}
