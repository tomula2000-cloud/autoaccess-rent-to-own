import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { generateContractPdf } from "@/lib/contract-pdf";
import { sendContractSignedClientEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { role?: string; loginType?: string } | undefined;

    if (!sessionUser || sessionUser.role !== "ADMIN" || sessionUser.loginType !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID required" }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: {
        id: true,
        email: true,
        fullName: true,
        referenceNumber: true,
        contractAccepted: true,
        contractSignatureImage: true,
        contractSignedAt: true,
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

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (!application.contractAccepted) {
      return NextResponse.json({ error: "Contract has not been signed yet" }, { status: 400 });
    }

    const contractPdfBuffer = await generateContractPdf({
      referenceNumber: application.referenceNumber,
      contractSignatureImage: application.contractSignatureImage,
      contractSignedAt: application.contractSignedAt,
      contractIssuedAt: application.contractIssuedAt,
      contractVehicleTitle: application.contractVehicleTitle,
      contractVehicleYearModel: application.contractVehicleYearModel,
      contractVehicleMileage: application.contractVehicleMileage,
      contractVehicleTransmission: application.contractVehicleTransmission,
      contractVehicleFuelType: application.contractVehicleFuelType,
      contractDepositAmount: application.contractDepositAmount,
      contractLicensingFee: application.contractLicensingFee,
      contractMonthlyPayment: application.contractMonthlyPayment,
      contractTotalPayableNow: application.contractTotalPayableNow,
      contractTerm: application.contractTerm,
      contractClientFullName: application.contractClientFullName,
      contractClientEmail: application.contractClientEmail,
      contractClientPhone: application.contractClientPhone,
      contractClientIdentityType: application.contractClientIdentityType,
      contractClientIdentityNumber: application.contractClientIdentityNumber,
      contractClientAddress: application.contractClientAddress,
      contractTerms: application.contractTerms,
    });

    await sendContractSignedClientEmail({
      to: application.email,
      fullName: application.fullName,
      referenceNumber: application.referenceNumber,
      contractPdfBuffer,
    });

    return NextResponse.json({ success: true, message: "Contract copy sent successfully." });
  } catch (error) {
    console.error("Resend contract error:", error);
    return NextResponse.json({ error: "Failed to resend contract" }, { status: 500 });
  }
}
