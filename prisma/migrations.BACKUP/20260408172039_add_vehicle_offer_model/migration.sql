-- CreateTable
CREATE TABLE "VehicleOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VehicleOffer_slug_key" ON "VehicleOffer"("slug");
