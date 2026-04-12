-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicantId" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "monthlyIncome" TEXT NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "preferredVehicle" TEXT NOT NULL,
    "selectedVehicleId" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'APPLICATION_RECEIVED',
    "identityType" TEXT,
    "identityNumber" TEXT,
    "salaryDate" TEXT,
    "physicalAddress" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "approvalValidUntil" DATETIME,
    "reapplyAllowedAt" DATETIME,
    "contractRequestedAt" DATETIME,
    "contractIssuedAt" DATETIME,
    "contractExpiresAt" DATETIME,
    "contractCancelledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Application_selectedVehicleId_fkey" FOREIGN KEY ("selectedVehicleId") REFERENCES "VehicleOffer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicantId", "approvalValidUntil", "createdAt", "email", "employmentStatus", "fullName", "id", "identityNumber", "identityType", "monthlyIncome", "notes", "phone", "physicalAddress", "preferredVehicle", "reapplyAllowedAt", "referenceNumber", "salaryDate", "status", "termsAccepted", "updatedAt") SELECT "applicantId", "approvalValidUntil", "createdAt", "email", "employmentStatus", "fullName", "id", "identityNumber", "identityType", "monthlyIncome", "notes", "phone", "physicalAddress", "preferredVehicle", "reapplyAllowedAt", "referenceNumber", "salaryDate", "status", "termsAccepted", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_referenceNumber_key" ON "Application"("referenceNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
