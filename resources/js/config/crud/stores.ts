// config/crud/stores.ts
import { CrudConfig } from '@/types/crud';
import { t } from '@/utils/i18n';

export const storesConfig: CrudConfig = {
  entity: 'store',
  entityPlural: 'stores',
  route: '/stores',
  permissions: {
    view: 'manage-stores',
    create: 'create-stores',
    edit: 'edit-stores',
    delete: 'delete-stores',
  },
  columns: [
    {
      key: 'user_name',
      label: 'User Name',
      sortable: true,
    },
    {
      key: 'user_email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'store_count',
      label: 'Store Count',
      sortable: true,
    },
    {
      key: 'plan',
      label: 'Plan',
      sortable: true,
    },
    {
      key: 'created_at',
      label: 'Created At',
      sortable: true,
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
    },
  ],
  filters: [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Search stores...',
    },
  ],
  actions: [
    {
      key: 'edit',
      label: 'Edit',
      icon: 'Edit',
      permission: 'edit-stores',
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'Trash2',
      permission: 'delete-stores',
    },
    {
      key: 'store_links',
      label: 'Store Links',
      icon: 'Link',
      permission: 'super-admin',
    },
    {
      key: 'toggle_login',
      label: 'Enable/Disable Login',
      icon: 'Lock',
      permission: 'super-admin',
    },
    {
      key: 'upgrade_plan',
      label: 'Upgrade Plan',
      icon: 'ArrowUp',
      permission: 'super-admin',
    },
    {
      key: 'reset_password',
      label: 'Reset Password',
      icon: 'Key',
      permission: 'super-admin',
    },
    {
      key: 'login_as_admin',
      label: 'Login as Admin',
      icon: 'UserCheck',
      permission: 'super-admin',
    },
  ],
  form: {
    fields: [
      {
        key: 'store_name',
        label: 'Store Name',
        type: 'text',
        required: true,
      },
      {
        key: 'name',
        label: 'User Name',
        type: 'text',
        required: true,
        conditional: (mode) => mode === 'create',
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        conditional: (mode) => mode === 'create',
      },
      {
        key: 'password_switch',
        label: 'Set Password',
        type: 'switch',
        required: false,
        conditional: (mode) => mode === 'create',
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password',
        required: false,
        conditional: (mode, data) => mode === 'create' && data?.password_switch,
      },
      {
        key: 'is_active',
        label: 'Status',
        type: 'switch',
        required: false,
      },
    ],
  },
};