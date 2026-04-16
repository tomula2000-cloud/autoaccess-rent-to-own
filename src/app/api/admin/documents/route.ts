import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";

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

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const body = response.body;

    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    console.error("Document proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 });
  }
}
