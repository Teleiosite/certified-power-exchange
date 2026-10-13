import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { inquirySchema } from "@/lib/intake-schema";

async function fingerprint(address: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`lampros-intake:${address}`));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const submitLamprosInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inquirySchema.parse(input))
  .handler(async ({ data }) => {
    const address = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const ipFingerprint = await fingerprint(address);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: accepted, error: rateError } = await supabaseAdmin.rpc("claim_lampros_submission_slot", {
      p_fingerprint: ipFingerprint,
    });
    if (rateError) throw new Error("The enquiry could not be submitted. Please try again shortly.");
    if (!accepted) throw new Error("Too many requests. Please try again in a few minutes.");

    const { error } = await supabaseAdmin.from("lampros_inquiries").insert({
      inquiry_type: data.inquiryType,
      name: data.name,
      organization: data.organization,
      email: data.email,
      phone: data.phone,
      location: data.location,
      energy_load_kw: data.energyLoadKw,
      monthly_power_cost: data.monthlyPowerCost,
      outage_frequency: data.outageFrequency,
      sector: data.sector,
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
    });

    if (error) throw new Error("We couldn't save this enquiry. Please check your details and try again.");
    return { submitted: true as const };
  });