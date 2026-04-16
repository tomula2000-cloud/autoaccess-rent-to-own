import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import { head } from "@vercel/blob";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as { role?: string; loginType?: string } | undefined;

    if (!sessionUser || sessionUser.role !== "ADMIN" || sessionUser.loginType !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const { downloadUrl } = await head(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error("Document signed URL error:", error);
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }
}
