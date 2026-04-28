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
  const username = process.env.SENDMODE_USERNAME;
  const password = process.env.SENDMODE_PASSWORD;

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

  const url = new URL("https://api.sendmode.co.za/httppost.aspx");
  url.searchParams.set("Type", "sendparam");
  url.searchParams.set("username", username);
  url.searchParams.set("password", password);
  url.searchParams.set("numto", normalised);
  url.searchParams.set("data1", message);

  const response = await fetch(url.toString());
  const responseText = await response.text();

  if (!response.ok || responseText.includes("<r>False</r>")) {
    throw new Error(`Sendmode API error: ${responseText}`);
  }

  console.log("Sendmode SMS response:", responseText);
}
