import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { Crown, Zap, ArrowRight } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  feature?: string;
}

export function UpgradeModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  feature 
}: UpgradeModalProps) {
  const { t } = useTranslation();

  const handleUpgrade = () => {
    router.get(route('plans.index'));
    onClose();
  };

  const defaultTitle = feature 
    ? t('Upgrade Required for :feature', { feature: feature })
    : t('Plan Limit Reached');

  const defaultMessage = feature
    ? t('This feature is not included in your current plan. Upgrade to unlock :feature and more advanced features.', { feature: feature })
    : t('You have reached the limit of your current plan. Upgrade to continue using all features.');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-primary/10">
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            {title || defaultTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground leading-relaxed">
            {message || defaultMessage}
          </p>
          
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 text-primary font-medium">
              <Zap className="h-4 w-4" />
              {t('Unlock Premium Features')}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {t('Get access to unlimited resources and advanced features')}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t('Maybe Later')}
          </Button>
          <Button onClick={handleUpgrade} className="flex-1">
            {t('Upgrade Now')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}