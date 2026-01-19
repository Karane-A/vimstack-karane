import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function SettingsSection({ title, description, children, action }: SettingsSectionProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="pb-4 md:pb-6 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-bold text-slate-900">{title}</h3>
            {description && (
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
      <div className="pt-6">
        {children}
      </div>
    </div>
  );
}