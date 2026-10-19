import { createFileRoute } from "@tanstack/react-router";
import { TradeInPage } from "@/components/site/public-pages";

export const Route = createFileRoute("/trade-in")({
  head: () => ({
    meta: [
      { title: "Sell or Trade In Power Equipment | Lampros" },
      { name: "description", content: "Share the specifications, service history, location, and known condition of equipment for a transparent sourcing review." },
      { property: "og:title", content: "Sell or Trade In Power Equipment" },
      { property: "og:description", content: "Start an equipment recovery review with clear specifications and known condition." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TradeInPage,
});