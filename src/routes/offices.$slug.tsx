import { createFileRoute } from "@tanstack/react-router";
import { CmsDetail, META_ICONS } from "@/components/site/CmsDetail";

export const Route = createFileRoute("/offices/$slug")({
  component: OfficeDetail,
  head: () => ({ meta: [{ title: "Office — PYECSO" }] }),
});

function OfficeDetail() {
  const { slug } = Route.useParams();
  return (
    <CmsDetail
      type="office"
      slug={slug}
      backTo="/offices"
      backLabel="All offices"
      breadcrumbLabel="Offices"
      buildMeta={(d) => [
        d.city && { icon: META_ICONS.MapPin, label: "City", value: d.city },
        d.phone && { icon: META_ICONS.Phone, label: "Phone", value: d.phone },
        d.email && { icon: META_ICONS.Mail, label: "Email", value: d.email },
        d.hours && { icon: META_ICONS.Clock, label: "Hours", value: d.hours },
      ].filter(Boolean) as any}
      extra={(item) => (
        <>
          {item.data?.address && (
            <div className="mt-8 bg-white dark:bg-navy-900 ring-1 ring-border dark:ring-white/10 rounded-lg p-5">
              <div className="text-xs text-navy-900/60 dark:text-white/60 mb-1">Address</div>
              <div className="text-navy-900 dark:text-white whitespace-pre-line">{item.data.address}</div>
            </div>
          )}
          {item.data?.map_url && (
            <div className="mt-6 rounded-lg overflow-hidden ring-1 ring-border dark:ring-white/10 aspect-video">
              <iframe src={item.data.map_url} className="w-full h-full" loading="lazy" allowFullScreen title="Map" />
            </div>
          )}
        </>
      )}
    />
  );
}
