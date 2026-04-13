import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  searchParams?: Promise<{
    status?: string;
    q?: string;
  }>;
};

type AdminApplicationRow = {
  id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  identityType: string | null;
  identityNumber: string | null;
  employmentStatus: string;
  monthlyIncome: string;
  preferredVehicle: string;
  status: string;
  createdAt: Date;
};

const STATUS_OPTIONS = [
  "ALL",
  "APPLICATION_RECEIVED",
  "PRE_QUALIFICATION_REVIEW",
  "PRE_QUALIFIED",
  "AWAITING_DOCUMENTS",
  "DOCUMENTS_SUBMITTED",
  "DOCUMENTS_UNDER_REVIEW",
  "ADDITIONAL_DOCUMENTS_REQUIRED",
  "APPROVED_IN_PRINCIPLE",
  "CONTRACT_REQUESTED",
  "CONTRACT_ISSUED",
  "AWAITING_INVOICE",
  "INVOICE_ISSUED",
  "AWAITING_PAYMENT",
  "PAYMENT_UNDER_VERIFICATION",
  "PAYMENT_CONFIRMED",
  "COMPLETED",
  "DECLINED",
] as const;

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatIdentityType(value: string | null) {
  if (!value) return "—";
  if (value === "SA_ID") return "SA ID";
  if (value === "PASSPORT") return "Passport";
  return value;
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "APPLICATION_RECEIVED":
      return "border-blue-200 bg-blue-50 text-blue-800";
    case "PRE_QUALIFICATION_REVIEW":
      return "border-indigo-200 bg-indigo-50 text-indigo-800";
    case "PRE_QUALIFIED":
      return "border-sky-200 bg-sky-50 text-sky-800";
    case "AWAITING_DOCUMENTS":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "DOCUMENTS_SUBMITTED":
      return "border-cyan-200 bg-cyan-50 text-cyan-800";
    case "DOCUMENTS_UNDER_REVIEW":
      return "border-violet-200 bg-violet-50 text-violet-800";
    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return "border-orange-200 bg-orange-50 text-orange-800";
    case "APPROVED_IN_PRINCIPLE":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "CONTRACT_REQUESTED":
      return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800";
    case "CONTRACT_ISSUED":
      return "border-purple-200 bg-purple-50 text-purple-800";
    case "AWAITING_INVOICE":
      return "border-violet-200 bg-violet-50 text-violet-800";
    case "INVOICE_ISSUED":
      return "border-purple-200 bg-purple-50 text-purple-800";
    case "AWAITING_PAYMENT":
      return "border-yellow-200 bg-yellow-50 text-yellow-800";
    case "PAYMENT_UNDER_VERIFICATION":
      return "border-teal-200 bg-teal-50 text-teal-800";
    case "PAYMENT_CONFIRMED":
      return "border-green-200 bg-green-50 text-green-800";
    case "COMPLETED":
      return "border-lime-200 bg-lime-50 text-lime-800";
    case "DECLINED":
      return "border-red-200 bg-red-50 text-red-800";
    default:
      return "border-gray-200 bg-gray-50 text-gray-800";
  }
}

function getSummaryCount(
  applications: AdminApplicationRow[],
  statuses: string[]
) {
  return applications.filter((item) => statuses.includes(item.status)).length;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as
    | {
        email?: string;
        role?: string;
        loginType?: string;
      }
    | undefined;

  if (
    !sessionUser?.email ||
    sessionUser.role !== "ADMIN" ||
    sessionUser.loginType !== "ADMIN"
  ) {
    redirect("/admin-login");
  }

  const params = searchParams ? await searchParams : {};
  const activeStatus = params.status || "ALL";
  const searchQuery = (params.q || "").trim();

  const allApplications: AdminApplicationRow[] =
    await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        referenceNumber: true,
        fullName: true,
        email: true,
        phone: true,
        identityType: true,
        identityNumber: true,
        employmentStatus: true,
        monthlyIncome: true,
        preferredVehicle: true,
        status: true,
        createdAt: true,
      },
    });

  const applications = allApplications.filter(
    (application: AdminApplicationRow) => {
      const matchesStatus =
        activeStatus === "ALL" ? true : application.status === activeStatus;

      const haystack = [
        application.referenceNumber,
        application.fullName,
        application.email,
        application.phone,
        application.identityNumber || "",
        application.preferredVehicle,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchQuery
        ? haystack.includes(searchQuery.toLowerCase())
        : true;

      return matchesStatus && matchesSearch;
    }
  );

  const totalCount = allApplications.length;
  const docsCount = getSummaryCount(allApplications, [
    "AWAITING_DOCUMENTS",
    "ADDITIONAL_DOCUMENTS_REQUIRED",
  ]);
  const reviewCount = getSummaryCount(allApplications, [
    "PRE_QUALIFICATION_REVIEW",
    "DOCUMENTS_UNDER_REVIEW",
    "PAYMENT_UNDER_VERIFICATION",
  ]);
  const completedCount = getSummaryCount(allApplications, [
    "COMPLETED",
    "PAYMENT_CONFIRMED",
  ]);

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              Auto Access Admin
            </p>

            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Submitted Applications
            </h1>

            <p className="max-w-3xl text-lg text-gray-600">
              Review applications, monitor progress stages, and manage client
              records from one professional dashboard.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/admin/vehicles"
                className="inline-flex rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50"
              >
                Manage Vehicles
              </Link>

              <Link
                href="/admin/vehicles/new"
                className="inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Add Vehicle
              </Link>
            </div>
          </div>

          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Total Applications</p>
            <p className="mt-2 text-3xl font-bold">{totalCount}</p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm text-amber-700">Needs Documents</p>
            <p className="mt-2 text-3xl font-bold text-amber-900">
              {docsCount}
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
            <p className="text-sm text-indigo-700">Under Review</p>
            <p className="mt-2 text-3xl font-bold text-indigo-900">
              {reviewCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <p className="text-sm text-green-700">Confirmed / Completed</p>
            <p className="mt-2 text-3xl font-bold text-green-900">
              {completedCount}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <form className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search by reference, full name, email, phone, ID number, or vehicle"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            />

            <input type="hidden" name="status" value={activeStatus} />

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-3">
            {STATUS_OPTIONS.map((status) => {
              const isActive = activeStatus === status;
              const href = `/admin?status=${encodeURIComponent(status)}${
                searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""
              }`;

              return (
                <Link
                  key={status}
                  href={href}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {status === "ALL" ? "All" : formatStatus(status)}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{applications.length}</span>{" "}
            application{applications.length === 1 ? "" : "s"}
            {activeStatus !== "ALL" ? (
              <>
                {" "}
                for status{" "}
                <span className="font-semibold">
                  {formatStatus(activeStatus)}
                </span>
              </>
            ) : null}
            {searchQuery ? (
              <>
                {" "}
                matching <span className="font-semibold">"{searchQuery}"</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {applications.length === 0 ? (
            <div className="p-6 text-sm text-gray-600">
              No applications found for the current filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Reference</th>
                    <th className="px-6 py-4 font-semibold">Full Name</th>
                    <th className="px-6 py-4 font-semibold">Phone</th>
                    <th className="px-6 py-4 font-semibold">Identity</th>
                    <th className="px-6 py-4 font-semibold">Employment</th>
                    <th className="px-6 py-4 font-semibold">Income</th>
                    <th className="px-6 py-4 font-semibold">Vehicle</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Created</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application: AdminApplicationRow) => (
                    <tr
                      key={application.id}
                      className="border-t border-gray-200 align-top"
                    >
                      <td className="px-6 py-4 font-semibold whitespace-nowrap">
                        {application.referenceNumber}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold">
                          {application.fullName}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {application.email}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {application.phone}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">
                          {formatIdentityType(application.identityType)}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {application.identityNumber || "—"}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {application.employmentStatus}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {application.monthlyIncome}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {application.preferredVehicle}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                            application.status
                          )}`}
                        >
                          {formatStatus(application.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(application.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/${application.id}`}
                          className="inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                        >
                          View
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