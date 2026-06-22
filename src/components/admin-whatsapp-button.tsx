"use client";
import { useState } from "react";

interface AdminWhatsAppButtonProps {
  applicationId: string;
  phone: string;
  name: string;
  referenceNumber: string;
  status: string;
  whatsappContactedAt?: Date | string | null;
  size?: "sm" | "md";
}

function formatPhone(phone: string) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 10) return "27" + cleaned.slice(1);
  if (cleaned.startsWith("27")) return cleaned;
  return cleaned;
}

function getContactedLabel(whatsappContactedAt?: Date | string | null) {
  if (!whatsappContactedAt) return null;
  const date = new Date(whatsappContactedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffDays >= 3) return null;
  if (diffDays >= 1) return "Contacted " + diffDays + "d ago";
  if (diffHours >= 1) return "Contacted " + diffHours + "h ago";
  if (diffMins >= 1) return "Contacted " + diffMins + "m ago";
  return "Contacted just now";
}

function getPrefilledMessage(status: string, name: string, ref: string): string {
  const messages: Record<string, string> = {
    APPLICATION_RECEIVED: "Hi " + name + " \uD83D\uDC4B This is Auto Access.\n\nWe have received your application and your reference number is " + ref + ".\n\nOur team is reviewing your details and will be in touch within 48 hours.\n\nIn the meantime you can track your application through your client portal:\nautoaccess.co.za/portal\n\nIf you have any questions please don't hesitate to reach out.\n\nAuto Access Team",

    PRE_QUALIFICATION_REVIEW: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nYour application " + ref + " is currently going through our pre-qualification review.\n\nOur team is carefully assessing your details to match you with the best vehicle options within your budget.\n\nWe will be in touch shortly with an update. You can also monitor your progress on your portal:\nautoaccess.co.za/portal\n\nAuto Access Team",

    PRE_QUALIFIED: "Hi " + name + " \uD83C\uDF89 Great news from Auto Access!\n\nYour application " + ref + " has passed our initial pre-qualification review.\n\nOur team is finalising the next steps and will contact you shortly to guide you through the process.\n\nStay tuned \u2014 you are one step closer to your vehicle! Track your progress here:\nautoaccess.co.za/portal\n\nAuto Access Team",

    AWAITING_DOCUMENTS: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nYour application " + ref + " is on hold \u2014 we are waiting for your supporting documents before we can proceed.\n\nPlease submit the following as soon as possible:\n\uD83D\uDCC4 Valid SA ID or Passport\n\uD83E\uDEaa Valid Driver's Licence\n\uD83C\uDFE6 3 Months Bank Statements\n\uD83C\uDFE0 Proof of Residence (not older than 3 months)\n\nThe fastest way to submit is through your portal:\nautoaccess.co.za/portal\n\nAlternatively:\n\uD83D\uDCE7 docs@autoaccess.co.za (include your reference number in the subject)\n\uD83D\uDCAC WhatsApp: +27 61 049 0061\n\nThe sooner we receive your documents the sooner we can process your application.\n\nAuto Access Team",

    DOCUMENTS_SUBMITTED: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nWe have received your documents for application " + ref + ". Thank you for submitting them promptly.\n\nOur team is now reviewing everything and you will receive an update within 24 to 48 hours.\n\nTrack your progress on your portal:\nautoaccess.co.za/portal\n\nAuto Access Team",

    DOCUMENTS_UNDER_REVIEW: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nYour documents for application " + ref + " are currently being reviewed by our team.\n\nWe are working through everything carefully to ensure a smooth process for you. You will hear from us shortly.\n\nTrack your application here:\nautoaccess.co.za/portal\n\nAuto Access Team",

    ADDITIONAL_DOCUMENTS_REQUIRED: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nWe have reviewed your documents for application " + ref + " and require some additional information before we can proceed.\n\nPlease log into your portal where you will find details on what is needed:\nautoaccess.co.za/portal\n\nAlternatively contact our team:\n\uD83D\uDCAC WhatsApp: +27 61 049 0061\n\uD83D\uDCDE +27 21 211 0080 (Mon-Fri 09:00-17:00)\n\nPlease submit the additional documents as soon as possible to avoid any delays.\n\nAuto Access Team",

    APPROVED_IN_PRINCIPLE: "Hi " + name + " \uD83C\uDF89 Congratulations from Auto Access!\n\nWe are excited to let you know that your application " + ref + " has been APPROVED!\n\nHere is what happens next:\n1\uFE0F\u20E3 Log into your portal and browse your approved vehicle options\n2\uFE0F\u20E3 Select the vehicle that suits your budget and needs\n3\uFE0F\u20E3 Our team will be in touch to guide you through the contract\n\n\u26A0\uFE0F IMPORTANT: Your approval is valid for 12 working days. Please ensure you are ready to commit and complete the process within this window. If the window lapses your application will be cancelled and you will need to wait 6 months before reapplying.\n\nStart browsing your vehicles now:\nautoaccess.co.za/portal\n\nAuto Access Team",

    CONTRACT_REQUESTED: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nWe have received your vehicle selection for application " + ref + " and your contract is being prepared.\n\nOur team will have your rental agreement ready shortly. You will receive a notification through your portal once it is available for review and signing.\n\nautoaccess.co.za/portal\n\nAuto Access Team",

    CONTRACT_ISSUED: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nYour rental agreement for application " + ref + " is ready and waiting for your signature on your portal:\nautoaccess.co.za/portal\n\n\u26A0\uFE0F PLEASE READ THIS CAREFULLY BEFORE SIGNING:\n\n\u2705 Only sign your contract if you are 100% ready to proceed and complete the full process\n\u2705 Once signed your deposit must be paid within 24 hours to secure your vehicle\n\u2705 Do NOT sign the contract if you are not in a position to make the deposit payment immediately after signing\n\u2705 Your approval window is 12 working days \u2014 do not delay\n\nBy signing you are entering into a binding 54-month rental agreement. Please review all terms carefully before signing. If you have any questions about the contract contact our team before signing:\n\n\uD83D\uDCAC WhatsApp: +27 61 049 0061\n\uD83D\uDCDE +27 21 211 0080 (Mon-Fri 09:00-17:00)\n\nWe are excited to get you into your vehicle \u2014 let's do this the right way \uD83D\uDE97\n\nAuto Access Team",

    AWAITING_INVOICE: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nYour signed contract for application " + ref + " has been received. Thank you!\n\nYour invoice is being prepared and will be sent to you shortly with full payment details.\n\n\u26A0\uFE0F Please ensure you are ready to make your deposit payment via bank transfer as soon as you receive the invoice. Your vehicle preparation begins only once payment is confirmed.\n\nIf you have any questions in the meantime:\n\uD83D\uDCAC WhatsApp: +27 61 049 0061\n\uD83D\uDCDE +27 21 211 0080 (Mon-Fri 09:00-17:00)\n\nAuto Access Team",

    INVOICE_ISSUED: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nYour invoice for application " + ref + " has been issued and is available on your portal:\nautoaccess.co.za/portal\n\n\uD83D\uDCB3 PAYMENT INSTRUCTIONS:\nPlease make your deposit payment via bank transfer using the banking details on your invoice. Include your reference number " + ref + " as your payment reference.\n\n\u26A0\uFE0F IMPORTANT:\n- Payment must be made via bank transfer only \u2014 no cash payments accepted\n- Use your reference number " + ref + " as the payment reference\n- Once payment is confirmed we will begin preparing your vehicle for delivery\n\nYou are almost there! \uD83D\uDE97\n\nQuestions? Contact us:\n\uD83D\uDCAC WhatsApp: +27 61 049 0061\n\uD83D\uDCDE +27 21 211 0080 (Mon-Fri 09:00-17:00)\n\nAuto Access Team",

    AWAITING_PAYMENT: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nWe are following up on your application " + ref + ". We have not yet received your deposit payment.\n\nAs a reminder your invoice is available on your portal:\nautoaccess.co.za/portal\n\n\uD83D\uDCB3 Please make your payment via bank transfer and use your reference number " + ref + " as the payment reference.\n\n\u26A0\uFE0F Please note that your vehicle cannot be allocated or prepared for delivery until payment is confirmed. We would hate for you to lose your selected vehicle.\n\nIf you are experiencing any difficulties please contact us immediately:\n\uD83D\uDCAC WhatsApp: +27 61 049 0061\n\uD83D\uDCDE +27 21 211 0080 (Mon-Fri 09:00-17:00)\n\nAuto Access Team",

    PAYMENT_UNDER_VERIFICATION: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nWe have received your payment for application " + ref + " and it is currently being verified by our team.\n\nThis process typically takes 24 to 48 hours. Once confirmed we will begin preparing your vehicle for delivery.\n\nYou can track your progress on your portal:\nautoaccess.co.za/portal\n\nThank you for your patience \u2014 exciting times ahead! \uD83D\uDE97\n\nAuto Access Team",

    PAYMENT_CONFIRMED: "Hi " + name + " \uD83C\uDF89 Auto Access here.\n\nFantastic news \u2014 your payment for application " + ref + " has been confirmed!\n\nWe are now preparing your vehicle for delivery. Here is what happens next:\n\n\uD83D\uDD27 Your vehicle is being prepared, inspected and fitted with your GPS tracker\n\uD83D\uDCCB Licensing and registration is being handled in your province\n\uD83D\uDE9A Your vehicle will be loaded onto an approved transporter and shipped to you\n\uD83D\uDCE6 Delivery typically takes 3 to 5 working days from today\n\nTrack everything on your portal:\nautoaccess.co.za/portal\n\nFor any delivery queries:\n\uD83D\uDCAC WhatsApp: +27 61 049 0061\n\uD83D\uDCDE +27 21 211 0080 (Mon-Fri 09:00-17:00)\n\nCongratulations " + name + " \u2014 you are almost there! \uD83D\uDE97\n\nAuto Access Team",

    COMPLETED: "Hi " + name + " \uD83C\uDF89 Auto Access here.\n\nCongratulations on your new vehicle! We are thrilled to have been part of your journey.\n\nA few important reminders:\n\n\u2705 Keep up with your scheduled services \u2014 we will notify you when a service is due\n\u2705 Your debit order will run monthly on your chosen date\n\u2705 Unlimited km within your registered province \u2014 2,500km limit outside your province per month\n\u2705 Contact us immediately if you are involved in an accident or your vehicle is stolen\n\u2705 Do not remove or tamper with the GPS tracker at any time\n\nFor any queries:\n\uD83D\uDCAC WhatsApp: +27 61 049 0061\n\uD83D\uDCDE +27 21 211 0080 (Mon-Fri 09:00-17:00)\n\nThank you for choosing Auto Access. We look forward to supporting you throughout your 54-month journey to full ownership \uD83D\uDE97\n\nAuto Access Team",

    DECLINED: "Hi " + name + " \uD83D\uDC4B Auto Access here.\n\nThank you for your interest in Auto Access and for taking the time to apply.\n\nAfter carefully reviewing your application " + ref + " we are unfortunately unable to proceed at this time.\n\nWe understand this may be disappointing and we want you to know that circumstances change. We encourage you to reach out again in the future \u2014 we would love to assist you.\n\nIf you have any questions:\n\uD83D\uDCAC WhatsApp: +27 61 049 0061\n\uD83D\uDCDE +27 21 211 0080 (Mon-Fri 09:00-17:00)\n\nThank you again for considering Auto Access.\n\nAuto Access Team",
  };

  return messages[status] || ("Hi " + name + " \uD83D\uDC4B This is Auto Access following up on your application " + ref + ". Please log into your portal for updates: autoaccess.co.za/portal\n\nAuto Access Team");
}

export default function AdminWhatsAppButton({
  applicationId,
  phone,
  name,
  referenceNumber,
  status,
  whatsappContactedAt,
  size = "md",
}: AdminWhatsAppButtonProps) {
  const [contacted, setContacted] = useState<Date | null>(
    whatsappContactedAt ? new Date(whatsappContactedAt) : null
  );
  const [loading, setLoading] = useState(false);

  const contactedLabel = getContactedLabel(contacted);
  const formattedPhone = formatPhone(phone);
  const firstName = name.split(" ")[0];
  const message = getPrefilledMessage(status, firstName, referenceNumber);
  const waUrl = "https://wa.me/" + formattedPhone + "?text=" + encodeURIComponent(message);

  const handleClick = async () => {
    window.open(waUrl, "_blank");
    setLoading(true);
    try {
      await fetch("/api/admin/whatsapp-contacted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });
      setContacted(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const waIcon = (
    <svg className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );

  if (size === "sm") {
    return (
      <div className="flex flex-col items-start gap-1">
        <button
          onClick={handleClick}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
        >
          {waIcon}
          WhatsApp
        </button>
        {contactedLabel ? (
          <span className="text-[9px] font-semibold text-emerald-600">{"\u2713 " + contactedLabel}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
      >
        {waIcon}
        {loading ? "Opening..." : "Send WhatsApp"}
      </button>
      {contactedLabel ? (
        <span className="text-[10px] font-semibold text-emerald-600">{"\u2713 " + contactedLabel}</span>
      ) : null}
    </div>
  );
}
