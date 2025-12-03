// config/crud/currencies.ts
import { CrudConfig } from '@/types/crud';
import { t } from '@/utils/i18n';

export const currenciesConfig: CrudConfig = {
  entity: {
    name: 'currencies',
    endpoint: route('currencies.index'),
    permissions: {
      view: 'manage-currencies',
      create: 'manage-currencies',
      edit: 'manage-currencies',
      delete: 'manage-currencies'
    }
  },
  table: {
    columns: [
      { 
        key: 'name', 
        label: t('Name'), 
        sortable: true 
      },
      { 
        key: 'code', 
        label: t('Code'), 
        sortable: true 
      },
      { 
        key: 'symbol', 
        label: t('Symbol'), 
        sortable: true 
      },
      { 
        key: 'description', 
        label: t('Description') 
      },
      { 
        key: 'is_default', 
        label: t('Default'), 
        type: 'boolean'
      }
    ],
    actions: [
      { 
        label: t('Edit'), 
        icon: 'Edit', 
        action: 'edit', 
        className: 'text-amber-500',
        requiredPermission: 'manage-currencies'
      },
      { 
        label: t('Delete'), 
        icon: 'Trash2', 
        action: 'delete', 
        className: 'text-red-500',
        requiredPermission: 'manage-currencies',
        condition: (row) => !row.is_default // Don't allow deleting default currency
      }
    ]
  },
  filters: [],
  form: {
    fields: [
      { 
        name: 'name', 
        label: t('Currency Name'), 
        type: 'text', 
        required: true 
      },
      { 
        name: 'code', 
        label: t('Currency Code'), 
        type: 'text', 
        required: true,
        placeholder: 'e.g. USD, EUR, GBP'
      },
      { 
        name: 'symbol', 
        label: t('Currency Symbol'), 
        type: 'text', 
        required: true,
        placeholder: 'e.g. $, €, £'
      },
      { 
        name: 'description', 
        label: t('Description'), 
        type: 'textarea' 
      },
      { 
        name: 'is_default', 
        label: t('Set as Default Currency'), 
        type: 'checkbox' 
      }
    ]
  }
};