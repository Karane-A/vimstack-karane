import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { SettingsSection } from '@/components/settings-section';
import { Code, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CustomCodeSettingsProps {
  settings?: any;
}

export default function CustomCodeSettings({ settings = {} }: CustomCodeSettingsProps) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors } = useForm({
    custom_code_head: settings.custom_code_head || '',
    custom_code_body_start: settings.custom_code_body_start || '',
    custom_code_body_end: settings.custom_code_body_end || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('settings.store'), {
      preserveScroll: true,
    });
  };

  return (
    <SettingsSection
      id="custom-code-settings"
      title={t("Custom Code")}
      description={t("Add custom scripts and tracking codes to your store")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("Custom Code")}</CardTitle>
            <CardDescription>
              {t("Inject custom HTML, CSS, or JavaScript code into your store pages")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{t("Important:")}</strong> {t("Only add code from trusted sources. Invalid code can break your store. Common use cases: Facebook Pixel, Google Analytics, custom CSS/JS.")}
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="head" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="head">
                  <Code className="h-4 w-4 mr-2" />
                  {t("Header")}
                </TabsTrigger>
                <TabsTrigger value="body-start">
                  <Code className="h-4 w-4 mr-2" />
                  {t("Body Start")}
                </TabsTrigger>
                <TabsTrigger value="body-end">
                  <Code className="h-4 w-4 mr-2" />
                  {t("Body End")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="head" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="custom_code_head">{t("Code in <head> Section")}</Label>
                  <Textarea
                    id="custom_code_head"
                    value={data.custom_code_head}
                    onChange={(e) => setData('custom_code_head', e.target.value)}
                    placeholder={t("<!-- Your code here -->\n<script>\n  // JavaScript code\n</script>\n<style>\n  /* CSS code */\n</style>")}
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("Code will be injected into the <head> section. Use for: meta tags, CSS, tracking pixels, fonts.")}
                  </p>
                  {errors.custom_code_head && (
                    <p className="text-sm text-destructive">{errors.custom_code_head}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="body-start" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="custom_code_body_start">{t("Code After <body> Tag")}</Label>
                  <Textarea
                    id="custom_code_body_start"
                    value={data.custom_code_body_start}
                    onChange={(e) => setData('custom_code_body_start', e.target.value)}
                    placeholder={t("<!-- Your code here -->\n<noscript>\n  <!-- No-script content -->\n</noscript>")}
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("Code will be injected right after the opening <body> tag. Use for: Google Tag Manager (noscript), Facebook Pixel (noscript).")}
                  </p>
                  {errors.custom_code_body_start && (
                    <p className="text-sm text-destructive">{errors.custom_code_body_start}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="body-end" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="custom_code_body_end">{t("Code Before </body> Tag")}</Label>
                  <Textarea
                    id="custom_code_body_end"
                    value={data.custom_code_body_end}
                    onChange={(e) => setData('custom_code_body_end', e.target.value)}
                    placeholder={t("<!-- Your code here -->\n<script>\n  // Analytics or chat widgets\n</script>")}
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("Code will be injected before the closing </body> tag. Use for: analytics scripts, chat widgets, deferred JavaScript.")}
                  </p>
                  {errors.custom_code_body_end && (
                    <p className="text-sm text-destructive">{errors.custom_code_body_end}</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <Button type="submit" disabled={processing}>
              {processing ? t("Saving...") : t("Save Custom Code")}
            </Button>
          </CardContent>
        </Card>
      </form>
    </SettingsSection>
  );
}
