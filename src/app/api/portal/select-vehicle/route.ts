import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const referenceNumber = cookieStore.get("autoaccess_portal_ref")?.value;
    const email = cookieStore.get("autoaccess_portal_email")?.value;
    const applicationId = cookieStore.get("autoaccess_portal_application_id")?.value;

    if (!referenceNumber || !email || !applicationId) {
      return NextResponse.redirect(new URL("/portal-login", request.url), 303);
    }

    const formData = await request.formData();
    const vehicleId = String(formData.get("vehicleId") || "").trim();

    if (!vehicleId) {
      return NextResponse.redirect(
        new URL("/portal/select-vehicle", request.url),
        303
      );
    }

    const application = await prisma.application.findUnique({
      where: {
        referenceNumber,
      },
      select: {
        id: true,
        email: true,
        applicantId: true,
        status: true,
        selectedVehicleId: true,
      },
    });

    if (
      !application ||
      application.id !== applicationId ||
      application.email.toLowerCase() !== email.toLowerCase()
    ) {
      return NextResponse.redirect(new URL("/portal-login", request.url), 303);
    }

    if (application.status !== "APPROVED_IN_PRINCIPLE") {
      return NextResponse.redirect(new URL("/portal", request.url), 303);
    }

    const vehicle = await prisma.vehicleOffer.findUnique({
      where: {
        id: vehicleId,
      },
      select: {
        id: true,
        title: true,
        status: true,
      },
    });

    if (!vehicle || vehicle.status !== "AVAILABLE") {
      return NextResponse.redirect(
        new URL("/portal/select-vehicle", request.url),
        303
      );
    }

    await prisma.application.update({
      where: {
        id: application.id,
      },
      data: {
        selectedVehicleId: vehicle.id,
        preferredVehicle: vehicle.title,
      },
    });

    await prisma.statusLog.create({
      data: {
        applicationId: application.id,
        fromStatus: application.status as never,
        toStatus: application.status as never,
        note: `Client selected vehicle option: ${vehicle.title}`,
        updatedById: application.applicantId,
      },
    });

    return NextResponse.redirect(
      new URL("/portal/select-vehicle", request.url),
      303
    );
  } catch (error) {
    console.error("Portal vehicle selection failed:", error);

    return NextResponse.redirect(
      new URL("/portal/select-vehicle", request.url),
      303
    );
  }
}