import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

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
      where: {
        referenceNumber,
      },
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
    const documentType = String(formData.get("documentType") || "OTHER");

    const files = formData
      .getAll("files")
      .filter((item) => item instanceof File) as File[];

    const allFiles = files.filter(
      (file) => file.name && file.name.trim() !== ""
    );

    if (allFiles.length === 0) {
      return NextResponse.redirect(
        new URL(
          "/portal/documents?error=Please+choose+at+least+one+file.",
          request.url
        ),
        303
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    for (const file of allFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalName = safeFileName(file.name.trim());
      const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${originalName}`;
      const absolutePath = path.join(uploadsDir, uniqueName);
      const publicFileUrl = `/uploads/${uniqueName}`;

      await writeFile(absolutePath, buffer);

      await prisma.document.create({
        data: {
          applicationId: application.id,
          uploadedById: application.applicantId,
          fileName: file.name.trim(),
          fileUrl: publicFileUrl,
          documentType,
        },
      });
    }

    const successMessage =
      allFiles.length === 1
        ? "1 document uploaded successfully."
        : `${allFiles.length} documents uploaded successfully.`;

    return NextResponse.redirect(
      new URL(
        `/portal/documents?success=${encodeURIComponent(successMessage)}`,
        request.url
      ),
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