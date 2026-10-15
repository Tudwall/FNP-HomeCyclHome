/*
  Warnings:

  - A unique constraint covering the columns `[bike_type]` on the table `bike_type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bike_type_bike_type_key" ON "bike_type"("bike_type");
