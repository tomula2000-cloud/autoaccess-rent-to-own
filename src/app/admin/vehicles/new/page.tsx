import AdminVehicleForm from "@/components/admin-vehicle-form";
import AdminHeader from "@/components/admin-header";

export default function AdminNewVehiclePage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black">
      <div className="mx-auto max-w-5xl">
        <AdminHeader
          title="Add New Vehicle Offer"
          description="Create a new rent-to-own vehicle listing for the gallery and featured homepage offers section."
        />

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <AdminVehicleForm mode="create" />
        </div>
      </div>
    </main>
  );
}