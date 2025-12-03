import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { Save, CreditCard, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

export default function StripeSettings() {
  const { t } = useTranslation();
  // Stripe Settings form state
  const [stripeSettings, setStripeSettings] = useState({
    enabled: false,
    testMode: true,
    publishableKey: 'pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz12345678901234',
    secretKey: 'sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz12345678901234',
    webhookSecret: 'whsec_1234567890abcdefghijklmnopqrstuvwxyz1234'
  });

  // Password visibility state
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  // Handle stripe settings form changes
  const handleStripeSettingsChange = (field: string, value: string | boolean) => {
    setStripeSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle stripe settings form submission
  const submitStripeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // This would be replaced with an actual API call
    console.log('Stripe settings submitted:', stripeSettings);
    // Example: stripeSettingsPatch(route('settings.stripe.update'), { ...stripeSettings });
  };

  return (
    <SettingsSection
      title={t("Stripe Payment Settings")}
      description={t("Configure Stripe payment gateway integration for online payments")}
      action={
        <Button type="submit" form="stripe-settings-form" size="sm">
          <Save className="h-4 w-4 mr-2" />
          {t("Save Changes")}
        </Button>
      }
    >
      <form id="stripe-settings-form" onSubmit={submitStripeSettings}>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-md bg-muted/30">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <Label htmlFor="stripeEnabled" className="text-base font-medium">{t("Stripe Payment Gateway")}</Label>
                <p className="text-sm text-muted-foreground mt-1">{t("Enable or disable Stripe payment processing")}</p>
              </div>
            </div>
            <Switch
              id="stripeEnabled"
              checked={stripeSettings.enabled}
              onCheckedChange={(checked) => handleStripeSettingsChange('enabled', checked)}
            />
          </div>

          <div className={`space-y-6 ${!stripeSettings.enabled ? 'opacity-60' : ''}`}>
            <Alert variant="info" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t("You need to set up a Stripe account and obtain API keys before enabling this integration.")}
                <a 
                  href="https://dashboard.stripe.com/apikeys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 underline"
                >
                  {t("Get your API keys")}
                </a>
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <Label htmlFor="testMode" className="font-medium">{t("Test Mode")}</Label>
                <p className="text-xs text-muted-foreground mt-1">{t("Use Stripe test environment for development")}</p>
              </div>
              <Switch
                id="testMode"
                checked={stripeSettings.testMode}
                onCheckedChange={(checked) => handleStripeSettingsChange('testMode', checked)}
                disabled={!stripeSettings.enabled}
              />
            </div>

            <div className="grid gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="publishableKey" className="font-medium">
                    {stripeSettings.testMode ? 'Test Publishable Key' : 'Live Publishable Key'}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("Starts with")} {stripeSettings.testMode ? 'pk_test_' : 'pk_live_'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="publishableKey"
                  value={stripeSettings.publishableKey}
                  onChange={(e) => handleStripeSettingsChange('publishableKey', e.target.value)}
                  placeholder={stripeSettings.testMode ? 'pk_test_...' : 'pk_live_...'}
                  className="font-mono text-sm"
                  disabled={!stripeSettings.enabled}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="secretKey" className="font-medium">
                    {stripeSettings.testMode ? 'Test Secret Key' : 'Live Secret Key'}
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("Starts with")} {stripeSettings.testMode ? 'sk_test_' : 'sk_live_'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <Input
                    id="secretKey"
                    type={showSecretKey ? 'text' : 'password'}
                    value={stripeSettings.secretKey}
                    onChange={(e) => handleStripeSettingsChange('secretKey', e.target.value)}
                    placeholder={stripeSettings.testMode ? 'sk_test_...' : 'sk_live_...'}
                    className="font-mono text-sm pr-10"
                    disabled={!stripeSettings.enabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    disabled={!stripeSettings.enabled}
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label htmlFor="webhookSecret" className="font-medium">{t("Webhook Signing Secret")}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("Starts with whsec_")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <Input
                    id="webhookSecret"
                    type={showWebhookSecret ? 'text' : 'password'}
                    value={stripeSettings.webhookSecret}
                    onChange={(e) => handleStripeSettingsChange('webhookSecret', e.target.value)}
                    placeholder={t("whsec_...")}
                    className="font-mono text-sm pr-10"
                    disabled={!stripeSettings.enabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                    onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                    disabled={!stripeSettings.enabled}
                  >
                    {showWebhookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("Used to verify webhook events sent by Stripe")}
                </p>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-md border">
              <h4 className="text-sm font-medium mb-2">{t("Webhook Configuration")}</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {t("Set up a webhook in your Stripe dashboard to receive event notifications")}:
              </p>
              <div className="bg-muted p-2 rounded border text-xs font-mono mb-2 break-all">
                {window.location.origin}/api/webhooks/stripe
              </div>
              <p className="text-xs text-muted-foreground">
                {t("Required events: payment_intent.succeeded, payment_intent.payment_failed, checkout.session.completed")}
              </p>
            </div>
          </div>
        </div>
      </form>
    </SettingsSection>
  );
}