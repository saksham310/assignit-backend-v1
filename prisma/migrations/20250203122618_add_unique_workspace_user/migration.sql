/*
  Warnings:

  - A unique constraint covering the columns `[workspace_id,user_id]` on the table `Workspace_User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Workspace_User_workspace_id_user_id_key" ON "Workspace_User"("workspace_id", "user_id");
