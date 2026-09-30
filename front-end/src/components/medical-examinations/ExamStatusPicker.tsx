import { OptionPicker } from "@/components/ui/OptionPicker"
import { EXAM_STATUS_OPTIONS } from "@/constants/labels"

type Props = { value: string; onChange: (value: string) => void; error?: string | undefined }

export function ExamStatusPicker({ value, onChange, error }: Props) {
    // Preserva status legados (texto livre) que não estão na lista padrão.
    const statuses = value && !EXAM_STATUS_OPTIONS.includes(value) ? [...EXAM_STATUS_OPTIONS, value] : EXAM_STATUS_OPTIONS

    return <OptionPicker label="Status" options={statuses.map((s) => ({ value: s, label: s }))} value={value} onChange={onChange} clearable error={error} />
}
