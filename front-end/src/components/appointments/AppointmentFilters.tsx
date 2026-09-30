import { FilterBar } from "@/components/ui/FilterBar"
import { APPOINTMENT_STATUS_LABEL } from "@/constants/labels"

type Props = { status: string | undefined; from: string | undefined; to: string | undefined }

export function AppointmentFilters(values: Props) {
    return (
        <FilterBar
            resetHref="/appointments"
            values={values}
            fields={[
                {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: Object.entries(APPOINTMENT_STATUS_LABEL).map(([value, label]) => ({ value, label })),
                },
                { name: "from", label: "De", type: "date" },
                { name: "to", label: "Até", type: "date" },
            ]}
        />
    )
}
