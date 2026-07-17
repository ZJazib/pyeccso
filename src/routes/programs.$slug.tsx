import { createFileRoute } from "@tanstack/react-router";
import { CmsDetail } from "@/components/site/CmsDetail";

export const Route = createFileRoute("/programs/$slug")({
  component: ProgramDetail,
  head: () => ({ meta: [{ title: "Program — PYECSO" }] }),
});

function ProgramDetail() {
  const { slug } = Route.useParams();
  return (
    <CmsDetail
      type="program"
      slug={slug}
      backTo="/programs"
      backLabel="All programs"
      breadcrumbLabel="Programs"
      buildMeta={(d) => (d.category ? [{ icon: (require("lucide-react").Briefcase), label: "Category", value: d.category }] : [])}
    />
  );
}
