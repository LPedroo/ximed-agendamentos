-- Um agendamento passa a poder ter vários exames
DROP INDEX "MedicalExamination_appointmentId_key";
CREATE INDEX "MedicalExamination_appointmentId_idx" ON "MedicalExamination"("appointmentId");

-- O nome livre do exame é substituído pelo tipo de exame
ALTER TABLE "MedicalExamination" ADD COLUMN "examTypeId" TEXT;

-- Preserva nomes existentes que não correspondem a nenhum tipo cadastrado
INSERT INTO "ExamType" ("id", "name", "category", "updatedAt")
SELECT 'c' || substr(md5(random()::text || n."name"), 1, 24), n."name", 'COMPLEMENTARY', CURRENT_TIMESTAMP
FROM (SELECT DISTINCT btrim("name") AS "name" FROM "MedicalExamination") n
WHERE NOT EXISTS (SELECT 1 FROM "ExamType" t WHERE lower(t."name") = lower(n."name"));

UPDATE "MedicalExamination" e
SET "examTypeId" = t."id"
FROM "ExamType" t
WHERE lower(t."name") = lower(btrim(e."name"));

ALTER TABLE "MedicalExamination" ALTER COLUMN "examTypeId" SET NOT NULL;
ALTER TABLE "MedicalExamination" DROP COLUMN "name";

ALTER TABLE "MedicalExamination" ADD CONSTRAINT "MedicalExamination_examTypeId_fkey" FOREIGN KEY ("examTypeId") REFERENCES "ExamType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
