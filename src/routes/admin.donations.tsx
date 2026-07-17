import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/admin/donations")({
  component: () => (
    <ComingSoon
      title="Donations"
      phase="Phase 4"
      description="Manage fundraising campaigns, view HesabPay transactions and generate receipts."
    />
  ),
});
