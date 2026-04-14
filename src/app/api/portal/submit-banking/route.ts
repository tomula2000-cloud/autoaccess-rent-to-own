import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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
      where: { referenceNumber },
      select: { id: true, email: true, status: true },
    });

    if (
      !application ||
      application.id !== applicationId ||
      application.email.toLowerCase() !== email.toLowerCase()
    ) {
      return NextResponse.redirect(new URL("/portal-login", request.url), 303);
    }

    if (application.status !== "AWAITING_INVOICE") {
      return NextResponse.redirect(
        new URL("/portal?error=Banking+details+can+only+be+submitted+at+the+awaiting+invoice+stage.", request.url),
        303
      );
    }

    const formData = await request.formData();
    const clientBankName = String(formData.get("clientBankName") || "").trim();
    const clientAccountHolder = String(formData.get("clientAccountHolder") || "").trim();
    const clientAccountNumber = String(formData.get("clientAccountNumber") || "").trim();
    const clientAccountType = String(formData.get("clientAccountType") || "").trim();
    const clientBranchCode = String(formData.get("clientBranchCode") || "").trim();

    if (!clientBankName || !clientAccountHolder || !clientAccountNumber || !clientAccountType || !clientBranchCode) {
      return NextResponse.redirect(
        new URL("/portal?error=Please+complete+all+banking+details+before+submitting.", request.url),
        303
      );
    }

    await prisma.application.update({
      where: { id: application.id },
      data: {
        clientBankName,
        clientAccountHolder,
        clientAccountNumber,
        clientAccountType,
        clientBranchCode,
        clientBankSubmittedAt: new Date(),
        clientBankConfirmed: false,
      },
    });

    return NextResponse.redirect(
      new URL("/portal?success=Your+banking+details+have+been+submitted+successfully.+Admin+will+review+before+issuing+your+invoice.", request.url),
      303
    );
  } catch (error) {
    console.error("Banking details submission failed:", error);
    return NextResponse.redirect(
      new URL("/portal?error=Something+went+wrong+while+submitting+your+banking+details.", request.url),
      303
    );
  }
}
