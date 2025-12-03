// config/crud/coupons.ts
import React from 'react';
import { CrudConfig } from '@/types/crud';
import { columnRenderers } from '@/utils/columnRenderers';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/custom-toast';
import { t } from '@/utils/i18n';
import { formatSuperadminCurrency } from '@/utils/helpers';

export const couponsConfig: CrudConfig = {
  entity: {
    name: 'coupons',
    endpoint: route('coupons.index'),
    permissions: {
      view: 'view-coupons',
      create: 'create-coupons',
      edit: 'create-coupons',
      delete: 'delete-coupons'
    }
  },
  modalSize: '4xl',
  description: t('Manage discount coupons and promotional codes'),
  table: {
    columns: [
      { key: 'name', label: t('Name'), sortable: true },
      { 
        key: 'type', 
        label: t('Type'), 
        sortable: true,
        render: (value) => {
          const className = value === 'percentage' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800';
          return value === 'percentage' ? t('Percentage') : t('Flat Amount');
        }
      },
      { 
        key: 'minimum_spend', 
        label: t('Min Spend'), 
        render: (value) => value ? formatSuperadminCurrency(parseFloat(value)) : '-'
      },
      { 
        key: 'maximum_spend', 
        label: t('Max Spend'), 
        render: (value) => value ? formatSuperadminCurrency(parseFloat(value)) : '-'
      },
      { 
        key: 'discount_amount', 
        label: t('Discount'), 
        render: (value, row) => {
          const amount = parseFloat(value);
          return row.type === 'percentage' 
            ? `${amount}%` 
            : formatSuperadminCurrency(amount);
        }
      },
      { key: 'use_limit_per_coupon', label: t('Coupon Limit'), render: (value) => value || t('Unlimited') },
      { key: 'use_limit_per_user', label: t('User Limit'), render: (value) => value || t('Unlimited') },
      { 
        key: 'expiry_date', 
        label: t('Expiry Date'), 
        sortable: true, 
        render: columnRenderers.date() 
      },
      { key: 'code', label: t('Code'), sortable: true },
      { 
        key: 'status', 
        label: t('Status'), 
        render: (value, row) => {
          const handleToggle = () => {
            // Import router properly for ES modules
            import('@inertiajs/react').then(({ router }) => {
              router.put(route('coupons.toggle-status', row.id), {}, {
                preserveState: true,
                preserveScroll: true,
                onError: () => {
                  toast.error('Error updating status');
                }
              });
            });
          };
          
          return React.createElement('div', { className: 'flex items-center justify-center' }, [
            React.createElement(Switch, {
              key: 'status-switch',
              checked: !!value,
              onCheckedChange: handleToggle
            })
          ]);
        }
      }
    ],
    actions: [
      { 
        label: t('Edit'), 
        icon: 'Edit', 
        action: 'edit', 
        className: 'text-amber-500'
      },
      { 
        label: t('Delete'), 
        icon: 'Trash2', 
        action: 'delete', 
        className: 'text-red-500'
      }
    ]
  },
  search: {
    enabled: true,
    placeholder: t('Search coupons...'),
    fields: ['name', 'code']
  },
  filters: [
    {
      key: 'type',
      label: t('Type'),
      type: 'select',
      options: [
        { value: 'all', label: t('All Types') },
        { value: 'percentage', label: t('Percentage') },
        { value: 'flat', label: t('Flat Amount') }
      ]
    },
    {
      key: 'status',
      label: t('Status'),
      type: 'select',
      options: [
        { value: 'all', label: t('All Status') },
        { value: '1', label: t('Active') },
        { value: '0', label: t('Inactive') }
      ]
    }
  ],
  form: {
    fields: [
      { 
        name: 'name', 
        label: t('Coupon Name'), 
        type: 'text', 
        required: true,
        colSpan: 12,
        placeholder: t('Enter coupon name')
      },
      { 
        name: 'type', 
        label: t('Discount Type'), 
        type: 'select', 
        required: true,
        colSpan: 6,
        options: [
          { value: 'percentage', label: t('Percentage (%)') },
          { value: 'flat', label: t('Fixed Amount ($)') }
        ]
      },
      { 
        name: 'discount_amount', 
        label: t('Discount Value'), 
        type: 'number', 
        required: true,
        colSpan: 6,
        min: 0,
        max: 99,
        step: 0.01,
        placeholder: t('Enter value')
      },
      { 
        name: 'code_type', 
        label: t('Code Generation'), 
        type: 'radio', 
        required: true,
        colSpan: 12,
        options: [
          { value: 'manual', label: t('Manual Entry') },
          { value: 'auto', label: t('Auto Generate') }
        ],
        defaultValue: 'manual'
      },
      { 
        name: 'code', 
        label: t('Coupon Code'), 
        type: 'custom',
        colSpan: 12,
        render: (field: any, formData: any, onChange: any) => {
          const generateCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 10; i++) {
              result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            onChange('code', result);
          };

          const isAuto = formData.code_type === 'auto';

          return React.createElement('div', { className: 'space-y-2' }, [
            React.createElement('div', { 
              className: isAuto ? 'flex gap-2' : '', 
              key: 'input-group' 
            }, isAuto ? [
              React.createElement('input', {
                key: 'code-input',
                type: 'text',
                value: formData.code || '',
                onChange: (e: any) => onChange('code', e.target.value.toUpperCase()),
                placeholder: t('Click generate to create code'),
                className: 'flex-1 px-3 py-2 border rounded-md'
              }),
              React.createElement('button', {
                key: 'generate-btn',
                type: 'button',
                onClick: generateCode,
                className: 'px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
              }, t('Generate'))
            ] : [
              React.createElement('input', {
                key: 'code-input-manual',
                type: 'text',
                value: formData.code || '',
                onChange: (e: any) => onChange('code', e.target.value.toUpperCase()),
                placeholder: t('Enter coupon code'),
                className: 'w-full px-3 py-2 border rounded-md'
              })
            ])
          ]);
        }
      },
      { 
        name: 'minimum_spend', 
        label: t('Minimum Spend ($)'), 
        type: 'number', 
        colSpan: 6,
        min: 0,
        step: 0.01,
        placeholder: t('Optional')
      },
      { 
        name: 'maximum_spend', 
        label: t('Maximum Spend ($)'), 
        type: 'number', 
        colSpan: 6,
        min: 0,
        step: 0.01,
        placeholder: t('Optional')
      },
      { 
        name: 'use_limit_per_coupon', 
        label: t('Total Usage Limit'), 
        type: 'number', 
        colSpan: 6,
        min: 1,
        placeholder: t('Leave empty for unlimited')
      },
      { 
        name: 'use_limit_per_user', 
        label: t('Usage Limit Per User'), 
        type: 'number', 
        colSpan: 6,
        min: 1,
        placeholder: t('Leave empty for unlimited')
      },
      { 
        name: 'expiry_date', 
        label: t('Expiry Date'), 
        type: 'date', 
        colSpan: 6
      },
      { 
        name: 'status', 
        label: t('Status'), 
        type: 'switch', 
        colSpan: 6,
        defaultValue: true,
        placeholder: t('Enable or disable this coupon')
      }
    ]
  }
};