import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { hasValidFileSignature, inquirySchema } from "@/lib/intake-schema";

const storageBucket = "lampros-assessment-files";
const isProduction = process.env["NODE_ENV"] === "production" || import.meta.env.PROD;

async function fingerprint(address: string): Promise<string> {
  const keyMaterial = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!keyMaterial)
    throw new Error("Enquiry submissions are temporarily unavailable. Please try again later.");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(keyMaterial),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(address));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const submitLamprosInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inquirySchema.parse(input))
  .handler(async ({ data }) => {
    const address =
      getRequestHeader("cf-connecting-ip")?.trim() ||
      getRequestIP({ xForwardedFor: false }) ||
      "unknown";
    if (isProduction && address === "unknown") {
      throw new Error("Enquiry submissions are temporarily unavailable. Please try again later.");
    }
    const ipFingerprint = await fingerprint(address);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendInquiryNotification, notificationConfiguration } =
      await import("@/lib/intake-notification.server");

    const notification = notificationConfiguration();
    if (isProduction && !notification.configured) {
      throw new Error("Enquiry submissions are temporarily unavailable. Please try again later.");
    }

    const { data: accepted, error: rateError } = await supabaseAdmin.rpc(
      "claim_lampros_submission_slot",
      {
        p_fingerprint: ipFingerprint,
      },
    );
    if (rateError) throw new Error("The enquiry could not be submitted. Please try again shortly.");
    if (!accepted) throw new Error("Too many requests. Please try again in a few minutes.");

    for (const file of data.files) {
      const { data: uploadedFile, error: fileError } = await supabaseAdmin.storage
        .from(storageBucket)
        .download(file.storagePath);
      if (
        fileError ||
        !uploadedFile ||
        uploadedFile.size !== file.size ||
        uploadedFile.type !== file.type ||
        !(await hasValidFileSignature(uploadedFile))
      ) {
        throw new Error(
          "One or more attachments could not be verified. Please remove and attach them again.",
        );
      }
    }

    const { data: inquiry, error } = await supabaseAdmin
      .from("lampros_inquiries")
      .insert({
        inquiry_type: data.inquiryType,
        name: data.name,
        organization: data.organization,
        email: data.email,
        phone: data.phone,
        location: data.location,
        energy_load_kw: data.energyLoadKw,
        monthly_power_cost: data.monthlyPowerCost ?? null,
        outage_frequency: data.outageFrequency ?? null,
        sector: data.sector ?? null,
        details: data.details,
        items: data.items,
        documents: data.files.map((file) => ({
          name: file.name,
          path: file.storagePath,
          type: file.type,
          size: file.size,
          category: file.category,
        })),
        ip_fingerprint: ipFingerprint,
        notification_status: notification.configured ? "pending" : "not_configured",
      })
      .select("id")
      .single();

    if (error || !inquiry)
      throw new Error("We couldn't save this enquiry. Please check your details and try again.");
    if (notification.configured) {
      const delivered = await sendInquiryNotification(inquiry.id, data);
      const { error: notificationUpdateError } = await supabaseAdmin
        .from("lampros_inquiries")
        .update({
          notification_status: delivered ? "sent" : "failed",
          notification_sent_at: delivered ? new Date().toISOString() : null,
        })
        .eq("id", inquiry.id);
      if (notificationUpdateError) {
        console.error("[Intake] Could not update notification status", { inquiryId: inquiry.id });
      }
    }
    return { submitted: true as const };
  });
