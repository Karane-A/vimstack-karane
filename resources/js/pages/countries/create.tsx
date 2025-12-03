import { CrudFormModal } from '@/components/CrudFormModal';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateCountry() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (data: any) => {
    router.post(route('countries.store'), data);
  };

  const handleClose = () => {
    router.get(route('countries.index'), {}, { preserveState: false });
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
      initialData={{}}
      title={t('Add New Country')}
      mode="create"
    />
  );
}