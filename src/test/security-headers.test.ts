import { describe, expect, it } from "vitest";
import { withSecurityHeaders } from "@/lib/security-headers";

describe("security response headers", () => {
  it("adds defensive headers to every response", () => {
    const response = withSecurityHeaders(new Response("ok"), "http://localhost:3000/");
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    expect(response.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(response.headers.get("Permissions-Policy")).toContain("camera=()");
    expect(response.headers.has("Strict-Transport-Security")).toBe(false);
  });

  it("enables HSTS only for HTTPS requests", () => {
    const response = withSecurityHeaders(new Response("ok"), "https://example.test/");
    expect(response.headers.get("Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains",
    );
  });
});
