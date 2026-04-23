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
        subject: "🎉 Congratulations — Your application has been approved in principle",
        heading: "Congratulations — You're approved in principle",
        motto: "You're one step closer to your new vehicle.",
        intro:
          "we are pleased to inform you that your Auto Access rent-to-own application has been officially approved in principle. You've met our initial assessment criteria and your application has progressed to the vehicle selection stage.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:22px;">
            <p style="margin:0 0 10px; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:#f97316; font-weight:700;">
              What this means
            </p>
            <p style="margin:0; font-size:15px; line-height:1.7; color:#4b5563;">
              Based on our affordability assessment, you now have access to a curated list of qualifying vehicles within your approved budget. These are ready to view and select in your client portal.
            </p>
          </div>

          <div style="margin:24px 0; border:2px solid #c9973a; background:#fff8ee; border-radius:16px; padding:22px; text-align:center;">
            <p style="margin:0 0 8px; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#c9973a; font-weight:700;">
              ⏱ Important — Your approval is valid for 12 days only
            </p>
            <p style="margin:0 0 10px; font-size:15px; line-height:1.6; color:#39425d;">
              If you do not complete the next steps (vehicle selection, deposit, and contract signing) within <strong>12 days from today</strong>, your approval will expire.
            </p>
            <p style="margin:0; font-size:14px; line-height:1.6; color:#39425d;">
              Should your approval expire, a new application may only be submitted after <strong>6 months</strong>. We strongly recommend logging in as soon as possible.
            </p>
          </div>

          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:22px;">
            <p style="margin:0 0 14px; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:#f97316; font-weight:700;">
              🔹 Your Next Steps
            </p>

            <p style="margin:0 0 6px; font-size:14px; font-weight:700; color:#1b2345;">1. Log in to your Client Portal</p>
            <p style="margin:0 0 14px; font-size:14px; line-height:1.7; color:#4b5563;">
              Use the credentials shared with you during application. If you need help logging in, reply to this email.
            </p>

            <p style="margin:0 0 6px; font-size:14px; font-weight:700; color:#1b2345;">2. Review Your Vehicle Offers</p>
            <p style="margin:0 0 14px; font-size:14px; line-height:1.7; color:#4b5563;">
              Browse through the qualifying vehicles available within your approved budget. Full details, photos, and monthly rental amounts are shown for each.
            </p>

            <p style="margin:0 0 6px; font-size:14px; font-weight:700; color:#1b2345;">3. Select Your Preferred Vehicle</p>
            <p style="margin:0 0 14px; font-size:14px; line-height:1.7; color:#4b5563;">
              Choose the vehicle that best suits your needs and confirm your selection in the portal.
            </p>

            <p style="margin:0 0 6px; font-size:14px; font-weight:700; color:#1b2345;">4. Proceed to Contract &amp; Payment</p>
            <p style="margin:0; font-size:14px; line-height:1.7; color:#4b5563;">
              Follow the portal prompts to review your rent-to-own contract and complete the required deposit payment.
            </p>
          </div>

          <p style="margin:24px 0 0; font-size:14px; line-height:1.7; color:#4b5563;">
            Use the <strong>Client Portal</strong> button below to log in and get started. If you have any questions or need help choosing a vehicle, please reply to this email or reach out to us via WhatsApp. Our team is here to guide you through every step.
          </p>

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

    case "CONTRACT_ISSUED":
      return {
        subject: "Your Auto Access Rent-to-Own Contract is ready",
        heading: "Your contract is ready to review",
        motto: "A few steps away from your new vehicle.",
        intro:
          "Thank you for choosing Auto Access Rent-to-Own. Attached to this email is your Rent-to-Own Vehicle Contract. Please take a moment to carefully read and understand the terms outlined in the document.",
        detailHtml: `
          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:22px;">
            <p style="margin:0 0 14px; font-size:15px; line-height:1.7; color:#4b5563;">
              You do not need to print the contract at this stage — the original copy will be signed upon vehicle delivery.
            </p>
            <p style="margin:0; font-size:15px; line-height:1.7; color:#4b5563;">
              Once you have read and understood the terms, please either <strong style="color:#1b2345;">sign digitally in your portal</strong> or reply to this email confirming that you have read and understood the agreement. After we receive your confirmation, an invoice will be sent to you for payment.
            </p>
          </div>

          <div style="margin:24px 0; border:2px solid #c9973a; background:#fff8ee; border-radius:16px; padding:22px; text-align:center;">
            <p style="margin:0 0 8px; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#c9973a; font-weight:700;">
              ⏱ Payment required within 24 hours
            </p>
            <p style="margin:0 0 14px; font-size:15px; line-height:1.6; color:#39425d;">
              To keep your application active, payment must be completed before the contract expires. View your live countdown in the portal.
            </p>
          </div>

          <div style="margin:24px 0; border:1px solid #e5e7eb; background:#f9fafb; border-radius:16px; padding:22px;">
            <p style="margin:0 0 14px; font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:#f97316; font-weight:700;">
              🔹 Key Information to Note
            </p>

            <p style="margin:0 0 6px; font-size:14px; font-weight:700; color:#1b2345;">1. Licensing &amp; Registration</p>
            <p style="margin:0 0 14px; font-size:14px; line-height:1.7; color:#4b5563;">
              Licensing and registration are completed within 24 to 48 hours for clients based in the Western Cape. Vehicles can only be collected after registration is completed, or delivery can be arranged to your address.
            </p>

            <p style="margin:0 0 6px; font-size:14px; font-weight:700; color:#1b2345;">2. Clients Outside the Western Cape</p>
            <p style="margin:0 0 14px; font-size:14px; line-height:1.7; color:#4b5563;">
              For clients outside the province, collection is not available because registration must be done in the same province where you are based (insurance requirement). Delivery will be completed within 3 to 5 business days after payment. You are, however, welcome to make payment at our office if you wish — the vehicle will still be delivered afterward.
            </p>

            <p style="margin:0 0 6px; font-size:14px; font-weight:700; color:#1b2345;">3. Upon Delivery</p>
            <p style="margin:0 0 8px; font-size:14px; line-height:1.7; color:#4b5563;">
              You will receive a <strong>Full Starter Pack</strong> which includes:
            </p>
            <ul style="margin:0 0 14px; padding-left:20px; font-size:14px; line-height:1.8; color:#4b5563;">
              <li>Insurance information (covering accident, damage, or theft procedures)</li>
              <li>Service and maintenance details (where and when to service the vehicle)</li>
              <li>Debit order mandate form</li>
              <li>Vehicle inspection forms</li>
            </ul>

            <p style="margin:0 0 6px; font-size:14px; font-weight:700; color:#1b2345;">4. Delivery Policy</p>
            <p style="margin:0; font-size:14px; line-height:1.7; color:#4b5563;">
              Delivery is done only to the applicant's home or work address. No third-party deliveries are allowed under any circumstances.
            </p>
          </div>

          <p style="margin:24px 0 0; font-size:14px; line-height:1.7; color:#4b5563;">
            If you have any questions or need clarification on any point before confirming, please don't hesitate to reply to this email.
          </p>

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

export async function sendDocumentReminderEmail({
  to,
  fullName,
  referenceNumber,
}: {
  to: string;
  fullName: string;
  referenceNumber: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  const portalUrl = getPortalUrl();

  return resend.emails.send({
    from: "Auto Access <noreply@autoaccess.co.za>",
    replyTo: "support@autoaccess.co.za",
    to,
    subject: "Action required — your Auto Access application is awaiting documents",
    html: `
    <div style="font-family: Georgia, 'Times New Roman', serif; background:#e8e6df; padding:40px 20px; color:#1b2345;">
      <div style="max-width:680px; margin:0 auto; background:#fbfaf6; border:1px solid #c4beaf;">

        <div style="height:6px; background:#1b2345; border-bottom:2px solid #c9973a;"></div>

        <div style="padding:36px 48px 28px; text-align:center; border-bottom:1px solid #c4beaf;">
          <div style="font-size:10px; color:#8a8578; letter-spacing:0.36em; text-transform:uppercase; margin-bottom:14px; font-family:Arial,sans-serif;">Est. 1999 &middot; Paarl, South Africa</div>
          <div style="font-size:34px; color:#1b2345; font-weight:400; letter-spacing:0.08em;">A<span style="color:#c9973a;">UTO</span> A<span style="color:#c9973a;">CCESS</span></div>
          <div style="width:60px; height:1px; background:#c9973a; margin:14px auto;"></div>
          <div style="font-size:10px; color:#8a8578; letter-spacing:0.32em; text-transform:uppercase; font-family:Arial,sans-serif;">Rent-to-Own Vehicle Finance</div>
        </div>

        <div style="padding:40px 48px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td style="font-size:11px; color:#8a8578; letter-spacing:0.18em; text-transform:uppercase; font-family:Arial,sans-serif;">
                Reference<br/>
                <span style="color:#1b2345; font-family:Georgia,serif; font-size:16px; letter-spacing:0.02em; font-weight:700;">${referenceNumber}</span>
              </td>
              <td style="text-align:right; font-size:11px; color:#8a8578; letter-spacing:0.18em; text-transform:uppercase; font-family:Arial,sans-serif;">
                Review Time<br/>
                <span style="color:#1b2345; font-family:Georgia,serif; font-size:14px; letter-spacing:0.02em; font-weight:700;">24 &ndash; 48 hrs</span>
              </td>
            </tr>
          </table>

          <p style="margin:0 0 18px; font-size:16px; color:#1b2345; font-style:italic;">Dear ${fullName},</p>

          <p style="margin:0 0 18px; font-size:15px; line-height:1.9; color:#3a4256;">
            We write to you with regard to your rent-to-own vehicle application lodged with Auto Access. We are pleased to confirm that your application has been received and has successfully passed initial pre-screening.
          </p>
          <p style="margin:0 0 18px; font-size:15px; line-height:1.9; color:#3a4256;">
            In order to advance your application to the formal review and approval stage, we require your supporting documentation at your earliest convenience. Once received, your file will be assessed within <strong>24 to 48 business hours</strong>, after which you will be formally notified of the outcome.
          </p>
          <p style="margin:0; font-size:15px; line-height:1.9; color:#3a4256;">
            For your convenience, the required documentation and the available submission channels are set out in detail below.
          </p>
        </div>

        <div style="text-align:center; padding:8px 0 24px;">
          <span style="color:#c9973a; font-size:14px; letter-spacing:1em;">&#9670; &#9670; &#9670;</span>
        </div>

        <div style="padding:0 48px 32px;">
          <div style="font-size:10px; color:#c9973a; letter-spacing:0.32em; text-transform:uppercase; font-family:Arial,sans-serif; text-align:center; margin-bottom:6px;">Article I</div>
          <h2 style="margin:0 0 22px; font-size:22px; color:#1b2345; font-weight:400; text-align:center; letter-spacing:0.02em;">Required Documentation</h2>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #1b2345; border-bottom:2px solid #1b2345;">
            <tr>
              <td width="32" style="padding:16px 0 16px 8px; vertical-align:top; font-size:13px; color:#c9973a; font-weight:700; border-bottom:1px solid #e0dccf;">i.</td>
              <td style="padding:16px 8px 16px 4px; border-bottom:1px solid #e0dccf;">
                <div style="font-size:14px; color:#1b2345; font-weight:700; margin-bottom:2px;">South African Identification or Passport</div>
                <div style="font-size:12px; color:#6b6655; font-style:italic; font-family:Arial,sans-serif;">Both sides if smartcard ID</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 0 16px 8px; vertical-align:top; font-size:13px; color:#c9973a; font-weight:700; border-bottom:1px solid #e0dccf;">ii.</td>
              <td style="padding:16px 8px 16px 4px; border-bottom:1px solid #e0dccf;">
                <div style="font-size:14px; color:#1b2345; font-weight:700; margin-bottom:2px;">Proof of Residence</div>
                <div style="font-size:12px; color:#6b6655; font-style:italic; font-family:Arial,sans-serif;">Issued within the preceding three months</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 0 16px 8px; vertical-align:top; font-size:13px; color:#c9973a; font-weight:700; border-bottom:1px solid #e0dccf;">iii.</td>
              <td style="padding:16px 8px 16px 4px; border-bottom:1px solid #e0dccf;">
                <div style="font-size:14px; color:#1b2345; font-weight:700; margin-bottom:2px;">Valid Driver&rsquo;s Licence</div>
                <div style="font-size:12px; color:#6b6655; font-style:italic; font-family:Arial,sans-serif;">Both sides, clearly legible</div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 0 10px 8px; vertical-align:top; font-size:13px; color:#c9973a; font-weight:700;">iv.</td>
              <td style="padding:18px 8px 10px 4px;">
                <div style="font-size:14px; color:#1b2345; font-weight:700; margin-bottom:10px;">Proof of Income</div>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3efe3; border:1px solid #c9973a;">
                  <tr>
                    <td width="50%" style="padding:14px 16px; vertical-align:top; border-right:1px solid #c9973a;">
                      <div style="font-size:10px; color:#8a8578; letter-spacing:0.18em; text-transform:uppercase; font-family:Arial,sans-serif; margin-bottom:6px;">Option A &mdash; Employed</div>
                      <div style="font-size:13px; color:#1b2345; font-weight:700; line-height:1.5;">Payslip <span style="color:#c9973a;">&amp;</span> 3 months bank statements</div>
                    </td>
                    <td width="50%" style="padding:14px 16px; vertical-align:top;">
                      <div style="font-size:10px; color:#8a8578; letter-spacing:0.18em; text-transform:uppercase; font-family:Arial,sans-serif; margin-bottom:6px;">Option B &mdash; Self-Employed</div>
                      <div style="font-size:13px; color:#1b2345; font-weight:700; line-height:1.5;">6 months bank statements</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="margin:14px 0 0; font-size:12px; color:#6b6655; font-style:italic; text-align:center; font-family:Arial,sans-serif;">
            Digital copies and clear photographs are acceptable. Certification is not required.
          </p>
        </div>

        <div style="text-align:center; padding:0 0 24px;">
          <span style="color:#c9973a; font-size:14px; letter-spacing:1em;">&#9670; &#9670; &#9670;</span>
        </div>

        <div style="padding:0 48px 32px;">
          <div style="font-size:10px; color:#c9973a; letter-spacing:0.32em; text-transform:uppercase; font-family:Arial,sans-serif; text-align:center; margin-bottom:6px;">Article II</div>
          <h2 style="margin:0 0 22px; font-size:22px; color:#1b2345; font-weight:400; text-align:center; letter-spacing:0.02em;">Submission Channels</h2>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px; border:1px solid #c4beaf; background:#ffffff;">
            <tr>
              <td width="60" style="padding:18px 12px; background:#1b2345; text-align:center; vertical-align:middle;">
                <div style="color:#c9973a; font-size:18px; font-weight:700;">I</div>
              </td>
              <td style="padding:16px 20px;">
                <div style="font-size:14px; color:#1b2345; font-weight:700;">Secure Client Portal</div>
                <div style="font-size:12px; color:#6b6655; line-height:1.6; font-family:Arial,sans-serif;">Direct upload with immediate confirmation. Recommended.</div>
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px; border:1px solid #c4beaf; background:#ffffff;">
            <tr>
              <td width="60" style="padding:18px 12px; background:#1b2345; text-align:center; vertical-align:middle;">
                <div style="color:#c9973a; font-size:18px; font-weight:700;">II</div>
              </td>
              <td style="padding:16px 20px;">
                <div style="font-size:14px; color:#1b2345; font-weight:700;">Electronic Mail</div>
                <div style="font-size:12px; color:#6b6655; line-height:1.6; font-family:Arial,sans-serif;">docs@autoaccess.co.za &nbsp;&middot;&nbsp; quote reference ${referenceNumber}</div>
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #c4beaf; background:#ffffff;">
            <tr>
              <td width="60" style="padding:18px 12px; background:#1b2345; text-align:center; vertical-align:middle;">
                <div style="color:#c9973a; font-size:18px; font-weight:700;">III</div>
              </td>
              <td style="padding:16px 20px;">
                <div style="font-size:14px; color:#1b2345; font-weight:700;">WhatsApp Concierge</div>
                <div style="font-size:12px; color:#6b6655; line-height:1.6; font-family:Arial,sans-serif;">+27 61 049 0061 &nbsp;&middot;&nbsp; our team uploads on your behalf</div>
              </td>
            </tr>
          </table>
        </div>

        <div style="text-align:center; padding:0 0 24px;">
          <span style="color:#c9973a; font-size:14px; letter-spacing:1em;">&#9670; &#9670; &#9670;</span>
        </div>

        <div style="padding:0 48px 32px;">
          <div style="font-size:10px; color:#c9973a; letter-spacing:0.32em; text-transform:uppercase; font-family:Arial,sans-serif; text-align:center; margin-bottom:6px;">Article III</div>
          <h2 style="margin:0 0 22px; font-size:22px; color:#1b2345; font-weight:400; text-align:center; letter-spacing:0.02em;">Our Commitments to You</h2>

          <p style="margin:0 0 20px; font-size:13px; color:#3a4256; line-height:1.9; text-align:center; font-style:italic;">
            The following undertakings shall apply to your application and any contract that follows.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #c4beaf;">
            <tr>
              <td style="padding:14px 0; border-bottom:1px solid #e0dccf;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="40" style="vertical-align:top; font-size:11px; color:#c9973a; letter-spacing:0.18em; font-family:Arial,sans-serif; font-weight:700;">01</td>
                    <td>
                      <div style="font-size:13px; color:#1b2345; font-weight:700; margin-bottom:2px;">Approval based on affordability, not credit score alone.</div>
                      <div style="font-size:12px; color:#6b6655; font-family:Arial,sans-serif; line-height:1.6;">A limited credit profile shall not, in itself, disqualify your application.</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 0; border-bottom:1px solid #e0dccf;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="40" style="vertical-align:top; font-size:11px; color:#c9973a; letter-spacing:0.18em; font-family:Arial,sans-serif; font-weight:700;">02</td>
                    <td>
                      <div style="font-size:13px; color:#1b2345; font-weight:700; margin-bottom:2px;">Full pricing transparency from application to delivery.</div>
                      <div style="font-size:12px; color:#6b6655; font-family:Arial,sans-serif; line-height:1.6;">All fees, deposits and monthly charges disclosed in writing before any commitment is made.</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 0; border-bottom:1px solid #e0dccf;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="40" style="vertical-align:top; font-size:11px; color:#c9973a; letter-spacing:0.18em; font-family:Arial,sans-serif; font-weight:700;">03</td>
                    <td>
                      <div style="font-size:13px; color:#1b2345; font-weight:700; margin-bottom:2px;">A dedicated case agent assigned to your file.</div>
                      <div style="font-size:12px; color:#6b6655; font-family:Arial,sans-serif; line-height:1.6;">One named point of contact throughout your application and delivery.</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 0; border-bottom:1px solid #e0dccf;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="40" style="vertical-align:top; font-size:11px; color:#c9973a; letter-spacing:0.18em; font-family:Arial,sans-serif; font-weight:700;">04</td>
                    <td>
                      <div style="font-size:13px; color:#1b2345; font-weight:700; margin-bottom:2px;">Strict confidentiality of all personal information.</div>
                      <div style="font-size:12px; color:#6b6655; font-family:Arial,sans-serif; line-height:1.6;">Your documents are encrypted and shared only with parties necessary to your application.</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 0; border-bottom:2px solid #1b2345;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="40" style="vertical-align:top; font-size:11px; color:#c9973a; letter-spacing:0.18em; font-family:Arial,sans-serif; font-weight:700;">05</td>
                    <td>
                      <div style="font-size:13px; color:#1b2345; font-weight:700; margin-bottom:2px;">Nationwide door-to-door delivery.</div>
                      <div style="font-size:12px; color:#6b6655; font-family:Arial,sans-serif; line-height:1.6;">Your vehicle is registered, licensed, and delivered to the address of your choosing.</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>

        <div style="padding:0 48px 32px;">
          <p style="margin:0 0 24px; font-size:15px; line-height:1.9; color:#3a4256;">
            Should any aspect of this correspondence require clarification, we would welcome the opportunity to assist. Please do not hesitate to contact our client services team directly.
          </p>

          <p style="margin:0 0 4px; font-size:15px; color:#3a4256; font-style:italic;">Yours sincerely,</p>
          <div style="font-family:'Brush Script MT','Lucida Handwriting',cursive; font-size:26px; color:#1b2345; margin:10px 0 6px;">Auto Access</div>
          <div style="width:180px; height:1px; background:#1b2345; margin-bottom:6px;"></div>
          <p style="margin:0; font-size:12px; color:#6b6655; font-family:Arial,sans-serif; letter-spacing:0.04em;">Client Services Department</p>
        </div>

        <div style="text-align:center; padding:0 48px 40px;">
          <a href="${portalUrl}" style="display:inline-block; background:#1b2345; color:#c9973a; text-decoration:none; padding:15px 44px; font-size:12px; letter-spacing:0.22em; text-transform:uppercase; font-family:Arial,sans-serif; font-weight:700;">Access Client Portal</a>
        </div>

        <div style="background:#1b2345; padding:22px 48px; text-align:center; font-family:Arial,sans-serif; border-top:2px solid #c9973a;">
          <div style="font-size:10px; color:#c9973a; letter-spacing:0.22em; text-transform:uppercase; font-weight:700; margin-bottom:6px;">Access Holdings (Pty) Ltd</div>
          <div style="font-size:10px; color:#8a9bbf; line-height:1.8;">
            22 Eiland Street, Eiland Park, Paarl, 7646<br/>
            Reg. No. 1999/002599/10 &nbsp;&middot;&nbsp; 087 012 6734 &nbsp;&middot;&nbsp; admin@autoaccess.co.za
          </div>
        </div>

      </div>
    </div>
    `,
  });
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
    from: "Auto Access <noreply@autoaccess.co.za>",
    replyTo: "support@autoaccess.co.za",
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
    from: "Auto Access <noreply@autoaccess.co.za>",
    replyTo: "support@autoaccess.co.za",
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
}/*
 * ============================================================
 * INSTRUCTIONS — Append these TWO functions to the BOTTOM of
 * src/lib/email.ts
 * ============================================================
 */


// ── Email sent to the client after they sign the contract ──
export async function sendContractSignedClientEmail({
  to,
  fullName,
  referenceNumber,
}: {
  to: string;
  fullName: string;
  referenceNumber: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set.");
  }
  const portalUrl = getPortalUrl();
  const payload: any = {
    from: "Auto Access <noreply@autoaccess.co.za>",
    replyTo: "support@autoaccess.co.za",
    to,
    subject: `✅ Contract Signed — ${referenceNumber}`,
    html: getEmailShell({
      eyebrow: "Auto Access Rent To Own",
      heading: "Thank you for signing your contract",
      motto: "Welcome to Auto Access",
      intro: `Hello ${fullName}, we have successfully received your signed Vehicle Rental Agreement. A copy of your signed contract is attached to this email for your records.`,
      detailHtml: `
        <div style="padding:16px 20px; background:#f5f7fb; border-left:3px solid #c9973a; border-radius:6px; margin:16px 0;">
          <p style="margin:0 0 8px 0; font-size:13px; color:#1b2345;"><strong>What happens next:</strong></p>
          <ul style="margin:0; padding-left:20px; font-size:13px; color:#39425d; line-height:1.7;">
            <li>Our team is now preparing your invoice for payment</li>
            <li>You will receive the invoice with banking details shortly</li>
            <li><strong style="color:#c9973a;">Payment must be completed before the contract expires</strong> — please refer to your portal countdown</li>
            <li>Once payment is verified, your vehicle will be prepared for collection or delivery</li>
          </ul>
        </div>
        <div style="margin:24px 0; border:2px solid #c9973a; background:#fff8ee; border-radius:16px; padding:20px; text-align:center;">
          <p style="margin:0 0 6px; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#c9973a; font-weight:700;">
            ⏱ Live payment countdown
          </p>
          <p style="margin:0; font-size:14px; line-height:1.6; color:#39425d;">
            Your live countdown to payment deadline is available in your portal.
          </p>
        </div>
        <p style="font-size:13px; color:#39425d; line-height:1.6;">
          You can view your signed contract anytime in your client portal.
        </p>
      `,
      portalUrl,
      to,
      referenceNumber,
    }),
  };
  return resend.emails.send(payload);
}


// ── Email sent to admin when a client signs ──
export async function sendContractSignedAdminEmail({
  fullName,
  email,
  referenceNumber,
  signedAt,
}: {
  fullName: string;
  email: string;
  referenceNumber: string;
  signedAt: Date;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set.");
  }
  const portalUrl = getPortalUrl();
  const formattedDate = signedAt.toLocaleString("en-ZA", {
    dateStyle: "full",
    timeStyle: "short",
  });
  return resend.emails.send({
    from: "Auto Access <noreply@autoaccess.co.za>",
    replyTo: email,
    to: "admin@autoaccess.co.za",
    subject: `🖊️ Client signed contract — ${referenceNumber}`,
    html: getEmailShell({
      eyebrow: "Admin Notification",
      heading: "A client has signed their contract",
      motto: `Reference: ${referenceNumber}`,
      intro: `${fullName} has just signed their Vehicle Rental Agreement. Please review the signed contract and begin the next step of the process.`,
      detailHtml: `
        <div style="padding:16px 20px; background:#f5f7fb; border-left:3px solid #1b2345; border-radius:6px; margin:16px 0; font-size:13px; color:#39425d; line-height:1.8;">
          <div><strong style="color:#1b2345;">Client:</strong> ${fullName}</div>
          <div><strong style="color:#1b2345;">Email:</strong> ${email}</div>
          <div><strong style="color:#1b2345;">Reference:</strong> ${referenceNumber}</div>
          <div><strong style="color:#1b2345;">Signed at:</strong> ${formattedDate}</div>
        </div>
        <p style="font-size:13px; color:#39425d;">Log in to the admin panel to view the signed contract and advance the application.</p>
      `,
      portalUrl,
      to: "admin@autoaccess.co.za",
      referenceNumber,
    }),
  });
}

// ── Invoice email sent to client when admin issues invoice ──
export async function sendInvoiceEmail({
  to,
  fullName,
  referenceNumber,
  invoiceNumber,
  invoiceIssuedAt,
  invoiceDueAt,
  invoiceDepositAmount,
  invoiceLicensingFee,
  invoiceMonthlyAmount,
  invoiceTotalDue,
  invoiceBankName,
  invoiceBankHolder,
  invoiceBankAccount,
  invoiceBankBranch,
  invoiceBankType,
  invoiceTerms,
}: {
  to: string;
  fullName: string;
  referenceNumber: string;
  invoiceNumber: string;
  invoiceIssuedAt: Date;
  invoiceDueAt: Date;
  invoiceDepositAmount: string;
  invoiceLicensingFee: string;
  invoiceMonthlyAmount: string;
  invoiceTotalDue: string;
  invoiceBankName: string;
  invoiceBankHolder: string;
  invoiceBankAccount: string;
  invoiceBankBranch: string;
  invoiceBankType: string;
  invoiceTerms: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  const portalUrl = getPortalUrl();

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });

  return resend.emails.send({
    from: "Auto Access <noreply@autoaccess.co.za>",
    replyTo: "admin@autoaccess.co.za",
    to,
    subject: `Invoice ${invoiceNumber} — Payment Required | Auto Access`,
    html: `
    <div style="font-family: Arial, sans-serif; background:#f4f5f7; padding:40px 20px; color:#1b2345;">
      <div style="max-width:680px; margin:0 auto;">

        <!-- Header -->
        <div style="background:#1b2345; padding:28px 32px; display:block;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="font-size:22px; font-weight:700; color:#c9973a; font-family:Georgia,serif;">Auto Access</div>
                <div style="font-size:10px; color:#8a9bbf; letter-spacing:0.18em; text-transform:uppercase; margin-top:2px;">Access Holdings (Pty) Ltd T/A Auto Access</div>
                <div style="font-size:11px; color:#8a9bbf; margin-top:10px; line-height:1.7;">
                  22 Eiland St, Eiland Park, Paarl, 7646<br/>
                  087 012 6734 &nbsp;|&nbsp; admin@autoaccess.co.za
                </div>
              </td>
              <td style="text-align:right; vertical-align:top;">
                <div style="font-size:26px; color:#ffffff; font-family:Georgia,serif; font-weight:400;">Invoice</div>
                <div style="font-size:10px; color:#c9973a; letter-spacing:0.22em; text-transform:uppercase; margin-top:4px;">Payment Request</div>
                <div style="margin-top:12px; display:inline-block; background:#fff0e0; border:1px solid #c9973a; padding:3px 12px; font-size:10px; color:#c9973a; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;">Due within 24 hours</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Gold bar -->
        <div style="height:3px; background:#c9973a;"></div>

        <!-- Ref strip -->
        <div style="background:#f8f6f0; padding:12px 32px; border-bottom:1px solid #e2ddd5;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:24px;">
                <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.18em; color:#8a9bbf;">Invoice No.</div>
                <div style="font-size:14px; font-weight:700; color:#c9973a; margin-top:2px;">${invoiceNumber}</div>
              </td>
              <td style="padding-right:24px;">
                <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.18em; color:#8a9bbf;">Contract Ref.</div>
                <div style="font-size:13px; font-weight:700; color:#1b2345; margin-top:2px;">${referenceNumber}</div>
              </td>
              <td style="padding-right:24px;">
                <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.18em; color:#8a9bbf;">Invoice Date</div>
                <div style="font-size:13px; font-weight:700; color:#1b2345; margin-top:2px;">${fmtDate(invoiceIssuedAt)}</div>
              </td>
              <td>
                <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.18em; color:#8a9bbf;">Due Date</div>
                <div style="font-size:13px; font-weight:700; color:#c9973a; margin-top:2px;">${fmtDate(invoiceDueAt)} at ${fmtTime(invoiceDueAt)}</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Body -->
        <div style="background:#ffffff; padding:28px 32px;">

          <!-- Greeting -->
          <p style="margin:0 0 20px; font-size:15px; line-height:1.7; color:#1b2345;">
            Dear <strong>${fullName}</strong>,<br/><br/>
            Thank you for signing your Rent-to-Own Vehicle Contract with Auto Access. Please find your payment invoice below. 
            <strong style="color:#c9973a;">Payment must be completed within 24 hours</strong> to keep your contract active.
          </p>

          <!-- Line items -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:20px;">
            <thead>
              <tr style="background:#1b2345;">
                <th style="padding:10px 14px; text-align:left; font-size:9px; text-transform:uppercase; letter-spacing:0.18em; color:#8a9bbf; font-weight:400;">#</th>
                <th style="padding:10px 14px; text-align:left; font-size:9px; text-transform:uppercase; letter-spacing:0.18em; color:#8a9bbf; font-weight:400;">Description</th>
                <th style="padding:10px 14px; text-align:right; font-size:9px; text-transform:uppercase; letter-spacing:0.18em; color:#8a9bbf; font-weight:400;">Amount Due</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid #eef0f5;">
                <td style="padding:12px 14px; font-size:12px; color:#8a9bbf;">01</td>
                <td style="padding:12px 14px;">
                  <div style="font-size:13px; font-weight:700; color:#1b2345;">Security Deposit</div>
                  <div style="font-size:11px; color:#8a9bbf; margin-top:2px;">Refundable upon successful completion of 54-month term</div>
                </td>
                <td style="padding:12px 14px; text-align:right; font-size:13px; font-weight:700; color:#1b2345;">R ${invoiceDepositAmount}</td>
              </tr>
              <tr style="border-bottom:1px solid #eef0f5; background:#fafbfd;">
                <td style="padding:12px 14px; font-size:12px; color:#8a9bbf;">02</td>
                <td style="padding:12px 14px;">
                  <div style="font-size:13px; font-weight:700; color:#1b2345;">Licensing &amp; Registration Fee</div>
                  <div style="font-size:11px; color:#8a9bbf; margin-top:2px;">Vehicle registration &amp; licence disc</div>
                </td>
                <td style="padding:12px 14px; text-align:right; font-size:13px; font-weight:700; color:#1b2345;">R ${invoiceLicensingFee}</td>
              </tr>
              <tr style="border-bottom:1px solid #eef0f5; opacity:0.7;">
                <td style="padding:12px 14px; font-size:12px; color:#8a9bbf;">03</td>
                <td style="padding:12px 14px;">
                  <div style="font-size:13px; font-weight:700; color:#1b2345;">Monthly Instalment <span style="display:inline-block; background:#eef0f5; border:0.5px solid #c8d0e0; padding:1px 8px; font-size:9px; color:#8a9bbf; letter-spacing:0.1em; text-transform:uppercase; margin-left:6px;">Not due now</span></div>
                  <div style="font-size:11px; color:#8a9bbf; margin-top:2px;">R ${invoiceMonthlyAmount}/month (incl. service plan) — commences next calendar month via debit order</div>
                </td>
                <td style="padding:12px 14px; text-align:right; font-size:13px; font-weight:700; color:#8a9bbf;">R 0.00</td>
              </tr>
            </tbody>
          </table>

          <!-- Deferred note -->
          <div style="background:#f8f6f0; border-left:3px solid #c9973a; padding:10px 14px; margin-bottom:20px; font-size:12px; color:#5a6480; line-height:1.6;">
            <strong style="color:#1b2345;">Note on monthly instalment:</strong> Your first monthly instalment of <strong>R ${invoiceMonthlyAmount}</strong> is not payable now. It commences via debit order in the next calendar month following vehicle delivery.
          </div>

          <!-- Total -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td></td>
              <td width="280">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr style="border-bottom:1px solid #eef0f5;">
                    <td style="padding:7px 0; font-size:13px; color:#5a6480;">Deposit</td>
                    <td style="padding:7px 0; font-size:13px; font-weight:700; text-align:right; color:#1b2345;">R ${invoiceDepositAmount}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #eef0f5;">
                    <td style="padding:7px 0; font-size:13px; color:#5a6480;">Licensing &amp; Registration</td>
                    <td style="padding:7px 0; font-size:13px; font-weight:700; text-align:right; color:#1b2345;">R ${invoiceLicensingFee}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #eef0f5;">
                    <td style="padding:7px 0; font-size:13px; color:#5a6480;">Monthly Instalment (deferred)</td>
                    <td style="padding:7px 0; font-size:13px; font-weight:700; text-align:right; color:#8a9bbf;">R 0.00</td>
                  </tr>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px; background:#1b2345;">
                  <tr>
                    <td style="padding:12px 14px; font-size:12px; text-transform:uppercase; letter-spacing:0.12em; color:#8a9bbf;">Total Due Now</td>
                    <td style="padding:12px 14px; text-align:right; font-size:18px; font-weight:700; color:#c9973a; font-family:Georgia,serif;">R ${invoiceTotalDue}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Banking details -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px; border-collapse:collapse;">
            <tr>
              <td width="48%" style="vertical-align:top; padding-right:12px;">
                <div style="border:1px solid #dde1ec; padding:14px;">
                  <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.18em; color:#c9973a; font-weight:700; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #eef0f5;">Banking Details</div>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td style="font-size:12px; color:#8a9bbf; padding:3px 0;">Bank</td><td style="font-size:12px; font-weight:700; color:#1b2345; text-align:right;">${invoiceBankName}</td></tr>
                    <tr><td style="font-size:12px; color:#8a9bbf; padding:3px 0;">Account Holder</td><td style="font-size:12px; font-weight:700; color:#1b2345; text-align:right;">${invoiceBankHolder}</td></tr>
                    <tr><td style="font-size:12px; color:#8a9bbf; padding:3px 0;">Account No.</td><td style="font-size:12px; font-weight:700; color:#1b2345; text-align:right;">${invoiceBankAccount}</td></tr>
                    <tr><td style="font-size:12px; color:#8a9bbf; padding:3px 0;">Branch Code</td><td style="font-size:12px; font-weight:700; color:#1b2345; text-align:right;">${invoiceBankBranch}</td></tr>
                    <tr><td style="font-size:12px; color:#8a9bbf; padding:3px 0;">Account Type</td><td style="font-size:12px; font-weight:700; color:#1b2345; text-align:right;">${invoiceBankType}</td></tr>
                  </table>
                </div>
              </td>
              <td width="52%" style="vertical-align:top; padding-left:12px;">
                <div style="border:1px solid #dde1ec; padding:14px; margin-bottom:10px;">
                  <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.18em; color:#c9973a; font-weight:700; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #eef0f5;">Payment Reference</div>
                  <div style="background:#fff8ee; border:1px solid #c9973a; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:11px; color:#8a9bbf; text-transform:uppercase; letter-spacing:0.12em;">Use exactly as shown</span>
                    <span style="font-size:16px; font-weight:700; color:#c9973a; font-family:Georgia,serif;">${referenceNumber}</span>
                  </div>
                  <div style="font-size:11px; color:#8a9bbf; line-height:1.6;">Always quote your reference number. Payments without a reference cannot be allocated and will cause delays.</div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Terms -->
          <div style="background:#fafbfd; border:1px solid #eef0f5; padding:14px; margin-bottom:20px;">
            <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.18em; color:#8a9bbf; margin-bottom:10px;">Terms &amp; Conditions of Payment</div>
            <div style="font-size:11px; color:#5a6480; line-height:1.7; white-space:pre-wrap;">${invoiceTerms}</div>
          </div>

          <!-- CTA -->
          <div style="text-align:center; margin:24px 0;">
            <a href="${portalUrl}" style="display:inline-block; background:#1b2345; color:#c9973a; text-decoration:none; font-weight:700; padding:14px 36px; font-size:14px; letter-spacing:0.04em; font-family:Georgia,serif;">
              View Invoice in Portal
            </a>
          </div>

          <p style="font-size:12px; color:#8a9bbf; line-height:1.7; text-align:center; margin:0;">
            Questions? Call us on <strong style="color:#1b2345;">087 012 6734</strong> or reply to this email.<br/>
            Monday to Friday, 8am to 5pm.
          </p>

        </div>

        <!-- Footer -->
        <div style="background:#1b2345; padding:14px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:10px; color:#8a9bbf; line-height:1.6;">
                Access Holdings (Pty) Ltd T/A Auto Access &nbsp;|&nbsp; Reg No: 1999/002599/10<br/>
                22 Eiland St, Eiland Park, Paarl, 7646 &nbsp;|&nbsp; admin@autoaccess.co.za
              </td>
              <td style="text-align:right; font-size:10px; color:#5a6480;">
                Invoice Ref: ${invoiceNumber}<br/>
                Page 1 of 1
              </td>
            </tr>
          </table>
        </div>

      </div>
    </div>
    `,
  });
}

// ── Admin alert when client confirms payment ──
export async function sendPaymentCompletedAdminEmail({
  fullName,
  email,
  referenceNumber,
  invoiceNumber,
  invoiceTotalDue,
  proofOfPaymentCount,
  completedAt,
}: {
  fullName: string;
  email: string;
  referenceNumber: string;
  invoiceNumber: string;
  invoiceTotalDue: string;
  proofOfPaymentCount: number;
  completedAt: Date;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  const adminUrl = `${getPortalUrl().replace("/portal", "")}/admin`;

  return resend.emails.send({
    from: "Auto Access <noreply@autoaccess.co.za>",
    replyTo: "admin@autoaccess.co.za",
    to: "admin@autoaccess.co.za",
    subject: `🔔 Payment Completed — ${referenceNumber} | ${fullName}`,
    html: `
    <div style="font-family: Arial, sans-serif; background:#f4f5f7; padding:40px 20px; color:#1b2345;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #dde1ec;">

        <div style="background:#1b2345; padding:24px 28px;">
          <div style="font-size:11px; color:#c9973a; text-transform:uppercase; letter-spacing:0.2em; font-weight:700;">Admin Alert</div>
          <div style="font-size:20px; color:#ffffff; font-family:Georgia,serif; margin-top:4px;">Payment Completed by Client</div>
        </div>

        <div style="height:3px; background:#c9973a;"></div>

        <div style="padding:24px 28px;">

          <div style="background:#fff8ee; border-left:3px solid #c9973a; padding:14px 16px; margin-bottom:20px;">
            <p style="margin:0; font-size:13px; line-height:1.7; color:#1b2345;">
              <strong>${fullName}</strong> has confirmed payment completion and uploaded 
              <strong>${proofOfPaymentCount} proof of payment ${proofOfPaymentCount === 1 ? "document" : "documents"}</strong>.
              The application is now awaiting payment verification.
            </p>
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:20px;">
            <tr><td style="padding:6px 0; font-size:12px; color:#8a9bbf;">Reference</td><td style="padding:6px 0; font-size:13px; font-weight:700; color:#1b2345; text-align:right;">${referenceNumber}</td></tr>
            <tr><td style="padding:6px 0; font-size:12px; color:#8a9bbf;">Invoice No.</td><td style="padding:6px 0; font-size:13px; font-weight:700; color:#c9973a; text-align:right;">${invoiceNumber}</td></tr>
            <tr><td style="padding:6px 0; font-size:12px; color:#8a9bbf;">Client Email</td><td style="padding:6px 0; font-size:13px; font-weight:700; color:#1b2345; text-align:right;">${email}</td></tr>
            <tr><td style="padding:6px 0; font-size:12px; color:#8a9bbf;">Total Due</td><td style="padding:6px 0; font-size:13px; font-weight:700; color:#1b2345; text-align:right;">R ${invoiceTotalDue}</td></tr>
            <tr><td style="padding:6px 0; font-size:12px; color:#8a9bbf;">POP Files</td><td style="padding:6px 0; font-size:13px; font-weight:700; color:#1b2345; text-align:right;">${proofOfPaymentCount} uploaded</td></tr>
            <tr><td style="padding:6px 0; font-size:12px; color:#8a9bbf;">Completed At</td><td style="padding:6px 0; font-size:13px; font-weight:700; color:#1b2345; text-align:right;">${completedAt.toLocaleString("en-ZA", { dateStyle: "full", timeStyle: "short" })}</td></tr>
          </table>

          <div style="text-align:center; margin:24px 0;">
            <a href="${adminUrl}" style="display:inline-block; background:#1b2345; color:#c9973a; text-decoration:none; font-weight:700; padding:14px 32px; font-size:13px; letter-spacing:0.04em; font-family:Georgia,serif;">
              Review Payment in Admin Panel →
            </a>
          </div>

          <p style="margin:0; font-size:11px; color:#8a9bbf; text-align:center; line-height:1.6;">
            Status is now PAYMENT_UNDER_VERIFICATION. Please review the proof of payment and verify against your bank statement.
          </p>

        </div>

        <div style="background:#1b2345; padding:12px 28px;">
          <p style="margin:0; font-size:10px; color:#8a9bbf;">Auto Access Admin System · ${referenceNumber}</p>
        </div>

      </div>
    </div>
    `,
  });
}
