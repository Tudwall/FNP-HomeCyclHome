/*
  Warnings:

  - A unique constraint covering the columns `[brand_name]` on the table `bike_brand` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[brand_id,model_name]` on the table `bike_model` will be added. If there are existing duplicate values, this will fail.
  - Made the column `brand_name` on table `bike_brand` required. This step will fail if there are existing NULL values in that column.
  - Made the column `model_name` on table `bike_model` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bike_type` on table `bike_type` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bike_brand" ALTER COLUMN "brand_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "bike_model" ALTER COLUMN "model_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "bike_type" ALTER COLUMN "bike_type" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bike_brand_brand_name_key" ON "bike_brand"("brand_name");

-- CreateIndex
CREATE UNIQUE INDEX "bike_model_brand_id_model_name_key" ON "bike_model"("brand_id", "model_name");
