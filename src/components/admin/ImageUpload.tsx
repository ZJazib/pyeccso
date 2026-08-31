import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  UploadCloud,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  X,
  Check,
  RefreshCw,
  Eye,
  Trash2,
  FileCheck,
  AlertCircle,
} from "lucide-react";
import { optimizeImage, formatBytes, type OptimizationResult } from "@/lib/fileOptimizer";

interface ImageUploadProps {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
  description?: string;
  maxDimensions?: { width?: number; height?: number };
  aspectRatioLabel?: string;
}

const PRESET_IMAGES = [
  { label: "Classroom / Education", url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80" },
  { label: "Humanitarian Aid / Cash", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80" },
  { label: "Vocational Training / STEM", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80" },
  { label: "Agriculture & Water", url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80" },
  { label: "Community Meeting", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80" },
  { label: "Youth & Sports", url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80" },
];

export function ImageUpload({
  label,
  value,
  onChange,
  description,
  maxDimensions = { width: 1920, height: 1080 },
  aspectRatioLabel,
}: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [inputUrl, setInputUrl] = useState(value || "");
  const [showPresets, setShowPresets] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [optimizationStats, setOptimizationStats] = useState<OptimizationResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = async (file: File) => {
    setUploadError(null);
    setIsCompressing(true);
    try {
      const result = await optimizeImage(file, {
        maxWidth: maxDimensions.width || 1920,
        maxHeight: maxDimensions.height || 1080,
        quality: 0.84,
        format: "image/webp",
      });
      setOptimizationStats(result);
      onChange(result.dataUrl);
      setInputUrl(result.dataUrl);
    } catch (err: any) {
      console.error("Image processing error:", err);
      setUploadError(err.message || "Failed to process and optimize image.");
    } finally {
      setIsCompressing(false);
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
      setOptimizationStats(null);
      setUploadError(null);
      onChange(inputUrl.trim());
    }
  };

  const handleClear = () => {
    setInputUrl("");
    setOptimizationStats(null);
    setUploadError(null);
    onChange("");
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </Label>
          {aspectRatioLabel && (
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
              {aspectRatioLabel}
            </span>
          )}
        </div>

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
            Upload Device
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
            Web URL / Stock
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
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Zone */}
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
              {isCompressing ? (
                <div className="flex flex-col items-center justify-center py-3">
                  <RefreshCw className="w-6 h-6 text-brand-blue animate-spin mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Optimizing & Compressing Image...
                  </p>
                  <p className="text-[11px] text-slate-400">Converting to ultra-fast WebP</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-brand-blue dark:text-blue-400 flex items-center justify-center mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Click to browse or drag & drop image
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    JPG, PNG, WebP, SVG, GIF (Auto-compressed to high-speed WebP)
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        /* Direct Web URL Mode */
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="url"
                placeholder="https://images.unsplash.com/... or image link"
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
              Apply
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="text-xs text-brand-blue dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {showPresets ? "Hide Presets" : "Stock Photo Library"}
            </button>
          </div>

          {/* Preset Image Picker */}
          {showPresets && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputUrl(preset.url);
                    onChange(preset.url);
                    setShowPresets(false);
                  }}
                  className="group relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-brand-blue aspect-video text-left"
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 flex items-end">
                    <span className="text-[10px] text-white font-medium truncate">
                      {preset.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error Notice */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Live Preview Box with optimization details & action toolbar */}
      {value && (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/60 p-3 space-y-2.5">
          <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video max-h-48 bg-slate-950/10 flex items-center justify-center group">
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            
            {/* Overlay Toolbar */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 text-xs font-semibold bg-white/90 hover:bg-white text-slate-800"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleClear}
                className="h-8 text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Remove
              </Button>
            </div>
          </div>

          {/* Info Footer & Optimization Stats */}
          <div className="flex items-center justify-between text-xs pt-1">
            {optimizationStats ? (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <FileCheck className="w-4 h-4 shrink-0" />
                <span>
                  Optimized: {formatBytes(optimizationStats.optimizedSize)} (saved {optimizationStats.compressionRatio}%)
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                {value.startsWith("data:") ? "Local optimized image stored" : "Online image linked"}
              </span>
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 text-xs px-2.5 text-slate-700 dark:text-slate-200"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleClear}
                className="h-7 text-xs px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
