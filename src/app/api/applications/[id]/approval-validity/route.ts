import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const VALID_ACTIONS = [
  "extend_3_days",
  "extend_5_days",
  "extend_7_days",
  "remove_expiry",
  "reinstate_12_days",
] as const;

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
    const action = String(body.action || "").trim();

    if (!VALID_ACTIONS.includes(action as (typeof VALID_ACTIONS)[number])) {
      return NextResponse.json(
        { success: false, message: `Invalid action: ${action}` },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        approvalValidUntil: true,
        reapplyAllowedAt: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found." },
        { status: 404 }
      );
    }

    if (application.status !== "APPROVED_IN_PRINCIPLE") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Approval validity controls are only available while the application is in Approved in Principle status.",
        },
        { status: 400 }
      );
    }

    let approvalValidUntil: Date | null = application.approvalValidUntil;
    let reapplyAllowedAt: Date | null = application.reapplyAllowedAt;
    let note = "";

    if (action === "extend_3_days") {
      const baseDate =
        application.approvalValidUntil &&
        application.approvalValidUntil > new Date()
          ? application.approvalValidUntil
          : new Date();

      approvalValidUntil = addDays(baseDate, 3);
      note = "Admin extended approval validity by 3 days.";
    }

    if (action === "extend_5_days") {
      const baseDate =
        application.approvalValidUntil &&
        application.approvalValidUntil > new Date()
          ? application.approvalValidUntil
          : new Date();

      approvalValidUntil = addDays(baseDate, 5);
      note = "Admin extended approval validity by 5 days.";
    }

    if (action === "extend_7_days") {
      const baseDate =
        application.approvalValidUntil &&
        application.approvalValidUntil > new Date()
          ? application.approvalValidUntil
          : new Date();

      approvalValidUntil = addDays(baseDate, 7);
      note = "Admin extended approval validity by 7 days.";
    }

    if (action === "reinstate_12_days") {
      approvalValidUntil = addDays(new Date(), 12);
      reapplyAllowedAt = null;
      note = "Admin reinstated approval validity for 12 days.";
    }

    if (action === "remove_expiry") {
      approvalValidUntil = null;
      reapplyAllowedAt = null;
      note = "Admin removed the approval expiry limit.";
    }

    await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: {
          approvalValidUntil,
          reapplyAllowedAt,
        },
      }),
      prisma.statusLog.create({
        data: {
          applicationId: id,
          fromStatus: application.status,
          toStatus: application.status,
          note,
          updatedById: adminUser.id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Approval validity updated successfully.",
    });
  } catch (error) {
    console.error("Approval validity update failed:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        success: false,
        message: `Approval validity update failed: ${message}`,
      },
      { status: 500 }
    );
  }
}