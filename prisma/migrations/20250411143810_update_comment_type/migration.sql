/*
  Warnings:

  - The values [log] on the enum `Comment_Types` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Comment_Types_new" AS ENUM ('comment', 'activity');
ALTER TABLE "Task_Comment" ALTER COLUMN "type" TYPE "Comment_Types_new" USING ("type"::text::"Comment_Types_new");
ALTER TYPE "Comment_Types" RENAME TO "Comment_Types_old";
ALTER TYPE "Comment_Types_new" RENAME TO "Comment_Types";
DROP TYPE "Comment_Types_old";
COMMIT;
