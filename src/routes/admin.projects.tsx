import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/projects")({
  component: () => (
    <ComingSoon
      title="Projects"
      phase="Phase 2"
      description="Manage active and completed projects, categories, timelines and gallery."
    />
  ),
});
