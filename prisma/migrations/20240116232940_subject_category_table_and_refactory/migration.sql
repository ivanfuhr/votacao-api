/*
  Warnings:

  - You are about to drop the column `user_id` on the `subjects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_user_id_fkey";

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "user_id",
ADD COLUMN     "category_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "subject_categories" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subject_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_document_key" ON "users"("document");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "subject_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
