"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AdminVehicleFormProps = {
  mode: "create" | "edit";
  vehicle?: {
    id: string;
    title: string;
    slug: string;
    featuredImage: string;
    galleryImage1: string | null;
    galleryImage2: string | null;
    galleryImage3: string | null;
    galleryImage4: string | null;
    rentToOwnLabel: string;
    depositAmount: string;
    monthlyPayment: string;
    term: string;
    yearModel: string;
    mileage: string;
    transmission: "MANUAL" | "AUTOMATIC";
    fuelType: "PETROL" | "DIESEL";
    status: "AVAILABLE" | "UNDER_OFFER" | "SOLD";
    featured: boolean;
    sortOrder: number;
  };
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type UploadField =
  | "featuredImage"
  | "galleryImage1"
  | "galleryImage2"
  | "galleryImage3"
  | "galleryImage4";

export default function AdminVehicleForm({
  mode,
  vehicle,
}: AdminVehicleFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(vehicle?.title ?? "");
  const [slug, setSlug] = useState(vehicle?.slug ?? "");
  const [featuredImage, setFeaturedImage] = useState(vehicle?.featuredImage ?? "");
  const [galleryImage1, setGalleryImage1] = useState(vehicle?.galleryImage1 ?? "");
  const [galleryImage2, setGalleryImage2] = useState(vehicle?.galleryImage2 ?? "");
  const [galleryImage3, setGalleryImage3] = useState(vehicle?.galleryImage3 ?? "");
  const [galleryImage4, setGalleryImage4] = useState(vehicle?.galleryImage4 ?? "");
  const [rentToOwnLabel, setRentToOwnLabel] = useState(
    vehicle?.rentToOwnLabel ?? "Available for Rent to Own"
  );
  const [depositAmount, setDepositAmount] = useState(vehicle?.depositAmount ?? "");
  const [monthlyPayment, setMonthlyPayment] = useState(
    vehicle?.monthlyPayment ?? ""
  );
  const [term, setTerm] = useState(vehicle?.term ?? "54 Months");
  const [yearModel, setYearModel] = useState(vehicle?.yearModel ?? "");
  const [mileage, setMileage] = useState(vehicle?.mileage ?? "");
  const [transmission, setTransmission] = useState<"MANUAL" | "AUTOMATIC">(
    vehicle?.transmission ?? "MANUAL"
  );
  const [fuelType, setFuelType] = useState<"PETROL" | "DIESEL">(
    vehicle?.fuelType ?? "PETROL"
  );
  const [status, setStatus] = useState<
    "AVAILABLE" | "UNDER_OFFER" | "SOLD"
  >(vehicle?.status ?? "AVAILABLE");
  const [featured, setFeatured] = useState(vehicle?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(String(vehicle?.sortOrder ?? 0));

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingField, setUploadingField] = useState<UploadField | null>(null);

  const previewSlug = useMemo(() => slug || slugify(title), [slug, title]);

  async function uploadImage(field: UploadField, file: File | null) {
    if (!file) return;

    setMessage("");
    setUploadingField(field);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads/vehicle-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Image upload failed.");
        setUploadingField(null);
        return;
      }

      const url = String(data.url || "");

      if (field === "featuredImage") setFeaturedImage(url);
      if (field === "galleryImage1") setGalleryImage1(url);
      if (field === "galleryImage2") setGalleryImage2(url);
      if (field === "galleryImage3") setGalleryImage3(url);
      if (field === "galleryImage4") setGalleryImage4(url);

      setUploadingField(null);
    } catch (error) {
      console.error(error);
      setMessage("Image upload failed.");
      setUploadingField(null);
    }
  }

  function clearImage(field: UploadField) {
    if (field === "featuredImage") setFeaturedImage("");
    if (field === "galleryImage1") setGalleryImage1("");
    if (field === "galleryImage2") setGalleryImage2("");
    if (field === "galleryImage3") setGalleryImage3("");
    if (field === "galleryImage4") setGalleryImage4("");
  }

  async function handleDeleteVehicle() {
    if (!vehicle?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle offer? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Delete failed.");
        setLoading(false);
        return;
      }

      router.push("/admin/vehicles");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Delete failed.");
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      title,
      slug: slug || slugify(title),
      featuredImage,
      galleryImage1,
      galleryImage2,
      galleryImage3,
      galleryImage4,
      rentToOwnLabel,
      depositAmount,
      monthlyPayment,
      term,
      yearModel,
      mileage,
      transmission,
      fuelType,
      status,
      featured,
      sortOrder: Number(sortOrder || 0),
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/admin/vehicles" : `/api/admin/vehicles/${vehicle?.id}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong while saving.");
        setLoading(false);
        return;
      }

      router.push("/admin/vehicles");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while saving.");
      setLoading(false);
    }
  }

  function imagePreview(url: string | null | undefined, alt: string) {
    if (!url) return null;

    return (
      <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
        <img src={url} alt={alt} className="h-40 w-full object-cover" />
      </div>
    );
  }

  const imageFields = [
    {
      label: "Gallery Image 1",
      value: galleryImage1,
      setter: setGalleryImage1,
      field: "galleryImage1" as UploadField,
    },
    {
      label: "Gallery Image 2",
      value: galleryImage2,
      setter: setGalleryImage2,
      field: "galleryImage2" as UploadField,
    },
    {
      label: "Gallery Image 3",
      value: galleryImage3,
      setter: setGalleryImage3,
      field: "galleryImage3" as UploadField,
    },
    {
      label: "Gallery Image 4",
      value: galleryImage4,
      setter: setGalleryImage4,
      field: "galleryImage4" as UploadField,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-900">
          {message}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Vehicle Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="e.g. Toyota Corolla Cross 1.8 Xi 2021"
            required
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="e.g. toyota-corolla-cross-2021"
            disabled={loading}
          />
          <p className="mt-2 text-xs text-gray-500">
            Preview URL: /gallery/{previewSlug || "vehicle-slug"}
          </p>
        </div>

        <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <label className="mb-2 block text-sm font-medium">Featured Image</label>

          <input
            type="text"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="Image URL will appear here after upload, or you may paste one manually"
            required
            disabled={loading}
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
              {uploadingField === "featuredImage" ? "Uploading..." : "Upload Featured Image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={loading || uploadingField !== null}
                onChange={(e) =>
                  uploadImage("featuredImage", e.target.files?.[0] ?? null)
                }
              />
            </label>

            {featuredImage ? (
              <button
                type="button"
                onClick={() => clearImage("featuredImage")}
                className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-800 hover:bg-red-100"
                disabled={loading}
              >
                Remove Image
              </button>
            ) : null}

            <span className="text-sm text-gray-500">
              JPG, PNG, or WEBP up to 2 MB
            </span>
          </div>

          {imagePreview(featuredImage, "Featured vehicle image")}
        </div>

        {imageFields.map((item) => (
          <div key={item.field} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <label className="mb-2 block text-sm font-medium">{item.label}</label>

            <input
              type="text"
              value={item.value ?? ""}
              onChange={(e) => item.setter(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Image URL will appear here after upload, or you may paste one manually"
              disabled={loading}
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50">
                {uploadingField === item.field ? "Uploading..." : `Upload ${item.label}`}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={loading || uploadingField !== null}
                  onChange={(e) =>
                    uploadImage(item.field, e.target.files?.[0] ?? null)
                  }
                />
              </label>

              {item.value ? (
                <button
                  type="button"
                  onClick={() => clearImage(item.field)}
                  className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-800 hover:bg-red-100"
                  disabled={loading}
                >
                  Remove Image
                </button>
              ) : null}

              <span className="text-sm text-gray-500">
                JPG, PNG, or WEBP up to 2 MB
              </span>
            </div>

            {imagePreview(item.value, item.label)}
          </div>
        ))}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">Rent To Own Label</label>
          <input
            type="text"
            value={rentToOwnLabel}
            onChange={(e) => setRentToOwnLabel(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Deposit Amount</label>
          <input
            type="text"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="e.g. R 45,000"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Monthly Payment</label>
          <input
            type="text"
            value={monthlyPayment}
            onChange={(e) => setMonthlyPayment(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="e.g. R 8,950 p/m"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Term</label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            placeholder="e.g. 54 Months"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Year Model</label>
          <input
            type="text"
            value={yearModel}
            onChange={(e) => setYearModel(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Mileage</label>
          <input
            type="text"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Transmission</label>
          <select
            value={transmission}
            onChange={(e) =>
              setTransmission(e.target.value as "MANUAL" | "AUTOMATIC")
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            disabled={loading}
          >
            <option value="MANUAL">Manual</option>
            <option value="AUTOMATIC">Automatic</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Fuel Type</label>
          <select
            value={fuelType}
            onChange={(e) =>
              setFuelType(e.target.value as "PETROL" | "DIESEL")
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            disabled={loading}
          >
            <option value="PETROL">Petrol</option>
            <option value="DIESEL">Diesel</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Offer Status</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "AVAILABLE" | "UNDER_OFFER" | "SOLD")
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            disabled={loading}
          >
            <option value="AVAILABLE">Available</option>
            <option value="UNDER_OFFER">Under Offer</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Sort Order</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
            disabled={loading}
          />
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="mt-1 h-4 w-4"
          disabled={loading}
        />
        <span className="text-sm leading-6 text-gray-700">
          Mark this vehicle as featured on the homepage.
        </span>
      </label>

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={loading || uploadingField !== null}
          className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading
            ? "Saving..."
            : mode === "create"
            ? "Create Vehicle Offer"
            : "Update Vehicle Offer"}
        </button>

        {mode === "edit" ? (
          <button
            type="button"
            onClick={handleDeleteVehicle}
            disabled={loading}
            className="inline-flex rounded-xl border border-red-300 bg-red-50 px-6 py-3 font-semibold text-red-800 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete Vehicle
          </button>
        ) : null}
      </div>
    </form>
  );
}