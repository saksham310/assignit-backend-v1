/*
  Warnings:

  - A unique constraint covering the columns `[project_id,user_id]` on the table `Project_User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_User_project_id_user_id_key" ON "Project_User"("project_id", "user_id");
