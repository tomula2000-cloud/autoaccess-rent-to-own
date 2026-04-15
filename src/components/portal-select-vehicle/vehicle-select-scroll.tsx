"use client";

import { useEffect } from "react";

export default function VehicleSelectScroll({ selectedId }: { selectedId: string | null }) {
  useEffect(() => {
    if (!selectedId) return;
    const el = document.getElementById("financial-summary");
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [selectedId]);

  return null;
}
