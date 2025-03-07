/*
  Warnings:

  - You are about to drop the column `firstName` on the `ContactCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `ContactCustomer` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ContactCustomer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContactCustomer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "provider" TEXT,
    "providerAccountId" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ContactCustomer" ("email", "id", "phone") SELECT "email", "id", "phone" FROM "ContactCustomer";
DROP TABLE "ContactCustomer";
ALTER TABLE "new_ContactCustomer" RENAME TO "ContactCustomer";
CREATE UNIQUE INDEX "ContactCustomer_email_key" ON "ContactCustomer"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
