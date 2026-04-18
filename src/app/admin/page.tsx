import Link from "next/link";
import AdminBulkReminder from "@/components/admin-bulk-reminder";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  searchParams?: Promise<{ status?: string; stage?: string; q?: string }>;
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

const STATUS_GROUPS = [
  {
    key: "NEW",
    label: "New Applications",
    color: "#BA7517",
    bg: "#FAEEDA",
    border: "#EF9F27",
    textColor: "#633806",
    dot: "#BA7517",
    statuses: ["APPLICATION_RECEIVED", "PRE_QUALIFICATION_REVIEW", "PRE_QUALIFIED"],
  },
  {
    key: "DOCS",
    label: "Document Collection",
    color: "#185FA5",
    bg: "#E6F1FB",
    border: "#378ADD",
    textColor: "#042C53",
    dot: "#185FA5",
    statuses: ["AWAITING_DOCUMENTS", "DOCUMENTS_SUBMITTED", "DOCUMENTS_UNDER_REVIEW", "ADDITIONAL_DOCUMENTS_REQUIRED"],
  },
  {
    key: "APPROVAL",
    label: "Approval & Contract",
    color: "#534AB7",
    bg: "#EEEDFE",
    border: "#7F77DD",
    textColor: "#26215C",
    dot: "#534AB7",
    statuses: ["APPROVED_IN_PRINCIPLE", "CONTRACT_REQUESTED", "CONTRACT_ISSUED"],
  },
  {
    key: "PAYMENT",
    label: "Payment & Completion",
    color: "#3B6D11",
    bg: "#EAF3DE",
    border: "#639922",
    textColor: "#173404",
    dot: "#3B6D11",
    statuses: ["AWAITING_INVOICE", "INVOICE_ISSUED", "AWAITING_PAYMENT", "PAYMENT_UNDER_VERIFICATION", "PAYMENT_CONFIRMED", "COMPLETED"],
  },
  {
    key: "DECLINED",
    label: "Declined",
    color: "#A32D2D",
    bg: "#FCEBEB",
    border: "#E24B4A",
    textColor: "#501313",
    dot: "#A32D2D",
    statuses: ["DECLINED"],
  },
];

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function shortenStatus(status: string) {
  const map: Record<string, string> = {
    APPLICATION_RECEIVED: "Received",
    PRE_QUALIFICATION_REVIEW: "In Review",
    PRE_QUALIFIED: "Pre-Qualified",
    AWAITING_DOCUMENTS: "Awaiting Docs",
    DOCUMENTS_SUBMITTED: "Docs Submitted",
    DOCUMENTS_UNDER_REVIEW: "Docs in Review",
    ADDITIONAL_DOCUMENTS_REQUIRED: "More Docs Needed",
    APPROVED_IN_PRINCIPLE: "Approved",
    CONTRACT_REQUESTED: "Contract Requested",
    CONTRACT_ISSUED: "Contract Issued",
    AWAITING_INVOICE: "Awaiting Invoice",
    INVOICE_ISSUED: "Invoice Issued",
    AWAITING_PAYMENT: "Awaiting Payment",
    PAYMENT_UNDER_VERIFICATION: "Verifying Payment",
    PAYMENT_CONFIRMED: "Payment Confirmed",
    COMPLETED: "Completed",
    DECLINED: "Declined",
  };
  return map[status] || formatStatus(status);
}

function getStatusGroup(status: string) {
  return STATUS_GROUPS.find((g) => g.statuses.includes(status));
}

function getSummaryCount(applications: AdminApplicationRow[], statuses: string[]) {
  return applications.filter((item) => statuses.includes(item.status)).length;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin-login");

  const params = await (searchParams ?? Promise.resolve({}));
  const activeStage = params.stage || "";
  const activeStatus = params.status || "";
  const searchQuery = params.q || "";

  const allApplications: AdminApplicationRow[] = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, referenceNumber: true, fullName: true, email: true, phone: true,
      identityType: true, identityNumber: true, employmentStatus: true,
      monthlyIncome: true, preferredVehicle: true, status: true, createdAt: true,
    },
  });

  const activeGroup = STATUS_GROUPS.find((g) => g.key === activeStage);

  const applications = allApplications.filter((application: AdminApplicationRow) => {
    let matchesFilter = true;
    if (activeStatus) {
      matchesFilter = application.status === activeStatus;
    } else if (activeStage && activeGroup) {
      matchesFilter = activeGroup.statuses.includes(application.status);
    }
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || [
      application.referenceNumber, application.fullName, application.email,
      application.phone, application.identityNumber ?? "", application.preferredVehicle,
    ].some((field) => field.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const totalCount = allApplications.length;
  const buildHref = (stage: string, status?: string) => {
    const parts = [];
    if (stage) parts.push(`stage=${encodeURIComponent(stage)}`);
    if (status) parts.push(`status=${encodeURIComponent(status)}`);
    if (searchQuery) parts.push(`q=${encodeURIComponent(searchQuery)}`);
    return `/admin${parts.length ? `?${parts.join("&")}` : ""}`;
  };

  const isFilterActive = Boolean(activeStage || activeStatus);

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ── HEADER ── */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d59758]">Admin Panel</p>
            <h1 className="text-2xl font-bold text-[#1b2345]">Applications Pipeline</h1>
          </div>
          <div className="flex items-center gap-3">
            <AdminBulkReminder />
            <Link href="/admin-logout" className="rounded-full border border-[#e1e4ee] bg-white px-4 py-2 text-[12px] font-semibold text-[#68708a] transition hover:bg-[#f4f6fb]">
              Log Out
            </Link>
          </div>
        </div>

        {/* ── PIPELINE STAGE CARDS ── */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {/* All card */}
          <Link
            href={buildHref("", "")}
            className={`overflow-hidden rounded-[14px] border bg-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)] ${
              !isFilterActive ? "border-2 border-[#1b2345]" : "border-[#e1e4ee]"
            }`}
          >
            <div className="flex items-center justify-between px-3 py-3">
              <span className="text-3xl font-bold text-[#1b2345]">{totalCount}</span>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#a3aac0]">All Stages</p>
                <p className="mt-0.5 text-[11px] font-semibold leading-tight text-[#1b2345]">Everything</p>
              </div>
            </div>
            <div className="h-[3px] bg-[#1b2345]" />
          </Link>

          {STATUS_GROUPS.map((group, index) => {
            const count = getSummaryCount(allApplications, group.statuses);
            const isActive = activeStage === group.key && !activeStatus;
            return (
              <Link
                key={group.key}
                href={buildHref(group.key)}
                className={`overflow-hidden rounded-[14px] border bg-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)] ${
                  isActive ? "border-2" : "border-[#e1e4ee]"
                }`}
                style={isActive ? { borderColor: group.color } : {}}
              >
                <div className="flex items-center justify-between px-3 py-3">
                  <span className="text-3xl font-bold" style={{ color: group.textColor }}>{count}</span>
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#a3aac0]">Stage {index + 1}</p>
                    <p className="mt-0.5 text-[11px] font-semibold leading-tight" style={{ color: group.textColor }}>{group.label}</p>
                  </div>
                </div>
                <div className="h-[3px]" style={{ background: group.color }} />
              </Link>
            );
          })}
        </div>

        {/* ── SUB-STATUS PILLS (only shown when a stage is selected) ── */}
        {activeGroup ? (
          <div className="mb-6 overflow-hidden rounded-[14px] border bg-white" style={{ borderColor: activeGroup.border }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: activeGroup.bg }}>
              <span className="h-2 w-2 rounded-full" style={{ background: activeGroup.dot }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: activeGroup.textColor }}>{activeGroup.label}</span>
              <span className="ml-auto text-[11px]" style={{ color: activeGroup.textColor }}>
                {getSummaryCount(allApplications, activeGroup.statuses)} application{getSummaryCount(allApplications, activeGroup.statuses) !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 p-3">
              <Link
                href={buildHref(activeGroup.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                  !activeStatus ? "" : "hover:bg-[#fafbff]"
                }`}
                style={!activeStatus ? {
                  background: activeGroup.color,
                  borderColor: activeGroup.color,
                  color: "#ffffff",
                } : {
                  background: "#fafbff",
                  borderColor: "#e1e4ee",
                  color: "#68708a",
                }}
              >
                All in stage
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                  style={!activeStatus ? {
                    background: "rgba(255,255,255,0.25)",
                    color: "#ffffff",
                  } : {
                    background: activeGroup.color,
                    color: "#ffffff",
                  }}
                >
                  {getSummaryCount(allApplications, activeGroup.statuses)}
                </span>
              </Link>
              {activeGroup.statuses.map((status) => {
                const isActive = activeStatus === status;
                const count = getSummaryCount(allApplications, [status]);
                return (
                  <Link
                    key={status}
                    href={buildHref(activeGroup.key, status)}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition"
                    style={isActive ? {
                      background: activeGroup.color,
                      borderColor: activeGroup.color,
                      color: "#ffffff",
                    } : {
                      background: "#fafbff",
                      borderColor: "#e1e4ee",
                      color: "#68708a",
                    }}
                  >
                    {shortenStatus(status)}
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                      style={isActive ? {
                        background: "rgba(255,255,255,0.25)",
                        color: "#ffffff",
                      } : {
                        background: activeGroup.color,
                        color: "#ffffff",
                      }}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* ── SEARCH ── */}
        <div className="mb-4 rounded-[14px] border border-[#e1e4ee] bg-white p-3">
          <form method="GET" action="/admin" className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search by reference, name, email, phone, ID or vehicle..."
              className="w-full rounded-[10px] border border-[#dde1ee] bg-[#fafbff] px-3 py-2 text-sm text-[#1b2345] outline-none transition placeholder:text-[#a3aac0] focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
            />
            {activeStage ? <input type="hidden" name="stage" value={activeStage} /> : null}
            {activeStatus ? <input type="hidden" name="status" value={activeStatus} /> : null}
            <button type="submit" className="shrink-0 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-5 py-2 text-sm font-semibold text-white">
              Search
            </button>
          </form>
        </div>

        {/* ── RESULTS BAR ── */}
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-[13px] text-[#68708a]">
            Showing <span className="font-semibold text-[#1b2345]">{applications.length}</span> application{applications.length !== 1 ? "s" : ""}
            {activeStatus ? (
              <span> · <span className="font-semibold" style={{ color: getStatusGroup(activeStatus)?.color ?? "#1b2345" }}>{formatStatus(activeStatus)}</span></span>
            ) : activeGroup ? (
              <span> · <span className="font-semibold" style={{ color: activeGroup.color }}>{activeGroup.label}</span></span>
            ) : null}
          </p>
          {isFilterActive || searchQuery ? (
            <Link href="/admin" className="text-[11px] font-semibold text-[#68708a] underline underline-offset-2 hover:text-[#1b2345]">
              Clear filters
            </Link>
          ) : null}
        </div>

        {/* ── TABLE ── */}
        <div className="overflow-hidden rounded-[14px] border border-[#e1e4ee] bg-white shadow-[0_4px_12px_-6px_rgba(15,23,42,0.08)]">
          {applications.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[15px] font-semibold text-[#1b2345]">No applications found</p>
              <p className="mt-1 text-[12px] text-[#68708a]">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563]">
                    {["Reference", "Name", "Email", "Phone", "Income", "Vehicle", "Status", "Applied", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, i) => {
                    const group = getStatusGroup(app.status);
                    return (
                      <tr key={app.id} className={`border-b border-[#f0f2f8] transition hover:bg-[#fafbff] ${i % 2 === 0 ? "bg-white" : "bg-[#fdfeff]"}`}>
                        <td className="px-4 py-3 text-[11px] font-bold text-[#2f67de]">{app.referenceNumber}</td>
                        <td className="px-4 py-3 text-[12px] font-semibold text-[#1b2345]">{app.fullName}</td>
                        <td className="px-4 py-3 text-[11px] text-[#68708a]">{app.email}</td>
                        <td className="px-4 py-3 text-[11px] text-[#68708a]">{app.phone}</td>
                        <td className="px-4 py-3 text-[11px] text-[#68708a]">R {app.monthlyIncome}</td>
                        <td className="px-4 py-3 text-[11px] text-[#68708a]">{app.preferredVehicle || "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em]"
                            style={group ? {
                              background: group.bg,
                              borderColor: group.border,
                              color: group.textColor,
                            } : {}}
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: group?.dot }} />
                            {shortenStatus(app.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-[#68708a]">
                          {new Date(app.createdAt).toLocaleDateString("en-ZA")}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/${app.id}`}
                            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-3 py-1.5 text-[10px] font-bold text-white"
                          >
                            View
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
