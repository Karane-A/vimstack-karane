import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Layout } from 'lucide-react';

interface TemplateListItemProps {
  template: {
    name: string;
    category: string;
  };
  onRemove: () => void;
}

export default function TemplateListItem({ template, onRemove }: TemplateListItemProps) {
  // Format template name for display
  const displayName = template.name ? template.name.replace(/-/g, ' ') : '';
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <Layout className="h-4 w-4 text-gray-600" />
        </div>
        <div>
          <h5 className="font-medium capitalize">{capitalizedName}</h5>
          <p className="text-xs text-gray-500 capitalize">{template.category}</p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}