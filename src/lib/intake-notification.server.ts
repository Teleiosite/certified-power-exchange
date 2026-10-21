import type { z } from "zod";
import { inquirySchema } from "@/lib/intake-schema";

type Inquiry = z.infer<typeof inquirySchema>;

type NotificationConfig =
  | { configured: false }
  | { configured: true; apiKey: string; recipient: string; sender: string };

export function notificationConfiguration() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipient = process.env.LAMPROS_NOTIFICATION_EMAIL?.trim();
  const sender = process.env.LAMPROS_FROM_EMAIL?.trim();
  const values = [apiKey, recipient, sender];
  const hasAnyConfiguration = values.some(Boolean);
  const isFullyConfigured = values.every(Boolean);

  if (hasAnyConfiguration && !isFullyConfigured) {
    throw new Error("Configure RESEND_API_KEY, LAMPROS_NOTIFICATION_EMAIL, and LAMPROS_FROM_EMAIL together.");
  }

  if (!isFullyConfigured) return { configured: false } satisfies NotificationConfig;
  return { configured: true, apiKey: apiKey!, recipient: recipient!, sender: sender! } satisfies NotificationConfig;
}

export async function sendInquiryNotification(inquiryId: string, inquiry: Inquiry): Promise<boolean> {
  const configuration = notificationConfiguration();
  if (!configuration.configured) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `******
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: configuration.sender,
      to: [configuration.recipient],
      reply_to: inquiry.email,
      subject: `New ${inquiry.inquiryType} enquiry`,
      text: [
        `A new ${inquiry.inquiryType} enquiry has been received.`,
        `Reference: ${inquiryId}`,
        `Name: ${inquiry.name}`,
        `Organization: ${inquiry.organization || "Not provided"}`,
        `Email: ${inquiry.email}`,
        `Phone: ${inquiry.phone}`,
        `Location: ${inquiry.location}`,
        `Estimated load: ${inquiry.energyLoadKw} kW`,
        "",
        "Review the inquiry in the secured database console. Uploaded files are not attached to this email.",
      ].join("\n"),
    }),
    signal: AbortSignal.timeout(10_000),
  }).catch((error: unknown) => {
    console.error("[Intake] Notification request failed", {
      inquiryId,
      error: error instanceof Error ? error.message : "Unknown notification error",
    });
    return undefined;
  });

  if (!response?.ok) {
    console.error("[Intake] Notification provider rejected the email", {
      inquiryId,
      status: response?.status ?? "network_error",
    });
    return false;
  }
  return true;
}
