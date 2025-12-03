import { useState } from 'react';
import { router } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

export default function DeleteUser() {
  const { t } = useTranslation();
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser = () => {
    router.delete(route('profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => closeModal(),
      onFinish: () => closeModal(),
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);
  };

  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-lg font-medium mb-4">{t("Delete Account")}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {t("Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.")}
      </p>

      <Button
        variant="destructive"
        onClick={confirmUserDeletion}
      >
        {t("Delete Account")}
      </Button>

      <Dialog open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              {t("Delete Account")}
            </DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to delete your account? Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              {t("Cancel")}
            </Button>
            <Button variant="destructive" onClick={deleteUser}>
              {t("Delete Account")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}