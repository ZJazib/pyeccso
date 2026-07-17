import { createFileRoute } from "@tanstack/react-router";
import { CmsDetail, META_ICONS } from "@/components/site/CmsDetail";

export const Route = createFileRoute("/events/$slug")({
  component: EventDetail,
  head: () => ({ meta: [{ title: "Event — PYECSO" }] }),
});

function EventDetail() {
  const { slug } = Route.useParams();
  return (
    <CmsDetail
      type="event"
      slug={slug}
      backTo="/media"
      backLabel="All events"
      breadcrumbLabel="Events"
      buildMeta={(d) => [
        d.start_date && { icon: META_ICONS.Calendar, label: "Starts", value: new Date(d.start_date).toLocaleString() },
        d.end_date && { icon: META_ICONS.Clock, label: "Ends", value: new Date(d.end_date).toLocaleString() },
        d.venue && { icon: META_ICONS.MapPin, label: "Venue", value: d.venue },
        d.city && { icon: META_ICONS.MapPin, label: "City", value: d.city },
      ].filter(Boolean) as any}
      extra={(item) => item.data?.rsvp_url ? (
        <div className="mt-8">
          <a href={item.data.rsvp_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-md font-semibold">
            RSVP <META_ICONS.ExternalLink className="size-4" />
          </a>
        </div>
      ) : null}
    />
  );
}
