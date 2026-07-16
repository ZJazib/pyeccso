import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Send } from "lucide-react";
import { PortalGate } from "@/components/portal/PortalShell";
import { CourseMaterialsPanel } from "@/components/portal/CourseMaterialsPanel";
import {
  type CmsItem,
  listContent,
  submitCourseApplication,
} from "@/lib/phpBridge";

export const Route = createFileRoute("/portal/student")({
  component: StudentPortal,
  head: () => ({
    meta: [
      { title: "Student Portal — PYECSO" },
      { name: "description", content: "Apply for announced trainings, workshops and courses." },
    ],
  }),
});

function StudentPortal() {
  return (
    <PortalGate allow={["student"]}>
      {(user) => <StudentDashboard user={user} />}
    </PortalGate>
  );
}

function StudentDashboard({ user }: { user: { full_name: string; email: string } }) {
  const [courses, setCourses] = useState<CmsItem[]>([]);
  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState<Record<number, boolean>>({});

  useEffect(() => {
    listContent("courses", "en").then(setCourses).catch(() => setCourses([]));
  }, []);

  async function apply(course: CmsItem) {
    try {
      await submitCourseApplication({
        course_id: course.id,
        applicant_name: user.full_name,
        email: user.email,
        message: `Application for ${course.title}`,
      });
      setApplied((prev) => ({ ...prev, [course.id]: true }));
      setMessage(`Application submitted for ${course.title}.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not submit application.");
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-navy-900">Available trainings and workshops</h2>
        <span className="text-sm text-navy-900/60">{courses.length} programs</span>
      </div>
      {message && <p className="text-sm font-semibold text-brand-blue">{message}</p>}
      <div className="grid gap-5 md:grid-cols-2">
        {courses.map((course) => (
          <article key={course.id} className="bg-white border border-border rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-navy-900">{course.title}</h3>
                <p className="text-sm text-navy-900/70 mt-2">{course.summary}</p>
              </div>
              <BookOpen className="size-5 text-brand-blue shrink-0" />
            </div>
            <button
              disabled={applied[course.id]}
              onClick={() => apply(course)}
              className="mt-4 h-10 px-4 rounded-md bg-brand-blue text-white font-semibold text-sm inline-flex items-center gap-2 disabled:opacity-60"
            >
              <Send className="size-4" /> {applied[course.id] ? "Applied" : "Apply"}
            </button>
            <CourseMaterialsPanel courseId={course.id} canUpload={false} />
          </article>
        ))}
        {!courses.length && (
          <div className="bg-white border border-border rounded-lg p-8 text-center text-navy-900/60 md:col-span-2">
            No courses announced yet.
          </div>
        )}
      </div>
    </section>
  );
}
