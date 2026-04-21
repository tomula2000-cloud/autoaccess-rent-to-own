/**
 * BulkSMS sending utility
 * Docs: https://www.bulksms.com/developer/json/v1/#tag/Message/paths/~1messages/post
 */

export async function sendBulkSMS({
  to,
  message,
}: {
  to: string;
  message: string;
}): Promise<void> {
  const tokenId = process.env.BULKSMS_TOKEN_ID;
  const tokenSecret = process.env.BULKSMS_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    console.warn("BulkSMS credentials not set — skipping SMS send");
    return;
  }

  // Normalise SA phone number to international format (e.g. 0821234567 -> +27821234567)
  const normalised = to.startsWith("+")
    ? to
    : to.startsWith("27")
    ? `+${to}`
    : `+27${to.replace(/^0/, "")}`;

  const credentials = Buffer.from(`${tokenId}:${tokenSecret}`).toString("base64");

  const response = await fetch("https://api.bulksms.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify([
      {
        to: normalised,
        body: message,
      },
    ]),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`BulkSMS API error ${response.status}: ${error}`);
  }
}
