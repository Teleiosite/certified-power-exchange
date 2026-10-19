import { z } from "zod";

export const supportedUploadTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const;
export const intakeFileSchema = z.object({
  name: z.string().trim().min(1).max(200),
  storagePath: z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|jpg|png|webp)$/i),
  type: z.enum(supportedUploadTypes),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  category: z.enum(["equipment specifications", "energy requirements", "project cost estimates", "financing paperwork"]).optional(),
});

export async function hasValidFileSignature(file: File): Promise<boolean> {
  if (!isAllowedFile(file)) return false;
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (file.type === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png") return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte);
  if (file.type === "image/webp") return new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  return false;
}

export const inquirySchema = z.object({
  inquiryType: z.enum(["quote", "audit", "loan", "trade-in"]),
  name: z.string().trim().min(2).max(100),
  organization: z.string().trim().max(120).default(""),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(32).regex(/^\+?[0-9().\s-]+$/),
  location: z.string().trim().min(2).max(160),
  energyLoadKw: z.number().finite().positive().max(1000000),
  monthlyPowerCost: z.number().finite().positive().max(10000000000).optional(),
  outageFrequency: z.string().trim().max(80).optional(),
  sector: z.enum(["Residential", "Commercial", "Industrial"]).optional(),
  details: z.string().trim().max(4000).default(""),
  items: z.array(z.object({
    id: z.string().trim().min(1).max(80),
    name: z.string().trim().min(1).max(200),
    quantity: z.number().int().positive().max(100000),
  })).max(50).default([]),
  files: z.array(intakeFileSchema).max(8).default([]),
}).superRefine((value, context) => {
  if (value.inquiryType === "audit") {
    if (value.monthlyPowerCost === undefined) context.addIssue({ code: z.ZodIssueCode.custom, path: ["monthlyPowerCost"], message: "Add your estimated monthly power cost." });
    if (!value.outageFrequency) context.addIssue({ code: z.ZodIssueCode.custom, path: ["outageFrequency"], message: "Select how often your power goes out." });
    if (!value.sector) context.addIssue({ code: z.ZodIssueCode.custom, path: ["sector"], message: "Select a sector." });
  }
  if (value.inquiryType === "quote" && value.items.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["items"], message: "Add at least one product to your quote." });
  }
});

export type IntakeInput = z.input<typeof inquirySchema>;
export type IntakeFile = z.infer<typeof intakeFileSchema>;

export const maxIntakeFileSize = 10 * 1024 * 1024;
export const isAllowedFile = (file: File) => supportedUploadTypes.includes(file.type as (typeof supportedUploadTypes)[number]) && file.size > 0 && file.size <= maxIntakeFileSize;