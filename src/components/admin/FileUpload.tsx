import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileArchive,
  File,
  Download,
  Link as LinkIcon,
  X,
  Check,
  RefreshCw,
  Trash2,
  ExternalLink,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { optimizeDocument, formatBytes, type OptimizationResult } from "@/lib/fileOptimizer";

interface FileUploadProps {
  label: string;
  value?: string | null;
  fileName?: string | null;
  onChange: (url: string, meta?: { fileName?: string; fileSize?: number; fileType?: string }) => void;
  description?: string;
  allowedExtensions?: string[]; // e.g. ['.pdf', '.docx', '.xlsx']
  maxSizeMb?: number;
}

export function FileUpload({
  label,
  value,
  fileName,
  onChange,
  description,
  allowedExtensions = [".pdf", ".docx", ".doc", ".xlsx", ".xls", ".txt", ".zip"],
  maxSizeMb = 15,
}: FileUploadProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [inputUrl, setInputUrl] = useState(value || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(fileName || null);
  const [fileStats, setFileStats] = useState<OptimizationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getFileIcon = (nameOrUrl: string) => {
    const lower = nameOrUrl.toLowerCase();
    if (lower.includes(".pdf")) return <FileText className="w-6 h-6 text-rose-500" />;
    if (lower.includes(".xls") || lower.includes(".xlsx") || lower.includes(".csv")) {
      return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
    }
    if (lower.includes(".zip") || lower.includes(".rar")) {
      return <FileArchive className="w-6 h-6 text-amber-500" />;
    }
    if (lower.includes(".doc") || lower.includes(".docx")) {
      return <FileText className="w-6 h-6 text-blue-500" />;
    }
    return <File className="w-6 h-6 text-slate-500" />;
  };

  const processFile = async (file: File) => {
    setUploadError(null);
    setIsProcessing(true);
    try {
      const result = await optimizeDocument(file, maxSizeMb);
      setFileStats(result);
      setCurrentFileName(result.fileName);
      onChange(result.dataUrl, {
        fileName: result.fileName,
        fileSize: result.optimizedSize,
        fileType: result.fileType,
      });
      setInputUrl(result.dataUrl);
    } catch (err: any) {
      console.error("Document processing error:", err);
      setUploadError(err.message || "Failed to process document file.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (inputUrl.trim()) {
      setUploadError(null);
      const guessedName = inputUrl.split("/").pop()?.split("?")[0] || "Document File";
      setCurrentFileName(guessedName);
      onChange(inputUrl.trim(), { fileName: guessedName });
    }
  };

  const handleClear = () => {
    setInputUrl("");
    setCurrentFileName(null);
    setFileStats(null);
    setUploadError(null);
    onChange("");
  };

  const acceptString = allowedExtensions.join(",");

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </Label>
        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-2 py-0.5 rounded font-medium transition ${
              activeTab === "upload"
                ? "bg-brand-blue text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`px-2 py-0.5 rounded font-medium transition ${
              activeTab === "url"
                ? "bg-brand-blue text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            File Link
          </button>
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{description}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptString}
        className="hidden"
        onChange={handleFileChange}
      />

      {activeTab === "upload" ? (
        <div>
          {!value ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-brand-blue bg-blue-50/50 dark:bg-blue-950/30 scale-[0.99]"
                  : "border-slate-300 dark:border-slate-700 hover:border-brand-blue dark:hover:border-blue-400 bg-slate-50/70 dark:bg-slate-900/50"
              }`}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-3">
                  <RefreshCw className="w-6 h-6 text-brand-blue animate-spin mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Validating & Preparing Document...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-brand-blue dark:text-blue-400 flex items-center justify-center mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Click to select or drag & drop document file
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {allowedExtensions.join(", ").toUpperCase()} (Max {maxSizeMb} MB)
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="url"
              placeholder="https://.../document.pdf or download link"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleApplyUrl}
            className="text-xs shrink-0"
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            Apply Link
          </Button>
        </div>
      )}

      {/* Error Notice */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* File Document Card Preview */}
      {value && (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
              {getFileIcon(currentFileName || value)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                {currentFileName || "Attached Document"}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {fileStats && <span>{formatBytes(fileStats.optimizedSize)}</span>}
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <FileCheck className="w-3 h-3" /> Ready
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              download={currentFileName || "document"}
              className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              View / Test
            </a>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 text-xs px-2.5 text-slate-700 dark:text-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleClear}
              className="h-8 text-xs px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
