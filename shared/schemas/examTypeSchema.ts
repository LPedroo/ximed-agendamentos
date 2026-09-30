import { z } from "zod"

export const ExamCategorySchema = z.enum(["OCCUPATIONAL", "COMPLEMENTARY"])
export type ExamCategory = z.infer<typeof ExamCategorySchema>

export const createExamTypeSchema = z.object({
    name: z.string().trim().min(2),
    description: z.string().trim().min(1).optional(),
    category: ExamCategorySchema,
})
export type CreateExamTypeInput = z.infer<typeof createExamTypeSchema>

export const updateExamTypeSchema = createExamTypeSchema
    .extend({ description: z.string().trim().min(1).nullable().optional() })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Informe ao menos um campo para atualizar.",
    })
export type UpdateExamTypeInput = z.infer<typeof updateExamTypeSchema>

export const examTypeIdParamSchema = z.object({ id: z.string().min(1) })

export type ExamTypeResponse = {
    id: string
    name: string
    description: string | null
    category: ExamCategory
    active: boolean
    createdAt: string
    updatedAt: string
}

export const listExamTypesQuerySchema = z.object({
    includeInactive: z.enum(["true", "false"]).default("false").transform((v) => v === "true"),
    search: z.string().trim().min(1).optional(),
    category: ExamCategorySchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
})
export type ListExamTypesQuery = z.infer<typeof listExamTypesQuerySchema>
