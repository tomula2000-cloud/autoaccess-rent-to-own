import Link from "next/link";
import { prisma } from "@/lib/prisma";

type FeaturedOffer = {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  depositAmount: string;
  monthlyPayment: string;
  yearModel: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  status: string;
};

export default async function HomeFeaturedOffers() {
  const featuredOffers: FeaturedOffer[] = await prisma.vehicleOffer.findMany({
    where: {
      featured: true,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      featuredImage: true,
      depositAmount: true,
      monthlyPayment: true,
      yearModel: true,
      mileage: true,
      transmission: true,
      fuelType: true,
      status: true,
    },
  });

  if (featuredOffers.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Featured Offers
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
              Selected vehicle opportunities
            </h2>
          </div>

          <Link
            href="/gallery"
            className="inline-flex rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-blue-600 hover:text-blue-600"
          >
            View all vehicles
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {featuredOffers.map((offer: FeaturedOffer) => (
            <article
              key={offer.id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={offer.featuredImage}
                  alt={offer.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
                  {offer.yearModel}
                </p>

                <h3 className="mt-2 text-2xl font-bold text-gray-900">
                  {offer.title}
                </h3>

                <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                  <div>
                    <span className="font-semibold text-gray-900">Mileage:</span>{" "}
                    {offer.mileage}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">
                      Transmission:
                    </span>{" "}
                    {offer.transmission}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Fuel:</span>{" "}
                    {offer.fuelType}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Status:</span>{" "}
                    {offer.status}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 rounded-2xl bg-gray-50 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Deposit</span>
                    <span className="font-bold text-gray-900">
                      {offer.depositAmount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Monthly</span>
                    <span className="font-bold text-blue-700">
                      {offer.monthlyPayment}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/gallery/${offer.slug}`}
                    className="inline-flex w-full justify-center rounded-full bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    View vehicle
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}