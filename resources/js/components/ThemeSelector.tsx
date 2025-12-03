import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

interface ThemeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  themes: ThemeOption[];
}

export function ThemeSelector({ value, onChange, themes }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {themes.map((theme) => (
        <div
          key={theme.id}
          className={cn(
            "cursor-pointer rounded-lg border-2 p-1 transition-all hover:border-primary",
            value === theme.id ? "border-primary" : "border-muted"
          )}
          onClick={() => onChange(theme.id)}
        >
          <div className="relative aspect-video overflow-hidden rounded-md theme-preview-container">
            <img
              src={theme.thumbnail}
              alt={theme.name}
              className="h-full w-full object-cover theme-preview-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/300x180?text=Theme';
              }}
            />
            {value === theme.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                <div className="rounded-full bg-primary p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
          </div>
          <div className="p-2">
            <h3 className="font-medium text-sm">{theme.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{theme.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}