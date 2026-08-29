import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchApplications,
  updateApplicationStatus,
  deleteApplication,
  type JobApplicationItem,
} from "@/lib/firebaseCms";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-blue" />
            Applicant Dossiers & Submissions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review candidate resumes, evaluate cover letters, and track hiring decisions for all open job vacancies.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
          className="border-slate-700 bg-slate-800 text-slate-200 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Submissions
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search applicants by name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs bg-slate-900 border-slate-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["all", "new", "shortlisted", "accepted", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? "bg-brand-blue text-white"
                  : "text-slate-400 hover:text-slate-200 bg-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Applications */}
      <Card className="bg-slate-950 border-slate-800 text-white overflow-hidden">
        <CardContent className="p-0">
          {filteredApps.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No applicant dossiers found matching the criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Position Applied For</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Submission Date</th>
                    <th className="px-4 py-3">HR Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{app.fullName}</div>
                        <div className="text-[10px] text-slate-400">{app.province || "Kabul"}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-200">
                        {app.referenceTitle || app.kind}
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
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
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : app.status === "shortlisted"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : app.status === "accepted"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : app.status === "rejected"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-slate-800 text-slate-400"
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
                            className="h-7 text-xs border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-sky-400" />
                            Review CV
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAppToDelete(app)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/50"
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
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white flex items-center justify-between">
                <span>Candidate Dossier: {selectedApp.fullName}</span>
                <span className="text-xs uppercase font-mono text-emerald-400">
                  {selectedApp.status}
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Email</span>
                  <span className="text-slate-200 font-mono">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Phone</span>
                  <span className="text-slate-200 font-mono">{selectedApp.phone || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Target Position</span>
                  <span className="text-slate-200 font-semibold">{selectedApp.referenceTitle || selectedApp.kind}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Province / Residence</span>
                  <span className="text-slate-200">{selectedApp.province || "Kabul"}</span>
                </div>
              </div>

              {selectedApp.data?.coverLetter && (
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Cover Letter / Statement of Purpose</Label>
                  <div className="p-3 mt-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedApp.data?.coverLetter}
                  </div>
                </div>
              )}

              {selectedApp.data?.cvUrl && (
                <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-brand-blue" />
                    <span className="font-semibold text-slate-200">Applicant Resume / CV Document</span>
                  </div>
                  <a
                    href={selectedApp.data?.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold"
                  >
                    Open Document
                  </a>
                </div>
              )}

              <div>
                <Label className="text-xs font-semibold text-slate-300">HR Reviewer Notes & Evaluation</Label>
                <Textarea
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder="Record interview results, qualification checks, or hiring decision rationale..."
                  className="text-xs mt-1 bg-slate-950 border-slate-800"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between gap-2 border-t border-slate-800 pt-3 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => handleStatusChange(selectedApp.id, "shortlisted", reviewerNotes)}
                  className="text-xs border-blue-500/40 text-blue-300 bg-blue-950/30"
                >
                  Shortlist
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => handleStatusChange(selectedApp.id, "accepted", reviewerNotes)}
                  className="text-xs border-emerald-500/40 text-emerald-300 bg-emerald-950/30"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => handleStatusChange(selectedApp.id, "rejected", reviewerNotes)}
                  className="text-xs border-rose-500/40 text-rose-300 bg-rose-950/30"
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => setAppToDelete(selectedApp)}
                  className="text-xs border-rose-500/40 text-rose-300 bg-rose-950/30 hover:bg-rose-900/50"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete Dossier
                </Button>
              </div>

              <Button
                type="button"
                onClick={() => handleStatusChange(selectedApp.id, selectedApp.status, reviewerNotes)}
                className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold"
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
