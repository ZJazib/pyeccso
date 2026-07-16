import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Users } from "lucide-react";
import { PortalGate } from "@/components/portal/PortalShell";
import { CourseMaterialsPanel } from "@/components/portal/CourseMaterialsPanel";
import {
  type CmsItem,
  type CourseApplication,
  listApplications,
  listContent,
} from "@/lib/phpBridge";

export const Route = createFileRoute("/portal/teacher")({
  component: TeacherPortal,
  head: () => ({
    meta: [
      { title: "Teacher Portal — PYECSO" },
      { name: "description", content: "Teachers review assigned courses and student interest." },
    ],
  }),
});

function TeacherPortal() {
  return (
    <PortalGate allow={["teacher"]}>
      {() => <TeacherDashboard />}
    </PortalGate>
  );
}

function TeacherDashboard() {
  const [courses, setCourses] = useState<CmsItem[]>([]);
  const [applications, setApplications] = useState<CourseApplication[]>([]);

  useEffect(() => {
    listContent("courses", "en").then(setCourses).catch(() => setCourses([]));
    listApplications().then(setApplications).catch(() => setApplications([]));
  }, []);

  const byCourse = useMemo(() => {
    const map = new Map<number, CourseApplication[]>();
    for (const a of applications) {
      if (a.course_id == null) continue;
      const list = map.get(a.course_id) ?? [];
      list.push(a);
      map.set(a.course_id, list);
    }
    return map;
  }, [applications]);

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-8">
      <h2 className="text-2xl font-bold text-navy-900">My courses and applicants</h2>
      <div className="grid gap-5">
        {courses.map((course) => {
          const apps = byCourse.get(course.id) ?? [];
          return (
            <article key={course.id} className="bg-white border border-border rounded-lg p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-brand-blue text-sm font-semibold">
                    <BookOpen className="size-4" /> Course
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mt-1">{course.title}</h3>
                  <p className="text-sm text-navy-900/70 mt-2">{course.summary}</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 text-navy-900 font-bold">
                    <Users className="size-4" /> {apps.length}
                  </div>
                  <div className="text-xs text-navy-900/60">applicants</div>
                </div>
              </div>
              {apps.length > 0 && (
                <ul className="mt-4 divide-y divide-border border-t border-border">
                  {apps.map((a) => (
                    <li key={a.id} className="py-2 flex items-center justify-between text-sm">
                      <span className="text-navy-900 font-medium">{a.applicant_name}</span>
                      <span className="text-navy-900/60">{a.email}</span>
                      <span className="text-xs uppercase tracking-wider text-brand-blue">
                        {a.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <CourseMaterialsPanel courseId={course.id} canUpload canDelete />
            </article>
          );
        })}
        {!courses.length && (
          <div className="bg-white border border-border rounded-lg p-8 text-center text-navy-900/60">
            No courses assigned yet.
          </div>
        )}
      </div>
    </section>
  );
}
