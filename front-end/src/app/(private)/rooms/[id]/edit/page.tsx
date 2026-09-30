import { notFound } from "next/navigation"
import { getRoom } from "@/actions/rooms"
import { RoomForm } from "@/components/rooms/RoomForm"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { PageHeader } from "@/components/ui/PageHeader"
import { ROOM_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(ROOM_WRITE_ROLES)
  const { id } = await params

  const room = await getRoom(id)
  if (!room.ok) {
    if (room.status === 404) notFound()
    return <ErrorMessage message={room.message} />
  }

  return (
    <>
      <PageHeader title="Editar sala" />
      <RoomForm room={room.data} />
    </>
  )
}
