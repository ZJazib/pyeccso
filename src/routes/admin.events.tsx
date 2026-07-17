import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/events")({
  component: () => (
    <ComingSoon
      title="Events"
      phase="Phase 3"
      description="Create upcoming events with date, venue, RSVP and gallery."
    />
  ),
});
