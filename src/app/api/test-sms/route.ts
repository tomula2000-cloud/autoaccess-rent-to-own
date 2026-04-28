import { NextResponse } from "next/server";

export async function GET() {
  try {
    const proxyUrl = new URL("https://sendmode-proxy.onrender.com/send-sms");
    proxyUrl.searchParams.set("numto", "27630193138");
    proxyUrl.searchParams.set("data1", "TestFromVercelDirectly");

    const startTime = Date.now();
    const response = await fetch(proxyUrl.toString(), {
      method: "GET",
      cache: "no-store",
    });
    const elapsed = Date.now() - startTime;
    const text = await response.text();

    return NextResponse.json({
      success: true,
      elapsed: `${elapsed}ms`,
      status: response.status,
      body: text,
      url: proxyUrl.toString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
