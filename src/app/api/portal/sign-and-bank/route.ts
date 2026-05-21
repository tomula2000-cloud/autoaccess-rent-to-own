import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendContractSignedAdminEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const referenceNumber = cookieStore.get("autoaccess_portal_ref")?.value;
    const email = cookieStore.get("autoaccess_portal_email")?.value;
    const applicationId = cookieStore.get("autoaccess_portal_application_id")?.value;

    if (!referenceNumber || !email || !applicationId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const application = await prisma.application.findUnique({
      where: { referenceNumber },
      select: { id: true, email: true, status: true, fullName: true, referenceNumber: true, contractAccepted: true, applicantId: true },
    });

    if (!application || application.id !== applicationId || application.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "CONTRACT_ISSUED" || !application.contractAccepted) {
      return NextResponse.json({ error: "Invalid application state" }, { status: 400 });
    }

    const body = await request.json();
    const { clientBankName, clientAccountHolder, clientAccountNumber, clientAccountType, clientBranchCode } = body;

    if (!clientBankName || !clientAccountHolder || !clientAccountNumber || !clientAccountType || !clientBranchCode) {
      return NextResponse.json({ error: "All banking fields are required" }, { status: 400 });
    }

    const now = new Date();

    await prisma.application.update({
      where: { id: application.id },
      data: {
        clientBankName,
        clientAccountHolder,
        clientAccountNumber,
        clientAccountType,
        clientBranchCode,
        clientBankSubmittedAt: now,
        clientBankConfirmed: false,
        status: "AWAITING_INVOICE",
        adminSeen: false,
      },
    });

    await prisma.statusLog.create({
      data: {
        applicationId: application.id,
        fromStatus: "CONTRACT_ISSUED",
        toStatus: "AWAITING_INVOICE",
        note: "Contract signed and banking details submitted by client — auto-advanced to awaiting invoice",
        updatedById: application.applicantId,
      },
    });

    try {
      await sendContractSignedAdminEmail({
        fullName: application.fullName,
        email: application.email,
        referenceNumber: application.referenceNumber,
        signedAt: now,
      });
    } catch (e) {
      console.error("Admin notification failed:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sign and bank failed:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
