"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import type { ExamCategory, ExamTypeResponse } from "@shared/schemas/examTypeSchema"
import { createExamType, updateExamType } from "@/actions/exam-types"
import { Button } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Field, inputClass, textareaClass } from "@/components/ui/Field"
import { EXAM_CATEGORY_LABEL } from "@/constants/labels"
import { applyApiErrors, REQUIRED_MESSAGE } from "@/utils"

type FormValues = { name: string; category: ExamCategory; description: string }

export function ExamTypeForm({ examType }: { examType?: ExamTypeResponse }) {
    const router = useRouter()
    const isEdit = !!examType

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            name: examType?.name ?? "",
            category: examType?.category ?? "OCCUPATIONAL",
            description: examType?.description ?? "",
        },
    })

    const onSubmit = handleSubmit(async (values) => {
        const name = values.name.trim()
        const description = values.description.trim()

        // Na criação, descrição vazia é omitida; na edição, `null` limpa o campo.
        const result = examType
            ? await updateExamType(examType.id, { name, category: values.category, description: description || null })
            : await createExamType({ name, category: values.category, ...(description && { description }) })

        if (!result.ok) return applyApiErrors(result, Object.keys(values), setError)

        router.push("/exam-types")
        router.refresh()
    })

    return (
        <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border border-border bg-white p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
                <Field label="Nome *" error={errors.name?.message}>
                    <input className={inputClass} maxLength={100} {...register("name", { required: REQUIRED_MESSAGE, minLength: { value: 2, message: "Mínimo de 2 caracteres." } })} />
                </Field>

                <Field label="Categoria *" error={errors.category?.message}>
                    <select className={inputClass} {...register("category")}>
                        {Object.entries(EXAM_CATEGORY_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </Field>
            </div>

            <Field label="Descrição" error={errors.description?.message}>
                <textarea rows={3} maxLength={500} className={textareaClass} {...register("description")} />
            </Field>

            {errors.root?.message && <ErrorMessage message={errors.root.message} />}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" arrow={false} disabled={isSubmitting}>{isSubmitting ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar"}</Button>
                <Button type="button" variant="secondary" arrow={false} onClick={() => router.push("/exam-types")}>Voltar</Button>
            </div>
        </form>
    )
}
