-- AlterTable
ALTER TABLE "Project_User" ADD COLUMN     "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Sprint_Feedback" (
    "id" SERIAL NOT NULL,
    "sprint_id" INTEGER NOT NULL,
    "wentWell" TEXT NOT NULL,
    "toImprove" TEXT NOT NULL,
    "actionItems" TEXT NOT NULL,

    CONSTRAINT "Sprint_Feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sprint_Feedback" ADD CONSTRAINT "Sprint_Feedback_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "Sprint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
