import Link from "next/link";

type AdminHeaderProps = {
  title: string;
  description?: string;
};

export default function AdminHeader({
  title,
  description,
}: AdminHeaderProps) {
  return (
    <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
            Auto Access Admin
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">{title}</h1>

          {description ? (
            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              {description}
            </p>
          ) : null}
        </div>

        <nav className="flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/vehicles"
            className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50"
          >
            Vehicles
          </Link>

          <Link
            href="/admin/vehicles/new"
            className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Add Vehicle
          </Link>
        </nav>
      </div>
    </div>
  );
}