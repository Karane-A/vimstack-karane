import { PageCrudWrapper } from '@/components/PageCrudWrapper';
import { couponsConfig } from '@/config/crud/coupons';
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

export default function CouponsPage() {
  const { t } = useTranslation();
  const { flash } = usePage().props as any;
  const [config, setConfig] = useState(couponsConfig);
  
  // Flash messages handled by global handler to prevent duplicates
  // useEffect(() => {
  //   if (flash?.success) {
  //     toast.success(flash.success);
  //   }
  //   if (flash?.error) {
  //     toast.error(flash.error);
  //   }
  // }, [flash]);

  // Customize the config with translations and hooks
  useEffect(() => {
    setConfig({
      ...couponsConfig,
      table: {
        ...couponsConfig.table,
        columns: couponsConfig.table.columns.map(col => ({
          ...col,
          label: t(col.label)
        }))
      },
      form: {
        ...couponsConfig.form,
        fields: couponsConfig.form.fields.map(field => ({
          ...field,
          label: t(field.label),
          placeholder: field.placeholder ? t(field.placeholder) : undefined,
          options: field.options ? field.options.map(opt => ({
            ...opt,
            label: t(opt.label)
          })) : undefined
        }))
      },
      filters: couponsConfig.filters?.map(filter => ({
        ...filter,
        label: t(filter.label),
        options: filter.options ? filter.options.map(opt => ({
          ...opt,
          label: t(opt.label)
        })) : undefined
      })),
      hooks: {
        beforeCreate: (data: any) => {
          // Set default values
          if (!data.code_type) data.code_type = 'manual';
          if (data.status === undefined || data.status === null) data.status = true;
          // Ensure numeric fields are properly formatted
          if (data.minimum_spend) data.minimum_spend = parseFloat(data.minimum_spend);
          if (data.maximum_spend) data.maximum_spend = parseFloat(data.maximum_spend);
          if (data.discount_amount) data.discount_amount = parseFloat(data.discount_amount);
          if (data.use_limit_per_coupon) data.use_limit_per_coupon = parseInt(data.use_limit_per_coupon);
          if (data.use_limit_per_user) data.use_limit_per_user = parseInt(data.use_limit_per_user);
          return data;
        },
        beforeUpdate: (data: any) => {
          // Ensure boolean values are properly set
          if (data.status === undefined || data.status === null) data.status = true;
          // Ensure numeric fields are properly formatted
          if (data.minimum_spend) data.minimum_spend = parseFloat(data.minimum_spend);
          if (data.maximum_spend) data.maximum_spend = parseFloat(data.maximum_spend);
          if (data.discount_amount) data.discount_amount = parseFloat(data.discount_amount);
          if (data.use_limit_per_coupon) data.use_limit_per_coupon = parseInt(data.use_limit_per_coupon);
          if (data.use_limit_per_user) data.use_limit_per_user = parseInt(data.use_limit_per_user);
          return data;
        },
        // Removed duplicate toasts - handled by backend flash messages
        // afterCreate: (data: any) => {
        //   toast.success(t('Coupon "{{name}}" created successfully', { name: data.name }));
        // },
        // afterUpdate: (data: any) => {
        //   toast.success(t('Coupon "{{name}}" updated successfully', { name: data.name }));
        // },
        // afterDelete: () => {
        //   toast.success(t('Coupon deleted successfully'));
        // }
      }
    });
  }, [t]);

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Coupons') }
  ];

  return (
    <PageCrudWrapper 
      config={config} 
      url="/coupons" 
      breadcrumbs={breadcrumbs}
    />
  );
}