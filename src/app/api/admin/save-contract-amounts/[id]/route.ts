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
    const { deposit, licensing, monthly, total } = await req.json();

    await prisma.application.update({
      where: { id },
      data: {
        contractDepositAmount: deposit,
        contractLicensingFee: licensing,
        contractMonthlyPayment: monthly,
        contractTotalPayableNow: total,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save contract amounts failed:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
