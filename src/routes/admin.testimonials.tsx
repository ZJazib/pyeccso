import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/testimonials")({
  component: () => (
    <ComingSoon
      title="Testimonials"
      phase="Phase 3"
      description="Manage beneficiary and partner quotes with photos and ratings."
    />
  ),
});
