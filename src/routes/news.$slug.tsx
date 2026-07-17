import { createFileRoute } from "@tanstack/react-router";
import { CmsDetail, META_ICONS } from "@/components/site/CmsDetail";

export const Route = createFileRoute("/news/$slug")({
  component: NewsDetail,
  head: () => ({ meta: [{ title: "News — PYECSO" }] }),
});

function NewsDetail() {
  const { slug } = Route.useParams();
  return (
    <CmsDetail
      type="news"
      slug={slug}
      backTo="/media"
      backLabel="All news"
      breadcrumbLabel="News"
      buildMeta={(d) => [
        d.author && { icon: META_ICONS.Users, label: "Author", value: d.author },
        d.category && { icon: META_ICONS.Briefcase, label: "Category", value: d.category },
      ].filter(Boolean) as any}
    />
  );
}
