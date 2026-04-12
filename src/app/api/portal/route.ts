import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

function redirectWithMessage(request: Request, type: "success" | "error", message: string) {
  const url = new URL("/portal/documents", request.url);
  url.searchParams.set(type, message);
  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const documentType = String(formData.get("documentType") || "");
    const file = formData.get("file");
    const fileName = file instanceof File ? file.name : "";

    if (!documentType || !allowedDocumentTypes.includes(documentType as AllowedDocumentType)) {
      return redirectWithMessage(request, "error", "Please select a valid document type.");
    }

    if (!fileName.trim()) {
      return redirectWithMessage(request, "error", "Please choose a file first.");
    }

    const latestApplication = await prisma.application.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!latestApplication) {
      return redirectWithMessage(
        request,
        "error",
        "No application was found to attach this document to."
      );
    }

    await prisma.document.create({
      data: {
        fileName: fileName.trim(),
        fileUrl: `local-upload-pending/${fileName.trim()}`,
        documentType: documentType as AllowedDocumentType,
        applicationId: latestApplication.id,
        uploadedById: latestApplication.applicantId,
      },
    });

    return redirectWithMessage(request, "success", "Document uploaded successfully.");
  } catch (error) {
    console.error("Document upload failed:", error);
    return redirectWithMessage(
      request,
      "error",
      "Something went wrong while uploading the document."
    );
  }
}