/*
  Warnings:

  - You are about to drop the `user_full_address` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `street` on table `full_address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postal_code` on table `full_address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `locality` on table `full_address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `full_address` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "user_full_address" DROP CONSTRAINT "user_full_address_full_address_id_fkey";

-- DropForeignKey
ALTER TABLE "user_full_address" DROP CONSTRAINT "user_full_address_user_id_fkey";

-- DropIndex
DROP INDEX "full_address_zone_id_key";

-- AlterTable
ALTER TABLE "full_address" ADD COLUMN     "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_on" TIMESTAMP(6),
ADD COLUMN     "user_id" INTEGER,
ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "postal_code" SET NOT NULL,
ALTER COLUMN "locality" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "country" SET DEFAULT 'France',
ALTER COLUMN "zone_id" DROP NOT NULL;

-- DropTable
DROP TABLE "user_full_address";

-- CreateIndex
CREATE INDEX "full_address_user_id_idx" ON "full_address"("user_id");

-- AddForeignKey
ALTER TABLE "full_address" ADD CONSTRAINT "full_address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
