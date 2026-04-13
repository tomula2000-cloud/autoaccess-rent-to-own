import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ApplicationDocument = {
  id: string;
  fileName: string;
  documentType: string;
  createdAt: Date;
};

type ApplicationStatusLog = {
  id: string;
  toStatus: string;
  note: string | null;
  createdAt: Date;
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatIdentityType(value: string | null) {
  if (!value) return "Not provided";
  if (value === "SA_ID") return "South African ID";
  if (value === "PASSPORT") return "Passport";
  return value;
}

export default async function AdminApplicationDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as
    | {
        email?: string;
        role?: string;
      }
    | undefined;

  if (!sessionUser?.email || sessionUser.role !== "ADMIN") {
    redirect("/admin-login");
  }

  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    select: {
      id: true,
      referenceNumber: true,
      fullName: true,
      email: true,
      phone: true,
      status: true,
      identityType: true,
      identityNumber: true,
      employmentStatus: true,
      monthlyIncome: true,
      salaryDate: true,
      preferredVehicle: true,
      physicalAddress: true,
      notes: true,
      createdAt: true,
      statusLogs: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          toStatus: true,
          note: true,
          createdAt: true,
        },
      },
      documents: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          fileName: true,
          documentType: true,
          createdAt: true,
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
          Auto Access Admin
        </p>

        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Application Details
        </h1>

        <p className="mb-10 max-w-3xl text-lg text-gray-600">
          Review the applicant profile, uploaded documents, and status history.
        </p>

        <div className="mb-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Reference Number</p>
            <p className="mt-2 text-2xl font-bold">{application.referenceNumber}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Current Status</p>
            <p className="mt-2 text-2xl font-bold">{formatStatus(application.status)}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Created</p>
            <p className="mt-2 font-semibold">
              {new Date(application.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-bold">Applicant Information</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="mt-1 font-semibold">{application.fullName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 font-semibold">{application.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="mt-1 font-semibold">{application.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Identity Type</p>
                <p className="mt-1 font-semibold">
                  {formatIdentityType(application.identityType)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">ID / Passport Number</p>
                <p className="mt-1 font-semibold">
                  {application.identityNumber || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Employment Status</p>
                <p className="mt-1 font-semibold">{application.employmentStatus}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Monthly Income</p>
                <p className="mt-1 font-semibold">{application.monthlyIncome}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Salary Date</p>
                <p className="mt-1 font-semibold">
                  {application.salaryDate || "Not provided"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Preferred Vehicle</p>
                <p className="mt-1 font-semibold">{application.preferredVehicle}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Physical Address</p>
                <p className="mt-1 font-semibold">
                  {application.physicalAddress || "Not provided"}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Additional Notes</p>
                <p className="mt-1 font-semibold">
                  {application.notes || "No additional notes provided."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Uploaded Documents</h2>

              {application.documents.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                  No documents uploaded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {application.documents.map(
                    (document: ApplicationDocument, index: number) => (
                      <div
                        key={document.id}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <p className="font-semibold">
                          File {index + 1}: {document.fileName}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Type: {formatStatus(document.documentType)}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Uploaded: {new Date(document.createdAt).toLocaleString()}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Status History</h2>

              {application.statusLogs.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                  No status updates yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {application.statusLogs.map((log: ApplicationStatusLog) => (
                    <div
                      key={log.id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <p className="font-semibold">{formatStatus(log.toStatus)}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {log.note || "Status updated."}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}