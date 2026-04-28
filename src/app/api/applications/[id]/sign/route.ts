import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContractSignedClientEmail, sendContractSignedAdminEmail } from "@/lib/email";
import { generateContractPdf } from "@/lib/contract-pdf";

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
      return NextResponse.json({ error: "Signature is required" }, { status: 400 });
    }

    if (!signatureImage.startsWith("data:image/png;base64,")) {
      return NextResponse.json({ error: "Invalid signature format" }, { status: 400 });
    }

    const existing = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        applicantId: true,
        status: true,
        email: true,
        fullName: true,
        phone: true,
        identityType: true,
        identityNumber: true,
        physicalAddress: true,
        referenceNumber: true,
        contractAccepted: true,
        contractIssuedAt: true,
        contractVehicleTitle: true,
        contractVehicleYearModel: true,
        contractVehicleMileage: true,
        contractVehicleTransmission: true,
        contractVehicleFuelType: true,
        contractDepositAmount: true,
        contractLicensingFee: true,
        contractMonthlyPayment: true,
        contractTotalPayableNow: true,
        contractTerm: true,
        contractClientFullName: true,
        contractClientEmail: true,
        contractClientPhone: true,
        contractClientIdentityType: true,
        contractClientIdentityNumber: true,
        contractClientAddress: true,
        contractTerms: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (existing.status !== "CONTRACT_ISSUED") {
      return NextResponse.json({ error: "Contract is not available for signing" }, { status: 400 });
    }

    if (existing.contractAccepted) {
      return NextResponse.json({ error: "Contract has already been signed" }, { status: 400 });
    }

    const signedAt = new Date();

    const updated = await prisma.application.update({
      where: { id },
      data: {
        contractSignatureImage: signatureImage,
        contractSignedAt: signedAt,
        contractAccepted: true,
        contractAcceptedAt: signedAt,
        contractAcceptedName: signedName || existing.fullName,
        status: "AWAITING_INVOICE",
        adminSeen: false,
      },
    });

    await prisma.statusLog.create({
      data: {
        applicationId: id,
        fromStatus: "CONTRACT_ISSUED",
        toStatus: "AWAITING_INVOICE",
        note: "Contract signed digitally by client — auto-advanced to awaiting invoice",
        updatedById: existing.applicantId,
      },
    });

    // Generate signed contract PDF
    let contractPdfBuffer: Buffer | null = null;
    try {
      contractPdfBuffer = await generateContractPdf({
        referenceNumber: existing.referenceNumber,
        contractSignatureImage: signatureImage,
        contractSignedAt: signedAt,
        contractIssuedAt: existing.contractIssuedAt,
        contractVehicleTitle: existing.contractVehicleTitle,
        contractVehicleYearModel: existing.contractVehicleYearModel,
        contractVehicleMileage: existing.contractVehicleMileage,
        contractVehicleTransmission: existing.contractVehicleTransmission,
        contractVehicleFuelType: existing.contractVehicleFuelType,
        contractDepositAmount: existing.contractDepositAmount,
        contractLicensingFee: existing.contractLicensingFee,
        contractMonthlyPayment: existing.contractMonthlyPayment,
        contractTotalPayableNow: existing.contractTotalPayableNow,
        contractTerm: existing.contractTerm,
        contractClientFullName: existing.contractClientFullName,
        contractClientEmail: existing.contractClientEmail,
        contractClientPhone: existing.contractClientPhone,
        contractClientIdentityType: existing.contractClientIdentityType,
        contractClientIdentityNumber: existing.contractClientIdentityNumber,
        contractClientAddress: existing.contractClientAddress,
        contractTerms: existing.contractTerms,
      });
    } catch (pdfErr) {
      console.error("Contract PDF generation failed:", pdfErr);
    }

    // Send client confirmation email with PDF attachment
    try {
      await sendContractSignedClientEmail({
        to: existing.email,
        fullName: existing.fullName,
        referenceNumber: existing.referenceNumber,
        contractPdfBuffer: contractPdfBuffer ?? undefined,
      });
    } catch (err) {
      console.error("Client confirmation email failed:", err);
    }

    // Send admin notification
    try {
      await sendContractSignedAdminEmail({
        fullName: existing.fullName,
        email: existing.email,
        referenceNumber: existing.referenceNumber,
        signedAt: updated.contractSignedAt || signedAt,
      });
    } catch (err) {
      console.error("Admin notification email failed:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contract signing failed:", error);
    return NextResponse.json({ error: "Failed to process signature" }, { status: 500 });
  }
}
