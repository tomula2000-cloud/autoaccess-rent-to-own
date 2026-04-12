import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(
    new URL("/portal-login", request.url),
    303
  );

  response.cookies.set("autoaccess_portal_ref", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("autoaccess_portal_email", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("autoaccess_portal_application_id", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}