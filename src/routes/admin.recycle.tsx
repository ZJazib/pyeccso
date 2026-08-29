import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchDeletedContentItems,
  restoreContentItem,
  hardDeleteContentItem,
  type FirebaseContentItem,
} from "@/lib/firebaseCms";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, RotateCcw, AlertOctagon, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/recycle")({
  component: AdminRecycle,
});

function AdminRecycle() {
  const [deletedItems, setDeletedItems] = useState<FirebaseContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemToPurge, setItemToPurge] = useState<FirebaseContentItem | null>(null);
  const [purging, setPurging] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchDeletedContentItems();
      setDeletedItems(data);
    } catch (e) {
      console.warn("Failed to load recycle bin:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRestore = async (item: FirebaseContentItem) => {
    setRestoringId(item.id);
    try {
      const ok = await restoreContentItem(item.id);
      if (ok) {
        toast.success(`"${item.data?.title?.en || item.data?.name?.en || item.slug}" restored successfully!`);
        await loadData();
      } else {
        toast.error("Failed to restore item");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error restoring item");
    } finally {
      setRestoringId(null);
    }
  };

  const handleConfirmPurge = async () => {
    if (!itemToPurge) return;
    setPurging(true);
    try {
      const ok = await hardDeleteContentItem(itemToPurge.id);
      if (ok) {
        toast.success("Item permanently erased from Firestore database");
        setItemToPurge(null);
        await loadData();
      } else {
        toast.error("Failed to permanently delete item");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error purging item");
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-rose-400" />
            Recycle Bin & Content Recovery
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Safely restore accidentally removed programs, projects, articles, or vacancies, or permanently purge them from Firestore.
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
          Refresh
        </Button>
      </div>

      <Card className="bg-slate-950 border-slate-800 text-white overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base text-white">Soft-Deleted Items ({deletedItems.length})</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Items in the recycle bin are hidden from the public website but can be restored with a single click.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {deletedItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Recycle bin is clean. No deleted items found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Item Title / ID</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Deleted Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {deletedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">
                        {item.data?.title?.en || item.data?.name?.en || item.id}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400">
                        /{item.slug}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">
                        {new Date(item.deletedAt || item.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestore(item)}
                            disabled={restoringId === item.id}
                            className="h-7 text-xs border-emerald-500/40 text-emerald-300 bg-emerald-950/20 hover:bg-emerald-900/40"
                          >
                            <RotateCcw className={`w-3.5 h-3.5 mr-1 ${restoringId === item.id ? "animate-spin" : ""}`} />
                            {restoringId === item.id ? "Restoring..." : "Restore"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setItemToPurge(item)}
                            className="h-7 text-xs border-rose-500/40 text-rose-300 bg-rose-950/20 hover:bg-rose-900/40"
                          >
                            <AlertOctagon className="w-3.5 h-3.5 mr-1" />
                            Purge Permanently
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

      {/* Permanent Deletion Dialog */}
      <DeleteConfirmDialog
        open={!!itemToPurge}
        onOpenChange={(open) => {
          if (!open) setItemToPurge(null);
        }}
        title={`Permanently Purge "${itemToPurge?.data?.title?.en || itemToPurge?.data?.name?.en || itemToPurge?.slug || 'Item'}"?`}
        description="WARNING: This action is permanent and cannot be undone. This document will be completely deleted from the Firestore database."
        confirmLabel="Purge Permanently"
        onConfirm={handleConfirmPurge}
        loading={purging}
      />
    </div>
  );
}
