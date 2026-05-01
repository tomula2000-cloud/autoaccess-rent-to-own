import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type PortalLoginApplication = {
  id: string;
  referenceNumber: string;
  email: string;
  fullName: string;
  status: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeReference(value: string) {
  return value.replace(/\s+/g, "").trim().toUpperCase();
}

function setPortalCookies(
  response: NextResponse,
  application: {
    id: string;
    referenceNumber: string;
    email: string;
  }
) {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/",
    maxAge: 60 * 60 * 24,
  };

  response.cookies.set(
    "autoaccess_portal_ref",
    String(application.referenceNumber),
    cookieOptions
  );

  response.cookies.set(
    "autoaccess_portal_email",
    String(application.email),
    cookieOptions
  );

  response.cookies.set(
    "autoaccess_portal_application_id",
    String(application.id),
    cookieOptions
  );
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let rawEmail = "";
    let rawReferenceNumber = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      rawEmail = String(body.email || "");
      rawReferenceNumber = String(body.referenceNumber || "");
    } else {
      const formData = await request.formData();
      rawEmail = String(formData.get("email") || "");
      rawReferenceNumber = String(formData.get("referenceNumber") || "");
    }

    const email = normalizeEmail(rawEmail);
    const referenceNumber = normalizeReference(rawReferenceNumber);

    if (!email || !referenceNumber) {
      if (contentType.includes("application/json")) {
        return NextResponse.json(
          {
            success: false,
            message: "Email and reference number are required.",
          },
          { status: 400 }
        );
      }

      return NextResponse.redirect(
        new URL(
          "/portal-login?error=Email%20and%20reference%20number%20are%20required.",
          request.url
        )
      );
    }

    const applications: PortalLoginApplication[] =
      await prisma.application.findMany({
        select: {
          id: true,
          referenceNumber: true,
          email: true,
          fullName: true,
          status: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const matchedApplication = applications.find(
      (application: PortalLoginApplication) => {
        const appEmail = normalizeEmail(application.email || "");
        const appReference = normalizeReference(
          application.referenceNumber || ""
        );

        return appEmail === email && appReference === referenceNumber;
      }
    );

    if (!matchedApplication) {
      if (contentType.includes("application/json")) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email or reference number.",
          },
          { status: 401 }
        );
      }

      return NextResponse.redirect(
        new URL(
          "/portal-login?error=Invalid%20email%20or%20reference%20number.",
          request.url
        )
      );
    }

    // Check if the user account is blocked
    const user = await prisma.user.findUnique({
      where: { email: matchedApplication.email },
      select: { isBlocked: true },
    });

    if (user?.isBlocked) {
      const blockedMsg = "Your%20profile%20has%20been%20suspended.%20Please%20contact%20us%20at%20admin%40autoaccess.co.za%20or%20call%20087%20012%206734.";
      if (contentType.includes("application/json")) {
        return NextResponse.json(
          { success: false, message: "Your profile has been suspended. Please contact us at admin@autoaccess.co.za or call 087 012 6734." },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL(`/portal-login?error=${blockedMsg}`, request.url));
    }

    if (contentType.includes("application/json")) {
      const response = NextResponse.json({
        success: true,
        message: "Portal login successful.",
      });

      setPortalCookies(response, matchedApplication);
      return response;
    }

    const docStatuses = ["PRE_QUALIFIED", "AWAITING_DOCUMENTS", "ADDITIONAL_DOCUMENTS_REQUIRED"];
    const landingPath = docStatuses.includes(matchedApplication.status) ? "/portal/documents" : "/portal";
    const response = NextResponse.redirect(new URL(landingPath, request.url));
    setPortalCookies(response, matchedApplication);
    return response;
  } catch (error) {
    console.error("Portal login failed:", error);

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong during portal login.",
        },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      new URL(
        "/portal-login?error=Something%20went%20wrong%20during%20portal%20login.",
        request.url
      )
    );
  }
}