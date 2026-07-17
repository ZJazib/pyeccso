import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/learn")({
  component: () => (
    <ComingSoon
      title="Learn Landing"
      phase="Phase 4"
      description="Configure the learn.pyecso.org.af landing content and featured trainings."
    />
  ),
});
