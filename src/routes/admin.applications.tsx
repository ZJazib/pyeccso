import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchApplications,
  updateApplicationStatus,
  deleteApplication,
  type JobApplicationItem,
} from "@/lib/firebaseCms";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { FileUpload } from "@/components/admin/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Mail,
  Phone,
  MapPin,
  Eye,
  User,
  Filter,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/applications")({
  component: AdminApplications,
});

function AdminApplications() {
  const [apps, setApps] = useState<JobApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<JobApplicationItem | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [appToDelete, setAppToDelete] = useState<JobApplicationItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchApplications();
      setApps(data);
    } catch (e) {
      console.warn("Failed to load applications:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: JobApplicationItem["status"],
    notes?: string
  ) => {
    try {
      await updateApplicationStatus(id, newStatus, notes);
      toast.success(`Application updated to ${newStatus}`);
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus, notes });
      }
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || "Error updating application");
    }
  };

  const handleConfirmDelete = async () => {
    if (!appToDelete) return;
    setDeleting(true);
    try {
      const ok = await deleteApplication(appToDelete.id);
      if (ok) {
        toast.success("Application removed from database");
        if (selectedApp && selectedApp.id === appToDelete.id) {
          setSelectedApp(null);
        }
        setAppToDelete(null);
        await loadData();
      } else {
        toast.error("Failed to delete application");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting application");
    } finally {
      setDeleting(false);
    }
  };

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.referenceTitle || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-brand-blue" />
            Applicant Dossiers & Submissions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review candidate resumes, evaluate cover letters, and track hiring decisions for all open job vacancies.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
          className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs rounded-xl shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Submissions
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search applicants by name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs bg-white border-slate-300 text-slate-900 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["all", "new", "shortlisted", "accepted", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? "bg-brand-blue text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Applications */}
      <Card className="bg-white border-slate-200 text-slate-900 overflow-hidden rounded-2xl shadow-2xs">
        <CardContent className="p-0">
          {filteredApps.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No applicant dossiers found matching the criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Position Applied For</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Submission Date</th>
                    <th className="px-4 py-3">HR Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{app.fullName}</div>
                        <div className="text-[10px] text-slate-500">{app.province || "Kabul"}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {app.referenceTitle || app.kind}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">
                        <div>{app.email}</div>
                        <div>{app.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                            app.status === "new"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : app.status === "shortlisted"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : app.status === "accepted"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : app.status === "rejected"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedApp(app);
                              setReviewerNotes(app.notes || "");
                            }}
                            className="h-7 text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-brand-blue rounded-lg"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-brand-blue" />
                            Review CV
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAppToDelete(app)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg"
                            title="Delete dossier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      {selectedApp && (
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
                <span>Candidate Dossier: {selectedApp.fullName}</span>
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedApp.status}
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Email</span>
                  <span className="text-slate-900 font-mono">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Phone</span>
                  <span className="text-slate-900 font-mono">{selectedApp.phone || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Target Position</span>
                  <span className="text-slate-900 font-semibold">{selectedApp.referenceTitle || selectedApp.kind}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Province / Residence</span>
                  <span className="text-slate-900">{selectedApp.province || "Kabul"}</span>
                </div>
              </div>

              {selectedApp.data?.coverLetter && (
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Cover Letter / Statement of Purpose</Label>
                  <div className="p-3.5 mt-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedApp.data?.coverLetter}
                  </div>
                </div>
              )}

              <FileUpload
                label="Candidate CV / Supplemental Verification Document (PDF/DOCX)"
                value={selectedApp.data?.cvUrl}
                fileName={selectedApp.data?.cvFileName}
                onChange={(url, meta) =>
                  setSelectedApp({
                    ...selectedApp,
                    data: {
                      ...selectedApp.data,
                      cvUrl: url,
                      cvFileName: meta?.fileName || selectedApp.data?.cvFileName,
                    },
                  })
                }
                description="Upload, preview, replace, or update candidate's official resume, certifications, or diploma dossier."
              />

              <div>
                <Label className="text-xs font-semibold text-slate-700">HR Reviewer Notes & Evaluation</Label>
                <Textarea
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="Record interview results, qualification checks, or hiring decision rationale..."
                  className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => handleStatusChange(selectedApp.id, "shortlisted", reviewerNotes)}
                  className="text-xs border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl"
                >
                  Shortlist
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => handleStatusChange(selectedApp.id, "accepted", reviewerNotes)}
                  className="text-xs border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => handleStatusChange(selectedApp.id, "rejected", reviewerNotes)}
                  className="text-xs border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl"
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => setAppToDelete(selectedApp)}
                  className="text-xs border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete Dossier
                </Button>
              </div>

              <Button
                type="button"
                onClick={() => handleStatusChange(selectedApp.id, selectedApp.status, reviewerNotes)}
                className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Save Reviewer Notes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={!!appToDelete}
        onOpenChange={(open) => {
          if (!open) setAppToDelete(null);
        }}
        title={`Permanently Delete Application for "${appToDelete?.fullName || 'Candidate'}"?`}
        description="This candidate submission and resume link will be permanently removed from the database. This action cannot be undone."
        confirmLabel="Permanently Delete"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
