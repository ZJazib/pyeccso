import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/careers")({
  component: () => (
    <ComingSoon
      title="Careers"
      phase="Phase 4"
      description="Post jobs and internships and review applications."
    />
  ),
});
