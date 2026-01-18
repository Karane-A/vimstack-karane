import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { ReactNode } from 'react';

export interface PageAction {
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick?: () => void;
}

export interface PageTemplateProps {
  title: string;
  description: string;
  url: string;
  actions?: PageAction[];
  children: ReactNode;
  noPadding?: boolean;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageTemplate({ 
  title,
  description, 
  url, 
  actions, 
  children, 
  noPadding = false,
  breadcrumbs
}: PageTemplateProps) {
  // Default breadcrumbs if none provided
  const pageBreadcrumbs: BreadcrumbItem[] = breadcrumbs || [
    {
      title,
      href: url,
    },
  ];

  return (
    <AppLayout breadcrumbs={pageBreadcrumbs}>
      <Head title={title} />
      
      <div className="flex h-full flex-1 flex-col gap-4 p-3 sm:p-4 md:p-6">
        {/* Header with action buttons */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">{title}</h1>
          {actions && actions.length > 0 && (
            <>
              {/* Desktop: Show all buttons */}
              <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                {actions.map((action, index) => (
                  <Button 
                    key={index}
                    variant={action.variant || 'outline'} 
                    size="sm"
                    onClick={action.onClick}
                    className="touch-manipulation"
                  >
                    {action.icon}
                    <span className="ml-2">{action.label}</span>
                  </Button>
                ))}
              </div>

              {/* Tablet: Show primary action + dropdown for others */}
              <div className="hidden sm:flex md:hidden items-center gap-2 flex-shrink-0">
                {actions.length > 0 && (
                  <Button 
                    variant={actions[actions.length - 1].variant || 'default'} 
                    size="sm"
                    onClick={actions[actions.length - 1].onClick}
                    className="touch-manipulation"
                  >
                    {actions[actions.length - 1].icon}
                    <span className="ml-2">{actions[actions.length - 1].label}</span>
                  </Button>
                )}
                {actions.length > 1 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="touch-manipulation">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {actions.slice(0, -1).map((action, index) => (
                        <DropdownMenuItem key={index} onClick={action.onClick} className="touch-manipulation">
                          {action.icon}
                          <span className="ml-2">{action.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Mobile: Dropdown menu for all actions */}
              <div className="flex sm:hidden flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 w-9 p-0 touch-manipulation">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {actions.map((action, index) => (
                      <DropdownMenuItem key={index} onClick={action.onClick} className="touch-manipulation">
                        <div className="flex items-center">
                          {action.icon}
                          <span className="ml-2">{action.label}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
        
        {/* Content */}
        <div className={noPadding ? "" : "rounded-xl border p-3 sm:p-4 md:p-6"}>
          {children}
        </div>
      </div>
    </AppLayout>
  );
}