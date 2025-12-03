import { CrudFormModal } from '@/components/CrudFormModal';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function EditState() {
  const { t } = useTranslation();
  const { state, countries } = usePage().props as any;
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (data: any) => {
    router.put(route('states.update', state.id), data, {
      onSuccess: () => {
        router.get(route('states.index'));
      }
    });
  };

  const handleClose = () => {
    router.get(route('states.index'));
  };

  return (
    <CrudFormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      formConfig={{
        fields: [
          { 
            name: 'country_id', 
            label: t('Country'), 
            type: 'select', 
            required: true,
            options: countries?.map((country: any) => ({ value: country.id, label: country.name })) || []
          },
          { name: 'name', label: t('State Name'), type: 'text', required: true },
          { name: 'code', label: t('State Code'), type: 'text', required: false },
          { name: 'status', label: t('Status'), type: 'switch', defaultValue: true }
        ],
        modalSize: 'lg'
      }}
      initialData={state}
      title={t('Edit State')}
      mode="edit"
    />
  );
}