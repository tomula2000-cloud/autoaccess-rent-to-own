import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SiteHeader from "@/components/site-header";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "border-green-200 bg-green-50 text-green-800";
    case "UNDER_OFFER":
      return "border-orange-200 bg-orange-50 text-orange-800";
    case "SOLD":
      return "border-red-200 bg-red-50 text-red-800";
    default:
      return "border-gray-200 bg-gray-50 text-gray-800";
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatTransmission(value: string) {
  return value === "AUTOMATIC" ? "Automatic" : "Manual";
}

function formatFuelType(value: string) {
  return value === "DIESEL" ? "Diesel" : "Petrol";
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const vehicle = await prisma.vehicleOffer.findUnique({
    where: { slug },
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
    },
  });

  if (!vehicle) {
    notFound();
  }

  const galleryImages = [
    vehicle.featuredImage,
    vehicle.galleryImage1,
    vehicle.galleryImage2,
    vehicle.galleryImage3,
    vehicle.galleryImage4,
  ].filter(Boolean) as string[];

  const applyHref = `/apply?vehicle=${encodeURIComponent(vehicle.title)}`;

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      <SiteHeader />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <Link
              href="/gallery"
              className="inline-flex rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50"
            >
              Back to Gallery
            </Link>

            <Link
              href={applyHref}
              className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Apply Now
            </Link>
          </div>

          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative">
                <div className="aspect-[4/3] w-full bg-gray-100 lg:h-full lg:min-h-[520px]">
                  <img
                    src={vehicle.featuredImage}
                    alt={vehicle.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="absolute left-6 top-6 rounded-full bg-black/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  {vehicle.rentToOwnLabel}
                </div>

                <div className="absolute right-6 top-6">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                      vehicle.status
                    )}`}
                  >
                    {formatStatus(vehicle.status)}
                  </span>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
                  Rent To Own Vehicle Offer
                </p>

                <h1 className="mt-3 text-4xl font-bold leading-tight">
                  {vehicle.title}
                </h1>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700">
                      Deposit Amount
                    </p>
                    <p className="mt-2 text-2xl font-bold text-blue-900">
                      {vehicle.depositAmount}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                      Monthly Payment
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-900">
                      {vehicle.monthlyPayment}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                      Term
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">{vehicle.term}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                      Year Model
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">
                      {vehicle.yearModel}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                      Mileage
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">{vehicle.mileage}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                      Transmission
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">
                      {formatTransmission(vehicle.transmission)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                      Fuel Type
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">
                      {formatFuelType(vehicle.fuelType)}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href={applyHref}
                    className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Apply For This Offer
                  </Link>

                  <Link
                    href="/gallery"
                    className="inline-flex rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    View More Offers
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {galleryImages.length > 1 ? (
            <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
                Vehicle Gallery
              </p>

              <h2 className="mt-3 text-3xl font-bold">More vehicle images</h2>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((image, index) => (
                  <div
                    key={`${vehicle.id}-${index}`}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
                  >
                    <img
                      src={image}
                      alt={`${vehicle.title} gallery image ${index + 1}`}
                      className="h-72 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}