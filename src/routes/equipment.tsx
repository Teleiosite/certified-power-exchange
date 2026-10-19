import { createFileRoute } from "@tanstack/react-router";
import { EquipmentPage } from "@/components/site/public-pages";

export const Route = createFileRoute("/equipment")({
  head: () => ({
    meta: [
      { title: "Inspected & Certified Power Equipment | Lampros" },
      { name: "description", content: "Review the sourcing, inspection, testing, and transparent condition-report process for recovered power equipment." },
      { property: "og:title", content: "Inspected Power Equipment | Lampros" },
      { property: "og:description", content: "Condition evidence and documented recovery for power equipment sourcing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EquipmentPage,
});