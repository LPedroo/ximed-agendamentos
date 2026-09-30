import { prisma } from "../src/lib/prisma.js"

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
await prisma.$disconnect()
