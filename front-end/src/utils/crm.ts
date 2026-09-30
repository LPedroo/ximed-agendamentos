export const CRM_MAX_LENGTH = 20

// Normaliza o CRM (ex.: "crm-sp  123456" -> "CRM-SP 123456").
export const formatCrm = (value: string) => value.toUpperCase().replace(/\s+/g, " ").trimStart().slice(0, CRM_MAX_LENGTH)
