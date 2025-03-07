/*
  Warnings:

  - A unique constraint covering the columns `[pnr_id]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Booking_pnr_id_key" ON "Booking"("pnr_id");
