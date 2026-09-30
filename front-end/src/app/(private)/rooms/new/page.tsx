import { RoomForm } from "@/components/rooms/RoomForm"
import { PageHeader } from "@/components/ui/PageHeader"
import { ROOM_WRITE_ROLES } from "@/constants/permissions"
import { requireRole } from "@/lib/guards"

export default async function NewRoomPage() {
  await requireRole(ROOM_WRITE_ROLES)

  return (
    <>
      <PageHeader title="Nova sala" />
      <RoomForm />
    </>
  )
}
