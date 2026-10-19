import { createFileRoute } from "@tanstack/react-router";
import { AuditPage } from "@/components/site/public-pages";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Request an Energy Audit Estimate | Lampros" },
      { name: "description", content: "Share your sector, monthly power cost, outage frequency, location, and estimated load for an energy assessment scope." },
      { property: "og:title", content: "Request an Energy Audit Estimate" },
      { property: "og:description", content: "A practical, site-aware review begins with your energy use and operating conditions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditPage,
});