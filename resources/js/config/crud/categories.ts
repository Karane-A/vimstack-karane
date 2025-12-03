// config/crud/categories.ts
import { CrudConfig } from '@/types/crud';
import { columnRenderers } from '@/utils/columnRenderers';
import { t } from '@/utils/i18n';

export const categoriesConfig: CrudConfig = {
  entity: {
    name: 'categories',
    endpoint: route('categories.index'),
    permissions: {
      view: 'view-categories',
      create: 'create-categories',
      edit: 'edit-categories',
      delete: 'delete-categories'
    }
  },
  table: {
    columns: [
      { key: 'name', label: t('Name'), sortable: true },
      { key: 'slug', label: t('Slug'), sortable: true },
      { 
        key: 'image', 
        label: t('Image'), 
        render: columnRenderers.image('h-16 w-24 rounded-md object-cover shadow-sm')
      },
      { key: 'description', label: t('Description') },
      { 
        key: 'created_at', 
        label: t('Created At'), 
        sortable: true, 
        render: columnRenderers.date()
      }
    ],
    actions: [
      { 
        label: t('View'), 
        icon: 'Eye', 
        action: 'view', 
        className: 'text-blue-500',
        requiredPermission: 'view-categories'
      },
      { 
        label: t('Edit'), 
        icon: 'Edit', 
        action: 'edit', 
        className: 'text-amber-500',
        requiredPermission: 'edit-categories'
      },
      { 
        label: t('Delete'), 
        icon: 'Trash2', 
        action: 'delete', 
        className: 'text-red-500',
        requiredPermission: 'delete-categories'
      }
    ]
  },
  filters: [],
  form: {
    fields: [
      { name: 'name', label: t('Name'), type: 'text', required: true },
      { name: 'slug', label: t('Slug'), type: 'text', required: true },
      { name: 'description', label: t('Description'), type: 'textarea' },
      { 
        name: 'image', 
        label: t('Image'), 
        type: 'file',
        fileValidation: {
          accept: 'image/*',
          maxSize: 2 * 1024 * 1024, // 2MB
          mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
          extensions: ['.jpg', '.jpeg', '.png', '.gif']
        }
      }
    ],
    modalSize: '4xl'
  }
};