import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/news")({
  component: () => (
    <ComingSoon
      title="News"
      phase="Phase 3"
      description="Publish news articles with author, category, cover image and multilingual body."
    />
  ),
});
