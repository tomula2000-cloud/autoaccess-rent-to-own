import { NextResponse } from "next/server";
import { sendStatusUpdateEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = [
  "APPLICATION_RECEIVED",
  "PRE_QUALIFICATION_REVIEW",
  "PRE_QUALIFIED",
  "AWAITING_DOCUMENTS",
  "DOCUMENTS_SUBMITTED",
  "DOCUMENTS_UNDER_REVIEW",
  "ADDITIONAL_DOCUMENTS_REQUIRED",
  "APPROVED_IN_PRINCIPLE",
  "CONTRACT_REQUESTED",
  "CONTRACT_ISSUED",
  "AWAITING_INVOICE",
  "CONTRACT_EXPIRED",
  "CONTRACT_CANCELLED",
  "INVOICE_ISSUED",
  "AWAITING_PAYMENT",
  "PAYMENT_UNDER_VERIFICATION",
  "PAYMENT_CONFIRMED",
  "COMPLETED",
  "DECLINED",
] as const;

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function resolveAdminUser(sessionUser: {
  email?: string;
  role?: string;
  name?: string;
}) {
  if (!sessionUser.email || sessionUser.role !== "ADMIN") {
    return null;
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: sessionUser.email },
    select: {
      id: true,
      role: true,
    },
  });

  if (existingAdmin?.role === "ADMIN") {
    return existingAdmin;
  }

  const recoveredAdmin = await prisma.user.upsert({
    where: { email: sessionUser.email },
    update: {
      role: "ADMIN",
      fullName: sessionUser.name?.trim() || "Admin User",
    },
    create: {
      email: sessionUser.email,
      fullName: sessionUser.name?.trim() || "Admin User",
      role: "ADMIN",
    },
    select: {
      id: true,
      role: true,
    },
  });

  return recoveredAdmin;
}

function hasPreparedContractSnapshot(application: {
  contractVehicleTitle: string | null;
  contractDepositAmount: string | null;
  contractLicensingFee: string | null;
  contractMonthlyPayment: string | null;
  contractClientFullName: string | null;
  contractClientIdentityNumber: string | null;
  contractTerms: string | null;
}) {
  return Boolean(
    application.contractVehicleTitle &&
      application.contractDepositAmount &&
      application.contractLicensingFee &&
      application.contractMonthlyPayment &&
      application.contractClientFullName &&
      application.contractClientIdentityNumber &&
      application.contractTerms
  );
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as
      | {
          email?: string;
          role?: string;
          name?: string;
        }
      | undefined;

    if (!sessionUser?.email || sessionUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const adminUser = await resolveAdminUser(sessionUser);

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Admin account could not be restored." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const newStatus = String(body.status || "").trim();
    const note = String(body.note || "").trim();

    if (!VALID_STATUSES.includes(newStatus as (typeof VALID_STATUSES)[number])) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid application status: ${newStatus}`,
        },
        { status: 400 }
      );
    }

    const existingApplication = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        referenceNumber: true,
        status: true,
        approvalValidUntil: true,
        reapplyAllowedAt: true,
        contractRequestedAt: true,
        contractIssuedAt: true,
        contractExpiresAt: true,
        contractCancelledAt: true,
        contractAccepted: true,
        contractAcceptedAt: true,
        contractAcceptedName: true,

        contractVehicleTitle: true,
        contractDepositAmount: true,
        contractLicensingFee: true,
        contractMonthlyPayment: true,
        contractClientFullName: true,
        contractClientIdentityNumber: true,
        contractTerms: true,
      },
    });

    if (!existingApplication) {
      return NextResponse.json(
        { success: false, message: "Application not found." },
        { status: 404 }
      );
    }

    if (
      newStatus === "CONTRACT_ISSUED" &&
      !hasPreparedContractSnapshot(existingApplication)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must save the contract snapshot first before issuing the contract.",
        },
        { status: 400 }
      );
    }

    const updateData: {
      status: (typeof VALID_STATUSES)[number];
      approvalValidUntil?: Date | null;
      reapplyAllowedAt?: Date | null;
      contractRequestedAt?: Date | null;
      contractIssuedAt?: Date | null;
      contractExpiresAt?: Date | null;
      contractCancelledAt?: Date | null;
      contractAccepted?: boolean;
      contractAcceptedAt?: Date | null;
      contractAcceptedName?: string | null;
    } = {
      status: newStatus as (typeof VALID_STATUSES)[number],
    };

    const movingIntoApproved =
      existingApplication.status !== "APPROVED_IN_PRINCIPLE" &&
      newStatus === "APPROVED_IN_PRINCIPLE";

    const movingOutOfApproved =
      existingApplication.status === "APPROVED_IN_PRINCIPLE" &&
      newStatus !== "APPROVED_IN_PRINCIPLE";

    if (movingIntoApproved) {
      updateData.approvalValidUntil = addDays(new Date(), 12);
      updateData.reapplyAllowedAt = null;
      updateData.contractRequestedAt = null;
      updateData.contractIssuedAt = null;
      updateData.contractExpiresAt = null;
      updateData.contractCancelledAt = null;
      updateData.contractAccepted = false;
      updateData.contractAcceptedAt = null;
      updateData.contractAcceptedName = null;
    }

    if (movingOutOfApproved) {
      updateData.approvalValidUntil = null;
    }

    if (newStatus === "CONTRACT_REQUESTED") {
      updateData.approvalValidUntil = null;
      updateData.contractRequestedAt =
        existingApplication.contractRequestedAt || new Date();
      updateData.contractIssuedAt = null;
      updateData.contractExpiresAt = null;
      updateData.contractCancelledAt = null;
      updateData.contractAccepted = false;
      updateData.contractAcceptedAt = null;
      updateData.contractAcceptedName = null;
    }

    if (newStatus === "CONTRACT_ISSUED") {
      const now = new Date();
      updateData.approvalValidUntil = null;
      updateData.contractRequestedAt =
        existingApplication.contractRequestedAt || now;
      updateData.contractIssuedAt = now;
      updateData.contractExpiresAt = addDays(now, 1);
      updateData.contractCancelledAt = null;
      updateData.contractAccepted = false;
      updateData.contractAcceptedAt = null;
      updateData.contractAcceptedName = null;
    }

    if (newStatus === "AWAITING_INVOICE") {
      updateData.approvalValidUntil = null;
    }

    if (newStatus === "CONTRACT_EXPIRED") {
      updateData.approvalValidUntil = null;
      updateData.contractCancelledAt = new Date();
    }

    if (newStatus === "CONTRACT_CANCELLED") {
      updateData.approvalValidUntil = null;
      updateData.contractCancelledAt = new Date();
    }

    if (
      newStatus === "INVOICE_ISSUED" ||
      newStatus === "AWAITING_PAYMENT" ||
      newStatus === "PAYMENT_UNDER_VERIFICATION" ||
      newStatus === "PAYMENT_CONFIRMED" ||
      newStatus === "COMPLETED"
    ) {
      updateData.approvalValidUntil = null;
    }

    await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          status: true,
          approvalValidUntil: true,
          reapplyAllowedAt: true,
          contractRequestedAt: true,
          contractIssuedAt: true,
          contractExpiresAt: true,
          contractCancelledAt: true,
          contractAccepted: true,
          contractAcceptedAt: true,
          contractAcceptedName: true,
        },
      }),
      prisma.statusLog.create({
        data: {
          applicationId: id,
          fromStatus: existingApplication.status,
          toStatus: newStatus as never,
          note: note || null,
          updatedById: adminUser.id,
        },
        select: {
          id: true,
        },
      }),
    ]);

    try {
      await sendStatusUpdateEmail({
        to: existingApplication.email,
        fullName: existingApplication.fullName,
        referenceNumber: existingApplication.referenceNumber,
        status: newStatus,
        note: note || null,
      });
    } catch (emailError) {
      console.error("Status email failed (non-blocking):", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Application status updated successfully.",
    });
  } catch (error) {
    console.error("Status update failed:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        success: false,
        message: `Status update failed: ${message}`,
      },
      { status: 500 }
    );
  }
}