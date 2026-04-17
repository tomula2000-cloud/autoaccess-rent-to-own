"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Props = {
  currentStatus: string;
  referenceNumber: string;
};

export default function PortalStatusPoller({ currentStatus, referenceNumber }: Props) {
  const router = useRouter();
  const statusRef = useRef(currentStatus);

  useEffect(() => {
    statusRef.current = currentStatus;
  }, [currentStatus]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/portal/me");
        const data = await res.json();
        if (data.loggedIn && data.status && data.status !== statusRef.current) {
          router.refresh();
        }
      } catch {
        // silent fail
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
