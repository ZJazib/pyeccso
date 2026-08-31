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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <DollarSign className="w-6 h-6 text-brand-blue" />
            Donations & Banking Channels CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure HesabPay mobile integration parameters, preset donation tiers, and official Azizi Bank wire transfer credentials.
          </p>
        </div>
        <Button
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {saving ? "Saving…" : "Save Donation Settings"}
        </Button>
      </div>

      <Tabs defaultValue="hesabpay" className="space-y-6">
        <TabsList className="bg-slate-100 border border-slate-200 p-1 rounded-xl">
          <TabsTrigger value="hesabpay" className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600">
            HesabPay Mobile Payments
          </TabsTrigger>
          <TabsTrigger value="bank" className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600">
            Azizi Bank International Wire Transfer
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: HESABPAY */}
        <TabsContent value="hesabpay" className="space-y-4">
          <Card className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base text-slate-900 font-bold flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    HesabPay Payment Gateway Integration
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Seamless digital mobile donations in AFN and USD
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-semibold text-slate-700">Gateway Active</Label>
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
                  <Label className="text-xs font-semibold text-slate-700">Merchant Account Name</Label>
                  <Input
                    value={hesabPayConfig.merchantName}
                    onChange={(e) =>
                      setHesabPayConfig({ ...hesabPayConfig, merchantName: e.target.value })
                    }
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Merchant ID / Account Code</Label>
                  <Input
                    value={hesabPayConfig.merchantId}
                    onChange={(e) =>
                      setHesabPayConfig({ ...hesabPayConfig, merchantId: e.target.value })
                    }
                    className="text-xs mt-1 font-mono text-emerald-700 font-bold bg-white border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">AFN Preset Amounts (Comma Separated)</Label>
                  <Input
                    value={hesabPayConfig.presetsAfn?.join(", ") || "500, 1500, 3500, 7500, 15000"}
                    onChange={(e) => {
                      const nums = e.target.value
                        .split(",")
                        .map((n) => Number(n.trim()))
                        .filter((n) => !isNaN(n));
                      setHesabPayConfig({ ...hesabPayConfig, presetsAfn: nums });
                    }}
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">USD Preset Amounts (Comma Separated)</Label>
                  <Input
                    value={hesabPayConfig.presetsUsd?.join(", ") || "10, 25, 50, 100, 250"}
                    onChange={(e) => {
                      const nums = e.target.value
                        .split(",")
                        .map((n) => Number(n.trim()))
                        .filter((n) => !isNaN(n));
                      setHesabPayConfig({ ...hesabPayConfig, presetsUsd: nums });
                    }}
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
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
          <Card className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xs">
            <CardHeader>
              <CardTitle className="text-base text-slate-900 font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-blue" />
                Azizi Bank Wire Transfer Credentials
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Official banking coordinates for institutional donors and bank transfers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Bank Name</Label>
                  <Input
                    value={bankConfig.bankName}
                    onChange={(e) => setBankConfig({ ...bankConfig, bankName: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">SWIFT / BIC Code</Label>
                  <Input
                    value={bankConfig.swiftCode}
                    onChange={(e) => setBankConfig({ ...bankConfig, swiftCode: e.target.value })}
                    className="text-xs mt-1 font-mono font-bold text-emerald-700 bg-white border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Beneficiary Account Name</Label>
                  <Input
                    value={bankConfig.accountName}
                    onChange={(e) => setBankConfig({ ...bankConfig, accountName: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Bank Account Number / IBAN</Label>
                  <Input
                    value={bankConfig.accountNumber}
                    onChange={(e) => setBankConfig({ ...bankConfig, accountNumber: e.target.value })}
                    className="text-xs mt-1 font-mono font-bold text-brand-blue bg-white border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Branch Name</Label>
                  <Input
                    value={bankConfig.branchName}
                    onChange={(e) => setBankConfig({ ...bankConfig, branchName: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Branch Address</Label>
                  <Input
                    value={bankConfig.branchAddress}
                    onChange={(e) => setBankConfig({ ...bankConfig, branchAddress: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Wire Transfer Memo Guidelines</Label>
                <Input
                  value={bankConfig.instructions}
                  onChange={(e) => setBankConfig({ ...bankConfig, instructions: e.target.value })}
                  className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
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
