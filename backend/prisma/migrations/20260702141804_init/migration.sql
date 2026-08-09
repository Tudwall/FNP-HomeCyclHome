-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "intervention_status" AS ENUM ('pending', 'done', 'cancelled');

-- CreateEnum
CREATE TYPE "mime_type" AS ENUM ('image/jpeg', 'image/png');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('processed', 'awaiting');

-- CreateEnum
CREATE TYPE "payment_type" AS ENUM ('debit_card', 'cash');

-- CreateTable
CREATE TABLE "app_user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(6),
    "deleted_on" TIMESTAMP(6),

    CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bike" (
    "id" SERIAL NOT NULL,
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(6),
    "deleted_on" TIMESTAMP(6),
    "id_1" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,

    CONSTRAINT "bike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bike_brand" (
    "id" SERIAL NOT NULL,
    "brand_name" VARCHAR(50),

    CONSTRAINT "bike_brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bike_model" (
    "id" SERIAL NOT NULL,
    "model_name" VARCHAR(50),
    "brand_id" INTEGER NOT NULL,

    CONSTRAINT "bike_model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bike_type" (
    "id" SERIAL NOT NULL,
    "bike_type" VARCHAR(50),

    CONSTRAINT "bike_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "text" VARCHAR(1000) NOT NULL,
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "intervention_id" INTEGER NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_info" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "phone_number" VARCHAR(12) NOT NULL,
    "linkedin_link" VARCHAR(100),
    "facebook_link" VARCHAR(100),
    "twitter_link" VARCHAR(100),
    "instagram_link" VARCHAR(100),
    "full_address_id" INTEGER NOT NULL,

    CONSTRAINT "company_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "mime_type" "mime_type" NOT NULL,
    "url" VARCHAR(200) NOT NULL,
    "intervention_id" INTEGER NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "full_address" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(50),
    "street" VARCHAR(150),
    "postal_code" VARCHAR(10),
    "locality" VARCHAR(100),
    "region" VARCHAR(100),
    "country" VARCHAR(100),
    "zone_id" INTEGER NOT NULL,

    CONSTRAINT "full_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interval_" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(6) NOT NULL,
    "end_date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "interval__pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intervention" (
    "id" SERIAL NOT NULL,
    "status" "intervention_status" NOT NULL,
    "is_cancelled" BOOLEAN,
    "cancelled_on" TIMESTAMP(6),
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(6),
    "deleted_on" TIMESTAMP(6),
    "intervention_id" INTEGER NOT NULL,
    "job_id" INTEGER NOT NULL,
    "mechanic_id" INTEGER NOT NULL,
    "cycle_id" INTEGER NOT NULL,

    CONSTRAINT "intervention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "price" DECIMAL(6,2) NOT NULL,
    "duration" VARCHAR(50) NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "status" "payment_status" NOT NULL,
    "type" "payment_type" NOT NULL,
    "amount" DECIMAL(8,2) NOT NULL,
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(6),
    "intervention_id" INTEGER NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" INTEGER NOT NULL,
    "permission" VARCHAR(50) NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" INTEGER NOT NULL,
    "label" VARCHAR(50) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "role_id" INTEGER NOT NULL,
    "permissions_id" INTEGER NOT NULL,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_id","permissions_id")
);

-- CreateTable
CREATE TABLE "user_full_address" (
    "user_id" INTEGER NOT NULL,
    "full_address_id" INTEGER NOT NULL,

    CONSTRAINT "user_full_address_pkey" PRIMARY KEY ("user_id","full_address_id")
);

-- CreateTable
CREATE TABLE "user_permission" (
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "user_permission_pkey" PRIMARY KEY ("user_id","permission_id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "zone" (
    "id" INTEGER NOT NULL,
    "coordinates" geometry NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "created_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(6),
    "deleted_on" TIMESTAMP(6),

    CONSTRAINT "zone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_user_email_key" ON "app_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "company_info_full_address_id_key" ON "company_info"("full_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "full_address_zone_id_key" ON "full_address"("zone_id");

-- AddForeignKey
ALTER TABLE "bike" ADD CONSTRAINT "bike_id_1_fkey" FOREIGN KEY ("id_1") REFERENCES "bike_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bike" ADD CONSTRAINT "bike_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "bike_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bike" ADD CONSTRAINT "bike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bike_model" ADD CONSTRAINT "bike_model_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "bike_brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "intervention"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "company_info" ADD CONSTRAINT "company_info_full_address_id_fkey" FOREIGN KEY ("full_address_id") REFERENCES "full_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "intervention"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "full_address" ADD CONSTRAINT "full_address_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zone"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "bike"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "interval_"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "intervention" ADD CONSTRAINT "intervention_mechanic_id_fkey" FOREIGN KEY ("mechanic_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "intervention"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permissions_id_fkey" FOREIGN KEY ("permissions_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_full_address" ADD CONSTRAINT "user_full_address_full_address_id_fkey" FOREIGN KEY ("full_address_id") REFERENCES "full_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_full_address" ADD CONSTRAINT "user_full_address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
