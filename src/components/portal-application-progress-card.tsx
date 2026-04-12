"use client";

import { useEffect, useState } from "react";

type PortalApplicationProgressCardProps = {
  status:
    | "DOCUMENTS_SUBMITTED"
    | "DOCUMENTS_UNDER_REVIEW"
    | "ADDITIONAL_DOCUMENTS_REQUIRED";
};

function getCardContent(status: PortalApplicationProgressCardProps["status"]) {
  switch (status) {
    case "DOCUMENTS_SUBMITTED":
      return {
        label: "Application In Progress",
        title: "Documents received successfully",
        description:
          "Your documents have been submitted and your application is moving into the next review stage.",
        sub: "We have received your uploaded documents and are preparing the next assessment step.",
        messages: [
          "Driving your application forward.",
          "Documents received and queued for review.",
          "Preparing your next application step.",
          "Almost ready for the next stage.",
        ],
      };

    case "DOCUMENTS_UNDER_REVIEW":
      return {
        label: "Application In Review",
        title: "Your documents are under review",
        description:
          "Our team is currently reviewing your submitted documents and application details.",
        sub: "We are reviewing your documents and overall deal structure.",
        messages: [
          "Driving your application forward.",
          "Reviewing your documents carefully.",
          "Checking your details for the next step.",
          "Almost ready for the next stage.",
        ],
      };

    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return {
        label: "Action Still Required",
        title: "Additional documents are required",
        description:
          "More supporting documents are needed before your application can continue to the next stage.",
        sub: "Please review the latest request and prepare the additional documents needed.",
        messages: [
          "Driving your application forward.",
          "A few more documents are still needed.",
          "Preparing your application for the next review.",
          "Upload the requested items to continue.",
        ],
      };
  }
}

export default function PortalApplicationProgressCard({
  status,
}: PortalApplicationProgressCardProps) {
  const content = getCardContent(status);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % content.messages.length);
    }, 1600);

    return () => clearInterval(timer);
  }, [content.messages.length]);

  return (
    <div className="rounded-[18px] border border-white/80 bg-white/70 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)] backdrop-blur-md">
      <div className="inline-flex rounded-full bg-[rgba(249,115,22,0.10)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">
        {content.label}
      </div>

      <h3 className="mt-3 text-[1rem] font-bold tracking-tight text-[#1b2345] sm:text-[1.05rem]">
        {content.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#4d546a]">
        {content.description}
      </p>

      <div className="mx-auto mt-4 w-full max-w-[210px]">
        <div className="relative h-[74px] overflow-hidden">
          <div className="absolute bottom-3 left-0 right-0 h-[5px] overflow-hidden rounded-full bg-[#dbe3f2]">
            <div className="portal-road-stripes h-full w-[200%] opacity-60" />
          </div>

          <div className="portal-car absolute bottom-5 left-[-22%] h-[28px] w-[94px] rounded-[12px_18px_8px_8px] bg-[linear-gradient(180deg,#fb923c,#ea580c)] shadow-[0_8px_18px_rgba(249,115,22,0.20)]">
            <div className="absolute left-5 top-[-10px] h-[16px] w-[42px] rounded-[10px_10px_3px_3px] bg-[linear-gradient(180deg,#fdba74,#fb923c)]" />
            <div className="portal-wheel absolute bottom-[-7px] left-3 h-[18px] w-[18px] rounded-full border-[3px] border-[#94a3b8] bg-[#111827]" />
            <div className="portal-wheel absolute bottom-[-7px] right-3 h-[18px] w-[18px] rounded-full border-[3px] border-[#94a3b8] bg-[#111827]" />
          </div>
        </div>
      </div>

      <div className="mt-1 text-center text-sm font-semibold text-[#1b2345] min-h-[20px]">
        {content.messages[messageIndex]}
      </div>

      <div className="mt-1 text-center text-xs leading-5 text-[#6b7280]">
        {content.sub}
      </div>

      <div className="mt-4 h-[8px] w-full overflow-hidden rounded-full bg-[#e7edf7]">
        <div className="portal-progress-glow h-full w-[28%] rounded-full opacity-80" />
      </div>
    </div>
  );
}