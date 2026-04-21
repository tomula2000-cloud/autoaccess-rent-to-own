import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("autoaccess_portal_email")?.value;

    if (!email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const application = await prisma.application.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referenceNumber: true,
        status: true,
        proofOfPaymentUrls: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (!["INVOICE_ISSUED", "AWAITING_PAYMENT"].includes(application.status)) {
      return NextResponse.json(
        { error: "Invoice must be issued before uploading proof of payment" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB per file

    const uploadedUrls: Array<{ url: string; filename: string; uploadedAt: string }> = [];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File type not allowed: ${file.name}. Only PDF, JPG, PNG, WEBP allowed.` },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Maximum 10MB per file.` },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const token = process.env.VEHICLE_IMAGES_READ_WRITE_TOKEN;
      const blob = await put(
        `pop/${application.referenceNumber}/${timestamp}-${safeName}`,
        file,
        { access: "public", addRandomSuffix: false, token }
      );

      uploadedUrls.push({
        url: blob.url,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
      });
    }

    // Merge with existing POP files (if re-uploading additional files)
    const existingUrls = (application.proofOfPaymentUrls as any[]) || [];
    const allUrls = [...existingUrls, ...uploadedUrls];

    await prisma.application.update({
      where: { id: application.id },
      data: {
        proofOfPaymentUrls: allUrls,
        proofOfPaymentSubmittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, files: allUrls });
  } catch (error) {
    console.error("POP upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("autoaccess_portal_email")?.value;

    if (!email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { url } = await req.json();

    const application = await prisma.application.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        proofOfPaymentUrls: true,
        clientPaymentCompletedAt: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Once payment is completed, cannot delete files
    if (application.clientPaymentCompletedAt) {
      return NextResponse.json(
        { error: "Cannot delete files after payment confirmation" },
        { status: 400 }
      );
    }

    const existingUrls = (application.proofOfPaymentUrls as any[]) || [];
    const filtered = existingUrls.filter((f: any) => f.url !== url);

    await prisma.application.update({
      where: { id: application.id },
      data: {
        proofOfPaymentUrls: filtered,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POP delete failed:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
