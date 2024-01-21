/*
  Warnings:

  - Added the required column `end_at` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "end_at" TIMESTAMP(3) NOT NULL;
