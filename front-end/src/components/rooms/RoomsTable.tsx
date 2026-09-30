import type { RoomResponse } from "@shared/schemas/roomSchema"
import { deleteRoom } from "@/actions/rooms"
import { ButtonLink } from "@/components/ui/Button"
import { DataTable } from "@/components/ui/DataTable"
import { RowActionButton } from "@/components/ui/RowActionButton"
import { Tag } from "@/components/ui/Tag"
import { ROOM_STATUS_LABEL, ROOM_TYPE_LABEL } from "@/constants/labels"

export function RoomsTable({ rooms, canWrite }: { rooms: RoomResponse[]; canWrite: boolean }) {
    return (
        <DataTable
            rows={rooms}
            rowKey={(room) => room.id}
            emptyMessage="Nenhuma sala encontrada."
            columns={[
                { header: "Nome", cell: (room) => <span className="font-medium">{room.name}</span> },
                { header: "Tipo", cell: (room) => <Tag>{ROOM_TYPE_LABEL[room.roomType]}</Tag> },
                { header: "Capacidade", cell: (room) => `${room.capacity} pessoa(s)` },
                { header: "Situação", cell: (room) => ROOM_STATUS_LABEL[room.status] },
                ...(canWrite
                    ? [
                          {
                              header: "Ações",
                              align: "right" as const,
                              cell: (room: RoomResponse) => (
                                  <div className="flex items-start justify-end gap-1">
                                      <ButtonLink href={`/rooms/${room.id}/edit`} variant="secondary" size="sm" arrow={false}>Editar</ButtonLink>
                                      <RowActionButton label="Excluir" variant="danger" confirm={`Excluir a sala "${room.name}"?`} action={deleteRoom.bind(null, room.id)} />
                                  </div>
                              ),
                          },
                      ]
                    : []),
            ]}
        />
    )
}
