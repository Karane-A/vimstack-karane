// components/CrudTable.tsx
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import * as LucidIcons from 'lucide-react';
import { hasPermission } from '@/utils/authorization';
import { TableColumn, TableAction } from '@/types/crud';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface CrudTableProps {
  columns: TableColumn[];
  actions: TableAction[];
  data: any[];
  from: number;
  onAction: (action: string, row: any) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  statusColors?: Record<string, string>;
  permissions: string[];
  entityPermissions?: {
    view: string;
    edit: string;
    delete: string;
  };
  showActionsAsIcons?: boolean;
}

export function CrudTable({
  columns,
  actions,
  data,
  from,
  onAction,
  sortField,
  sortDirection,
  onSort,
  statusColors = {},
  permissions,
  entityPermissions
}: CrudTableProps) {
  const { t } = useTranslation();
  const renderSortIcon = (column: TableColumn) => {
    if (!column.sortable) return null;
    
    if (sortField === column.key) {
      return sortDirection === 'asc' ? 
        <ChevronUp className="ml-1 h-4 w-4" /> : 
        <ChevronDown className="ml-1 h-4 w-4" />;
    }
    
    return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />;
  };

  const handleSort = (column: TableColumn) => {
    if (!column.sortable || !onSort) return;
    onSort(column.key);
  };

  const getVisibleActionsForRow = (row: any) => {
    return actions.filter((action) => {
      // Skip if user doesn't have permission
      const permissionKey = action.requiredPermission || (
        entityPermissions && (
          action.action === 'view' 
            ? entityPermissions.view 
            : action.action === 'edit' 
              ? entityPermissions.edit 
              : action.action === 'delete' 
                ? entityPermissions.delete 
                : action.permission
        )
      );
            
      if (permissionKey && !hasPermission(permissions, permissionKey)) {
        return false;
      }
      
      // Skip if condition function returns false
      if (action.condition && !action.condition(row)) {
        return false;
      }

      return true;
    });
  };

  const hasAnyVisibleActions = data.some(row => getVisibleActionsForRow(row).length > 0);

  const renderActionButtons = (row: any) => {
    const visibleActions = getVisibleActionsForRow(row);
    
    return (
      <div className="flex items-center justify-end space-x-2">
        {visibleActions.map((action, index) => {
          const IconComponent = (LucidIcons as any)[action.icon] as React.ElementType;

          // Handle link actions
          if (action.href) {
            const href = typeof action.href === 'function' 
              ? action.href(row) 
              : action.href.replace(':id', row.id);
              
            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={href} target={action.openInNewTab ? '_blank' : undefined}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn("h-8 w-8", action.className)}
                      >
                        <IconComponent size={16} />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          // Handle regular action buttons
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-8 w-8", action.className)} 
                    onClick={() => onAction(action.action, row)}
                  >
                    <IconComponent size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    );
  };

  // Helper function to get nested property value using dot notation
  const getNestedValue = (obj: any, path: string) => {
    if (!obj || !path) return null;
    
    const keys = path.split('.');
    return keys.reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  };

  const renderCellContent = (row: any, col: TableColumn) => {
    // Get value using dot notation for nested properties
    const value = getNestedValue(row, col.key);
    
    // If column has custom render function, use it
    if (col.render) {
      return col.render(value, row);
    }
    
    // Handle different column types
    switch (col.type) {
      case 'badge':
        return (
          <Badge className={cn("capitalize", statusColors[value])}>
            {value}
          </Badge>
        );
        
      case 'image':
        if (!value) {
          return <div className="text-center text-gray-400">{t("No image")}</div>;
        }
        return (
          <div className="flex justify-center">
            <img 
              src={value.startsWith && value.startsWith('http') 
                ? value 
                : `/storage/${value}`} 
              alt={row.name || 'Image'} 
              className={col.className || "h-16 w-20 rounded-md object-cover shadow-sm"} 
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/200x150?text=Image+Not+Found';
              }}
            />
          </div>
        );
        
      case 'date':
        return value ? <span className="text-sm">{new Date(value).toLocaleDateString()}</span> : <span>-</span>;
        
      case 'currency':
        return <span className="text-sm">{typeof value === 'number' ? 
          value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 
          value}</span>;
          
      case 'boolean':
        return <span className="text-sm">{value ? 'Yes' : 'No'}</span>;
        
      case 'link':
        if (!value) return <span>-</span>;
        
        const href = col.href 
          ? (typeof col.href === 'function' ? col.href(row) : col.href.replace(':id', row.id))
          : '#';
          
        return (
          <Link 
            href={href} 
            className={col.linkClassName || "text-blue-600 hover:underline"}
            target={col.openInNewTab ? '_blank' : undefined}
          >
            {value}
          </Link>
        );
        
      default:
        return <span className="text-sm font-medium">{value || '-'}</span>;
    }
  };

  return (
    <div className="border-collapse">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="w-12 py-2.5 font-semibold">#</TableHead>
            {columns.map((column) => (
              <TableHead 
                key={column.key}
                className={cn(
                  "py-2.5 font-semibold",
                  column.sortable && "cursor-pointer select-none",
                  column.className
                )}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center">
                  {column.label}
                  {renderSortIcon(column)}
                </div>
              </TableHead>
            ))}
            {hasAnyVisibleActions && (
              <TableHead className="w-24 py-2.5 font-semibold text-right">{t("Actions")}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow key={row.id || index} className="hover:bg-gray-50 border-b">
                <TableCell className="font-medium py-2.5">{from + index}</TableCell>
                {columns.map((col) => (
                  <TableCell 
                    key={col.key}
                    className={cn(
                      "py-2.5",
                      col.className
                    )}
                  >
                    {renderCellContent(row, col)}
                  </TableCell>
                ))}
                {hasAnyVisibleActions && (
                  <TableCell className="py-2.5 text-right">
                    {renderActionButtons(row)}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={columns.length + (hasAnyVisibleActions ? 2 : 1)} 
                className="h-24 text-center text-muted-foreground"
              >
                {t("No results found.")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}