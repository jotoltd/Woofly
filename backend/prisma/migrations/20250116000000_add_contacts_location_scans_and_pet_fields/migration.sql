-- AlterTable
ALTER TABLE "Pet" ADD COLUMN "sex" TEXT;
ALTER TABLE "Pet" ADD COLUMN "color" TEXT;

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationScan" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contact_petId_idx" ON "Contact"("petId");

-- CreateIndex
CREATE INDEX "Contact_priority_idx" ON "Contact"("priority");

-- CreateIndex
CREATE INDEX "LocationScan_petId_idx" ON "LocationScan"("petId");

-- CreateIndex
CREATE INDEX "LocationScan_createdAt_idx" ON "LocationScan"("createdAt");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationScan" ADD CONSTRAINT "LocationScan_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
