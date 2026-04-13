import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import crypto from "crypto";

const allowedDocumentTypes = [
  "ID_DOCUMENT",
  "PASSPORT",
  "PROOF_OF_INCOME",
  "BANK_STATEMENT",
  "PROOF_OF_RESIDENCE",
  "DRIVERS_LICENSE",
  "OTHER",
] as const;

type AllowedDocumentType = (typeof allowedDocumentTypes)[number];

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

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
      where: { referenceNumber },
      select: {
        id: true,
        email: true,
        applicantId: true,
      },
    });

    if (
      !application ||
      application.id !== applicationId ||
      application.email.toLowerCase() !== email.toLowerCase()
    ) {
      return NextResponse.redirect(new URL("/portal-login", request.url), 303);
    }

    const formData = await request.formData();
    const rawDocumentType = String(formData.get("documentType") || "OTHER").trim();

    if (!allowedDocumentTypes.includes(rawDocumentType as AllowedDocumentType)) {
      return NextResponse.redirect(
        new URL("/portal/documents?error=Invalid+document+type.", request.url),
        303
      );
    }

    const documentType = rawDocumentType as AllowedDocumentType;

    const deviceFiles = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File);

    const cameraFiles = formData
      .getAll("cameraFiles")
      .filter((item): item is File => item instanceof File);

    const allFiles = [...deviceFiles, ...cameraFiles].filter(
      (file) => file.name && file.name.trim() !== "" && file.size > 0
    );

    if (allFiles.length === 0) {
      return NextResponse.redirect(
        new URL("/portal/documents?error=Please+choose+at+least+one+file.", request.url),
        303
      );
    }

    for (const file of allFiles) {
      const originalName = safeFileName(file.name.trim());
      const uniqueName = `${application.id}/${Date.now()}-${crypto.randomUUID()}-${originalName}`;

      const blob = await put(uniqueName, file, {
        access: "public",
        addRandomSuffix: false,
      });

      await prisma.document.create({
        data: {
          applicationId: application.id,
          uploadedById: application.applicantId,
          fileName: file.name.trim(),
          fileUrl: blob.url,
          documentType,
        },
      });
    }

    const successMessage =
      allFiles.length === 1
        ? "1 document uploaded successfully."
        : `${allFiles.length} documents uploaded successfully.`;

    return NextResponse.redirect(
      new URL(`/portal/documents?success=${encodeURIComponent(successMessage)}`, request.url),
      303
    );
  } catch (error) {
    console.error("Portal document upload failed:", error);

    return NextResponse.redirect(
      new URL(
        "/portal/documents?error=Something+went+wrong+while+uploading+documents.",
        request.url
      ),
      303
    );
  }
}