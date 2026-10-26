import { createFileRoute } from "@tanstack/react-router";
import { GalleryPage } from "@/components/site/public-pages";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Project Gallery | Lampros Power Tech" },
      { name: "description", content: "Photos of Lampros Power Tech projects and what each project is about." },
      { property: "og:title", content: "Project Gallery | Lampros Power Tech" },
      { property: "og:description", content: "Photos of our projects and what they are about." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});
