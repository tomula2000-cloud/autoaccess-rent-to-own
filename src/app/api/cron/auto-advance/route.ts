import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendStatusUpdateEmail } from "@/lib/email";
import {
  isWithinWorkingHours,
  workingMinutesBetween,
} from "@/lib/working-hours";

// Thresholds in WORKING minutes
const DOCS_SUBMITTED_THRESHOLD_MIN = 2 * 60; // 2 working hours
const UNDER_REVIEW_THRESHOLD_MIN = 8 * 60; // 8 working hours
const CONTRACT_REQUESTED_THRESHOLD_MIN = 30; // 30 working minutes

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Find when an application most recently ENTERED a given status,
// using the statusLog (toStatus). Falls back to updatedAt/createdAt.
async function enteredStatusAt(
  applicationId: string,
  status: string,
  fallback: Date
): Promise<Date> {
  const log = await prisma.statusLog.findFirst({
    where: { applicationId, toStatus: status as never },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });
  return log?.createdAt ?? fallback;
}

async function getSystemAdminId(): Promise<string | null> {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  return admin?.id ?? null;
}

export async function GET(request: Request) {
  // --- Security: only allow Vercel Cron (or a caller with the secret) ---
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // --- Only run during working hours (Mon-Fri 08:30-18:00 SAST) ---
  const now = new Date();
  if (!isWithinWorkingHours(now)) {
    return NextResponse.json({
      skipped: true,
      reason: "Outside working hours (Mon-Fri 08:30-18:00 SAST)",
      ranAt: now.toISOString(),
    });
  }

  const adminId = await getSystemAdminId();
  const results = {
    ranAt: now.toISOString(),
    docsToReview: 0,
    reviewToApproved: 0,
    contractAutoIssued: 0,
    contractSkippedNoSnapshot: 0,
    errors: [] as string[],
  };

  const { sendBulkSMS } = await import("@/lib/sms");

  // ===== TRANSITION 1: DOCUMENTS_SUBMITTED -> DOCUMENTS_UNDER_REVIEW (2 working hrs) =====
  try {
    const candidates = await prisma.application.findMany({
      where: { status: "DOCUMENTS_SUBMITTED" as never },
      select: { id: true, fullName: true, email: true, phone: true, referenceNumber: true, createdAt: true, updatedAt: true },
    });
    for (const app of candidates) {
      const enteredAt = await enteredStatusAt(app.id, "DOCUMENTS_SUBMITTED", app.updatedAt ?? app.createdAt);
      if (workingMinutesBetween(enteredAt, now) < DOCS_SUBMITTED_THRESHOLD_MIN) continue;
      await prisma.application.update({
        where: { id: app.id },
        data: { status: "DOCUMENTS_UNDER_REVIEW" as never },
      });
      await prisma.statusLog.create({
        data: {
          applicationId: app.id,
          fromStatus: "DOCUMENTS_SUBMITTED" as never,
          toStatus: "DOCUMENTS_UNDER_REVIEW" as never,
          note: "Auto-advanced to Documents Under Review after 2 working hours (system automation).",
          updatedById: adminId ?? app.id,
        },
      });
      try {
        await sendStatusUpdateEmail({
          to: app.email,
          fullName: app.fullName,
          referenceNumber: app.referenceNumber,
          status: "DOCUMENTS_UNDER_REVIEW",
          note: null,
        });
      } catch (e) {
        results.errors.push(`Email (review) ${app.referenceNumber}: ${String(e)}`);
      }
      results.docsToReview++;
    }
  } catch (e) {
    results.errors.push(`Transition 1: ${String(e)}`);
  }

  // ===== TRANSITION 2: DOCUMENTS_UNDER_REVIEW -> APPROVED_IN_PRINCIPLE (8 working hrs) =====
  try {
    const candidates = await prisma.application.findMany({
      where: { status: "DOCUMENTS_UNDER_REVIEW" as never },
      select: { id: true, fullName: true, email: true, phone: true, referenceNumber: true, createdAt: true, updatedAt: true },
    });
    for (const app of candidates) {
      const enteredAt = await enteredStatusAt(app.id, "DOCUMENTS_UNDER_REVIEW", app.updatedAt ?? app.createdAt);
      if (workingMinutesBetween(enteredAt, now) < UNDER_REVIEW_THRESHOLD_MIN) continue;
      await prisma.application.update({
        where: { id: app.id },
        data: {
          status: "APPROVED_IN_PRINCIPLE" as never,
          approvalValidUntil: addDays(now, 12),
          reapplyAllowedAt: null,
          contractRequestedAt: null,
          contractIssuedAt: null,
          contractExpiresAt: null,
          contractCancelledAt: null,
          contractAccepted: false,
          contractAcceptedAt: null,
          contractAcceptedName: null,
        },
      });
      await prisma.statusLog.create({
        data: {
          applicationId: app.id,
          fromStatus: "DOCUMENTS_UNDER_REVIEW" as never,
          toStatus: "APPROVED_IN_PRINCIPLE" as never,
          note: "Auto-advanced to Approved in Principle after 8 working hours (system automation).",
          updatedById: adminId ?? app.id,
        },
      });
      try {
        await sendStatusUpdateEmail({
          to: app.email,
          fullName: app.fullName,
          referenceNumber: app.referenceNumber,
          status: "APPROVED_IN_PRINCIPLE",
          note: null,
        });
      } catch (e) {
        results.errors.push(`Email (approved) ${app.referenceNumber}: ${String(e)}`);
      }
      if (app.phone) {
        try {
          const firstName = app.fullName.split(" ")[0];
          await sendBulkSMS({
            to: app.phone,
            message: `Dear ${firstName}, great news! Your Auto Access rent-to-own application (Ref: ${app.referenceNumber}) has been approved in principle. Log in to your portal at autoaccess.co.za/portal using your reference number and email to proceed. Need help? Speak to your appointed sales champion on WhatsApp: 074 546 2367.`,
          });
        } catch (e) {
          results.errors.push(`SMS (approved) ${app.referenceNumber}: ${String(e)}`);
        }
      }
      results.reviewToApproved++;
    }
  } catch (e) {
    results.errors.push(`Transition 2: ${String(e)}`);
  }

  // ===== TRANSITION 3: CONTRACT_REQUESTED -> CONTRACT_ISSUED (30 working min, snapshot must be complete) =====
  try {
    const candidates = await prisma.application.findMany({
      where: { status: "CONTRACT_REQUESTED" as never },
      select: {
        id: true, fullName: true, email: true, phone: true, referenceNumber: true,
        createdAt: true, updatedAt: true, contractRequestedAt: true,
        contractVehicleTitle: true, contractDepositAmount: true,
        contractMonthlyPayment: true, contractLicensingFee: true,
        contractClientFullName: true, contractTerms: true,
      },
    });
    for (const app of candidates) {
      const enteredAt = await enteredStatusAt(app.id, "CONTRACT_REQUESTED", app.contractRequestedAt ?? app.updatedAt ?? app.createdAt);
      if (workingMinutesBetween(enteredAt, now) < CONTRACT_REQUESTED_THRESHOLD_MIN) continue;

      // Snapshot completeness check — never auto-issue an empty contract
      const snapshotComplete =
        !!app.contractVehicleTitle &&
        !!app.contractDepositAmount &&
        !!app.contractMonthlyPayment &&
        !!app.contractLicensingFee &&
        !!app.contractClientFullName &&
        !!app.contractTerms;

      if (!snapshotComplete) {
        results.contractSkippedNoSnapshot++;
        await prisma.statusLog.create({
          data: {
            applicationId: app.id,
            fromStatus: "CONTRACT_REQUESTED" as never,
            toStatus: "CONTRACT_REQUESTED" as never,
            note: "Auto-issue skipped: contract snapshot incomplete. Admin must complete contract figures before issue.",
            updatedById: adminId ?? app.id,
          },
        });
        continue;
      }

      const issuedAt = now;
      await prisma.application.update({
        where: { id: app.id },
        data: {
          status: "CONTRACT_ISSUED" as never,
          approvalValidUntil: null,
          contractRequestedAt: app.contractRequestedAt || issuedAt,
          contractIssuedAt: issuedAt,
          contractExpiresAt: null,
          contractCancelledAt: null,
          contractAccepted: false,
          contractAcceptedAt: null,
          contractAcceptedName: null,
          adminSeen: false,
        },
      });
      await prisma.statusLog.create({
        data: {
          applicationId: app.id,
          fromStatus: "CONTRACT_REQUESTED" as never,
          toStatus: "CONTRACT_ISSUED" as never,
          note: "Auto-issued contract after 30 working minutes (system automation, snapshot was complete).",
          updatedById: adminId ?? app.id,
        },
      });
      try {
        await sendStatusUpdateEmail({
          to: app.email,
          fullName: app.fullName,
          referenceNumber: app.referenceNumber,
          status: "CONTRACT_ISSUED",
          note: null,
        });
      } catch (e) {
        results.errors.push(`Email (issued) ${app.referenceNumber}: ${String(e)}`);
      }
      if (app.phone) {
        try {
          const firstName = app.fullName.split(" ")[0];
          await sendBulkSMS({
            to: app.phone,
            message: `Dear ${firstName}, your Auto Access contract (Ref: ${app.referenceNumber}) is ready for your review and signature. Please log in to your client portal at autoaccess.co.za/portal to review and sign your agreement. For assistance, contact us on WhatsApp: 074 546 2367.`,
          });
        } catch (e) {
          results.errors.push(`SMS (issued) ${app.referenceNumber}: ${String(e)}`);
        }
      }
      results.contractAutoIssued++;
    }
  } catch (e) {
    results.errors.push(`Transition 3: ${String(e)}`);
  }

  return NextResponse.json({ ok: true, ...results });
}
