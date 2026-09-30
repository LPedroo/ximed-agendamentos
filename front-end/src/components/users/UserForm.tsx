"use client"

import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import type { CreateUserInput, UpdateUserInput, UserResponse, UserRole } from "@shared/schemas/userSchema"
import { createUser, updateUser } from "@/actions/users"
import { Button } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Field, inputClass } from "@/components/ui/Field"
import { USER_ROLE_LABEL } from "@/constants/labels"
import { applyApiErrors, formatCpf, formatCrm, formatPhone, parseCpf, parsePhone, REQUIRED_MESSAGE } from "@/utils"

type FormValues = {
    name: string
    email: string
    cpf: string
    telephone: string
    role: UserRole
    crm: string
    password: string
}

export function UserForm({ user }: { user?: UserResponse }) {
    const router = useRouter()
    const isEdit = !!user

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            cpf: user ? formatCpf(user.cpf) : "",
            telephone: user?.telephone ? formatPhone(user.telephone) : "",
            role: user?.role ?? "PATIENT",
            crm: user?.doctor?.crm ?? "",
            password: "",
        },
    })

    const role = useWatch({ control, name: "role" })
    const isDoctor = role === "DOCTOR"

    const onSubmit = handleSubmit(async (values) => {
        const telephone = parsePhone(values.telephone)
        const common = {
            name: values.name.trim(),
            email: values.email.trim(),
            cpf: parseCpf(values.cpf),
            ...(telephone && { telephone }),
            ...(isDoctor && values.crm.trim() && { crm: values.crm.trim() }),
        }

        const result = user
            ? await updateUser(user.id, { ...common, ...(values.password && { password: values.password }) } satisfies UpdateUserInput)
            : await createUser({ ...common, password: values.password, role: values.role } satisfies CreateUserInput)

        if (!result.ok) return applyApiErrors(result, Object.keys(values), setError)

        router.push("/users")
        router.refresh()
    })

    return (
        <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border border-border bg-white p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
                <Field label="Nome *" error={errors.name?.message}>
                    <input className={inputClass} maxLength={120} {...register("name", { required: REQUIRED_MESSAGE, minLength: { value: 2, message: "Mínimo de 2 caracteres." } })} />
                </Field>

                <Field label="E-mail *" error={errors.email?.message}>
                    <input type="email" className={inputClass} maxLength={254} autoComplete="off" {...register("email", { required: REQUIRED_MESSAGE })} />
                </Field>

                <Field label="CPF *" error={errors.cpf?.message}>
                    <input
                        inputMode="numeric"
                        placeholder="000.000.000-00"
                        className={inputClass}
                        {...register("cpf", {
                            required: REQUIRED_MESSAGE,
                            validate: (value) => parseCpf(value).length === 11 || "CPF deve conter 11 dígitos.",
                            onChange: (event) => setValue("cpf", formatCpf(event.target.value)),
                        })}
                    />
                </Field>

                <Field label="Telefone" error={errors.telephone?.message}>
                    <input
                        inputMode="tel"
                        placeholder="(00) 00000-0000"
                        className={inputClass}
                        {...register("telephone", {
                            validate: (value) => !value || [10, 11].includes(parsePhone(value).length) || "Telefone deve ter 10 ou 11 dígitos.",
                            onChange: (event) => setValue("telephone", formatPhone(event.target.value)),
                        })}
                    />
                </Field>

                <Field label="Perfil *" error={errors.role?.message}>
                    <select className={inputClass} disabled={isEdit} {...register("role")}>
                        {Object.entries(USER_ROLE_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </Field>

                {isDoctor && (
                    <Field label="CRM *" error={errors.crm?.message}>
                        <input
                            className={inputClass}
                            placeholder="CRM-SP 123456"
                            {...register("crm", {
                                validate: (value) => value.trim().length >= 4 || "Informe o CRM (mínimo de 4 caracteres).",
                                onChange: (event) => setValue("crm", formatCrm(event.target.value)),
                            })}
                        />
                    </Field>
                )}

                <Field label={isEdit ? "Nova senha" : "Senha *"} error={errors.password?.message}>
                    <input
                        type="password"
                        autoComplete="new-password"
                        placeholder={isEdit ? "Deixe em branco para manter" : undefined}
                        className={inputClass}
                        {...register("password", {
                            ...(!isEdit && { required: REQUIRED_MESSAGE }),
                            validate: (value) => !value || (value.length >= 8 && value.length <= 72) || "A senha deve ter entre 8 e 72 caracteres.",
                        })}
                    />
                </Field>
            </div>

            {errors.root?.message && <ErrorMessage message={errors.root.message} />}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" arrow={false} disabled={isSubmitting}>{isSubmitting ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar"}</Button>
                <Button type="button" variant="secondary" arrow={false} onClick={() => router.push("/users")}>Voltar</Button>
            </div>
        </form>
    )
}
