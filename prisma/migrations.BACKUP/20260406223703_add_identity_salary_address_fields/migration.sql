/*
  Warnings:

  - Made the column `employmentStatus` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `monthlyIncome` on table `Application` required. This step will fail if there are existing NULL values in that column.
  - Made the column `preferredVehicle` on table `Application` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referenceNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "identityType" TEXT,
    "identityNumber" TEXT,
    "monthlyIncome" TEXT NOT NULL,
    "salaryDate" TEXT,
    "employmentStatus" TEXT NOT NULL,
    "preferredVehicle" TEXT NOT NULL,
    "physicalAddress" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'APPLICATION_RECEIVED',
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "invoiceUrl" TEXT,
    "applicantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("applicantId", "createdAt", "email", "employmentStatus", "fullName", "id", "invoiceUrl", "monthlyIncome", "notes", "phone", "preferredVehicle", "referenceNumber", "status", "termsAccepted", "updatedAt") SELECT "applicantId", "createdAt", "email", "employmentStatus", "fullName", "id", "invoiceUrl", "monthlyIncome", "notes", "phone", "preferredVehicle", "referenceNumber", "status", "termsAccepted", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE UNIQUE INDEX "Application_referenceNumber_key" ON "Application"("referenceNumber");
CREATE TABLE "new_StatusLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationId" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT NOT NULL,
    "note" TEXT,
    "updatedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StatusLog_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StatusLog" ("applicationId", "createdAt", "fromStatus", "id", "note", "toStatus", "updatedById") SELECT "applicationId", "createdAt", "fromStatus", "id", "note", "toStatus", "updatedById" FROM "StatusLog";
DROP TABLE "StatusLog";
ALTER TABLE "new_StatusLog" RENAME TO "StatusLog";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "fullName", "id", "passwordHash", "phone", "role", "updatedAt") SELECT "createdAt", "email", "fullName", "id", "passwordHash", "phone", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
