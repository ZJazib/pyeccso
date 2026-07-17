import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/programs")({
  component: () => (
    <ComingSoon
      title="Programs"
      phase="Phase 2"
      description="Create and edit programs shown on the Programs section of the site."
    />
  ),
});
