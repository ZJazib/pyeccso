import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/contact")({
  component: () => (
    <ComingSoon
      title="Contact & Messages"
      phase="Phase 4"
      description="Manage office locations, contact info and inbound messages."
    />
  ),
});
