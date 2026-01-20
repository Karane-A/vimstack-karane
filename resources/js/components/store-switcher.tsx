import React, { useState } from 'react';
import { Check, ChevronsUpDown, Store, PlusCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: {
    id: string;
    name: string;
  }[];
  currentStore?: {
    id: string;
    name: string;
  };
  isIconOnly?: boolean;
}

export function StoreSwitcher({
  className,
  items = [],
  currentStore,
  isIconOnly = false
}: StoreSwitcherProps) {
  const { t } = useTranslation();
  const { auth } = usePage().props as any;
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const formattedItems = items.map((item) => ({
    id: String(item.id),
    name: item.name,
  }));

  const currentStoreItem = currentStore || formattedItems[0];

  // Check if user has permission to switch stores
  const canSwitchStores = auth.user.type === 'company' || (auth.permissions && auth.permissions.includes('switch-stores'));

  // If user can't switch stores, show only current store name
  if (!canSwitchStores) {
    return (
      <div className={cn("w-[180px] px-3 py-2 text-sm font-medium text-muted-foreground border rounded-md", className)}>
        <Store className="mr-2 h-4 w-4 inline" />
        <span className="truncate">{currentStoreItem?.name || 'No Store'}</span>
      </div>
    );
  }

  const onStoreSelect = (store: { id: string, name: string }) => {
    if (String(currentStoreItem?.id) === String(store.id)) {
      setOpen(false);
      return;
    }

    setIsLoading(true);
    setOpen(false);

    // Use Inertia.js router to submit the form
    router.post(route('switch-store'), {
      store_id: store.id
    }, {
      onSuccess: () => {
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      }
    });
  };

  // Filter stores based on search query
  const filteredItems = searchQuery
    ? formattedItems.filter(store =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : formattedItems;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          aria-label={t('Select a store')}
          className={cn(
            isIconOnly ? "h-9 w-9 p-0 rounded-xl" : "w-[180px] justify-between font-medium",
            className
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className={cn("h-4 w-4 animate-spin", !isIconOnly && "mr-2")} />
          ) : (
            <Store className={cn("h-4 w-4", !isIconOnly && "mr-2")} />
          )}
          {!isIconOnly && (
            <>
              <span className="truncate">{currentStoreItem?.name || t('Select store')}</span>
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-2 shadow-lg border-gray-200" align="end">
        {/* Search input */}
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
          <Store className="mr-2 h-4 w-4 opacity-50" />
          <input
            type="text"
            placeholder={t('Search store...')}
            className="flex h-9 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-gray-400 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Store list */}
        <div className="max-h-[300px] overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">
              {t('No store found.')}
            </div>
          ) : (
            <>
              <p className="px-1 py-1 text-xs font-medium text-gray-500">{t('Your Stores')}</p>
              {filteredItems.map((store) => (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => onStoreSelect(store)}
                  className="flex w-full items-center text-sm cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-2 my-1"
                >
                  <Store className="mr-2 h-4 w-4" />
                  <span className="flex-grow text-left">{store.name}</span>
                  {String(currentStoreItem?.id) === String(store.id) && (
                    <Check className="ml-2 h-4 w-4" />
                  )}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Create new store link */}
        {(auth.user.type === 'company' || (auth.permissions && auth.permissions.includes('create-stores'))) && (
          <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
            <Link
              href={route('stores.create')}
              className="flex w-full items-center px-2 py-2 text-sm cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-primary dark:text-primary/80"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('Create New Store')}
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}