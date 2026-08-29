import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchSiteSetting,
  saveSiteSetting,
} from "@/lib/firebaseCms";
import { I18nField } from "@/components/admin/I18nField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Save, Sparkles, Laptop, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/learn")({
  component: AdminLearn,
});

function AdminLearn() {
  const [saving, setSaving] = useState(false);
  const [learnConfig, setLearnConfig] = useState({
    portalUrl: "https://learn.pyecso.org.af",
    eyebrow: {
      en: "PYECSO DIGITAL LEARNING PLATFORM",
      dr: "پلتفرم آموزش دیجیتال سازمان",
      ps: "د سازمان ډیجیټل زده کړې پلیټ فارم",
    },
    title: {
      en: "Accessible Education & TVET Vocational Skills for Afghan Youth",
      dr: "آموزش‌های فنی و حرفه‌ای و مهارت‌های دیجیتال برای جوانان",
      ps: "د افغان ځوانانو لپاره مسلکي او تخنیکي زده کړې",
    },
    description: {
      en: "Providing accredited digital curricula in computer programming, mobile device repair, solar power installation, bookkeeping, and English language proficiency.",
      dr: "ارائه دوره‌های آموزشی در بخش‌های کمپیوتر، ترمیم مبایل، سیستم‌های سولر، محاسبه و لسان انگلیسی.",
      ps: "په کمپیوټر، د موبایل ترمیم، لمریزه برېښنا، محاسبه او انګلیسي ژبه کې د مسلکي کورسونو وړاندې کول.",
    },
    studentPortalUrl: "/portal/student",
    teacherPortalUrl: "/portal/teacher",
    managerPortalUrl: "/portal/manager",
  });

  const loadData = async () => {
    try {
      const saved = await fetchSiteSetting("learn_settings");
      if (saved) setLearnConfig(saved as any);
    } catch (e) {
      console.warn("Failed to load learn config:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteSetting("learn_settings", learnConfig);
      toast.success("Learn & Portal settings saved to Firestore!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save learn settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-blue" />
            Learn & Portal Ecosystem CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure learning platform tracks, external LMS URLs, and role-based student/teacher/manager portal access points.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {saving ? "Saving…" : "Save Portal Settings"}
        </Button>
      </div>

      <Card className="bg-slate-950 border-slate-800 text-white">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Laptop className="w-5 h-5 text-emerald-400" />
            Learning Tracks & LMS Portal Integration
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Educational copy and destination portals for Afghan youth
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <I18nField
            label="Header Eyebrow"
            value={learnConfig.eyebrow}
            onChange={(val) => setLearnConfig({ ...learnConfig, eyebrow: val as any })}
          />

          <I18nField
            label="Learning Headline"
            value={learnConfig.title}
            onChange={(val) => setLearnConfig({ ...learnConfig, title: val as any })}
            required
          />

          <I18nField
            label="Curriculum & Platform Overview"
            value={learnConfig.description}
            onChange={(val) => setLearnConfig({ ...learnConfig, description: val as any })}
            multiline
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
            <div>
              <Label className="text-xs font-semibold text-slate-300">Student Portal Route</Label>
              <Input
                value={learnConfig.studentPortalUrl}
                onChange={(e) =>
                  setLearnConfig({ ...learnConfig, studentPortalUrl: e.target.value })
                }
                className="text-xs mt-1 font-mono"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-300">Instructor Portal Route</Label>
              <Input
                value={learnConfig.teacherPortalUrl}
                onChange={(e) =>
                  setLearnConfig({ ...learnConfig, teacherPortalUrl: e.target.value })
                }
                className="text-xs mt-1 font-mono"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-300">Manager Portal Route</Label>
              <Input
                value={learnConfig.managerPortalUrl}
                onChange={(e) =>
                  setLearnConfig({ ...learnConfig, managerPortalUrl: e.target.value })
                }
                className="text-xs mt-1 font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
