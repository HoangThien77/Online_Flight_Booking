/*
  Warnings:

  - You are about to drop the column `passportExpiry` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `passportIssuedAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `passportNumber` on the `Customer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL
);
INSERT INTO "new_Customer" ("dateOfBirth", "firstName", "gender", "id", "lastName", "middleName", "nationality") SELECT "dateOfBirth", "firstName", "gender", "id", "lastName", "middleName", "nationality" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
