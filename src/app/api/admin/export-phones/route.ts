import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return cleaned.slice(1);
  }
  if (cleaned.startsWith("27") && cleaned.length === 11) {
    return cleaned.slice(2);
  }
  if (cleaned.length === 9) {
    return cleaned;
  }
  return cleaned;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const stage = searchParams.get("stage") || "";
  const q = searchParams.get("q") || "";

  const STATUS_GROUPS: Record<string, string[]> = {
    NEW: ["APPLICATION_RECEIVED", "PRE_QUALIFICATION_REVIEW", "PRE_QUALIFIED"],
    DOCS: ["AWAITING_DOCUMENTS", "DOCUMENTS_SUBMITTED", "DOCUMENTS_UNDER_REVIEW", "ADDITIONAL_DOCUMENTS_REQUIRED"],
    APPROVAL: ["APPROVED_IN_PRINCIPLE", "CONTRACT_REQUESTED", "CONTRACT_ISSUED"],
    PAYMENT: ["AWAITING_INVOICE", "INVOICE_ISSUED", "AWAITING_PAYMENT", "PAYMENT_UNDER_VERIFICATION", "PAYMENT_CONFIRMED", "COMPLETED"],
    DECLINED: ["DECLINED"],
  };

  const allApplications = await prisma.application.findMany({
    select: { fullName: true, phone: true, status: true, referenceNumber: true },
    orderBy: { createdAt: "desc" },
  });

  const filtered = allApplications.filter((app) => {
    let matchesFilter = true;
    if (status) {
      matchesFilter = app.status === status;
    } else if (stage && STATUS_GROUPS[stage]) {
      matchesFilter = STATUS_GROUPS[stage].includes(app.status);
    }
    const query = q.toLowerCase();
    const matchesSearch = !query || [app.fullName, app.phone, app.referenceNumber].some((f) => f.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  // Build CSV with formatted numbers
  const rows = filtered.map((app) => {
    const formatted = formatPhone(app.phone);
    return `${app.referenceNumber},${app.fullName},${formatted},${app.status}`;
  });

  const csv = ["Reference,Name,Phone (9 digits),Status", ...rows].join("\n");

  const label = status || stage || "all";
  const filename = `autoaccess-phones-${label}-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
