import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/partners")({
  component: () => (
    <ComingSoon
      title="Partners"
      phase="Phase 3"
      description="Manage donors and partner logos shown across the site."
    />
  ),
});
