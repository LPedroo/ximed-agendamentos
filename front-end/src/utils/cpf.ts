import { onlyDigits } from "./digits"

export const CPF_LENGTH = 11

// Máscara enquanto digita: 12345678901 -> 123.456.789-01
export const formatCpf = (value: string) => {
    const digits = onlyDigits(value).slice(0, CPF_LENGTH)
    return digits
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
}

// O que a API espera: exatamente 11 dígitos, sem máscara.
export const parseCpf = (value: string) => onlyDigits(value).slice(0, CPF_LENGTH)
