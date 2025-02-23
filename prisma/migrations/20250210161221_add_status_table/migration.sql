-- CreateEnum
CREATE TYPE "Status_Types" AS ENUM ('To_Do', 'In_Progress', 'Completed');

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "Status_Types" NOT NULL,
    "color" TEXT,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
