-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pet" (
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
    "isLost" BOOLEAN NOT NULL DEFAULT false,
    "lostDate" DATETIME,
    "lastSeenLocation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Pet" ("age", "breed", "createdAt", "description", "id", "imageUrl", "medicalInfo", "name", "nfcId", "ownerEmail", "ownerPhone", "qrCode", "species", "updatedAt", "userId", "vetName", "vetPhone") SELECT "age", "breed", "createdAt", "description", "id", "imageUrl", "medicalInfo", "name", "nfcId", "ownerEmail", "ownerPhone", "qrCode", "species", "updatedAt", "userId", "vetName", "vetPhone" FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
CREATE UNIQUE INDEX "Pet_qrCode_key" ON "Pet"("qrCode");
CREATE UNIQUE INDEX "Pet_nfcId_key" ON "Pet"("nfcId");
CREATE INDEX "Pet_qrCode_idx" ON "Pet"("qrCode");
CREATE INDEX "Pet_nfcId_idx" ON "Pet"("nfcId");
CREATE INDEX "Pet_userId_idx" ON "Pet"("userId");
CREATE INDEX "Pet_isLost_idx" ON "Pet"("isLost");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
