import { NextResponse } from "next/server";
import { sendBulkSMS } from "@/lib/sms";

export async function GET() {
  try {
    const startTime = Date.now();
    await sendBulkSMS({
      to: "0630193138",
      message: "Test via sendBulkSMS function from Vercel",
    });
    const elapsed = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      elapsed: `${elapsed}ms`,
      message: "sendBulkSMS completed without throwing",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
