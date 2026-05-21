"use client";
import { useEffect } from "react";

export default function PortalStatusCookie({ status }: { status: string }) {
  useEffect(() => {
    document.cookie = `autoaccess_portal_status=${status};path=/;max-age=3600`;
  }, [status]);
  return null;
}
