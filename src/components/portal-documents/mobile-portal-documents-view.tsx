type PageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function MobilePortalDocumentsView({
  searchParams,
}: PageProps) {
  const params = searchParams ? await searchParams : {};

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-black">
      <div className="mx-auto max-w-md rounded-[24px] border border-white bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-500">
          Auto Access Client Portal
        </p>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Upload Your Documents
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Your mobile documents view is being prepared.
        </p>

        {params.success ? (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-900">
            {params.success}
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
            {params.error}
          </div>
        ) : null}
      </div>
    </main>
  );
}