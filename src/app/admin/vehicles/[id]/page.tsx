import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminVehicleForm from "@/components/admin-vehicle-form";
import AdminHeader from "@/components/admin-header";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditVehiclePage({ params }: PageProps) {
  const { id } = await params;

  const vehicle = await prisma.vehicleOffer.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      featuredImage: true,
      galleryImage1: true,
      galleryImage2: true,
      galleryImage3: true,
      galleryImage4: true,
      rentToOwnLabel: true,
      depositAmount: true,
      monthlyPayment: true,
      term: true,
      yearModel: true,
      mileage: true,
      transmission: true,
      fuelType: true,
      status: true,
      featured: true,
      sortOrder: true,
    },
  });

  if (!vehicle) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black">
      <div className="mx-auto max-w-5xl">
        <AdminHeader
          title="Edit Vehicle Offer"
          description="Update rent-to-own vehicle details, offer status, featured visibility, and image presentation."
        />

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <AdminVehicleForm
            mode="edit"
            vehicle={{
              ...vehicle,
              transmission:
                vehicle.transmission === "AUTOMATIC" ? "AUTOMATIC" : "MANUAL",
              fuelType: vehicle.fuelType === "DIESEL" ? "DIESEL" : "PETROL",
              status:
                vehicle.status === "UNDER_OFFER"
                  ? "UNDER_OFFER"
                  : vehicle.status === "SOLD"
                  ? "SOLD"
                  : "AVAILABLE",
            }}
          />
        </div>
      </div>
    </main>
  );
}