import { createFileRoute } from "@tanstack/react-router";
import { CmsDetail, META_ICONS } from "@/components/site/CmsDetail";

export const Route = createFileRoute("/publications/$slug")({
  component: PublicationDetail,
  head: () => ({ meta: [{ title: "Publication — PYECSO" }] }),
});

function PublicationDetail() {
  const { slug } = Route.useParams();
  return (
    <CmsDetail
      type="publication"
      slug={slug}
      backTo="/media"
      backLabel="All publications"
      breadcrumbLabel="Publications"
      buildMeta={(d) => [
        d.year && { icon: META_ICONS.Calendar, label: "Year", value: String(d.year) },
        d.category && { icon: META_ICONS.Briefcase, label: "Category", value: d.category },
      ].filter(Boolean) as any}
      extra={(item) => item.data?.file_url ? (
        <div className="mt-8">
          <a href={item.data.file_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-md font-semibold">
            <META_ICONS.Download className="size-4" /> Download PDF
          </a>
        </div>
      ) : null}
    />
  );
}
