import { createFileRoute } from "@tanstack/react-router";
import { ContentManager } from "@/components/admin/ContentManager";

export const Route = createFileRoute("/admin/news")({
  component: () => <ContentManager typeKey="news" />,
});
