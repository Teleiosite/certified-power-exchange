import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "@/components/site/public-pages";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Renewable & Electrical Supplies Catalogue | Lampros" },
      { name: "description", content: "Search solar, battery, cable, protection, switch, conduit, and distribution products for a project-matched quote." },
      { property: "og:title", content: "Renewable & Electrical Supplies Catalogue" },
      { property: "og:description", content: "Browse project-specified renewable energy products and electrical components." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});