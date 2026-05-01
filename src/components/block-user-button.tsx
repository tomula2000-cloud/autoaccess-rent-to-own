"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BlockUserButton({ userId, isBlocked }: { userId: string; isBlocked: boolean }) {
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(isBlocked);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleToggle = async () => {
    const action = blocked ? "unblock" : "block";
    if (!confirm(blocked ? "Unblock this client and restore portal access?" : "Block this client? They will receive an email and lose portal access immediately.")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/block-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setBlocked(data.isBlocked);
        setMessage(data.isBlocked ? "✅ Client blocked. Notification email sent." : "✅ Client unblocked. Portal access restored.");
        router.refresh();
      } else {
        setMessage(`❌ ${data.error || "Failed."}`);
      }
    } catch {
      setMessage("❌ Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow transition disabled:opacity-50 ${
          blocked
            ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
            : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
        }`}
      >
        {loading ? "Processing…" : blocked ? "🔓 Unblock Client" : "🚫 Block Client"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
