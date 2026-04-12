import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

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

export default async function HomeFeaturedOffers() {
  const featuredOffers = await prisma.vehicleOffer.findMany({
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
      term: true,
      yearModel: true,
      status: true,
    },
  });

  if (featuredOffers.length === 0) {
    return null;
  }

  return (
    <section className="bg-white px-6 py-20 text-black">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
              Latest Rent To Own Offers
            </p>
            <h2 className="mt-3 text-4xl font-bold md:text-5xl">
              Featured vehicle opportunities
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              Explore our latest rent-to-own offers with structured deposits,
              monthly payment options, and carefully presented vehicle details.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            View More
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {featuredOffers.map((offer) => (
            <article
              key={offer.id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <Link href={`/gallery/${offer.slug}`} className="block">
                <div className="relative">
                  <img
                    src={offer.featuredImage}
                    alt={offer.title}
                    className="h-72 w-full object-cover"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-black/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    Featured Offer
                  </div>

                  <div className="absolute right-4 top-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                        offer.status
                      )}`}
                    >
                      {formatStatus(offer.status)}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {offer.title}
                  </h3>

                  <Link
                    href={`/gallery/${offer.slug}`}
                    className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    View
                  </Link>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                      Deposit
                    </p>
                    <p className="mt-2 text-lg font-bold text-blue-900">
                      {offer.depositAmount}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                      Monthly
                    </p>
                    <p className="mt-2 text-lg font-bold text-emerald-900">
                      {offer.monthlyPayment}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                      Term
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">{offer.term}</p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                      Year Model
                    </p>
                    <p className="mt-2 font-semibold text-gray-900">
                      {offer.yearModel}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}