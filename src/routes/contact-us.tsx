import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/site/public-pages";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Lampros Power Tech" },
      {
        name: "description",
        content:
          "Connect with Lampros Power Tech for energy project reviews, electrical supplies, power equipment and equipment recovery.",
      },
      { property: "og:title", content: "Contact Lampros Power Tech" },
      {
        property: "og:description",
        content: "Choose the right project request and connect with the Lampros Power Tech team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});
