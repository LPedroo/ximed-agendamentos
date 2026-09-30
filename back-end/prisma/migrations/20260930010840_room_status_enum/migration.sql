-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'MAINTENANCE', 'INACTIVE');

-- AlterTable: converte o texto livre existente; valores não reconhecidos viram AVAILABLE
ALTER TABLE "Room" ALTER COLUMN "status" TYPE "RoomStatus" USING (
  CASE upper("status")
    WHEN 'MAINTENANCE' THEN 'MAINTENANCE'
    WHEN 'MANUTENCAO' THEN 'MAINTENANCE'
    WHEN 'INACTIVE' THEN 'INACTIVE'
    WHEN 'INATIVA' THEN 'INACTIVE'
    ELSE 'AVAILABLE'
  END::"RoomStatus"
);
UPDATE "Room" SET "status" = 'AVAILABLE' WHERE "status" IS NULL;
ALTER TABLE "Room" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
ALTER TABLE "Room" ALTER COLUMN "status" SET NOT NULL;
