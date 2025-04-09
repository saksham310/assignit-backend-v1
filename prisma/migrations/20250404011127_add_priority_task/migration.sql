-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('Low', 'Medium', 'High');

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'Medium';
