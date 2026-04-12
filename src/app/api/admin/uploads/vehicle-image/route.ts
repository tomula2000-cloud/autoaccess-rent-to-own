import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../auth";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getExtensionFromMimeType(type: string) {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as
      | {
          email?: string;
          role?: string;
        }
      | undefined;

    if (!sessionUser?.email || sessionUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No image file was provided." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG, and WEBP images are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be 2 MB or less.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = getExtensionFromMimeType(file.type);
    const safeBaseName = path
      .basename(file.name, path.extname(file.name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "vehicle";

    const uniqueId = crypto.randomBytes(8).toString("hex");
    const fileName = `${Date.now()}-${safeBaseName}-${uniqueId}.${extension}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "vehicles");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/vehicles/${fileName}`;

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully.",
      url: publicUrl,
    });
  } catch (error) {
    console.error("Vehicle image upload failed:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        success: false,
        message: `Vehicle image upload failed: ${message}`,
      },
      { status: 500 }
    );
  }
}