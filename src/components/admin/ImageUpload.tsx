import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Link as LinkIcon, Sparkles, X, Check } from "lucide-react";

interface ImageUploadProps {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
  description?: string;
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
}: ImageUploadProps) {
  const [inputUrl, setInputUrl] = useState(value || "");
  const [showPresets, setShowPresets] = useState(false);

  const handleApplyUrl = () => {
    if (inputUrl.trim()) {
      onChange(inputUrl.trim());
    }
  };

  const handleClear = () => {
    setInputUrl("");
    onChange("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </Label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-xs text-brand-blue dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {showPresets ? "Hide Library" : "Choose from Library"}
        </button>
      </div>

      {description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{description}</p>
      )}

      {/* Direct URL input with Apply button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="url"
            placeholder="https://images.unsplash.com/photo-... or CDN URL"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              onChange(e.target.value);
            }}
            className="pl-9 text-xs"
          />
        </div>
        {value ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="text-rose-600 hover:text-rose-700"
          >
            <X className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleApplyUrl}
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Preset Image Picker */}
      {showPresets && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-2">
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

      {/* Image Preview Box */}
      {value && (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video max-h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
