import { CrudFormModal } from '@/components/CrudFormModal';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function EditCountry() {
  const { t } = useTranslation();
  const { country } = usePage().props as any;
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (data: any) => {
    router.put(route('countries.update', country.id), data, {
      onSuccess: () => {
        router.get(route('countries.index'));
      }
    });
  };

  const handleClose = () => {
    router.get(route('countries.index'));
  };

  return (
    <CrudFormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      formConfig={{
        fields: [
          { name: 'name', label: t('Country Name'), type: 'text', required: true },
          { name: 'code', label: t('Country Code'), type: 'text', required: true },
          { name: 'status', label: t('Status'), type: 'switch', defaultValue: true }
        ],
        modalSize: 'lg'
      }}
      initialData={country}
      title={t('Edit Country')}
      mode="edit"
    />
  );
}