import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/portal-login?error=Invalid+link.", request.url));
  }

  const application = await prisma.application.findFirst({
    where: {
      portalToken: token,
      portalTokenExpiry: { gt: new Date() },
    },
    select: {
      id: true,
      referenceNumber: true,
      email: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!application) {
    return NextResponse.redirect(new URL("/portal-login?error=This+link+has+expired+or+is+invalid.+Please+log+in+manually.", request.url));
  }

  // Clear the token so it can only be used once
  await prisma.application.update({
    where: { id: application.id },
    data: { portalToken: null, portalTokenExpiry: null },
  });

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 24,
  };

  const response = NextResponse.redirect(new URL("/portal", request.url));
  response.cookies.set("autoaccess_portal_ref", application.referenceNumber, cookieOptions);
  response.cookies.set("autoaccess_portal_email", application.email, cookieOptions);
  response.cookies.set("autoaccess_portal_application_id", application.id, cookieOptions);

  return response;
}
