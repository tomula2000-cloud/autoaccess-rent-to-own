import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContractSignedClientEmail, sendContractSignedAdminEmail } from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { signatureImage, signedName } = body as {
      signatureImage?: string;
      signedName?: string;
    };

    if (!signatureImage || typeof signatureImage !== "string") {
      return NextResponse.json(
        { error: "Signature is required" },
        { status: 400 }
      );
    }

    // Basic validation — must be a base64 PNG data URL
    if (!signatureImage.startsWith("data:image/png;base64,")) {
      return NextResponse.json(
        { error: "Invalid signature format" },
        { status: 400 }
      );
    }

    // Find the application
    const existing = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        applicantId: true,
        status: true,
        email: true,
        fullName: true,
        referenceNumber: true,
        contractAccepted: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (existing.status !== "CONTRACT_ISSUED") {
      return NextResponse.json(
        { error: "Contract is not available for signing" },
        { status: 400 }
      );
    }

    if (existing.contractAccepted) {
      return NextResponse.json(
        { error: "Contract has already been signed" },
        { status: 400 }
      );
    }

    // Update the application
    const updated = await prisma.application.update({
      where: { id },
      data: {
        contractSignatureImage: signatureImage,
        contractSignedAt: new Date(),
        contractAccepted: true,
        contractAcceptedAt: new Date(),
        contractAcceptedName: signedName || existing.fullName,
        status: "AWAITING_INVOICE",
        adminSeen: false,
      },
    });

    // Log the status change
    await prisma.statusLog.create({
      data: {
        applicationId: id,
        fromStatus: "CONTRACT_ISSUED",
        toStatus: "AWAITING_INVOICE",
        note: "Contract signed digitally by client — auto-advanced to awaiting invoice",
        updatedById: existing.applicantId,
      },
    });

    // Fire confirmation emails (non-blocking — don't fail request if emails fail)
    try {
      await sendContractSignedClientEmail({
        to: existing.email,
        fullName: existing.fullName,
        referenceNumber: existing.referenceNumber,
      });
    } catch (err) {
      console.error("Client confirmation email failed:", err);
    }

    try {
      await sendContractSignedAdminEmail({
        fullName: existing.fullName,
        email: existing.email,
        referenceNumber: existing.referenceNumber,
        signedAt: updated.contractSignedAt || new Date(),
      });
    } catch (err) {
      console.error("Admin notification email failed:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contract signing failed:", error);
    return NextResponse.json(
      { error: "Failed to process signature" },
      { status: 500 }
    );
  }
}
