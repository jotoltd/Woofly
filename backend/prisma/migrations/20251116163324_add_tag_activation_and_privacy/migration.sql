-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "activationCode" TEXT NOT NULL,
    "tagCode" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" TIMESTAMP(3),
    "userId" TEXT,
    "petId" TEXT,
    "batchNumber" TEXT,
    "productionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN "showBreed" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Pet" ADD COLUMN "showAge" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Pet" ADD COLUMN "showMedicalInfo" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Pet" ADD COLUMN "showVetInfo" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Pet" ADD COLUMN "showOwnerPhone" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Pet" ADD COLUMN "showOwnerEmail" BOOLEAN NOT NULL DEFAULT true;

-- Make qrCode and nfcId nullable for backwards compatibility
ALTER TABLE "Pet" ALTER COLUMN "qrCode" DROP NOT NULL;
ALTER TABLE "Pet" ALTER COLUMN "nfcId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_activationCode_key" ON "Tag"("activationCode");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tagCode_key" ON "Tag"("tagCode");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_petId_key" ON "Tag"("petId");

-- CreateIndex
CREATE INDEX "Tag_activationCode_idx" ON "Tag"("activationCode");

-- CreateIndex
CREATE INDEX "Tag_tagCode_idx" ON "Tag"("tagCode");

-- CreateIndex
CREATE INDEX "Tag_userId_idx" ON "Tag"("userId");

-- CreateIndex
CREATE INDEX "Tag_isActivated_idx" ON "Tag"("isActivated");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
