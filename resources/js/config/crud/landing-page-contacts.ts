export const landingPageContactsConfig = {
  entity: {
    name: 'contact',
    permissions: {
      view: 'view-contacts',
      create: 'create-contacts',
      edit: 'edit-contacts',
      delete: 'delete-contacts',
      export: 'export-contacts'
    }
  },
  table: {
    columns: [
      {
        key: 'name',
        label: 'Name',
        sortable: true
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true
      },
      {
        key: 'subject',
        label: 'Subject',
        sortable: true
      },
      {
        key: 'created_at',
        label: 'Submitted At',
        type: 'date',
        sortable: true
      }
    ],
    actions: [
      {
        action: 'view',
        label: 'View',
        icon: 'Eye'
      },
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
        { value: 'read', label: 'Read' },
        { value: 'unread', label: 'Unread' }
      ]
    }
  ]
};