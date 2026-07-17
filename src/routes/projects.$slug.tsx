import { createFileRoute } from "@tanstack/react-router";
import { CmsDetail, META_ICONS } from "@/components/site/CmsDetail";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetail,
  head: ({ params }) => ({
    meta: [{ title: `Project — PYECSO` }, { name: "description", content: `PYECSO project: ${params.slug}` }],
  }),
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  return (
    <CmsDetail
      type="project"
      slug={slug}
      backTo="/projects"
      backLabel="All projects"
      breadcrumbLabel="Projects"
      buildMeta={(d) => [
        d.location && { icon: META_ICONS.MapPin, label: "Location", value: d.location },
        d.start_date && { icon: META_ICONS.Calendar, label: "Started", value: new Date(d.start_date).toLocaleDateString() },
        d.beneficiaries && { icon: META_ICONS.Users, label: "Beneficiaries", value: String(d.beneficiaries) },
        d.budget && { icon: META_ICONS.DollarSign, label: "Budget", value: `$${Number(d.budget).toLocaleString()}` },
        d.partner && { icon: META_ICONS.Briefcase, label: "Partner", value: d.partner },
      ].filter(Boolean) as any}
    />
  );
}
