import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Trash2, HardDrive } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';

interface CacheSettingsProps {
  cacheSize?: string;
}

export default function CacheSettings({ cacheSize = '0.00' }: CacheSettingsProps) {
  const { t } = useTranslation();
  const [isClearing, setIsClearing] = useState(false);

  // Handle cache clear
  const handleClearCache = () => {
    setIsClearing(true);
    
    router.post(route('settings.cache.clear'), {}, {
      preserveScroll: true,
      onError: (errors) => {
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to clear cache');
        toast.error(errorMessage);
      },
      onFinish: () => {
        setIsClearing(false);
      }
    });
  };

  return (
    <SettingsSection
      title={t("Cache Settings")}
      description={t("Manage application cache to improve performance")}
    >
      <div className="space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {t("This is a page meant for more advanced users, simply ignore it if you don't understand what cache is.")}
          </p>
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            <HardDrive className="h-5 w-5 text-muted-foreground" />
            <div>
              <h4 className="font-medium">{t("Current Cache Size")}</h4>
              <p className="text-sm text-muted-foreground">
                {cacheSize} MB {t("of cached data")}
              </p>
            </div>
          </div>
          <Button
            onClick={handleClearCache}
            disabled={isClearing}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isClearing ? t("Clearing...") : t("Clear Cache")}
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>{t("Clearing cache will remove")}:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>{t("Application cache")}</li>
            <li>{t("Route cache")}</li>
            <li>{t("View cache")}</li>
            <li>{t("Configuration cache")}</li>
          </ul>
        </div>
      </div>
    </SettingsSection>
  );
}