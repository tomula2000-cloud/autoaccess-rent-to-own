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
        preferredVehicle: true,
        contractRequestedAt: true,
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
      return NextResponse.redirect(
        new URL(
          "/portal?error=Only+applications+approved+in+principle+can+request+a+contract.",
          request.url
        ),
        303
      );
    }

    if (!application.selectedVehicleId) {
      return NextResponse.redirect(
        new URL(
          "/portal/select-vehicle?error=Please+select+a+vehicle+before+requesting+a+contract.",
          request.url
        ),
        303
      );
    }

    const previousStatus = application.status;
    const now = new Date();

    await prisma.application.update({
      where: {
        id: application.id,
      },
      data: {
        status: "CONTRACT_REQUESTED" as never,
        contractRequestedAt: now,
        contractIssuedAt: null,
        contractExpiresAt: null,
        contractCancelledAt: null,
      },
    });

    await prisma.statusLog.create({
      data: {
        applicationId: application.id,
        fromStatus: previousStatus as never,
        toStatus: "CONTRACT_REQUESTED" as never,
        note: `Client requested contract for selected vehicle: ${application.preferredVehicle}`,
        updatedById: application.applicantId,
      },
    });

    return NextResponse.redirect(
      new URL(
        "/portal?success=Your+contract+request+has+been+submitted.+Admin+will+review+your+details+before+issuing+the+contract.",
        request.url
      ),
      303
    );
  } catch (error) {
    console.error("Portal contract request failed:", error);

    return NextResponse.redirect(
      new URL(
        "/portal/select-vehicle?error=Something+went+wrong+while+requesting+your+contract.",
        request.url
      ),
      303
    );
  }
}