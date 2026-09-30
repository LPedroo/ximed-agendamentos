"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import type { RoomResponse, RoomStatus, RoomType } from "@shared/schemas/roomSchema"
import { createRoom, updateRoom } from "@/actions/rooms"
import { Button } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { Field, inputClass } from "@/components/ui/Field"
import { ROOM_STATUS_LABEL, ROOM_TYPE_LABEL } from "@/constants/labels"
import { applyApiErrors, REQUIRED_MESSAGE } from "@/utils"

type FormValues = { name: string; roomType: RoomType; capacity: string; status: RoomStatus }

export function RoomForm({ room }: { room?: RoomResponse }) {
    const router = useRouter()
    const isEdit = !!room

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            name: room?.name ?? "",
            roomType: room?.roomType ?? "CONSULTATION",
            capacity: room?.capacity.toString() ?? "1",
            status: room?.status ?? "AVAILABLE",
        },
    })

    const onSubmit = handleSubmit(async (values) => {
        const payload = { name: values.name.trim(), roomType: values.roomType, capacity: Number(values.capacity), status: values.status }
        const result = room ? await updateRoom(room.id, payload) : await createRoom(payload)

        if (!result.ok) return applyApiErrors(result, Object.keys(values), setError)

        router.push("/rooms")
        router.refresh()
    })

    return (
        <form onSubmit={onSubmit} className="mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border border-border bg-white p-6 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
                <Field label="Nome *" error={errors.name?.message}>
                    <input className={inputClass} maxLength={100} {...register("name", { required: REQUIRED_MESSAGE, minLength: { value: 2, message: "Mínimo de 2 caracteres." } })} />
                </Field>

                <Field label="Tipo *" error={errors.roomType?.message}>
                    <select className={inputClass} {...register("roomType")}>
                        {Object.entries(ROOM_TYPE_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Capacidade *" error={errors.capacity?.message}>
                    <input type="number" min={1} className={inputClass} {...register("capacity", { required: REQUIRED_MESSAGE, min: { value: 1, message: "Mínimo de 1 pessoa." } })} />
                </Field>

                <Field label="Situação *" error={errors.status?.message}>
                    <select className={inputClass} {...register("status")}>
                        {Object.entries(ROOM_STATUS_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </Field>
            </div>

            {errors.root?.message && <ErrorMessage message={errors.root.message} />}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" arrow={false} disabled={isSubmitting}>{isSubmitting ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar"}</Button>
                <Button type="button" variant="secondary" arrow={false} onClick={() => router.push("/rooms")}>Voltar</Button>
            </div>
        </form>
    )
}
