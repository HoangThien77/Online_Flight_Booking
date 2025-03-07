/*
  Warnings:

  - You are about to drop the column `customerId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `legroom` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `pnr_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatNumber` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripType` to the `Ticket` table without a default value. This is not possible if the table is not empty.

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
    CONSTRAINT "Booking_contactCustomerId_fkey" FOREIGN KEY ("contactCustomerId") REFERENCES "ContactCustomer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("contactCustomerId", "createdAt", "id", "isRoundTrip", "updatedAt") SELECT "contactCustomerId", "createdAt", "id", "isRoundTrip", "updatedAt" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "departureAirport" TEXT NOT NULL,
    "arrivalAirport" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME NOT NULL,
    "travelClass" TEXT NOT NULL,
    "total_duration" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "tripType" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "seatNumber" TEXT NOT NULL,
    CONSTRAINT "Ticket_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("airline", "arrivalAirport", "arrivalTime", "bookingId", "departureAirport", "departureTime", "flightNumber", "id", "passportNumber", "price", "total_duration", "travelClass") SELECT "airline", "arrivalAirport", "arrivalTime", "bookingId", "departureAirport", "departureTime", "flightNumber", "id", "passportNumber", "price", "total_duration", "travelClass" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
