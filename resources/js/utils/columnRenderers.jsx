import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Switch } from '@/components/ui/switch';

// Simple renderers without TypeScript types
export const columnRenderers = {
  // Status badge renderer
  status: (colorMap = {}, defaultColor = 'bg-gray-100 text-gray-800') => {
    return (value) => {
      if (value === null || value === undefined) return <span>-</span>;
      
      // Handle boolean status values
      if (typeof value === 'boolean') {
        return (
          <Badge className={cn(
            "capitalize", 
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          )}>
            {value ? 'Active' : 'Inactive'}
          </Badge>
        );
      }
      
      const color = colorMap[value] || defaultColor;
      return (
        <Badge className={cn("capitalize", color)}>
          {value}
        </Badge>
      );
    };
  },
  
  // Image renderer
  image: (className = 'h-16 w-20 rounded-md object-cover shadow-sm', fallbackSrc = 'https://placehold.co/200x150?text=Image+Not+Found') => {
    return (value, row) => {
      if (!value) return <div className="text-center text-gray-400">No image</div>;
      
      const imageSrc = typeof value === 'string' && value.startsWith('http') 
        ? value 
        : `/storage/${value}`;
      
      return (
        <div className="flex justify-center">
          <img 
            src={imageSrc} 
            alt="Image" 
            className={className} 
            onError={(e) => {
              e.currentTarget.src = fallbackSrc;
            }}
          />
        </div>
      );
    };
  },
  
  // Price renderer
  price: (currency = 'USD', locale = 'en-US') => {
    return (value) => {
      if (value === null || value === undefined) return <span>-</span>;
      
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      
      return (
        <span className="text-sm font-medium">
          {numValue.toLocaleString(locale, { style: 'currency', currency })}
        </span>
      );
    };
  },
  
  // Date renderer with settings support
  date: (includeTime = false) => {
    return (value) => {
      if (!value) return <span>-</span>;
      
      try {
        // Try to use global settings if available
        if (typeof window !== 'undefined' && window.appSettings) {
          const formatted = window.appSettings.formatDateTime(value, false);
          return <span className="text-sm">{formatted}</span>;
        }
        
        // Fallback to default formatting
        const date = new Date(value);
        const options = includeTime 
          ? { dateStyle: 'medium', timeStyle: 'short' }
          : { dateStyle: 'medium' };
        return <span className="text-sm">{date.toLocaleDateString('en-US', options)}</span>;
      } catch (e) {
        return <span className="text-sm">{value}</span>;
      }
    };
  },
  
  // Boolean renderer
  boolean: () => {
    return (value) => <span>{value ? 'Yes' : 'No'}</span>;
  },
  
  // Relation renderer
  relation: (field) => {
    return (value, row) => {
      if (!row) return <span>-</span>;
      return row && row[field] ? <span>{row[field]}</span> : <span>-</span>;
    };
  },
  
  // Link renderer - for making a column value clickable
  link: (getUrl, className = 'text-blue-600 hover:underline', newTab = false) => {
    return (value, row) => {
      if (!value) return <span>-</span>;
      
      const url = typeof getUrl === 'function' ? getUrl(row) : getUrl.replace(':id', row.id);
      
      return (
        <Link 
          href={url} 
          className={className}
          target={newTab ? '_blank' : undefined}
        >
          {value}
        </Link>
      );
    };
  },
  
  // Button renderer - for adding a button in a column
  button: (label, getUrl, className = 'px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600', newTab = false) => {
    return (value, row) => {
      const url = typeof getUrl === 'function' ? getUrl(row) : getUrl.replace(':id', row.id);
      
      return (
        <Link 
          href={url} 
          className={className}
          target={newTab ? '_blank' : undefined}
        >
          {label}
        </Link>
      );
    };
  },
  
  // Switch renderer - for status toggles
  switch: (onToggle, disabled = false) => {
    return (value, row) => {
      const handleToggle = () => {
        if (!disabled && onToggle) {
          onToggle(row.id, !value);
        }
      };
      
      return React.createElement('div', { className: 'flex items-center justify-center' }, [
        React.createElement(Switch, {
          key: 'switch',
          checked: !!value,
          onCheckedChange: handleToggle,
          disabled
        })
      ]);
    };
  }
};