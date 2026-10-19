import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/site/public-pages";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Energy Services | Lampros Power Tech" },
      { name: "description", content: "Explore renewable energy, electrical supply, power equipment sourcing, energy audits, and project assessment services." },
      { property: "og:title", content: "Energy Services | Lampros Power Tech" },
      { property: "og:description", content: "Renewable energy, electrical supply, equipment sourcing, audits, and project evaluation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});