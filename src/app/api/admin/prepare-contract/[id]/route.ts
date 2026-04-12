import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";

function parseMoney(value: string) {
  const cleaned = value.replace(/[^\d.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value: string) {
  const amount = parseMoney(value);

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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
      return NextResponse.redirect(new URL("/admin-login", request.url), 303);
    }

    const adminUser = await resolveAdminUser(sessionUser);

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin-login", request.url), 303);
    }

    const { id } = await context.params;
    const formData = await request.formData();

    const contractVehicleTitle = String(
      formData.get("contractVehicleTitle") || ""
    ).trim();
    const contractVehicleImage = String(
      formData.get("contractVehicleImage") || ""
    ).trim();
    const contractVehicleYearModel = String(
      formData.get("contractVehicleYearModel") || ""
    ).trim();
    const contractVehicleMileage = String(
      formData.get("contractVehicleMileage") || ""
    ).trim();
    const contractVehicleTransmission = String(
      formData.get("contractVehicleTransmission") || ""
    ).trim();
    const contractVehicleFuelType = String(
      formData.get("contractVehicleFuelType") || ""
    ).trim();

    const contractDepositAmount = String(
      formData.get("contractDepositAmount") || ""
    ).trim();
    const contractLicensingFee = String(
      formData.get("contractLicensingFee") || ""
    ).trim();
    const contractMonthlyPayment = String(
      formData.get("contractMonthlyPayment") || ""
    ).trim();
    const contractTerm = String(formData.get("contractTerm") || "").trim();

    const contractClientFullName = String(
      formData.get("contractClientFullName") || ""
    ).trim();
    const contractClientEmail = String(
      formData.get("contractClientEmail") || ""
    ).trim();
    const contractClientPhone = String(
      formData.get("contractClientPhone") || ""
    ).trim();
    const contractClientIdentityType = String(
      formData.get("contractClientIdentityType") || ""
    ).trim();
    const contractClientIdentityNumber = String(
      formData.get("contractClientIdentityNumber") || ""
    ).trim();
    const contractClientAddress = String(
      formData.get("contractClientAddress") || ""
    ).trim();

    const contractTerms = String(formData.get("contractTerms") || "").trim();

    if (!contractVehicleTitle) {
      return NextResponse.redirect(
        new URL(
          `/admin/${id}?error=Please+provide+the+contract+vehicle+title.`,
          request.url
        ),
        303
      );
    }

    if (
      !contractDepositAmount ||
      !contractMonthlyPayment ||
      !contractLicensingFee
    ) {
      return NextResponse.redirect(
        new URL(
          `/admin/${id}?error=Please+complete+the+contract+financial+figures+before+saving.`,
          request.url
        ),
        303
      );
    }

    if (!contractClientFullName || !contractClientIdentityNumber) {
      return NextResponse.redirect(
        new URL(
          `/admin/${id}?error=Please+complete+the+client+identity+details+before+saving.`,
          request.url
        ),
        303
      );
    }

    if (!contractTerms) {
      return NextResponse.redirect(
        new URL(
          `/admin/${id}?error=Please+provide+the+contract+terms+before+saving.`,
          request.url
        ),
        303
      );
    }

    const totalNowValue =
      parseMoney(contractDepositAmount) + parseMoney(contractLicensingFee);

    const contractTotalPayableNow = formatMoney(String(totalNowValue));

    const existingApplication = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existingApplication) {
      return NextResponse.redirect(
        new URL(`/admin?error=Application+not+found.`, request.url),
        303
      );
    }

    await prisma.$transaction([
      prisma.application.update({
        where: { id },
        data: {
          contractVehicleTitle,
          contractVehicleImage: contractVehicleImage || null,
          contractVehicleYearModel: contractVehicleYearModel || null,
          contractVehicleMileage: contractVehicleMileage || null,
          contractVehicleTransmission: contractVehicleTransmission || null,
          contractVehicleFuelType: contractVehicleFuelType || null,
          contractDepositAmount: formatMoney(contractDepositAmount),
          contractLicensingFee: formatMoney(contractLicensingFee),
          contractMonthlyPayment: formatMoney(contractMonthlyPayment),
          contractTotalPayableNow,
          contractTerm: contractTerm || null,
          contractClientFullName,
          contractClientEmail: contractClientEmail || null,
          contractClientPhone: contractClientPhone || null,
          contractClientIdentityType: contractClientIdentityType || null,
          contractClientIdentityNumber,
          contractClientAddress: contractClientAddress || null,
          contractTerms,
        },
      }),
      prisma.statusLog.create({
        data: {
          applicationId: id,
          fromStatus: existingApplication.status,
          toStatus: existingApplication.status,
          note: "Admin prepared and saved contract snapshot details before contract issue.",
          updatedById: adminUser.id,
        },
      }),
    ]);

    return NextResponse.redirect(
      new URL(
        `/admin/${id}?success=Contract+snapshot+saved+successfully.`,
        request.url
      ),
      303
    );
  } catch (error) {
    console.error("Prepare contract failed:", error);

    const { id } = await context.params;

    return NextResponse.redirect(
      new URL(
        `/admin/${id}?error=Something+went+wrong+while+saving+the+contract+snapshot.`,
        request.url
      ),
      303
    );
  }
}