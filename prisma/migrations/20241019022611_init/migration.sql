/*
  Warnings:

  - Added the required column `totalAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.

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
    "pnr_id" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    CONSTRAINT "Booking_contactCustomerId_fkey" FOREIGN KEY ("contactCustomerId") REFERENCES "ContactCustomer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("contactCustomerId", "createdAt", "id", "isRoundTrip", "pnr_id", "updatedAt") SELECT "contactCustomerId", "createdAt", "id", "isRoundTrip", "pnr_id", "updatedAt" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE UNIQUE INDEX "Booking_pnr_id_key" ON "Booking"("pnr_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
