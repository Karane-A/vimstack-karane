// types/crud.ts
export interface EntityConfig {
    name: string;
    endpoint: string;
    permissions: {
      view: string;
      create: string;
      edit: string;
      delete: string;
    };
    breadcrumbs: {
      title: string;
      href?: string;
    }[];
  }
  
  export interface TableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    type?: 'text' | 'badge' | 'image' | 'date' | 'currency' | 'boolean' | 'link' | 'custom';
    className?: string;
    linkClassName?: string;
    href?: string | ((row: any) => string);
    openInNewTab?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
  }
  
  export interface TableAction {
    label: string;
    icon: string;
    action?: string;
    href?: string | ((row: any) => string);
    openInNewTab?: boolean;
    permission?: string;
    className?: string;
    requiredPermission?: string;
    condition?: (row: any) => boolean;
  }
  
  export interface TableConfig {
    columns: TableColumn[];
    actions: TableAction[];
    statusColors?: Record<string, string>;
  }
  
  export interface FilterOption {
    value: string;
    label: string;
  }
  
  export interface FilterField {
    key: string;
    label: string;
    type: 'select' | 'date' | 'daterange' | 'text' | 'number' | 'boolean';
    options?: FilterOption[];
    relation?: {
      endpoint: string;
      valueField: string;
      labelField: string;
    };
  }
  
  export interface FileValidation {
    accept?: string;
    maxSize?: number; // in bytes
    mimeTypes?: string[]; // e.g. ['image/jpeg', 'image/png']
    extensions?: string[]; // e.g. ['.jpg', '.png']
  }
  
  export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'radio' | 'checkbox' | 'switch' | 'file' | 'date' | 'number' | 'multi-select' | 'media-picker' | 'custom';
    placeholder?: string;
    required?: boolean;
    multiple?: boolean; // For media-picker and multi-select fields
    options?: FilterOption[];
    relation?: {
      endpoint: string;
      valueField: string;
      labelField: string;
    };
    validation?: {
      pattern?: string;
      min?: number;
      max?: number;
      minLength?: number;
      maxLength?: number;
    };
    fileValidation?: FileValidation;
    description?: string;
    colSpan?: number; // Number of columns this field should span (1-12)
    width?: string; // CSS width value (e.g., '50%', '200px')
    row?: number; // Optional row number for grouping fields
    render?: (field: FormField, formData: any, onChange: (name: string, value: any) => void) => React.ReactNode;
    conditional?: (mode: string, formData: any) => boolean;
  }
  
  export interface FormConfig {
    fields: FormField[];
    modalSize?: string;
    columns?: number; // Number of columns in the form grid (default: 1)
    layout?: 'grid' | 'flex' | 'default'; // Layout type
  }
  
  export interface CrudHooks {
    afterCreate?: (data: any, response: any) => void;
    afterUpdate?: (data: any, response: any) => void;
    afterDelete?: (id: any) => void;
  }
  
  export interface CrudConfig {
    entity: EntityConfig;
    table: TableConfig;
    filters: FilterField[];
    form: FormConfig;
    hooks?: CrudHooks;
    modalSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
    description?: string; // Description for accessibility in dialogs
  }