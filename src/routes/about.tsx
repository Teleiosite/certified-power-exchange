import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/site/public-pages";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Lampros Power Tech | Mission & Standards" },
      { name: "description", content: "Learn about Lampros Power Tech’s mission, values, and practical standards for energy projects and equipment sourcing." },
      { property: "og:title", content: "About Lampros Power Tech" },
      { property: "og:description", content: "Our mission, values, and standards for accountable power solutions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});