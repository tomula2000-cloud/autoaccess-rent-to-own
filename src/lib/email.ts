import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ApplicationEmailParams = {
  to: string;
  fullName: string;
  referenceNumber: string;
};

type StatusUpdateEmailParams = {
  to: string;
  fullName: string;
  referenceNumber: string;
  status: string;
  note?: string | null;
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function getPortalUrl() {
  return `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/portal-login`;
}

function getEmailShell({
  eyebrow,
  heading,
  motto,
  intro,
  detailHtml,
  portalUrl,
  to,
  referenceNumber,
}: {
  eyebrow: string;
  heading: string;
  motto: string;
  intro: string;
  detailHtml: string;
  portalUrl: string;
  to: string;
  referenceNumber: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:40px 20px; color:#111827;">
      <div style="max-width:680px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:24px; padding:40px;">
        <p style="margin:0 0 12px; font-size:12px; letter-spacing:0.22em; text-transform:uppercase; color:#f97316; font-weight:700;">
          ${eyebrow}
        </p>

        <h1 style="margin:0 0 12px; font-size:32px; line-height:1.2; color:#111827;">
          ${heading}
        </h1>

        <p style="margin:0 0 20px; font-size:16px; line-height:1.8; color:#2563eb; font-weight:700;">
          ${motto}
        </p>

        <p style="margin:0 0 24px; font-size:16px; line-height:1.8; color:#4b5563;">
          ${intro}
        </p>

        <div style="margin:24px 0; border:1px solid #bfdbfe; background:#eff6ff; border-radius:18px; padding:22px; text-align:center;">
          <p style="margin:0 0 8px; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:#1d4ed8; font-weight:700;">
            Reference Number
          </p>
          <p style="margin:0; font-size:30px; font-weight:800; color:#1e3a8a;">
            ${referenceNumber}
          </p>
        </div>

        ${detailHtml}

        <div style="margin-top:32px; text-align:center;">
          <a href="${portalUrl}" style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; font-weight:700; padding:14px 24px; border-radius:12px;">
            Go to Client Portal
          </a>
        </div>

        <p style="margin:32px 0 0; font-size:14px; line-height:1.8; color:#6b7280;">
          Portal login email: <strong>${to}</strong><br />
          Portal reference number: <strong>${referenceNumber}</strong>
        </p>
      </div>
    </div>
  `;
}

function getStatusTemplate(status: string, note?: string | null) {
  const safeNote = note?.trim();
  const noteBlock = safeNote
    ? `
      <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
        <p style="margin:0 0 10px; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:#f97316; font-weight:700;">
          Admin Note
        </p>
        <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
          ${safeNote}
        </p>
      </div>
    `
    : "";

  switch (status) {
    case "APPLICATION_RECEIVED":
      return {
        subject: "Your Auto Access application has been received",
        heading: "Your application has been received",
        motto: "Every journey starts with a first step.",
        intro:
          "We have successfully received your application and your journey with Auto Access is now underway.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0 0 10px; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:#f97316; font-weight:700;">
              What happens next
            </p>
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              Use your client portal to upload supporting documents and track progress as your application moves forward.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "PRE_QUALIFICATION_REVIEW":
      return {
        subject: "Your application is under pre-qualification review",
        heading: "Your application is under pre-qualification review",
        motto: "Progress begins with careful review.",
        intro:
          "Our team is carefully reviewing your application details as part of the pre-qualification stage.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              We will keep you updated as soon as the next stage is reached.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "PRE_QUALIFIED":
      return {
        subject: "You have been pre-qualified",
        heading: "You have been pre-qualified",
        motto: "You’re one step closer to the road ahead.",
        intro:
          "Good news. Your application has moved successfully through pre-qualification.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              Please continue checking your client portal for the next required actions.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "AWAITING_DOCUMENTS":
      return {
        subject: "We’re ready for your supporting documents",
        heading: "We’re ready for your supporting documents",
        motto: "The next step moves your application forward.",
        intro:
          "Your application is ready for document submission. Please upload the required supporting documents in your client portal.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              Typical required documents may include proof of income, bank statements, proof of residence, and identification.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "DOCUMENTS_SUBMITTED":
      return {
        subject: "Your documents have been submitted",
        heading: "Your documents have been submitted",
        motto: "Each step completed brings you closer.",
        intro:
          "We have recorded your submitted documents and your application is moving to the next review stage.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              Our team will assess the uploaded files and update you once review progresses.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "DOCUMENTS_UNDER_REVIEW":
      return {
        subject: "Your documents are under review",
        heading: "Your documents are under review",
        motto: "Careful review builds confident decisions.",
        intro:
          "Our team is currently reviewing your supporting documents and application information.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              We will notify you as soon as the review is complete or if anything additional is needed.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return {
        subject: "A few more documents are needed",
        heading: "A few more documents are needed",
        motto: "A little more detail brings you closer to approval.",
        intro:
          "Your application is progressing, but we need additional supporting information before we can move to the next stage.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              Please log into your client portal and upload the requested documents as soon as possible.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "APPROVED_IN_PRINCIPLE":
      return {
        subject: "Your application has been approved in principle",
        heading: "Your application has been approved in principle",
        motto: "Momentum is building.",
        intro:
          "We are pleased to let you know that your application has been approved in principle.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              The remaining steps will now focus on final processing and completion requirements.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case  "AWAITING_INVOICE":
      return {
        subject: "Your contract is now pending",
        heading: "Your contract is now pending",
        motto: "Closer than ever to completion.",
        intro:
          "Your application has moved into the contract stage and is now pending the next finalisation step.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              Please continue checking your portal for any further instructions from our team.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "INVOICE_ISSUED":
      return {
        subject: "Your invoice has been issued",
        heading: "Your invoice has been issued",
        motto: "The final steps are now in motion.",
        intro:
          "Your application has reached the invoicing stage and the process is moving toward completion.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              Please review your latest portal updates for payment-related instructions.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "AWAITING_PAYMENT":
      return {
        subject: "We are awaiting your payment",
        heading: "We are awaiting your payment",
        motto: "Complete this step to keep your progress moving.",
        intro:
          "Your application is now awaiting payment before it can continue to the next stage.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              Please check your client portal for the latest instructions and payment guidance.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "PAYMENT_UNDER_VERIFICATION":
      return {
        subject: "Your payment is under verification",
        heading: "Your payment is under verification",
        motto: "Every important step is checked with care.",
        intro:
          "We have received your payment update and it is currently being verified by our team.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              We will notify you once verification is complete.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "PAYMENT_CONFIRMED":
      return {
        subject: "Your payment has been confirmed",
        heading: "Your payment has been confirmed",
        motto: "Your progress is now confirmed.",
        intro:
          "Your payment has been successfully confirmed and your application is moving forward.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              Please continue monitoring your client portal for the next milestone.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "COMPLETED":
      return {
        subject: "Your application process is complete",
        heading: "Your application process is complete",
        motto: "Welcome to the next chapter.",
        intro:
          "Your application process has now been completed successfully.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              Thank you for moving through this journey with Auto Access.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    case "DECLINED":
      return {
        subject: "Update on your application",
        heading: "Update on your application",
        motto: "Every decision is handled with care and respect.",
        intro:
          "After review, we are unable to proceed with your application at this stage.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
              We appreciate your time and interest. Please review your portal for the latest information.
            </p>
          </div>
          ${noteBlock}
        `,
      };

    default:
      return {
        subject: `Your Auto Access application status is now: ${formatStatus(status)}`,
        heading: "Your application has been updated",
        motto: "Your journey forward starts here.",
        intro:
          "Your application status has been updated by our team.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
            <p style="margin:0 0 10px; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:#f97316; font-weight:700;">
              Current Status
            </p>
            <p style="margin:0; font-size:20px; font-weight:700; color:#111827;">
              ${formatStatus(status)}
            </p>
          </div>
          ${noteBlock}
        `,
      };
  }
}

export async function sendApplicationReceivedEmail({
  to,
  fullName,
  referenceNumber,
}: ApplicationEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  const portalUrl = getPortalUrl();

  return resend.emails.send({
    from: "Auto Access <onboarding@resend.dev>",
    to,
    subject: "Your Auto Access application has been received",
    html: getEmailShell({
      eyebrow: "Auto Access Rent To Own",
      heading: "You are pre-approved",
      motto: "Driven by progress. Built on trust.",
      intro: `Hello ${fullName}, your application has been successfully received and pre-approved for the next review stage.`,
      detailHtml: `
        <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:20px;">
          <p style="margin:0 0 10px; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:#f97316; font-weight:700;">
            Next Step
          </p>
          <p style="margin:0; font-size:16px; line-height:1.7; color:#4b5563;">
            Use your email address and reference number to log into the client portal, upload supporting documents, and track your application progress.
          </p>
        </div>
      `,
      portalUrl,
      to,
      referenceNumber,
    }),
  });
}

export async function sendStatusUpdateEmail({
  to,
  fullName,
  referenceNumber,
  status,
  note,
}: StatusUpdateEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  const portalUrl = getPortalUrl();
  const template = getStatusTemplate(status, note);

  return resend.emails.send({
    from: "Auto Access <onboarding@resend.dev>",
    to,
    subject: template.subject,
    html: getEmailShell({
      eyebrow: "Auto Access Rent To Own",
      heading: template.heading,
      motto: template.motto,
      intro: `Hello ${fullName}, ${template.intro}`,
      detailHtml: template.detailHtml,
      portalUrl,
      to,
      referenceNumber,
    }),
  });
}