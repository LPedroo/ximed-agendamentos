import bcrypt from "bcryptjs"
import { prisma } from "../src/lib/prisma.js"
import type { AppointmentStatus, UserRole } from "../generated/prisma/client.js"

const SEED_PASSWORD = process.env["SEED_PASSWORD"] ?? "Ximed@123"

const examTypes = [
    { category: "OCCUPATIONAL", name: "Admissional", description: "Feito antes do início das atividades do novo funcionário na empresa." },
    { category: "OCCUPATIONAL", name: "Periódico", description: "Realizado periodicamente para acompanhar a saúde do colaborador." },
    { category: "OCCUPATIONAL", name: "Demissional", description: "Concluído no encerramento do contrato de trabalho." },
    { category: "OCCUPATIONAL", name: "Retorno ao trabalho", description: "Feito após o afastamento do funcionário por motivos de saúde ou acidente." },
    { category: "OCCUPATIONAL", name: "Mudança de função", description: "Necessário quando o colaborador passa a exercer atividades com riscos diferentes." },
    { category: "COMPLEMENTARY", name: "Audiometria", description: "Avalia a audição." },
    { category: "COMPLEMENTARY", name: "Acuidade visual", description: "Testa a capacidade de enxergar de perto e de longe." },
    { category: "COMPLEMENTARY", name: "Exames laboratoriais", description: "Análises de sangue e urina." },
    { category: "COMPLEMENTARY", name: "Eletrocardiograma (ECG)", description: "Analisa a atividade elétrica do coração." },
    { category: "COMPLEMENTARY", name: "Eletroencefalograma (EEG)", description: "Examina a atividade elétrica cerebral." },
    { category: "COMPLEMENTARY", name: "Raio-X", description: "Imagens radiológicas, como o raio-X de tórax." },
    { category: "COMPLEMENTARY", name: "Espirometria", description: "Mede a função pulmonar (capacidade de respiração)." },
] as const

// Idempotente: insere os tipos padrão que faltam sem alterar os já existentes.
for (const examType of examTypes) {
    await prisma.examType.upsert({
        where: { name: examType.name },
        update: {},
        create: examType,
    })
}

console.log(`${examTypes.length} tipos de exame padrão garantidos.`)

// Usuários de demonstração (um por role). Idempotente: usa o e-mail como chave.
type SeedUser = { name: string; email: string; cpf: string; role: UserRole; crm?: string }

// 5 usuários por role. O primeiro de cada role usa o e-mail sem número (admin@, operador@...).
// CPFs sequenciais (..01 a ..20), intercalando as roles.
const emailFor = (prefix: string, index: number) => `${prefix}${index === 0 ? "" : index + 1}@ximed.com`

const names: Record<UserRole, string[]> = {
    ADMIN: ["Administrador", "Marina Duarte", "Rafael Nogueira", "Beatriz Campos", "Eduardo Pires"],
    OPERATOR: ["Operador", "Juliana Ramos", "Thiago Barros", "Camila Freitas", "Lucas Andrade"],
    DOCTOR: ["Dra. Helena Souza", "Dr. Ricardo Lima", "Dra. Patrícia Gomes", "Dr. André Moura", "Dra. Fernanda Reis"],
    PATIENT: ["Carlos Paciente", "Ana Beatriz Costa", "João Pedro Alves", "Mariana Teixeira", "Roberto Carvalho"],
}
const emailPrefix: Record<UserRole, string> = { ADMIN: "admin", OPERATOR: "operador", DOCTOR: "medico", PATIENT: "paciente" }
const roles: UserRole[] = ["ADMIN", "OPERATOR", "DOCTOR", "PATIENT"]

const users: SeedUser[] = roles.flatMap((role, roleIndex) =>
    names[role].map((name, index): SeedUser => ({
        name,
        email: emailFor(emailPrefix[role], index),
        cpf: String(index * roles.length + roleIndex + 1).padStart(11, "0"),
        role,
        ...(role === "DOCTOR" && { crm: `CRM-SP ${123456 + index}` }),
    })),
)

const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10)

for (const { crm, ...user } of users) {
    await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
            ...user,
            password: passwordHash,
            ...(user.role === "DOCTOR" && crm ? { doctor: { create: { crm } } } : {}),
            ...(user.role === "PATIENT" ? { patient: { create: {} } } : {}),
        },
    })
}
console.log(`${users.length} usuários de demonstração garantidos (senha: ${SEED_PASSWORD}).`)

// Salas de demonstração (Room não tem campo único, então checa pelo nome).
const rooms = [
    { name: "Sala 01 - Consultório", roomType: "CONSULTATION", capacity: 3 },
    { name: "Sala 02 - Audiometria", roomType: "PROCEDURE", capacity: 2 },
    { name: "Laboratório", roomType: "LABORATORY", capacity: 5 },
] as const

for (const room of rooms) {
    if (!(await prisma.room.findFirst({ where: { name: room.name } }))) {
        await prisma.room.create({ data: room })
    }
}
console.log(`${rooms.length} salas de demonstração garantidas.`)

// Agendamentos de exemplo: só cria se ainda não houver nenhum.
if ((await prisma.appointment.count()) === 0) {
    const [patient, doctor, operator, room, admissional, audiometria] = await Promise.all([
        prisma.patient.findFirstOrThrow({ where: { user: { email: "paciente@ximed.com" } } }),
        prisma.doctor.findFirstOrThrow({ where: { user: { email: "medico@ximed.com" } } }),
        prisma.user.findUniqueOrThrow({ where: { email: "operador@ximed.com" } }),
        prisma.room.findFirstOrThrow({ where: { name: rooms[0].name } }),
        prisma.examType.findUniqueOrThrow({ where: { name: "Admissional" } }),
        prisma.examType.findUniqueOrThrow({ where: { name: "Audiometria" } }),
    ])

    const at = (daysAhead: number, hour: number) => {
        const date = new Date()
        date.setDate(date.getDate() + daysAhead)
        date.setHours(hour, 0, 0, 0)
        return date
    }

    await prisma.appointment.createMany({
        data: (
            [
                { scheduledAt: at(1, 9), examTypeId: admissional.id, status: "SCHEDULED" },
                { scheduledAt: at(2, 14), examTypeId: audiometria.id, status: "CONFIRMED" },
                { scheduledAt: at(3, 10), examTypeId: admissional.id, status: "SCHEDULED" },
            ] satisfies { scheduledAt: Date; examTypeId: string; status: AppointmentStatus }[]
        ).map((appointment) => ({
            ...appointment,
            patientId: patient.id,
            requestingDoctorId: doctor.id,
            roomId: room.id,
            estimatedDuration: 30,
            createdById: operator.id,
        })),
    })
    console.log("3 agendamentos de exemplo criados.")
}

await prisma.$disconnect()
