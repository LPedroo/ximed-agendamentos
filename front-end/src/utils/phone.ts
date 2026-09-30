import { onlyDigits } from "./digits"

export const PHONE_MAX_LENGTH = 11

// Máscara enquanto digita: (11) 91234-5678 ou (11) 1234-5678
export const formatPhone = (value: string) => {
    const digits = onlyDigits(value).slice(0, PHONE_MAX_LENGTH)
    if (digits.length <= 2) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    const splitAt = digits.length === 11 ? 7 : 6
    return `(${digits.slice(0, 2)}) ${digits.slice(2, splitAt)}-${digits.slice(splitAt)}`
}

// O que a API espera: 10 ou 11 dígitos, sem máscara.
export const parsePhone = (value: string) => onlyDigits(value).slice(0, PHONE_MAX_LENGTH)
