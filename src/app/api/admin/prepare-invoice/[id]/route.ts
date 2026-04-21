import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const {
      invoiceDepositAmount,
      invoiceLicensingFee,
      invoiceMonthlyAmount,
      invoiceTotalDue,
      invoiceItems,
      invoiceBankName,
      invoiceBankHolder,
      invoiceBankAccount,
      invoiceBankBranch,
      invoiceBankType,
      invoiceTerms,
    } = body;

    const existing = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        referenceNumber: true,
        status: true,
        email: true,
        fullName: true,
        invoiceNumber: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (!["AWAITING_INVOICE", "INVOICE_ISSUED"].includes(existing.status)) {
      return NextResponse.json(
        { error: "Application is not in a valid state for invoicing" },
        { status: 400 }
      );
    }

    // Generate invoice number if first time
    const invoiceNumber =
      existing.invoiceNumber ||
      `INV-${existing.referenceNumber}-${String(Date.now()).slice(-4)}`;

    const now = new Date();
    const dueAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    await prisma.application.update({
      where: { id },
      data: {
        invoiceNumber,
        invoiceIssuedAt: now,
        invoiceDueAt: dueAt,
        invoiceDepositAmount,
        invoiceLicensingFee,
        invoiceMonthlyAmount,
        invoiceTotalDue,
        invoiceItems: invoiceItems || [],
        invoiceBankName,
        invoiceBankHolder,
        invoiceBankAccount,
        invoiceBankBranch,
        invoiceBankType,
        invoicePaymentReference: existing.referenceNumber,
        invoiceTerms,
        invoiceSentAt: now,
        status: "INVOICE_ISSUED",
      },
    });

    // Send invoice email (imported dynamically to avoid circular deps)
    try {
      const { sendInvoiceEmail } = await import("@/lib/email");
      await sendInvoiceEmail({
        to: existing.email,
        fullName: existing.fullName,
        referenceNumber: existing.referenceNumber,
        invoiceNumber,
        invoiceIssuedAt: now,
        invoiceDueAt: dueAt,
        invoiceDepositAmount,
        invoiceLicensingFee,
        invoiceMonthlyAmount,
        invoiceTotalDue,
        invoiceBankName,
        invoiceBankHolder,
        invoiceBankAccount,
        invoiceBankBranch,
        invoiceBankType,
        invoiceTerms,
      });
    } catch (emailErr) {
      console.error("Invoice email failed (non-blocking):", emailErr);
    }

    return NextResponse.json({ success: true, invoiceNumber });
  } catch (error) {
    console.error("Invoice send failed:", error);
    return NextResponse.json({ error: "Failed to send invoice" }, { status: 500 });
  }
}
