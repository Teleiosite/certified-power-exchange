import { createFileRoute } from "@tanstack/react-router";
import { AssessmentPage } from "@/components/site/public-pages";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Project & Loan Evaluation Portal | Lampros" },
      { name: "description", content: "Submit organization, energy requirements, project costs, and supporting documents for a preliminary project assessment." },
      { property: "og:title", content: "Project & Loan Evaluation Portal" },
      { property: "og:description", content: "Organize project information and documents for a preliminary evaluation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssessmentPage,
});