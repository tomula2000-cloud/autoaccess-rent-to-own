import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const allowedFields = [
      "fullName", "email", "phone",
      "identityType", "identityNumber",
      "employmentStatus", "monthlyIncome", "salaryDate",
      "preferredVehicle", "physicalAddress", "notes",
    ];

    const data: Record<string, string | null> = {};
    for (const field of allowedFields) {
      if (field in body) {
        data[field] = body[field] === "" ? null : String(body[field]);
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        identityType: true,
        identityNumber: true,
        employmentStatus: true,
        monthlyIncome: true,
        salaryDate: true,
        preferredVehicle: true,
        physicalAddress: true,
        notes: true,
      },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("Edit application failed:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}
