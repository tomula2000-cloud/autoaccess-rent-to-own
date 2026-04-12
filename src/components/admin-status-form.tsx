"use client";

import { useMemo, useState } from "react";

type AdminStatusFormProps = {
  applicationId: string;
  currentStatus: string;
};

const STATUS_OPTIONS = [
  { value: "APPLICATION_RECEIVED", label: "Application Received" },
  { value: "PRE_QUALIFICATION_REVIEW", label: "Pre Qualification Review" },
  { value: "PRE_QUALIFIED", label: "Pre Qualified" },
  { value: "AWAITING_DOCUMENTS", label: "Awaiting Documents" },
  { value: "DOCUMENTS_SUBMITTED", label: "Documents Submitted" },
  { value: "DOCUMENTS_UNDER_REVIEW", label: "Documents Under Review" },
  {
    value: "ADDITIONAL_DOCUMENTS_REQUIRED",
    label: "Additional Documents Required",
  },
  { value: "APPROVED_IN_PRINCIPLE", label: "Approved in Principle" },
  { value: "CONTRACT_REQUESTED", label: "Contract Requested" },
  { value: "CONTRACT_ISSUED", label: "Contract Issued" },
  { value: "AWAITING_INVOICE", label: "Awaiting Invoice" },
  { value: "CONTRACT_EXPIRED", label: "Contract Expired" },
  { value: "CONTRACT_CANCELLED", label: "Contract Cancelled" },
  { value: "INVOICE_ISSUED", label: "Invoice Issued" },
  { value: "AWAITING_PAYMENT", label: "Awaiting Payment" },
  {
    value: "PAYMENT_UNDER_VERIFICATION",
    label: "Payment Under Verification",
  },
  { value: "PAYMENT_CONFIRMED", label: "Payment Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DECLINED", label: "Declined" },
];

function getDefaultNote(targetStatus: string) {
  switch (targetStatus) {
    case "CONTRACT_REQUESTED":
      return "Contract request recorded and awaiting admin review.";
    case "CONTRACT_ISSUED":
      return "Contract issued after review of applicant details and selected vehicle stage.";
    case "AWAITING_INVOICE":
      return "Signed contract received and awaiting admin invoice release.";
    case "CONTRACT_EXPIRED":
      return "Issued contract expired before completion of the required payment and final process.";
    case "CONTRACT_CANCELLED":
      return "Contract stage cancelled by admin after review.";
    case "INVOICE_ISSUED":
      return "Invoice issued following signed contract review.";
    case "AWAITING_PAYMENT":
      return "Awaiting payment from client.";
    case "PAYMENT_UNDER_VERIFICATION":
      return "Client payment received and currently under verification.";
    case "PAYMENT_CONFIRMED":
      return "Payment confirmed successfully.";
    default:
      return "";
  }
}

export default function AdminStatusForm({
  applicationId,
  currentStatus,
}: AdminStatusFormProps) {
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isContractIssueAction = status === "CONTRACT_ISSUED";
  const isContractCancelAction = status === "CONTRACT_CANCELLED";
  const isContractExpireAction = status === "CONTRACT_EXPIRED";

  const buttonLabel = useMemo(() => {
    if (loading) return "Updating...";
    if (isContractIssueAction) return "Issue Contract";
    if (isContractCancelAction) return "Cancel Contract";
    if (isContractExpireAction) return "Mark Contract Expired";
    return "Update Status";
  }, [
    loading,
    isContractIssueAction,
    isContractCancelAction,
    isContractExpireAction,
  ]);

  function handleStatusChange(nextStatus: string) {
    setStatus(nextStatus);
    setMessage("");
    setError("");

    if (!note.trim()) {
      setNote(getDefaultNote(nextStatus));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          note,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Something went wrong while updating the application status."
        );
        setLoading(false);
        return;
      }

      setMessage("Application status updated successfully.");
      setLoading(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Something went wrong while updating the application status.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Application Status
        </label>

        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isContractIssueAction ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
          <p className="font-semibold">Contract issue warning</p>
          <p className="mt-2">
            Issuing the contract should only be done after confirming that the
            client details correspond with the uploaded identity document and the
            selected vehicle and payment figures are correct.
          </p>
          <p className="mt-2">
            Once the contract is issued, the prior approval period should no
            longer govern this stage and the active contract timeline will begin.
          </p>
        </div>
      ) : null}

      {isContractCancelAction ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-4 text-sm leading-6 text-red-900">
          <p className="font-semibold">Contract cancellation warning</p>
          <p className="mt-2">
            This action should only be used if the contract stage must be
            withdrawn after review or due to non-compliance.
          </p>
        </div>
      ) : null}

      {isContractExpireAction ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-4 text-sm leading-6 text-red-900">
          <p className="font-semibold">Contract expiry action</p>
          <p className="mt-2">
            Use this only when the contract period has lapsed without completion
            of the required payment or final process.
          </p>
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-medium">Admin Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={5}
          placeholder="Add a note about this status update"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-600"
        />
      </div>

      {message ? (
        <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className={`inline-flex rounded-xl px-6 py-3 font-semibold text-white disabled:cursor-not-allowed ${
          isContractIssueAction
            ? "bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300"
            : isContractCancelAction || isContractExpireAction
            ? "bg-red-600 hover:bg-red-700 disabled:bg-red-300"
            : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
        }`}
      >
        {buttonLabel}
      </button>
    </form>
  );
}