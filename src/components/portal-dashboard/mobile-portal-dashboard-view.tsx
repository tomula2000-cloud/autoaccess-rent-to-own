type MobilePortalDashboardViewProps = {
  referenceNumber: string;
};

export default function MobilePortalDashboardView({
  referenceNumber,
}: MobilePortalDashboardViewProps) {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-black">
      <div className="mx-auto max-w-md rounded-[24px] border border-white bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-500">
          Auto Access Client Portal
        </p>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Track Your Application
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Your portal dashboard mobile view is being prepared.
        </p>

        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
            Reference Number
          </p>
          <p className="mt-2 text-sm font-semibold text-[#1b2345]">
            {referenceNumber}
          </p>
        </div>
      </div>
    </main>
  );
}