// components/CrudFormModal.tsx
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/types/crud';
import { MultiSelectField } from '@/components/multi-select-field';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MediaPicker } from '@/components/MediaPicker';

interface CrudFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  formConfig: {
    fields: FormField[];
    modalSize?: string;
    columns?: number;
    layout?: 'grid' | 'flex' | 'default';
  };
  initialData?: any;
  title: string;
  mode: 'create' | 'edit' | 'view';
  description?: string;
}

export function CrudFormModal({
  isOpen,
  onClose,
  onSubmit,
  formConfig,
  initialData = {},
  title,
  mode,
  description
}: CrudFormModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [relationOptions, setRelationOptions] = useState<Record<string, any[]>>({});
  
  // Load initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      // Create a clean copy of the initial data
      const cleanData = { ...initialData };
      
      // Process multi-select fields in initial data
      formConfig.fields.forEach(field => {
        if (field.type === 'multi-select') {
          if (cleanData[field.name] && !Array.isArray(cleanData[field.name])) {
            // Convert to array if it's not already
            cleanData[field.name] = Array.isArray(cleanData[field.name]) 
              ? cleanData[field.name] 
              : cleanData[field.name] ? [cleanData[field.name].toString()] : [];
          }
        }
      });
      
      setFormData(cleanData || {});
      setErrors({});
      
      // Load relation data for select fields
      formConfig.fields.forEach(field => {
        if (field.relation && field.relation.endpoint) {
          fetch(field.relation.endpoint)
            .then(res => res.json())
            .then(data => {
              setRelationOptions(prev => ({
                ...prev,
                [field.name]: Array.isArray(data) ? data : data.data || []
              }));
            })
            .catch(err => {
              // Silent error handling
            });
        }
      });
    }
  }, [isOpen, initialData, formConfig.fields, mode]);
  
  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process form data before validation
    const processedData = { ...formData };
    
    // Ensure multi-select fields are properly formatted
    formConfig.fields.forEach(field => {
      if (field.type === 'multi-select' && processedData[field.name]) {
        // Make sure it's an array of strings
        if (!Array.isArray(processedData[field.name])) {
          processedData[field.name] = [processedData[field.name].toString()];
        }
      }
    });
    
    setFormData(processedData);
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    formConfig.fields.forEach(field => {
      // For file fields in edit mode, they're never required
      if (field.type === 'file' && mode === 'edit') {
        return;
      }
      
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      // File validation
      if (field.type === 'file' && formData[field.name] && field.fileValidation) {
        const file = formData[field.name];
        
        // Check file size
        if (field.fileValidation.maxSize && file.size > field.fileValidation.maxSize) {
          const maxSizeMB = field.fileValidation.maxSize / (1024 * 1024);
          newErrors[field.name] = `File size must be less than ${maxSizeMB}MB`;
        }
        
        // Check mime type
        if (field.fileValidation.mimeTypes && field.fileValidation.mimeTypes.length > 0) {
          if (!field.fileValidation.mimeTypes.includes(file.type)) {
            newErrors[field.name] = `File type must be one of: ${field.fileValidation.mimeTypes.join(', ')}`;
          }
        }
        
        // Check extension
        if (field.fileValidation.extensions && field.fileValidation.extensions.length > 0) {
          const fileName = file.name;
          const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
          if (!field.fileValidation.extensions.includes(fileExt)) {
            newErrors[field.name] = `File extension must be one of: ${field.fileValidation.extensions.join(', ')}`;
          }
        }
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create a clean copy without any unexpected properties
    const cleanData = { ...formData };
    
    // Process multi-select fields before submission
    formConfig.fields.forEach(field => {
      if (field.type === 'multi-select' && cleanData[field.name]) {
        // Ensure it's an array of strings
        if (!Array.isArray(cleanData[field.name])) {
          cleanData[field.name] = [cleanData[field.name].toString()];
        }
      }
    });
    
    onSubmit(cleanData);
  };
  
  const renderField = (field: FormField) => {
    // If field has custom render function, use it
    if (field.render) {
      return field.render(field, formData, handleChange);
    }
    
    // If in view mode, render as read-only
    if (mode === 'view') {
      // Special handling for multi-select fields
      if (field.type === 'multi-select') {
        const selectedValues = Array.isArray(formData[field.name]) ? formData[field.name] : [];
        const selectedLabels = selectedValues
          .map((value: string) => {
            const option = field.options?.find(opt => opt.value === value);
            return option ? option.label : value;
          })
          .join(', ');
        
        return (
          <div className="p-2 border rounded-md bg-gray-50">
            {selectedLabels || '-'}
          </div>
        );
      }
      
      // For other field types
      return (
        <div className="p-2 border rounded-md bg-gray-50">
          {field.type === 'select' && field.options ? 
            field.options.find(opt => opt.value === String(formData[field.name]))?.label || formData[field.name] || '-' :
            formData[field.name] || '-'}
        </div>
      );
    }
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'date':
        return (
          <Input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            className={errors[field.name] ? 'border-red-500' : ''}
            disabled={mode === 'view'}
          />
        );
        
      case 'number':
        return (
          <Input
            id={field.name}
            name={field.name}
            type="number"
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value ? parseFloat(e.target.value) : '')}
            required={field.required}
            className={errors[field.name] ? 'border-red-500' : ''}
            disabled={mode === 'view'}
          />
        );
        
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            className={errors[field.name] ? 'border-red-500' : ''}
            disabled={mode === 'view'}
          />
        );
          
      case 'select':
        const options = field.relation 
          ? relationOptions[field.name] || []
          : field.options || [];
          
        return (
          <Select
            value={String(formData[field.name] || '')}
            onValueChange={(value) => handleChange(field.name, value)}
            disabled={mode === 'view'}
          >
            <SelectTrigger className={errors[field.name] ? 'border-red-500' : ''}>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.relation ? (
                options.map((option: any) => (
                  <SelectItem 
                    key={option[field.relation!.valueField]} 
                    value={String(option[field.relation!.valueField])}
                  >
                    {option[field.relation!.labelField]}
                  </SelectItem>
                ))
              ) : (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        );
        
      case 'radio':
        return (
          <RadioGroup
            value={formData[field.name] || ''}
            onValueChange={(value) => handleChange(field.name, value)}
            disabled={mode === 'view'}
            className="flex gap-4"
          >
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={!!formData[field.name]}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
              disabled={mode === 'view'}
            />
            <Label htmlFor={field.name}>{field.placeholder || field.label}</Label>
          </div>
        );
        
      case 'multi-select':
        return (
          <MultiSelectField
            field={field}
            formData={formData}
            handleChange={handleChange}
          />
        );
        
      case 'media-picker':
        return (
          <MediaPicker
            value={formData[field.name] || ''}
            onChange={(value) => handleChange(field.name, value)}
            multiple={field.multiple || false}
            placeholder={field.placeholder || `Select ${field.label.toLowerCase()}...`}
          />
        );
        
      case 'file':
        const acceptAttr = field.fileValidation?.accept || '';
        const isImageFile = acceptAttr.includes('image') || 
          (field.fileValidation?.mimeTypes?.some(type => type.startsWith('image/')) ?? false);
        
        return (
          <>
            <Input
              id={field.name}
              name={field.name}
              type="file"
              accept={acceptAttr}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleChange(field.name, e.target.files[0]);
                }
              }}
              className={errors[field.name] ? 'border-red-500' : ''}
              disabled={mode === 'view'}
            />
            {mode === 'edit' && initialData[field.name] && (
              <div className="text-xs text-gray-500 mt-1">
                Current file: {initialData.featured_image_original_name || initialData[field.name]}
              </div>
            )}
            {field.fileValidation && (
              <div className="text-xs text-gray-500 mt-1">
                {field.fileValidation.extensions && (
                  <span>Allowed extensions: {field.fileValidation.extensions.join(', ')} </span>
                )}
                {field.fileValidation.maxSize && (
                  <span>Max size: {(field.fileValidation.maxSize / (1024 * 1024)).toFixed(1)}MB</span>
                )}
              </div>
            )}
            
            {/* Image preview for image files */}
            {isImageFile && (
              <div className="mt-2">
                {formData[field.name] && formData[field.name] instanceof File ? (
                  // Preview for newly selected file
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={URL.createObjectURL(formData[field.name])} 
                      alt="Preview" 
                      className="h-24 w-auto rounded-md object-cover shadow-sm" 
                    />
                  </div>
                ) : mode === 'edit' && initialData[field.name] && (
                  // Show existing image in edit mode
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Current image:</p>
                    <img 
                      src={typeof initialData[field.name] === 'string' && initialData[field.name].startsWith && initialData[field.name].startsWith('http') 
                        ? initialData[field.name] 
                        : `/storage/${initialData[field.name]}`} 
                      alt="Current" 
                      className="h-24 w-auto rounded-md object-cover shadow-sm" 
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/200x150?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        );
        
      default:
        return null;
    }
  };

  // Map modal size to appropriate width class
  const getModalSizeClass = () => {
    const sizeMap: Record<string, string> = {
      'sm': 'sm:max-w-sm',
      'md': 'sm:max-w-md',
      'lg': 'sm:max-w-lg',
      'xl': 'sm:max-w-xl',
      '2xl': 'sm:max-w-2xl',
      '3xl': 'sm:max-w-3xl',
      '4xl': 'sm:max-w-4xl',
      '5xl': 'sm:max-w-5xl',
      'full': 'sm:max-w-full'
    };
    return formConfig.modalSize ? sizeMap[formConfig.modalSize] : 'sm:max-w-md';
  };

  // Group fields by row if specified
  const groupFieldsByRow = () => {
    const rows: Record<number, FormField[]> = {};
    
    formConfig.fields.forEach(field => {
      const rowNumber = field.row || 0;
      if (!rows[rowNumber]) {
        rows[rowNumber] = [];
      }
      rows[rowNumber].push(field);
    });
    
    return Object.entries(rows).sort(([a], [b]) => parseInt(a) - parseInt(b));
  };

  // Determine the layout type
  const layout = formConfig.layout || 'default';
  const columns = formConfig.columns || 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${getModalSizeClass()} max-h-[90vh]`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {layout === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '1rem' }}>
                {formConfig.fields.map((field) => (
                  <div 
                    key={field.name} 
                    className="space-y-2"
                    style={{ 
                      gridColumn: field.colSpan ? `span ${field.colSpan}` : 'span 1',
                      width: '100%'
                    }}
                  >
                    <Label htmlFor={field.name} className="text-sm font-medium">
                      {field.label} {field.required && !(field.type === 'file' && mode === 'edit') && <span className="text-red-500">*</span>}
                    </Label>
                    {renderField(field)}
                    {errors[field.name] && (
                      <p className="text-xs text-red-500">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : layout === 'flex' ? (
              <div className="flex flex-wrap gap-4">
                {formConfig.fields.map((field) => (
                  <div 
                    key={field.name} 
                    className="space-y-2"
                    style={{ 
                      width: field.width || "100%",
                      flexGrow: field.width ? 0 : 1
                    }}
                  >
                    <Label htmlFor={field.name} className="text-sm font-medium">
                      {field.label} {field.required && !(field.type === 'file' && mode === 'edit') && <span className="text-red-500">*</span>}
                    </Label>
                    {renderField(field)}
                    {errors[field.name] && (
                      <p className="text-xs text-red-500">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Default layout with row grouping
              groupFieldsByRow().map(([rowNumber, fields]) => (
                <div key={rowNumber} className="flex flex-wrap gap-4 mb-4">
                  {fields.map((field) => (
                    <div 
                      key={field.name} 
                      className="space-y-2"
                      style={{ width: field.width || "100%" }}
                    >
                      <Label htmlFor={field.name} className="text-sm font-medium">
                        {field.label} {field.required && !(field.type === 'file' && mode === 'edit') && <span className="text-red-500">*</span>}
                      </Label>
                      {renderField(field)}
                      {errors[field.name] && (
                        <p className="text-xs text-red-500">{errors[field.name]}</p>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </form>
        </ScrollArea>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {mode !== 'view' && (
            <Button type="button" onClick={handleSubmit}>Save</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}