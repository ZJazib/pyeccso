import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClipboardList, FolderOpen, Settings2 } from "lucide-react";
import { PortalGate } from "@/components/portal/PortalShell";
import { CourseMaterialsPanel } from "@/components/portal/CourseMaterialsPanel";
import {
  type CmsItem,
  type CourseApplication,
  listApplications,
  listContent,
  updateApplicationStatus,
} from "@/lib/phpBridge";

const STATUSES: CourseApplication["status"][] = ["submitted", "reviewing", "accepted", "rejected"];

export const Route = createFileRoute("/portal/manager")({
  component: ManagerPortal,
  head: () => ({
    meta: [
      { title: "Manager Portal — PYECSO Learn" },
      { name: "description", content: "PYECSO Learn managers review and process course applications." },
    ],
  }),
});

function ManagerPortal() {
  return (
    <PortalGate allow={["learn_manager", "admin"]}>
      {() => <ManagerDashboard />}
    </PortalGate>
  );
}

function ManagerDashboard() {
  const [apps, setApps] = useState<CourseApplication[]>([]);
  const [courses, setCourses] = useState<CmsItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listApplications().then(setApps).catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
    listContent("courses", "en").then(setCourses).catch(() => setCourses([]));
  }, []);

  async function updateStatus(id: number, status: CourseApplication["status"]) {
    try {
      const updated = await updateApplicationStatus(id, status);
      setApps((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  const counts = STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = apps.filter((a) => a.status === s).length;
    return acc;
  }, {});

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-navy-900 inline-flex items-center gap-2">
          <ClipboardList className="size-6 text-brand-blue" /> Course applications
        </h2>
        <Link
          to="/admin"
          className="h-11 px-5 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center gap-2"
        >
          <Settings2 className="size-4" /> Content management
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATUSES.map((s) => (
          <div key={s} className="bg-white border border-border rounded-lg p-4">
            <div className="text-xs uppercase tracking-wider text-navy-900/60">{s}</div>
            <div className="text-2xl font-bold text-navy-900 mt-1">{counts[s] ?? 0}</div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-blue-wash text-navy-900">
            <tr>
              <th className="text-left px-4 py-3">Applicant</th>
              <th className="text-left px-4 py-3">Course</th>
              <th className="text-left px-4 py-3">Contact</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {apps.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-medium text-navy-900">{a.applicant_name}</td>
                <td className="px-4 py-3 text-navy-900/80">{a.course_title ?? "—"}</td>
                <td className="px-4 py-3 text-navy-900/70">
                  <div>{a.email}</div>
                  {a.phone && <div className="text-xs">{a.phone}</div>}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value as CourseApplication["status"])}
                    className="h-9 rounded-md border border-input px-2 bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!apps.length && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-navy-900/60">
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-navy-900 inline-flex items-center gap-2">
          <FolderOpen className="size-5 text-brand-blue" /> Course materials
        </h3>
        <div className="grid gap-4">
          {courses.map((c) => (
            <article key={c.id} className="bg-white border border-border rounded-lg p-5">
              <h4 className="font-bold text-navy-900">{c.title}</h4>
              <CourseMaterialsPanel courseId={c.id} canUpload canDelete />
            </article>
          ))}
          {!courses.length && (
            <div className="bg-white border border-border rounded-lg p-6 text-center text-navy-900/60 text-sm">
              No courses available yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
