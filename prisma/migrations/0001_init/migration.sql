-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLICATION_RECEIVED', 'PRE_QUALIFICATION_REVIEW', 'PRE_QUALIFIED', 'AWAITING_DOCUMENTS', 'DOCUMENTS_SUBMITTED', 'DOCUMENTS_UNDER_REVIEW', 'ADDITIONAL_DOCUMENTS_REQUIRED', 'APPROVED_IN_PRINCIPLE', 'CONTRACT_REQUESTED', 'CONTRACT_ISSUED', 'AWAITING_INVOICE', 'CONTRACT_EXPIRED', 'CONTRACT_CANCELLED', 'INVOICE_ISSUED', 'AWAITING_PAYMENT', 'PAYMENT_UNDER_VERIFICATION', 'PAYMENT_CONFIRMED', 'COMPLETED', 'DECLINED');

-- CreateEnum
CREATE TYPE "VehicleOfferStatus" AS ENUM ('AVAILABLE', 'UNDER_OFFER', 'SOLD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
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
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLICATION_RECEIVED',
    "identityType" TEXT,
    "identityNumber" TEXT,
    "salaryDate" TEXT,
    "physicalAddress" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "approvalValidUntil" TIMESTAMP(3),
    "reapplyAllowedAt" TIMESTAMP(3),
    "contractRequestedAt" TIMESTAMP(3),
    "contractIssuedAt" TIMESTAMP(3),
    "contractExpiresAt" TIMESTAMP(3),
    "contractCancelledAt" TIMESTAMP(3),
    "contractAccepted" BOOLEAN NOT NULL DEFAULT false,
    "contractAcceptedAt" TIMESTAMP(3),
    "contractAcceptedName" TEXT,
    "contractVehicleTitle" TEXT,
    "contractVehicleImage" TEXT,
    "contractVehicleYearModel" TEXT,
    "contractVehicleMileage" TEXT,
    "contractVehicleTransmission" TEXT,
    "contractVehicleFuelType" TEXT,
    "contractDepositAmount" TEXT,
    "contractLicensingFee" TEXT,
    "contractMonthlyPayment" TEXT,
    "contractTotalPayableNow" TEXT,
    "contractTerm" TEXT,
    "contractClientFullName" TEXT,
    "contractClientEmail" TEXT,
    "contractClientPhone" TEXT,
    "contractClientIdentityType" TEXT,
    "contractClientIdentityNumber" TEXT,
    "contractClientAddress" TEXT,
    "contractTerms" TEXT,
    "clientBankName" TEXT,
    "clientAccountHolder" TEXT,
    "clientAccountNumber" TEXT,
    "clientAccountType" TEXT,
    "clientBranchCode" TEXT,
    "clientBankSubmittedAt" TIMESTAMP(3),
    "clientBankConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusLog" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fromStatus" "ApplicationStatus",
    "toStatus" "ApplicationStatus" NOT NULL,
    "note" TEXT,
    "updatedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StatusLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleOffer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "featuredImage" TEXT NOT NULL,
    "galleryImage1" TEXT,
    "galleryImage2" TEXT,
    "galleryImage3" TEXT,
    "galleryImage4" TEXT,
    "rentToOwnLabel" TEXT NOT NULL DEFAULT 'Available for Rent to Own',
    "depositAmount" TEXT NOT NULL,
    "monthlyPayment" TEXT NOT NULL,
    "term" TEXT NOT NULL DEFAULT '54 Months',
    "yearModel" TEXT NOT NULL,
    "mileage" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "status" "VehicleOfferStatus" NOT NULL DEFAULT 'AVAILABLE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Application_referenceNumber_key" ON "Application"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleOffer_slug_key" ON "VehicleOffer"("slug");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_selectedVehicleId_fkey" FOREIGN KEY ("selectedVehicleId") REFERENCES "VehicleOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusLog" ADD CONSTRAINT "StatusLog_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusLog" ADD CONSTRAINT "StatusLog_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

