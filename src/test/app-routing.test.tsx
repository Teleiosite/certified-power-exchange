import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches the home page and each public destination", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    for (const path of ["/", "/about", "/services", "/catalog", "/equipment", "/quote", "/audit", "/assessment", "/trade-in"]) {
      const matches = router.matchRoutes(path);
      expect(matches.at(-1)?.routeId, `expected ${path} to resolve to a page`).not.toBe(rootRouteId);
    }
  });
});
