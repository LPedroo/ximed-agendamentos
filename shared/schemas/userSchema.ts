import { z } from "zod"

export const UserRoleSchema = z.enum(["ADMIN", "OPERATOR", "PATIENT", "DOCTOR"])
export type UserRole = z.infer<typeof UserRoleSchema>

const userBaseSchema = z.object({
    name: z.string().trim().min(2),
    email: z.email().toLowerCase(),
    password: z.string().min(8),
    telephone: z.string().trim().min(8).optional(),
    cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos."),
    role: UserRoleSchema.optional(),
    crm: z.string().trim().min(4).optional(),
})
export const createUserSchema = userBaseSchema.refine(
    (data) => data.role !== "DOCTOR" || !!data.crm,
    { message: "CRM é obrigatório para usuários com role DOCTOR.", path: ["crm"] },
)
export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = userBaseSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Informe ao menos um campo para atualizar.",
    })
export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const userIdParamSchema = z.object({ id: z.string().min(1) })

export type UserResponse = {
    id: string
    name: string
    email: string
    telephone: string | null
    cpf: string
    role: UserRole
    active: boolean
    patient: { id: string } | null
    doctor: { id: string; crm: string } | null
    createdAt: string
    updatedAt: string
}

export const listUsersQuerySchema = z.object({
    role: UserRoleSchema.optional(),
    includeInactive: z.enum(["true", "false"]).default("false").transform((v) => v === "true"),
    search: z.string().trim().min(1).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
})
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>

export type PaginatedResponse<T> = {
    data: T[]
    meta: { total: number; page: number; limit: number; totalPages: number }
}

export const loginSchema = z.object({
    email: z.email().toLowerCase(),
    password: z.string().min(1),
})

export type LoginInput = z.infer<typeof loginSchema>
