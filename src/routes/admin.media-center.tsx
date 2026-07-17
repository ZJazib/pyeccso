import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/media-center")({
  component: () => (
    <ComingSoon
      title="Media Center"
      phase="Phase 3"
      description="Curate Photos, Videos, Press Releases, News & Stories, Media Coverage and Publications."
    />
  ),
});
