import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

type ApplicationDocumentRow = {
  documentType: string;
};

const BASE_REQUIRED_TYPES = [
  ["ID_DOCUMENT", "PASSPORT"],
  ["BANK_STATEMENT"],
  ["PROOF_OF_RESIDENCE"],
  ["DRIVERS_LICENSE"],
] as const;

const EMPLOYED_REQUIRED_TYPES = [
  ...BASE_REQUIRED_TYPES,
  ["PROOF_OF_INCOME"],
] as const;

const SELF_EMPLOYED_REQUIRED_TYPES = [
  ...BASE_REQUIRED_TYPES,
  ["BANK_STATEMENT"],
] as const;

const ALLOWED_CONFIRM_STATUSES = new Set([
  "APPLICATION_RECEIVED",
  "PRE_QUALIFICATION_REVIEW",
  "PRE_QUALIFIED",
  "AWAITING_DOCUMENTS",
  "ADDITIONAL_DOCUMENTS_REQUIRED",
  "DOCUMENTS_SUBMITTED",
]);

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
        employmentStatus: true,
        documents: {
          select: {
            documentType: true,
          },
        },
      },
    });

    if (
      !application ||
      application.id !== applicationId ||
      application.email.toLowerCase() !== email.toLowerCase()
    ) {
      return NextResponse.redirect(new URL("/portal-login", request.url), 303);
    }

    const isSelfEmployedFlow =
      application.employmentStatus === "SELF_EMPLOYED" ||
      application.employmentStatus === "BUSINESS_OWNER";

    const requiredTypes = isSelfEmployedFlow
      ? SELF_EMPLOYED_REQUIRED_TYPES
      : EMPLOYED_REQUIRED_TYPES;

    const submittedTypes = new Set(
      application.documents.map(
        (doc: ApplicationDocumentRow) => doc.documentType
      )
    );

    const allRequiredSubmitted = requiredTypes.every((group) =>
      group.some((type) => submittedTypes.has(type))
    );

    if (!allRequiredSubmitted) {
      return NextResponse.redirect(
        new URL(
          "/portal/documents?error=Please+upload+all+required+documents+before+confirming+submission.",
          request.url
        ),
        303
      );
    }

    if (application.status === "DOCUMENTS_SUBMITTED") {
      return NextResponse.redirect(
        new URL(
          "/portal/documents?success=Your+documents+have+already+been+confirmed+as+submitted.",
          request.url
        ),
        303
      );
    }

    if (!ALLOWED_CONFIRM_STATUSES.has(application.status)) {
      return NextResponse.redirect(
        new URL(
          "/portal/documents?error=Your+application+is+already+beyond+the+document+submission+stage+and+cannot+be+reconfirmed.",
          request.url
        ),
        303
      );
    }

    const previousStatus = application.status;

    await prisma.application.update({
      where: {
        id: application.id,
      },
      data: {
        status: "DOCUMENTS_SUBMITTED" as never,
        adminSeen: false,
      },
    });

    await prisma.statusLog.create({
      data: {
        applicationId: application.id,
        fromStatus: previousStatus as never,
        toStatus: "DOCUMENTS_SUBMITTED" as never,
        note: "Client confirmed that all required documents have been submitted.",
        updatedById: application.applicantId,
      },
    });

    return NextResponse.redirect(
      new URL(
        "/portal",
        request.url
      ),
      303
    );
  } catch (error) {
    console.error("Portal document completion failed:", error);

    return NextResponse.redirect(
      new URL(
        "/portal/documents?error=Something+went+wrong+while+confirming+your+document+submission.",
        request.url
      ),
      303
    );
  }
}