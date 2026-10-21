import { describe, expect, it } from "vitest";
import {
  hasValidFileSignature,
  inquirySchema,
  intakeFileSchema,
  isAllowedFile,
  maxIntakeFileSize,
} from "@/lib/intake-schema";

const validContact = {
  inquiryType: "quote" as const,
  name: "Project Contact",
  organization: "Example Organization",
  email: "contact@example.com",
  phone: "+234 800 555 0101",
  location: "Lagos, Nigeria",
  energyLoadKw: 75,
  items: [{ id: "panel-01", name: "PV module", quantity: 4 }],
};

describe("intake file safeguards", () => {
  it("allows files up to 10 MB and rejects larger files", () => {
    expect(maxIntakeFileSize).toBe(10 * 1024 * 1024);
    expect(
      isAllowedFile(
        new File([new Uint8Array(10 * 1024 * 1024)], "report.pdf", { type: "application/pdf" }),
      ),
    ).toBe(true);
    expect(
      isAllowedFile(
        new File([new Uint8Array(10 * 1024 * 1024 + 1)], "report.pdf", { type: "application/pdf" }),
      ),
    ).toBe(false);
  });

  it("accepts only PDF, JPEG, PNG and WebP MIME types", () => {
    for (const type of ["application/pdf", "image/jpeg", "image/png", "image/webp"]) {
      expect(isAllowedFile(new File(["content"], "file", { type }))).toBe(true);
    }
    expect(isAllowedFile(new File(["content"], "file", { type: "text/plain" }))).toBe(false);
  });

  it("requires a UUID storage path with an accepted extension", () => {
    const base = { name: "specification.pdf", type: "application/pdf" as const, size: 12 };
    expect(
      intakeFileSchema.safeParse({
        ...base,
        storagePath: "550e8400-e29b-41d4-a716-446655440000.pdf",
      }).success,
    ).toBe(true);
    expect(
      intakeFileSchema.safeParse({ ...base, storagePath: "550e8400-e29b-41d4-a716-446655440000" })
        .success,
    ).toBe(false);
    expect(
      intakeFileSchema.safeParse({
        ...base,
        storagePath: "550e8400-e29b-41d4-a716-446655440000.png",
      }).success,
    ).toBe(false);
  });

  it("rejects a PDF whose bytes do not match the declared file type", async () => {
    expect(
      await hasValidFileSignature(new File(["not a PDF"], "fake.pdf", { type: "application/pdf" })),
    ).toBe(false);
    expect(
      await hasValidFileSignature(new File(["%PDF-1.7"], "real.pdf", { type: "application/pdf" })),
    ).toBe(true);
  });
});

describe("inquiry requirements", () => {
  it("requires a valid email address", () => {
    expect(inquirySchema.safeParse({ ...validContact, email: "not-an-email" }).success).toBe(false);
  });

  it("requires a valid phone number", () => {
    expect(inquirySchema.safeParse({ ...validContact, phone: "123" }).success).toBe(false);
  });

  it("requires a project location", () => {
    expect(inquirySchema.safeParse({ ...validContact, location: " " }).success).toBe(false);
  });

  it("requires a positive estimated energy load", () => {
    expect(inquirySchema.safeParse({ ...validContact, energyLoadKw: 0 }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...validContact, energyLoadKw: 75 }).success).toBe(true);
  });

  it("requires monthly cost, outage frequency and sector for audits", () => {
    expect(
      inquirySchema.safeParse({
        ...validContact,
        inquiryType: "audit",
        items: [],
        monthlyPowerCost: 450000,
        outageFrequency: "Daily",
        sector: "Commercial",
      }).success,
    ).toBe(true);
    expect(
      inquirySchema.safeParse({
        ...validContact,
        inquiryType: "audit",
        items: [],
        outageFrequency: "Daily",
        sector: "Commercial",
      }).success,
    ).toBe(false);
  });

  it("requires at least one requested product for a quote", () => {
    expect(inquirySchema.safeParse({ ...validContact, items: [] }).success).toBe(false);
  });
});
