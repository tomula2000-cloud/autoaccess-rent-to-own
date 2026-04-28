import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendApplicationReceivedEmail } from "@/lib/email";
import { sendBulkSMS } from "@/lib/sms";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function generateReferenceNumber() {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `AA${random}`;
}

function isValidSouthAfricanPhone(value: string) {
  return /^0\d{9}$/.test(value);
}

function isValidSouthAfricanId(value: string) {
  return /^\d{13}$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName || "").trim();
    const email = normalizeEmail(String(body.email || ""));
    const phone = digitsOnly(String(body.phone || ""));
    const identityType = String(body.identityType || "").trim();
    const identityNumberRaw = String(body.identityNumber || "").trim();
    const identityNumber =
      identityType === "SA_ID"
        ? digitsOnly(identityNumberRaw)
        : identityNumberRaw;
    const employmentStatus = String(body.employmentStatus || "").trim();
    const monthlyIncome = String(body.monthlyIncome || "").trim();
    const salaryDate = String(body.salaryDate || "").trim();
    const preferredVehicle = String(body.preferredVehicle || "").trim();
    const physicalAddress = String(body.physicalAddress || "").trim();
    const notes = String(body.notes || "").trim();

    if (
      !fullName ||
      !email ||
      !phone ||
      !identityType ||
      !identityNumber ||
      !employmentStatus ||
      !monthlyIncome ||
      !preferredVehicle
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    if (!isValidSouthAfricanPhone(phone)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Phone number must be a valid 10 digit South African number, for example 0711231212.",
        },
        { status: 400 }
      );
    }

    if (identityType === "SA_ID" && !isValidSouthAfricanId(identityNumber)) {
      return NextResponse.json(
        {
          success: false,
          message: "South African ID number must be exactly 13 digits.",
        },
        { status: 400 }
      );
    }

    if (identityType === "SA_ID") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const recentApplication = await prisma.application.findFirst({
        where: {
          identityNumber,
          createdAt: {
            gte: oneMonthAgo,
          },
        },
        select: {
          id: true,
          createdAt: true,
          referenceNumber: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (recentApplication) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This South African ID number has already applied within the last 1 month. Please wait before submitting another application.",
          },
          { status: 400 }
        );
      }
    }

    let referenceNumber = generateReferenceNumber();

    while (
      await prisma.application.findUnique({
        where: { referenceNumber },
        select: { id: true },
      })
    ) {
      referenceNumber = generateReferenceNumber();
    }

    let applicant = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    if (!applicant) {
      applicant = await prisma.user.create({
        data: {
          fullName,
          email,
          phone,
          role: "CLIENT",
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
      });
    }

    const application = await prisma.application.create({
      data: {
        applicantId: applicant.id,
        referenceNumber,
        fullName,
        email,
        phone,
        identityType: identityType as never,
        identityNumber,
        employmentStatus,
        monthlyIncome,
        salaryDate: salaryDate || null,
        preferredVehicle,
        physicalAddress: physicalAddress || null,
        notes: notes || null,
        termsAccepted: Boolean(body.termsAccepted),
        status: "APPLICATION_RECEIVED" as never,
      },
      select: {
        id: true,
        referenceNumber: true,
      },
    });

    await prisma.statusLog.create({
      data: {
        applicationId: application.id,
        fromStatus: "APPLICATION_RECEIVED" as never,
        toStatus: "APPLICATION_RECEIVED" as never,
        note: "Application submitted successfully.",
        updatedById: applicant.id,
      },
      select: {
        id: true,
      },
    });

    // Extract first name from full name
    const firstName = fullName.split(" ")[0];

    try {
      await sendApplicationReceivedEmail({
        to: email,
        fullName,
        referenceNumber: application.referenceNumber,
      });
    } catch (emailError) {
      console.error("Application email failed:", emailError);
    }

    try {
      await sendBulkSMS({
        to: phone,
        message: `Congratulations ${firstName}! Your Auto Access application (Ref: ${application.referenceNumber}) has been pre-approved. Please log in to your portal to upload your required documents: https://autoaccess.co.za/portal`,
      });
    } catch (smsError) {
      console.error("Application SMS failed:", smsError);
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      referenceNumber: application.referenceNumber,
    });
  } catch (error) {
    console.error("Application submission failed:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        success: false,
        message: `Application submission failed: ${message}`,
      },
      { status: 500 }
    );
  }
}