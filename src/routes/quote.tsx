import { createFileRoute } from "@tanstack/react-router";
import { QuotePage } from "@/components/site/public-pages";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Request a Project Quote | Lampros Power Tech" },
      { name: "description", content: "Send Lampros a multi-item equipment request with your location, power load, and delivery requirements. No online payment." },
      { property: "og:title", content: "Request a Project Quote | Lampros" },
      { property: "og:description", content: "Build a supply list and request project pricing, freight, and specification review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuotePage,
});