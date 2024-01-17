/*
  Warnings:

  - A unique constraint covering the columns `[subject_id,user_id]` on the table `subject_votes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `subject_votes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('YES', 'NO');

-- AlterTable
ALTER TABLE "subject_votes" ADD COLUMN     "type" "VoteType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subject_votes_subject_id_user_id_key" ON "subject_votes"("subject_id", "user_id");
