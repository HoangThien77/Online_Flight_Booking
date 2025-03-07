/*
  Warnings:

  - You are about to drop the column `pnr_id` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `pnrId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactCustomerId" INTEGER NOT NULL,
    "isRoundTrip" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "pnrId" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    CONSTRAINT "Booking_contactCustomerId_fkey" FOREIGN KEY ("contactCustomerId") REFERENCES "ContactCustomer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("contactCustomerId", "createdAt", "id", "isRoundTrip", "totalAmount", "updatedAt") SELECT "contactCustomerId", "createdAt", "id", "isRoundTrip", "totalAmount", "updatedAt" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE UNIQUE INDEX "Booking_pnrId_key" ON "Booking"("pnrId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
