-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "breed" TEXT,
    "age" INTEGER,
    "description" TEXT,
    "imageUrl" TEXT,
    "qrCode" TEXT NOT NULL,
    "nfcId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ownerPhone" TEXT,
    "ownerEmail" TEXT,
    "vetName" TEXT,
    "vetPhone" TEXT,
    "medicalInfo" TEXT,
    "isLost" BOOLEAN NOT NULL DEFAULT false,
    "lostDate" TIMESTAMP(3),
    "lastSeenLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_qrCode_key" ON "Pet"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_nfcId_key" ON "Pet"("nfcId");

-- CreateIndex
CREATE INDEX "Pet_qrCode_idx" ON "Pet"("qrCode");

-- CreateIndex
CREATE INDEX "Pet_nfcId_idx" ON "Pet"("nfcId");

-- CreateIndex
CREATE INDEX "Pet_userId_idx" ON "Pet"("userId");

-- CreateIndex
CREATE INDEX "Pet_isLost_idx" ON "Pet"("isLost");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
