import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookOpen, Loader2, LogOut, Send, UserRoundCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  type BridgeUser,
  type CmsItem,
  getBridgeToken,
  getCurrentBridgeUser,
  listApplications,
  listContent,
  loginToBridge,
  setBridgeToken,
  submitCourseApplication,
} from "@/lib/phpBridge";

export const Route = createFileRoute("/portal")({
  component: Portal,
  head: () => ({
    meta: [
      { title: "PYECSO Portal" },
      { name: "description", content: "Student, teacher and PYECSO Learn manager portal." },
    ],
  }),
});

function Portal() {
  const [user, setUser] = useState<BridgeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!getBridgeToken()) {
        setLoading(false);
        return;
      }
      try {
        const current = await getCurrentBridgeUser();
        if (!cancelled) setUser(current);
      } catch {
        setBridgeToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-navy-900">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </SiteLayout>
    );
  }

  if (!user) return <PortalLogin onLogin={setUser} />;

  return (
    <SiteLayout>
      <section className="bg-brand-blue-wash border-b border-border py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm mb-2">
              <UserRoundCheck className="size-4" /> {user.role.replace("_", " ")}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900">Welcome, {user.full_name}</h1>
          </div>
          <button
            onClick={() => {
              setBridgeToken(null);
              setUser(null);
            }}
            className="h-11 px-5 rounded-md bg-white border border-border text-navy-900 font-semibold inline-flex items-center gap-2"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </section>
      <PortalDashboard user={user} />
    </SiteLayout>
  );
}

function PortalDashboard({ user }: { user: BridgeUser }) {
  const [courses, setCourses] = useState<CmsItem[]>([]);
  const [message, setMessage] = useState("");
  const [applicationsCount, setApplicationsCount] = useState<number | null>(null);

  useEffect(() => {
    listContent("courses", "en").then(setCourses).catch(() => setCourses([]));
    if (user.role === "teacher" || user.role === "learn_manager" || user.role === "admin") {
      listApplications().then((items) => setApplicationsCount(items.length)).catch(() => setApplicationsCount(null));
    }
  }, [user.role]);

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      <div className="space-y-5">
        <h2 className="text-2xl font-bold text-navy-900">Available trainings and workshops</h2>
        {courses.map((course) => (
          <article key={course.id} className="bg-white border border-border rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-navy-900">{course.title}</h3>
                <p className="text-sm text-navy-900/70 mt-2">{course.summary}</p>
              </div>
              <BookOpen className="size-5 text-brand-blue shrink-0" />
            </div>
            {user.role === "student" && (
              <button
                onClick={async () => {
                  try {
                    await submitCourseApplication({
                      course_id: course.id,
                      applicant_name: user.full_name,
                      email: user.email,
                      message: `Application for ${course.title}`,
                    });
                    setMessage(`Application submitted for ${course.title}.`);
                  } catch (error) {
                    setMessage(error instanceof Error ? error.message : "Could not submit application.");
                  }
                }}
                className="mt-4 h-10 px-4 rounded-md bg-brand-blue text-white font-semibold text-sm inline-flex items-center gap-2"
              >
                <Send className="size-4" /> Apply
              </button>
            )}
          </article>
        ))}
        {!courses.length && <div className="bg-white border border-border rounded-lg p-8 text-center text-navy-900/60">No courses announced yet.</div>}
        {message && <p className="text-sm font-semibold text-brand-blue">{message}</p>}
      </div>

      <aside className="bg-white border border-border rounded-lg p-6 h-fit">
        <h2 className="font-bold text-navy-900 text-lg">Portal tools</h2>
        <div className="mt-4 space-y-3 text-sm text-navy-900/70">
          {user.role === "student" && <p>Students can apply for announced trainings and track application status.</p>}
          {user.role === "teacher" && <p>Teachers can review assigned course information and student interest.</p>}
          {(user.role === "learn_manager" || user.role === "admin") && (
            <>
              <p>Applications received: {applicationsCount ?? "—"}</p>
              <Link to="/admin" className="h-10 px-4 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center">
                Open management panel
              </Link>
            </>
          )}
        </div>
      </aside>
    </section>
  );
}

function PortalLogin({ onLogin }: { onLogin: (user: BridgeUser) => void }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      onLogin(await loginToBridge(identifier, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="max-w-md mx-auto px-4 md:px-6 py-20">
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-navy-900">PYECSO portal login</h1>
          <p className="text-sm text-navy-900/70 mt-2">Students, teachers and Learn managers can sign in here.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-navy-900">
              Username or email
              <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} className="mt-2 w-full h-11 rounded-md border border-input px-3 bg-white" />
            </label>
            <label className="block text-sm font-semibold text-navy-900">
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full h-11 rounded-md border border-input px-3 bg-white" />
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button disabled={loading} className="w-full h-11 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center justify-center gap-2">
              {loading && <Loader2 className="size-4 animate-spin" />} Login
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
