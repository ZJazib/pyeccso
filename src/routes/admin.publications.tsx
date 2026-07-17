import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/publications")({
  component: () => (
    <ComingSoon
      title="Publications"
      phase="Phase 3"
      description="Upload annual reports, research and downloadable resources."
    />
  ),
});
