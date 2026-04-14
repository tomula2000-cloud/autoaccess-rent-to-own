/*
  Warnings:

  - You are about to drop the column `invoiceUrl` on the `Application` table. All the data in the column will be lost.
  - Made the column `updatedById` on table `StatusLog` required. This step will fail if there are existing NULL values in that column.

*/
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
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'APPLICATION_RECEIVED',
    "identityType" TEXT,
    "identityNumber" TEXT,
    "salaryDate" TEXT,
    "physicalAddress" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicantId", "createdAt", "email", "employmentStatus", "fullName", "id", "identityNumber", "identityType", "monthlyIncome", "notes", "phone", "physicalAddress", "preferredVehicle", "referenceNumber", "salaryDate", "status", "termsAccepted", "updatedAt") SELECT "applicantId", "createdAt", "email", "employmentStatus", "fullName", "id", "identityNumber", "identityType", "monthlyIncome", "notes", "phone", "physicalAddress", "preferredVehicle", "referenceNumber", "salaryDate", "status", "termsAccepted", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_referenceNumber_key" ON "Application"("referenceNumber");
CREATE TABLE "new_StatusLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT NOT NULL,
    "note" TEXT,
    "updatedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StatusLog_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StatusLog_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StatusLog" ("applicationId", "createdAt", "fromStatus", "id", "note", "toStatus", "updatedById") SELECT "applicationId", "createdAt", "fromStatus", "id", "note", "toStatus", "updatedById" FROM "StatusLog";
DROP TABLE "StatusLog";
ALTER TABLE "new_StatusLog" RENAME TO "StatusLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
