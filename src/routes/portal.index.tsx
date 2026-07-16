import { createFileRoute, Navigate } from "@tanstack/react-router";
import { PortalLoginCard, roleHomePath, usePortalUser } from "@/components/portal/PortalShell";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/portal/")({
  component: PortalIndex,
  head: () => ({
    meta: [
      { title: "PYECSO Portal" },
      { name: "description", content: "Sign in to the student, teacher, or manager portal." },
    ],
  }),
});

function PortalIndex() {
  const { user, setUser, loading } = usePortalUser();
  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-navy-900">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </SiteLayout>
    );
  }
  if (user) return <Navigate to={roleHomePath(user.role)} />;
  return <PortalLoginCard onLogin={setUser} />;
}
