export const landingPageNewslettersConfig = {
  entity: {
    name: 'newsletter',
    permissions: {
      view: 'view-newsletters',
      create: 'create-newsletters',
      edit: 'edit-newsletters',
      delete: 'delete-newsletters',
      export: 'export-newsletters'
    }
  },
  table: {
    columns: [
      {
        key: 'email',
        label: 'Email',
        sortable: true
      },
      {
        key: 'created_at',
        label: 'Subscribed At',
        type: 'date',
        sortable: true
      }
    ],
    actions: [
      {
        action: 'delete',
        label: 'Delete',
        icon: 'Trash2',
        className: 'text-red-600 hover:text-red-700'
      }
    ]
  },
  filters: [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ]
};