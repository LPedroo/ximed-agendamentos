-- AlterTable
ALTER TABLE "MedicalExamination" ADD COLUMN     "appointmentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MedicalExamination_appointmentId_key" ON "MedicalExamination"("appointmentId");

-- AddForeignKey
ALTER TABLE "MedicalExamination" ADD CONSTRAINT "MedicalExamination_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

