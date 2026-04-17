import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const referenceNumber = cookieStore.get("autoaccess_portal_ref")?.value;
    const email = cookieStore.get("autoaccess_portal_email")?.value;

    if (!referenceNumber || !email) {
      return NextResponse.json({ loggedIn: false });
    }

    const application = await prisma.application.findUnique({
      where: { referenceNumber },
      select: {
        fullName: true,
        referenceNumber: true,
        status: true,
        email: true,
      },
    });

    if (!application || application.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ loggedIn: false });
    }

    return NextResponse.json({
      loggedIn: true,
      fullName: application.fullName,
      referenceNumber: application.referenceNumber,
      status: application.status,
    });
  } catch (error) {
    console.error("Portal me error:", error);
    return NextResponse.json({ loggedIn: false });
  }
}
