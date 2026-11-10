ALTER TABLE "bike" RENAME COLUMN "id_1" TO "bike_model_id";
 
ALTER TABLE "bike" RENAME CONSTRAINT "bike_id_1_fkey" TO "bike_bike_model_id_fkey";