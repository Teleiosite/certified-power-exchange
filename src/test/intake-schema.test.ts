import { describe, expect, it } from "vitest";
import { hasValidFileSignature, intakeFileSchema, isAllowedFile, maxIntakeFileSize } from "@/lib/intake-schema";

describe("intake file safeguards", () => {
  it("allows files up to 10 MB and rejects larger files", () => {
    expect(maxIntakeFileSize).toBe(10 * 1024 * 1024);
    expect(isAllowedFile(new File([new Uint8Array(10 * 1024 * 1024)], "report.pdf", { type: "application/pdf" }))).toBe(true);
    expect(isAllowedFile(new File([new Uint8Array(10 * 1024 * 1024 + 1)], "report.pdf", { type: "application/pdf" }))).toBe(false);
  });

  it("accepts only PDF, JPEG, PNG and WebP MIME types", () => {
    for (const type of ["application/pdf", "image/jpeg", "image/png", "image/webp"]) {
      expect(isAllowedFile(new File(["content"], "file", { type }))).toBe(true);
    }
    expect(isAllowedFile(new File(["content"], "file", { type: "text/plain" }))).toBe(false);
  });

  it("requires a UUID storage path with an accepted extension", () => {
    const base = { name: "specification.pdf", type: "application/pdf" as const, size: 12 };
    expect(intakeFileSchema.safeParse({ ...base, storagePath: "550e8400-e29b-41d4-a716-446655440000.pdf" }).success).toBe(true);
    expect(intakeFileSchema.safeParse({ ...base, storagePath: "550e8400-e29b-41d4-a716-446655440000" }).success).toBe(false);
  });

  it("rejects a PDF whose bytes do not match the declared file type", async () => {
    expect(await hasValidFileSignature(new File(["not a PDF"], "fake.pdf", { type: "application/pdf" }))).toBe(false);
    expect(await hasValidFileSignature(new File(["%PDF-1.7"], "real.pdf", { type: "application/pdf" }))).toBe(true);
  });
});