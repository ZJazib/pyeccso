import { createFileRoute, Link } from "@tanstack/react-router";
import { CmsDetail, META_ICONS } from "@/components/site/CmsDetail";

export const Route = createFileRoute("/careers/$slug")({
  component: CareerDetail,
  head: () => ({ meta: [{ title: "Career opportunity — PYECSO" }] }),
});

function CareerDetail() {
  const { slug } = Route.useParams();
  return (
    <CmsDetail
      type="career"
      slug={slug}
      backTo="/careers"
      backLabel="All openings"
      breadcrumbLabel="Careers"
      buildMeta={(d) => [
        d.department && { icon: META_ICONS.Briefcase, label: "Department", value: d.department },
        d.location && { icon: META_ICONS.MapPin, label: "Location", value: d.location },
        d.employment_type && { icon: META_ICONS.Clock, label: "Type", value: d.employment_type },
        d.deadline && { icon: META_ICONS.Calendar, label: "Deadline", value: new Date(d.deadline).toLocaleDateString() },
        d.salary_range && { icon: META_ICONS.DollarSign, label: "Salary", value: d.salary_range },
      ].filter(Boolean) as any}
      extra={(item) => (
        <>
          {item.t.requirements && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">Requirements</h3>
              <div className="text-navy-900/80 dark:text-white/80 whitespace-pre-line">{item.t.requirements}</div>
            </div>
          )}
          <div className="mt-8">
            <Link to="/portal" className="inline-flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-md font-semibold">
              Apply now
            </Link>
          </div>
        </>
      )}
    />
  );
}
