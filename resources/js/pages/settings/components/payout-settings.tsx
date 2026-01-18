import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { SettingsSection } from '@/components/settings-section';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PayoutSettingsProps {
  settings?: any;
}

export default function PayoutSettings({ settings = {} }: PayoutSettingsProps) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    payout_method: settings.payout_method || 'bank_transfer',
    payout_bank_name: settings.payout_bank_name || '',
    payout_account_name: settings.payout_account_name || '',
    payout_account_number: settings.payout_account_number || '',
    payout_bank_code: settings.payout_bank_code || '',
    payout_swift_code: settings.payout_swift_code || '',
    payout_mobile_provider: settings.payout_mobile_provider || '',
    payout_mobile_number: settings.payout_mobile_number || '',
    payout_mobile_account_name: settings.payout_mobile_account_name || '',
    payout_notes: settings.payout_notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('settings.store'), {
      preserveScroll: true,
    });
  };

  return (
    <SettingsSection
      id="payout-settings"
      title={t("Payout Settings")}
      description={t("Configure your payout details for receiving payments")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Payout Information")}</CardTitle>
            <CardDescription>
              {t("Enter your bank account or mobile money details to receive payouts")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payout Method Selection */}
            <div className="space-y-2">
              <Label htmlFor="payout_method">{t("Payout Method")}</Label>
              <Select
                value={data.payout_method}
                onValueChange={(value) => setData('payout_method', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">{t("Bank Transfer")}</SelectItem>
                  <SelectItem value="mobile_money">{t("Mobile Money")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.payout_method && (
                <p className="text-sm text-destructive">{errors.payout_method}</p>
              )}
            </div>

            {/* Bank Transfer Fields */}
            {data.payout_method === 'bank_transfer' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payout_bank_name">{t("Bank Name *")}</Label>
                    <Input
                      id="payout_bank_name"
                      value={data.payout_bank_name}
                      onChange={(e) => setData('payout_bank_name', e.target.value)}
                      placeholder={t("Enter bank name")}
                    />
                    {errors.payout_bank_name && (
                      <p className="text-sm text-destructive">{errors.payout_bank_name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payout_account_name">{t("Account Name *")}</Label>
                    <Input
                      id="payout_account_name"
                      value={data.payout_account_name}
                      onChange={(e) => setData('payout_account_name', e.target.value)}
                      placeholder={t("Account holder name")}
                    />
                    {errors.payout_account_name && (
                      <p className="text-sm text-destructive">{errors.payout_account_name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payout_account_number">{t("Account Number *")}</Label>
                    <Input
                      id="payout_account_number"
                      value={data.payout_account_number}
                      onChange={(e) => setData('payout_account_number', e.target.value)}
                      placeholder={t("Enter account number")}
                    />
                    {errors.payout_account_number && (
                      <p className="text-sm text-destructive">{errors.payout_account_number}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payout_bank_code">{t("Bank Code / Routing Number")}</Label>
                    <Input
                      id="payout_bank_code"
                      value={data.payout_bank_code}
                      onChange={(e) => setData('payout_bank_code', e.target.value)}
                      placeholder={t("Optional")}
                    />
                    {errors.payout_bank_code && (
                      <p className="text-sm text-destructive">{errors.payout_bank_code}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payout_swift_code">{t("SWIFT/BIC Code")}</Label>
                  <Input
                    id="payout_swift_code"
                    value={data.payout_swift_code}
                    onChange={(e) => setData('payout_swift_code', e.target.value)}
                    placeholder={t("For international transfers (optional)")}
                  />
                  {errors.payout_swift_code && (
                    <p className="text-sm text-destructive">{errors.payout_swift_code}</p>
                  )}
                </div>
              </>
            )}

            {/* Mobile Money Fields */}
            {data.payout_method === 'mobile_money' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="payout_mobile_provider">{t("Mobile Money Provider *")}</Label>
                  <Input
                    id="payout_mobile_provider"
                    value={data.payout_mobile_provider}
                    onChange={(e) => setData('payout_mobile_provider', e.target.value)}
                    placeholder={t("e.g., MTN Mobile Money, Airtel Money")}
                  />
                  {errors.payout_mobile_provider && (
                    <p className="text-sm text-destructive">{errors.payout_mobile_provider}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payout_mobile_number">{t("Mobile Number *")}</Label>
                    <Input
                      id="payout_mobile_number"
                      value={data.payout_mobile_number}
                      onChange={(e) => setData('payout_mobile_number', e.target.value)}
                      placeholder={t("+256 XXX XXX XXX")}
                    />
                    {errors.payout_mobile_number && (
                      <p className="text-sm text-destructive">{errors.payout_mobile_number}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payout_mobile_account_name">{t("Account Name *")}</Label>
                    <Input
                      id="payout_mobile_account_name"
                      value={data.payout_mobile_account_name}
                      onChange={(e) => setData('payout_mobile_account_name', e.target.value)}
                      placeholder={t("Registered account name")}
                    />
                    {errors.payout_mobile_account_name && (
                      <p className="text-sm text-destructive">{errors.payout_mobile_account_name}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="payout_notes">{t("Additional Notes")}</Label>
              <Textarea
                id="payout_notes"
                value={data.payout_notes}
                onChange={(e) => setData('payout_notes', e.target.value)}
                placeholder={t("Any additional information for payouts...")}
                rows={3}
              />
              {errors.payout_notes && (
                <p className="text-sm text-destructive">{errors.payout_notes}</p>
              )}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t("Your payout details are securely stored and will be used for processing payments to you. Make sure all information is accurate.")}
              </AlertDescription>
            </Alert>

            <Button type="submit" disabled={processing}>
              {processing ? t("Saving...") : t("Save Payout Settings")}
            </Button>
          </CardContent>
        </Card>
      </form>
    </SettingsSection>
  );
}
