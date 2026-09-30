type Option = { value: string; label: string }

type Props = {
    label: string
    options: Option[]
    value: string
    onChange: (value: string) => void
    // Quando true, clicar na opção ativa limpa o valor (campo opcional).
    clearable?: boolean
    error?: string | undefined
}

// Seleção em um clique, no lugar de select/datalist.
export function OptionPicker({ label, options, value, onChange, clearable = false, error }: Props) {
    return (
        <fieldset className="flex flex-col gap-1.5 text-sm">
            <legend className="mb-1.5 font-medium">{label}</legend>
            <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const active = option.value === value
                    return (
                        <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => onChange(active && clearable ? "" : option.value)}
                            className={
                                "h-11 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors duration-200 focus:shadow-focus focus:outline-none " +
                                (active ? "border-primary bg-primary text-white" : "border-border-strong bg-white text-text hover:border-primary hover:bg-tint")
                            }
                        >
                            {option.label}
                        </button>
                    )
                })}
            </div>
            {error && <span role="alert" className="text-[13px] text-error">{error}</span>}
        </fieldset>
    )
}
