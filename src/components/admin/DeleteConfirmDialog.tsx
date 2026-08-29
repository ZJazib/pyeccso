import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = "Move to Recycle Bin?",
  description = "This item will be deactivated and moved to the administrative Recycle Bin. You can restore or permanently delete it later.",
  confirmLabel = "Delete",
  onConfirm,
  loading = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
        <AlertDialogHeader>
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-2 text-rose-400">
            <Trash2 className="w-5 h-5" />
          </div>
          <AlertDialogTitle className="text-base font-bold text-white">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-slate-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel
            disabled={loading}
            className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-xs h-8"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold h-8"
          >
            {loading ? "Processing..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
