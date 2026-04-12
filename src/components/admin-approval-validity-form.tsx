"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdminApprovalValidityFormProps = {
  applicationId: string;
  currentStatus: string;
  approvalValidUntil: string | null;
};

export default function AdminApprovalValidityForm({
  applicationId,
  currentStatus,
  approvalValidUntil,
}: AdminApprovalValidityFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function runAction(action: string) {
    if (currentStatus !== "APPROVED_IN_PRINCIPLE") {
      setMessage(
        "Approval validity controls are only available while the application is in Approved in Principle status."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/applications/${applicationId}/approval-validity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong.");
        setLoading(false);
        return;
      }

      setMessage(data.message || "Approval validity updated successfully.");
      setLoading(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while updating approval validity.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
        Approval Validity Control
      </p>

      <h2 className="mt-3 text-2xl font-bold">Admin Expiry Override</h2>

      <p className="mt-3 text-sm leading-7 text-gray-600">
        The system applies a default 12-day validity period to applications in
        Approved in Principle status. Admin may extend, remove, or reinstate
        approval validity where operationally justified.
      </p>

      <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
          Current approval validity
        </p>
        <p className="mt-2 text-sm font-semibold text-gray-900">
          {approvalValidUntil
            ? new Date(approvalValidUntil).toLocaleString()
            : "No expiry limit currently applied"}
        </p>
      </div>

      {message ? (
        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm font-medium text-blue-900">
          {message}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => runAction("extend_3_days")}
          disabled={loading}
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Extend by 3 Days
        </button>

        <button
          type="button"
          onClick={() => runAction("extend_5_days")}
          disabled={loading}
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Extend by 5 Days
        </button>

        <button
          type="button"
          onClick={() => runAction("extend_7_days")}
          disabled={loading}
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Extend by 7 Days
        </button>

        <button
          type="button"
          onClick={() => runAction("reinstate_12_days")}
          disabled={loading}
          className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 font-semibold text-green-800 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Reinstate 12 Days
        </button>

        <button
          type="button"
          onClick={() => runAction("remove_expiry")}
          disabled={loading}
          className="sm:col-span-2 rounded-xl border border-orange-300 bg-orange-50 px-4 py-3 font-semibold text-orange-800 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Remove Expiry Limit
        </button>
      </div>
    </div>
  );
}