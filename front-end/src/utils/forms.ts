import type { FieldValues, UseFormSetError } from "react-hook-form"
import type { ApiFailure } from "@/types/api"

// Distribui os erros da API: issues cujo path é um campo do formulário vão para o campo;
// o restante (ou falha sem issues) vira erro geral do formulário (`errors.root`).
export function applyApiErrors<T extends FieldValues>(failure: ApiFailure, fields: string[], setError: UseFormSetError<T>) {
    let mapped = false
    for (const issue of failure.issues ?? []) {
        const field = issue.path.split(".")[0] ?? ""
        if (fields.includes(field)) {
            setError(field as Parameters<UseFormSetError<T>>[0], { message: issue.message })
            mapped = true
        }
    }
    if (!mapped) setError("root", { message: failure.message })
}

export const REQUIRED_MESSAGE = "Campo obrigatório."
