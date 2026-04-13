import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminHeader from "@/components/admin-header";

type AdminVehicleRow = {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  depositAmount: string;
  monthlyPayment: string;
  yearModel: string;
  status: string;
  featured: boolean;
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

export default async function AdminVehiclesPage() {
  const vehicles: AdminVehicleRow[] = await prisma.vehicleOffer.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      featuredImage: true,
      depositAmount: true,
      monthlyPayment: true,
      yearModel: true,
      status: true,
      featured: true,
    },
  });

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black">
      <div className="mx-auto max-w-7xl">
        <AdminHeader
          title="Vehicle Offers"
          description="Manage rent-to-own vehicle listings, featured homepage offers, and offer status presentation."
        />

        <div className="mb-6 flex justify-end">
          <Link
            href="/admin/vehicles/new"
            className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Add New Vehicle
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {vehicles.length === 0 ? (
            <div className="p-8 text-sm text-gray-600">
              No vehicle offers added yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Vehicle</th>
                    <th className="px-6 py-4 font-semibold">Slug</th>
                    <th className="px-6 py-4 font-semibold">Deposit</th>
                    <th className="px-6 py-4 font-semibold">Monthly</th>
                    <th className="px-6 py-4 font-semibold">Year</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Featured</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {vehicles.map((vehicle: AdminVehicleRow) => (
                    <tr
                      key={vehicle.id}
                      className="border-t border-gray-200 align-top"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={vehicle.featuredImage}
                            alt={vehicle.title}
                            className="h-16 w-24 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-semibold">{vehicle.title}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {vehicle.slug}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {vehicle.depositAmount}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {vehicle.monthlyPayment}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {vehicle.yearModel}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                            vehicle.status
                          )}`}
                        >
                          {formatStatus(vehicle.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {vehicle.featured ? (
                          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                            Featured
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/vehicles/${vehicle.id}`}
                          className="inline-flex rounded-lg bg-black px-4 py-2 font-semibold text-white hover:bg-gray-800"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}