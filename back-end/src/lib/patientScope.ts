import type { Request } from "express"

// Pacientes só enxergam os próprios registros; demais roles não têm restrição.
// Retorna o patientId ao qual o usuário está restrito (ou undefined se irrestrito).
export const patientScope = (req: Request): string | undefined =>
    req.user?.role === "PATIENT" ? (req.user.patientId ?? "") : undefined
