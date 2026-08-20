import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { submitCareerApplication } from "@/lib/applications.functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Upload, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  jobTitle: string;
  jobLocation?: string;
  jobId?: string;
}

const PROVINCES = [
  "Kabul", "Logar", "Ghazni", "Paktika", "Paktia", "Khost",
  "Nangarhar", "Kunar", "Nuristan", "Badakhshan", "Takhar", "Other",
];

const MAX_MB = 8;

export function ApplyModal({ open, onOpenChange, jobTitle, jobLocation, jobId }: Props) {
  const submit = useServerFn(submitCareerApplication);

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", province: "",
    education: "", experience: "", coverLetter: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { ok: boolean; message: string }>(null);
  const [err, setErr] = useState<string | null>(null);

  const set = <K extends keyof typeof form>(k: K, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const reset = () => {
    setForm({ fullName: "", email: "", phone: "", province: "", education: "", experience: "", coverLetter: "" });
    setFile(null); setDone(null); setErr(null);
  };

  const handleFile = (f: File | null) => {
    setErr(null);
    if (!f) { setFile(null); return; }
    if (f.size > MAX_MB * 1024 * 1024) { setErr(`File must be under ${MAX_MB} MB.`); return; }
    setFile(f);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!form.fullName || !form.email || !form.phone) {
      setErr("Please fill your name, email, and phone.");
      return;
    }
    setSubmitting(true);
    try {
      let cvPath = ""; let cvName = "";
      if (file) {
        const safe = file.name.replace(/[^\w.-]+/g, "_");
        const path = `applications/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
        const { error: upErr } = await supabase.storage
          .from("cv-uploads")
          .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
        if (upErr) throw new Error(`Upload failed: ${upErr.message}`);
        cvPath = path; cvName = file.name;
      }

      const res = await submit({
        data: {
          jobTitle, jobLocation: jobLocation ?? "", jobId,
          fullName: form.fullName, email: form.email, phone: form.phone,
          province: form.province, education: form.education, experience: form.experience,
          coverLetter: form.coverLetter, cvPath, cvName,
        },
      });

      setDone({
        ok: true,
        message: res.emailSent
          ? "Application submitted. PYECSO has been notified by email."
          : "Application received. Our team will review it shortly.",
      });
    } catch (e) {
      setErr((e as Error).message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTimeout(reset, 200); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            {jobLocation ? `${jobLocation} · ` : ""}Fill in your details and attach your CV. Applications are sent to PYECSO HR.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="size-14 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-navy-900 mb-1">Thank you, {form.fullName || "applicant"}!</h3>
            <p className="text-sm text-navy-900/70 mb-6">{done.message}</p>
            <button onClick={() => onOpenChange(false)} className="bg-brand-blue text-white rounded-md px-5 py-2 text-sm font-semibold">Close</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Full name *"><input required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputCls} /></Field>
              <Field label="Email *"><input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} /></Field>
              <Field label="Phone *"><input required value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="+93..." /></Field>
              <Field label="Province">
                <select value={form.province} onChange={(e) => set("province", e.target.value)} className={inputCls}>
                  <option value="">Select province</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Highest education"><input value={form.education} onChange={(e) => set("education", e.target.value)} className={inputCls} placeholder="e.g. BSc Public Health" /></Field>
              <Field label="Years of experience"><input value={form.experience} onChange={(e) => set("experience", e.target.value)} className={inputCls} placeholder="e.g. 3 years" /></Field>
            </div>

            <Field label="Cover letter">
              <textarea rows={4} value={form.coverLetter} onChange={(e) => set("coverLetter", e.target.value)} className={`${inputCls} min-h-[110px]`} placeholder="Why are you a good fit for this role?" />
            </Field>

            <Field label={`CV / Resume (PDF, DOC, DOCX — max ${MAX_MB} MB)`}>
              <label className="flex items-center gap-3 bg-white border border-dashed border-border rounded-md px-4 py-3 cursor-pointer hover:border-brand-blue">
                <Upload className="size-4 text-brand-blue" />
                <span className="text-sm text-navy-900/80 truncate">
                  {file ? file.name : "Click to choose a file"}
                </span>
                <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
              </label>
            </Field>

            {err && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
                <AlertCircle className="size-4 shrink-0 mt-0.5" /> {err}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm text-navy-900/70 hover:text-navy-900">Cancel</button>
              <button type="submit" disabled={submitting} className="bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-60 text-white rounded-md px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {submitting ? "Submitting…" : "Submit application"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

const inputCls = "w-full bg-white border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-navy-900/70 block mb-1">{label}</span>
      {children}
    </label>
  );
}
