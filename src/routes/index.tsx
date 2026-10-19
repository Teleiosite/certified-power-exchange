import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/site/public-pages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lampros Power Tech | Dependable Energy Products" },
      { name: "description", content: "Practical energy products, electrical supplies, and transparently inspected power equipment for real project requirements." },
      { property: "og:title", content: "Lampros Power Tech | Dependable Energy Products" },
      { property: "og:description", content: "Practical energy products, electrical supplies, and transparently inspected power equipment for real project requirements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});