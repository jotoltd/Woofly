-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
