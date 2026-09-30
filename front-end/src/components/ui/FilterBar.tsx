import { Button, ButtonLink } from "./Button"
import { Field, inputClass } from "./Field"

export type FilterField =
    | { name: string; label: string; type: "text" | "date"; placeholder?: string }
    | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; allLabel?: string }
    | { name: string; label: string; type: "checkbox" }

type Props = { fields: FilterField[]; values: Record<string, string | undefined>; resetHref: string }

// Formulário GET: os filtros ficam na URL (compartilháveis e sem estado no cliente).
export function FilterBar({ fields, values, resetHref }: Props) {
    return (
        <form method="get" className="mb-5 flex flex-wrap items-end gap-5 rounded-md border border-border bg-white p-5">
            {fields.map((field) => (
                <div key={field.name} className="min-w-[180px] flex-1">
                    {field.type === "checkbox" ? (
                        <label className="flex h-11 items-center gap-2 text-sm font-medium">
                            <input type="checkbox" name={field.name} value="true" defaultChecked={values[field.name] === "true"} className="size-4 accent-primary" />
                            {field.label}
                        </label>
                    ) : (
                        <Field label={field.label}>
                            {field.type === "select" ? (
                                <select name={field.name} defaultValue={values[field.name] ?? ""} className={inputClass}>
                                    <option value="">{field.allLabel ?? "Todos"}</option>
                                    {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input type={field.type} name={field.name} defaultValue={values[field.name] ?? ""} placeholder={field.placeholder} className={inputClass} />
                            )}
                        </Field>
                    )}
                </div>
            ))}
            <div className="flex gap-2">
                <Button type="submit">Filtrar</Button>
                <ButtonLink href={resetHref} variant="secondary" arrow={false}>Limpar</ButtonLink>
            </div>
        </form>
    )
}
