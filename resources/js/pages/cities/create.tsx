import { CrudFormModal } from '@/components/CrudFormModal';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateCity() {
  const { t } = useTranslation();
  const { countries } = usePage().props as any;
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (data: any) => {
    router.post(route('cities.store'), data);
  };

  const handleClose = () => {
    router.get(route('cities.index'), {}, { preserveState: false });
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
          { 
            name: 'state_id', 
            label: t('State'), 
            type: 'select', 
            required: true,
            relation: {
              endpoint: '/api/locations/states',
              valueField: 'id',
              labelField: 'name',
              dependsOn: 'country_id'
            }
          },
          { name: 'name', label: t('City Name'), type: 'text', required: true },
          { name: 'status', label: t('Status'), type: 'switch', defaultValue: true }
        ],
        modalSize: 'lg'
      }}
      initialData={{}}
      title={t('Add New City')}
      mode="create"
    />
  );
}