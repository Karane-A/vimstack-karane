import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
// Simple template data for Storego
const getBusinessTemplate = (name: string) => {
  return {
    defaultData: {
      header: { name: name.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }
    }
  };
};


interface TemplatePreviewCardProps {
  template: {
    name: string;
    category: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
  previewButtonText?: string;
}

export default function TemplatePreviewCard({ 
  template, 
  isSelected = false, 
  onClick,
  previewButtonText = 'Preview Template'
}: TemplatePreviewCardProps) {
  const templateData = getBusinessTemplate(template.name);

  
  // Format template name for display
  const displayName = template.name ? template.name.replace(/-/g, ' ') : '';
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  
  return (
    <>
      <div 
        className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-2 ring-green-500' : 'hover:border-gray-400'}`}
        onClick={onClick}
      >
        <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
          {/* Template preview */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-2">
              <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-white shadow-sm flex items-center justify-center">
                <span className="text-base font-semibold" style={{ color: '#10b981' }}>{template.name.charAt(0).toUpperCase()}</span>
              </div>
              <h4 className="text-xs font-medium capitalize mb-1 truncate">{template.name.replace(/-/g, ' ')}</h4>
              <span className="inline-block px-1.5 py-0.5 rounded-full text-[10px] capitalize" 
                    style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                {template.category}
              </span>
            </div>
          </div>
          
          {/* Preview button overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              
              // Simple preview alert for Storego
              alert(`Preview: ${templateData?.defaultData?.header?.name || template.name}`);
            }}
          >
            <Button size="sm" variant="secondary" className="text-xs bg-white hover:bg-gray-100 shadow-sm">
              <Eye className="h-3 w-3 mr-1" />
              {previewButtonText}
            </Button>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium capitalize">{capitalizedName}</h4>
            {isSelected && (
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 capitalize">{template.category}</p>
        </div>
      </div>
    </>
  );
}