import { LucideIcon } from 'lucide-react';
import * as LucidIcons from 'lucide-react';

export interface NavItem {
  title: string;
  href?: string;
  icon?: LucideIcon;
  permission?: string;
  isLabel?: boolean;
  isDivider?: boolean;
  children?: NavItem[];
}

export interface TableColumn {
  label: string;
  key: string;
  isImage?: boolean;
  isAction?: boolean;
  className?: string;
  type?: string;
  sortable?: boolean;
  sortKey?: string;
}

export interface ActionConfig {
  label: string;
  icon: keyof typeof LucidIcons;
  action: string;
  className: string;
  permission?: string;
}

export interface TableConfig {
  columns: TableColumn[];
  actions: ActionConfig[];
  statusColors?: Record<string, string>;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file';
  placeholder?: string;
  required?: boolean;
  validation?: string;
  options?: { value: string; label: string }[];
}

export interface FormConfig {
  fields: FormField[];
}