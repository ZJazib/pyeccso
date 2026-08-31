import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchSiteSetting,
  saveSiteSetting,
} from "@/lib/firebaseCms";
import { I18nField } from "@/components/admin/I18nField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { FileUpload } from "@/components/admin/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Building2,
  QrCode,
  Save,
  CheckCircle2,
  CreditCard,
  Banknote,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/donations")({
  component: AdminDonations,
});

function AdminDonations() {
  const [saving, setSaving] = useState(false);

  const [hesabPayConfig, setHesabPayConfig] = useState({
    enabled: true,
    merchantName: "PYECSO Humanitarian Fund",
    merchantId: "HP-PYECSO-KBL-2006",
    presetsAfn: [500, 1500, 3500, 7500, 15000],
    presetsUsd: [10, 25, 50, 100, 250],
    instructions: {
      en: "Scan QR code via HesabPay mobile app or select instant payment preset in AFN/USD.",
      dr: "کد QR را از طریق برنامه موبایل حساب‌پی اسکن نمایید یا مبلغ مورد نظر را انتخاب کنید.",
      ps: "د حساب‌پي موبایل اپلیکیشن له لارې QR کوډ سکین کړئ یا د مرستې ټاکلې اندازه وټاکئ.",
    },
  });

  const [bankConfig, setBankConfig] = useState({
    bankName: "Azizi Bank",
    accountName: "Patriotic Youths Education, Cultural & Social Organization",
    accountNumber: "000101201948201",
    swiftCode: "AZBKAFKA",
    branchName: "Karte Se Main Branch, Kabul",
    branchAddress: "Karte Se Square, Kabul, Afghanistan",
    currency: "USD & AFN",
    instructions: "Please include donor name and project reference in the wire transfer memo/notes.",
  });

  const loadData = async () => {
    try {
      const [savedHP, savedBank] = await Promise.all([
        fetchSiteSetting("hesabpay_settings"),
        fetchSiteSetting("bank_settings"),
      ]);
      if (savedHP) setHesabPayConfig(savedHP as any);
      if (savedBank) setBankConfig(savedBank as any);
    } catch (e) {
      console.warn("Failed to load donation settings:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await saveSiteSetting("hesabpay_settings", hesabPayConfig);
      await saveSiteSetting("bank_settings", bankConfig);
      toast.success("Donations & Banking parameters saved to Firestore!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save donation config");
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
            <DollarSign className="w-6 h-6 text-brand-blue" />
            Donations & Banking Channels CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure HesabPay mobile integration parameters, preset donation tiers, and official Azizi Bank wire transfer credentials.
          </p>
        </div>
        <Button
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {saving ? "Saving…" : "Save Donation Settings"}
        </Button>
      </div>

      <Tabs defaultValue="hesabpay" className="space-y-6">
        <TabsList className="bg-slate-950 border border-slate-800 p-1">
          <TabsTrigger value="hesabpay" className="text-xs data-[state=active]:bg-brand-blue data-[state=active]:text-white">
            HesabPay Mobile Payments
          </TabsTrigger>
          <TabsTrigger value="bank" className="text-xs data-[state=active]:bg-brand-blue data-[state=active]:text-white">
            Azizi Bank International Wire Transfer
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: HESABPAY */}
        <TabsContent value="hesabpay" className="space-y-4">
          <Card className="bg-slate-950 border-slate-800 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-400" />
                    HesabPay Payment Gateway Integration
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Seamless digital mobile donations in AFN and USD
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-slate-300">Gateway Active</Label>
                  <Switch
                    checked={hesabPayConfig.enabled}
                    onCheckedChange={(checked) =>
                      setHesabPayConfig({ ...hesabPayConfig, enabled: checked })
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Merchant Account Name</Label>
                  <Input
                    value={hesabPayConfig.merchantName}
                    onChange={(e) =>
                      setHesabPayConfig({ ...hesabPayConfig, merchantName: e.target.value })
                    }
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Merchant ID / Account Code</Label>
                  <Input
                    value={hesabPayConfig.merchantId}
                    onChange={(e) =>
                      setHesabPayConfig({ ...hesabPayConfig, merchantId: e.target.value })
                    }
                    className="text-xs mt-1 font-mono text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <Label className="text-xs font-semibold text-slate-300">AFN Preset Amounts (Comma Separated)</Label>
                  <Input
                    value={hesabPayConfig.presetsAfn?.join(", ") || "500, 1500, 3500, 7500, 15000"}
                    onChange={(e) => {
                      const nums = e.target.value
                        .split(",")
                        .map((n) => Number(n.trim()))
                        .filter((n) => !isNaN(n));
                      setHesabPayConfig({ ...hesabPayConfig, presetsAfn: nums });
                    }}
                    className="text-xs mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">USD Preset Amounts (Comma Separated)</Label>
                  <Input
                    value={hesabPayConfig.presetsUsd?.join(", ") || "10, 25, 50, 100, 250"}
                    onChange={(e) => {
                      const nums = e.target.value
                        .split(",")
                        .map((n) => Number(n.trim()))
                        .filter((n) => !isNaN(n));
                      setHesabPayConfig({ ...hesabPayConfig, presetsUsd: nums });
                    }}
                    className="text-xs mt-1 font-mono"
                  />
                </div>
              </div>

              <I18nField
                label="Donor Guidance Instructions"
                value={hesabPayConfig.instructions}
                onChange={(val) =>
                  setHesabPayConfig({ ...hesabPayConfig, instructions: val as any })
                }
                multiline
                rows={2}
              />

              <ImageUpload
                label="HesabPay Merchant Payment QR Code Image"
                value={(hesabPayConfig as any).qrCodeUrl}
                onChange={(url) => setHesabPayConfig({ ...hesabPayConfig, qrCodeUrl: url } as any)}
                description="Upload the official direct HesabPay payment QR code graphic (auto-compressed)."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: BANK WIRE */}
        <TabsContent value="bank" className="space-y-4">
          <Card className="bg-slate-950 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Azizi Bank Wire Transfer Credentials
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Official banking coordinates for institutional donors and bank transfers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Bank Name</Label>
                  <Input
                    value={bankConfig.bankName}
                    onChange={(e) => setBankConfig({ ...bankConfig, bankName: e.target.value })}
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">SWIFT / BIC Code</Label>
                  <Input
                    value={bankConfig.swiftCode}
                    onChange={(e) => setBankConfig({ ...bankConfig, swiftCode: e.target.value })}
                    className="text-xs mt-1 font-mono font-bold text-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Beneficiary Account Name</Label>
                  <Input
                    value={bankConfig.accountName}
                    onChange={(e) => setBankConfig({ ...bankConfig, accountName: e.target.value })}
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Bank Account Number / IBAN</Label>
                  <Input
                    value={bankConfig.accountNumber}
                    onChange={(e) => setBankConfig({ ...bankConfig, accountNumber: e.target.value })}
                    className="text-xs mt-1 font-mono font-bold text-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Branch Name</Label>
                  <Input
                    value={bankConfig.branchName}
                    onChange={(e) => setBankConfig({ ...bankConfig, branchName: e.target.value })}
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Branch Address</Label>
                  <Input
                    value={bankConfig.branchAddress}
                    onChange={(e) => setBankConfig({ ...bankConfig, branchAddress: e.target.value })}
                    className="text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-300">Wire Transfer Memo Guidelines</Label>
                <Input
                  value={bankConfig.instructions}
                  onChange={(e) => setBankConfig({ ...bankConfig, instructions: e.target.value })}
                  className="text-xs mt-1"
                />
              </div>

              <FileUpload
                label="Official Bank Wire Instructions & NGO Exemption Document (PDF)"
                value={(bankConfig as any).bankDocUrl}
                fileName={(bankConfig as any).bankDocFileName}
                onChange={(url, meta) =>
                  setBankConfig({
                    ...bankConfig,
                    bankDocUrl: url,
                    bankDocFileName: meta?.fileName || (bankConfig as any).bankDocFileName,
                  } as any)
                }
                description="Upload signed bank coordinates document or official wire transfer guide PDF."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
