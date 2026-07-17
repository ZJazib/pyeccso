import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/team")({
  component: () => (
    <ComingSoon
      title="Team"
      phase="Phase 3"
      description="Manage team members grouped by department with photos and bios."
    />
  ),
});
