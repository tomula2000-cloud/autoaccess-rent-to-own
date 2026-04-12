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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function redirectPage(request: Request, message: string, isError = false) {
  const url = new URL("/portal/documents", request.url);

  if (isError) {
    url.searchParams.set("error", message);
  } else {
    url.searchParams.set("success", message);
  }

  const safeUrl = escapeHtml(url.toString());

  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=${safeUrl}" />
    <title>Redirecting...</title>
    <script>
      window.location.replace(${JSON.stringify(url.toString())});
    </script>
  </head>
  <body>
    <p>Redirecting...</p>
    <p><a href="${safeUrl}">Continue</a></p>
  </body>
</html>
`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const documentType = String(formData.get("documentType") || "").trim();

    if (!documentType) {
      return redirectPage(request, "Document type is required.", true);
    }

    if (!allowedDocumentTypes.includes(documentType as AllowedDocumentType)) {
      return redirectPage(request, "Invalid document type.", true);
    }

    const deviceFiles = formData.getAll("files").filter((item) => item instanceof File) as File[];
    const cameraFiles = formData.getAll("cameraFiles").filter((item) => item instanceof File) as File[];

    const allFiles = [...deviceFiles, ...cameraFiles].filter(
      (file) => file.name && file.name.trim() !== ""
    );

    if (allFiles.length === 0) {
      return redirectPage(request, "Please choose at least one file.", true);
    }

    const latestApplication = await prisma.application.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!latestApplication) {
      return redirectPage(
        request,
        "No application found to attach the document(s) to.",
        true
      );
    }

    for (const file of allFiles) {
      const fileName = file.name.trim();

      await prisma.document.create({
        data: {
          fileName,
          fileUrl: `local-upload-pending/${fileName}`,
          documentType: documentType as AllowedDocumentType,
          applicationId: latestApplication.id,
          uploadedById: latestApplication.applicantId,
        },
      });
    }

    const successMessage =
      allFiles.length === 1
        ? "1 document uploaded successfully."
        : `${allFiles.length} documents uploaded successfully.`;

    return redirectPage(request, successMessage);
  } catch (error) {
    console.error("Document upload failed:", error);

    return redirectPage(
      request,
      "Something went wrong while creating the document record(s).",
      true
    );
  }
}