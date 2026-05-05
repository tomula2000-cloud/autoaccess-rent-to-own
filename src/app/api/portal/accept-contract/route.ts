import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendContractSignedAdminEmail, sendContractSignedClientEmail } from "@/lib/email";

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
    const acceptedName = String(formData.get("acceptedName") || "").trim();
    const acceptedTerms = String(formData.get("acceptedTerms") || "").trim();
    const confirmedDetails = String(formData.get("confirmedDetails") || "").trim();

    if (!acceptedName) {
      return NextResponse.redirect(
        new URL(
          "/portal?error=Please+type+your+full+legal+name+to+accept+the+contract.",
          request.url
        ),
        303
      );
    }

    if (acceptedTerms !== "yes" || confirmedDetails !== "yes") {
      return NextResponse.redirect(
        new URL(
          "/portal?error=You+must+confirm+the+contract+terms+and+your+details+before+continuing.",
          request.url
        ),
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
        fullName: true,
        status: true,
        contractAccepted: true,
        contractExpiresAt: true,
        referenceNumber: true,
      },
    });

    if (
      !application ||
      application.id !== applicationId ||
      application.email.toLowerCase() !== email.toLowerCase()
    ) {
      return NextResponse.redirect(new URL("/portal-login", request.url), 303);
    }

    if (application.status !== "CONTRACT_ISSUED") {
      return NextResponse.redirect(
        new URL(
          "/portal?error=Your+application+is+not+currently+in+the+contract+acceptance+stage.",
          request.url
        ),
        303
      );
    }

    if (application.contractAccepted) {
      return NextResponse.redirect(
        new URL(
          "/portal?success=Your+contract+has+already+been+accepted.",
          request.url
        ),
        303
      );
    }

    if (
      application.contractExpiresAt &&
      new Date(application.contractExpiresAt) < new Date()
    ) {
      await prisma.$transaction([
        prisma.application.update({
          where: { id: application.id },
          data: {
            status: "CONTRACT_EXPIRED" as never,
          },
        }),
        prisma.statusLog.create({
          data: {
            applicationId: application.id,
            fromStatus: "CONTRACT_ISSUED" as never,
            toStatus: "CONTRACT_EXPIRED" as never,
            note: "Contract acceptance attempt occurred after contract expiry.",
            updatedById: application.applicantId,
          },
        }),
      ]);

      return NextResponse.redirect(
        new URL(
          "/portal?error=The+contract+period+has+expired+and+can+no+longer+be+accepted.",
          request.url
        ),
        303
      );
    }

    await prisma.$transaction([
      prisma.application.update({
        where: { id: application.id },
        data: {
          contractAccepted: true,
          contractAcceptedAt: new Date(),
          contractAcceptedName: acceptedName,
          status: "AWAITING_INVOICE" as never,
          adminSeen: false,
        },
      }),
      prisma.statusLog.create({
        data: {
          applicationId: application.id,
          fromStatus: "CONTRACT_ISSUED" as never,
          toStatus: "AWAITING_INVOICE" as never,
          note: `Client accepted contract digitally as: ${acceptedName}`,
          updatedById: application.applicantId,
        },
      }),
    ]);

    // Notify admin
    try {
      await sendContractSignedAdminEmail({
        fullName: application.fullName,
        email: application.email,
        referenceNumber: application.referenceNumber,
        signedAt: new Date(),
      });
    } catch (e) {
      console.error("Admin notification email failed:", e);
    }
    return NextResponse.redirect(
      new URL(
        "/portal?success=Your+signed+contract+has+been+recorded.+Your+application+is+now+awaiting+invoice+release.",
        request.url
      ),
      303
    );
  } catch (error) {
    console.error("Contract acceptance failed:", error);

    return NextResponse.redirect(
      new URL(
        "/portal?error=Something+went+wrong+while+accepting+the+contract.",
        request.url
      ),
      303
    );
  }
}