import { EXAM_STATUS_OPTIONS } from "@/constants/labels"

type Props = {
    value: string
    onChange: (value: string) => void
    error?: string | undefined
}

// Seleção em um clique. Clicar no status ativo limpa o campo (status é opcional).
export function ExamStatusPicker({ value, onChange, error }: Props) {
    // Preserva status legados (texto livre) que não estão na lista padrão.
    const options = value && !EXAM_STATUS_OPTIONS.includes(value) ? [...EXAM_STATUS_OPTIONS, value] : EXAM_STATUS_OPTIONS

    return (
        <fieldset className="flex flex-col gap-1.5 text-sm">
            <legend className="mb-1.5 font-medium">Status</legend>
            <div role="radiogroup" aria-label="Status" className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const active = option === value
                    return (
                        <button
                            key={option}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => onChange(active ? "" : option)}
                            className={
                                "h-11 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors duration-200 focus:shadow-focus focus:outline-none " +
                                (active ? "border-primary bg-primary text-white" : "border-border-strong bg-white text-text hover:border-primary hover:bg-tint")
                            }
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
            {error && <span role="alert" className="text-[13px] text-error">{error}</span>}
        </fieldset>
    )
}
