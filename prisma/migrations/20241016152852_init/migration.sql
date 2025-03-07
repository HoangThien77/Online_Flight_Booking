/*
  Warnings:

  - You are about to drop the column `passportNumber` on the `Ticket` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "seatNumber" TEXT NOT NULL,
    CONSTRAINT "Ticket_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("airline", "arrivalAirport", "arrivalTime", "bookingId", "departureAirport", "departureTime", "flightNumber", "id", "price", "seatNumber", "total_duration", "travelClass", "tripType") SELECT "airline", "arrivalAirport", "arrivalTime", "bookingId", "departureAirport", "departureTime", "flightNumber", "id", "price", "seatNumber", "total_duration", "travelClass", "tripType" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
