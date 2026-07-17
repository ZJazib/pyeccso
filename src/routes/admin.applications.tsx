import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/applications")({
  component: () => (
    <ComingSoon
      title="Applications"
      phase="Phase 4"
      description="Review student and volunteer applications across all programs."
    />
  ),
});
