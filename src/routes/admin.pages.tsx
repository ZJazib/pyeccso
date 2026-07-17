import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/pages")({
  component: () => (
    <ComingSoon
      title="Pages"
      phase="Phase 2"
      description="Manage Home, About, Contact, Donate, Learn landing and other static pages with a multilingual content editor."
    />
  ),
});
