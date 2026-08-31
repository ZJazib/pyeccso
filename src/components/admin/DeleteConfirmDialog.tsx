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
      <AlertDialogContent className="bg-white border-slate-200 text-slate-900 max-w-md shadow-2xl rounded-2xl">
        <AlertDialogHeader>
          <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-2 text-rose-600 shadow-2xs">
            <Trash2 className="w-5 h-5" />
          </div>
          <AlertDialogTitle className="text-base font-bold text-slate-900">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel
            disabled={loading}
            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs h-9 rounded-xl shadow-2xs"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold h-9 rounded-xl shadow-xs"
          >
            {loading ? "Processing..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
