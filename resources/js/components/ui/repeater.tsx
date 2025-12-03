import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RepeaterField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'file' | 'select' | 'switch' | 'date' | 'time' | 'datetime-local';
  placeholder?: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  accept?: string; // for file inputs
  min?: string | number;
  max?: string | number;
  step?: string | number;
  defaultValue?: any;
  className?: string;
  disabled?: boolean;
}

export interface RepeaterProps {
  fields: RepeaterField[];
  value?: any[];
  onChange?: (value: any[]) => void;
  minItems?: number;
  maxItems?: number;
  addButtonText?: string;
  removeButtonText?: string;
  className?: string;
  itemClassName?: string;
  showItemNumbers?: boolean;
  allowReorder?: boolean;
  emptyMessage?: string;
}

export function Repeater({
  fields,
  value = [],
  onChange,
  minItems = 0,
  maxItems = 10,
  addButtonText = 'Add Item',
  removeButtonText = 'Remove',
  className,
  itemClassName,
  showItemNumbers = true,
  allowReorder = false,
  emptyMessage = 'No items added yet.'
}: RepeaterProps) {
  const [items, setItems] = useState<any[]>(value.length > 0 ? value : []);

  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(items)) {
      setItems(value);
    }
  }, [value]);

  const createEmptyItem = () => {
    const emptyItem: any = {};
    fields.forEach(field => {
      emptyItem[field.name] = field.defaultValue || (field.type === 'switch' ? false : '');
    });
    return emptyItem;
  };

  const addItem = () => {
    if (maxItems === -1 || items.length < maxItems) {
      const newItems = [...items, createEmptyItem()];
      setItems(newItems);
      onChange?.(newItems);
    }
  };

  const removeItem = (index: number) => {
    if (items.length > minItems) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      onChange?.(newItems);
    }
  };

  const updateItem = (index: number, fieldName: string, fieldValue: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [fieldName]: fieldValue };
    setItems(newItems);
    onChange?.(newItems);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (!allowReorder) return;
    
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
    onChange?.(newItems);
  };

  const renderField = (field: RepeaterField, value: any, onChange: (value: any) => void, itemIndex: number) => {
    const fieldId = `${field.name}_${itemIndex}`;
    
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={field.disabled}
            className={field.className}
          />
        );

      case 'number':
        return (
          <Input
            id={fieldId}
            type="number"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
            step={field.step}
            className={field.className}
          />
        );

      case 'file':
        return (
          <Input
            id={fieldId}
            type="file"
            accept={field.accept}
            onChange={(e) => onChange(e.target.files?.[0] || null)}
            required={field.required}
            disabled={field.disabled}
            className={field.className}
          />
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange} disabled={field.disabled}>
            <SelectTrigger className={field.className}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={fieldId}
              checked={Boolean(value)}
              onCheckedChange={onChange}
              disabled={field.disabled}
            />
            <Label htmlFor={fieldId} className="text-sm">
              {field.placeholder || 'Enable'}
            </Label>
          </div>
        );

      case 'date':
      case 'time':
      case 'datetime-local':
        return (
          <Input
            id={fieldId}
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
            className={field.className}
          />
        );

      default: // text, email, password
        return (
          <Input
            id={fieldId}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            disabled={field.disabled}
            className={field.className}
          />
        );
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          {emptyMessage}
        </div>
      )}

      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            'relative border rounded-lg p-4 space-y-4 bg-white',
            itemClassName
          )}
        >
          {/* Item Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {allowReorder && (
                <div className="cursor-move text-gray-400">
                  <GripVertical className="h-4 w-4" />
                </div>
              )}
              {showItemNumbers && (
                <span className="text-sm font-medium text-gray-600">
                  Item #{index + 1}
                </span>
              )}
            </div>
            
            {items.length > minItems && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {removeButtonText}
              </Button>
            )}
          </div>

          {/* Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`${field.name}_${index}`} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderField(
                  field,
                  item[field.name],
                  (value) => updateItem(index, field.name, value),
                  index
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add Button */}
      {(maxItems === -1 || items.length < maxItems) && (
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5"
        >
          <Plus className="h-4 w-4 mr-2" />
          {addButtonText}
        </Button>
      )}

      {/* Items Count */}
      {items.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          {items.length} of {maxItems === -1 ? <span className="text-lg font-medium">∞</span> : maxItems} items
          {minItems > 0 && ` (minimum ${minItems} required)`}
        </div>
      )}
    </div>
  );
}