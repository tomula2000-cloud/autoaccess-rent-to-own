type PageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function MobilePortalLoginView({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const error = params.error || "";

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-black">
      <div className="mx-auto max-w-md rounded-[24px] border border-white bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-500">
          Auto Access Portal
        </p>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Client Portal Login
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Log in securely to continue your application.
        </p>

        <form action="/api/portal-login" method="post" className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reference Number
            </label>
            <input
              type="text"
              name="referenceNumber"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
              placeholder="Enter your reference number"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
              placeholder="Enter your email address"
              required
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login to Portal
          </button>
        </form>
      </div>
    </main>
  );
}