/**
 * Sendmode SMS sending utility
 * Docs: https://developers.sendmode.co.za/httpdocs/httpsend
 */

export async function sendBulkSMS({
  to,
  message,
}: {
  to: string;
  message: string;
}): Promise<void> {
  const username = process.env.SENDMODE_USERNAME?.trim();
  const password = process.env.SENDMODE_PASSWORD?.trim();

  console.log("[SMS DEBUG] Sendmode start", {
    hasUsername: Boolean(username),
    hasPassword: Boolean(password),
    to,
  });

  if (!username || !password) {
    console.warn("Sendmode credentials not set — skipping SMS send");
    return;
  }

  // Normalise SA phone number to international format (e.g. 0821234567 -> 27821234567)
  const normalised = to.startsWith("+")
    ? to.replace("+", "")
    : to.startsWith("27")
    ? to
    : `27${to.replace(/^0/, "")}`;

  console.log("[SMS DEBUG] Normalised number:", normalised);

  const url = new URL("https://api.sendmode.co.za/httppost.aspx");
  url.searchParams.set("Type", "sendparam");
  url.searchParams.set("username", username);
  url.searchParams.set("password", password);
  url.searchParams.set("numto", normalised);
  url.searchParams.set("data1", message);

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  const responseText = await response.text();

  console.log("[SMS DEBUG] Sendmode HTTP status:", response.status);
  console.log("Sendmode SMS response:", responseText);

  const hasExplicitError =
    responseText.includes("<result>False</result>") ||
    responseText.includes("<r>False</r>") ||
    /<error>\s*[^<]+\s*<\/error>/i.test(responseText);

  if (!response.ok || hasExplicitError) {
    throw new Error(`Sendmode API error: ${responseText}`);
  }
}
