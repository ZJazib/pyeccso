import { createFileRoute } from "@tanstack/react-router";
import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/learn")({
  component: () => <ContentManager typeKey="learn" />,
});
