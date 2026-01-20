import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, ShoppingCart, User, Folder, Building2, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/helpers';
import { getImageUrl } from '@/utils/image-helper';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchResult {
    products?: any[];
    orders?: any[];
    customers?: any[];
    categories?: any[];
    companies?: any[];
}

export function GlobalSearch({ className }: { className?: string }) {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult>({});
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search
    useEffect(() => {
        if (query.length < 2) {
            setResults({});
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setResults(data);
                setIsOpen(true);
                setSelectedIndex(0);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Flatten results for keyboard navigation
    const flatResults = [
        ...(results.products || []).map((item) => ({ ...item, type: 'product' })),
        ...(results.orders || []).map((item) => ({ ...item, type: 'order' })),
        ...(results.customers || []).map((item) => ({ ...item, type: 'customer' })),
        ...(results.categories || []).map((item) => ({ ...item, type: 'category' })),
        ...(results.companies || []).map((item) => ({ ...item, type: 'company' })),
    ];

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || flatResults.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % flatResults.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (flatResults[selectedIndex]) {
                    router.visit(flatResults[selectedIndex].url);
                    setIsOpen(false);
                    setQuery('');
                }
                break;
            case 'Escape':
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    const handleResultClick = (url: string) => {
        router.visit(url);
        setIsOpen(false);
        setQuery('');
    };

    const isMobile = useIsMobile();
    const hasResults = Object.values(results).some((arr) => arr && arr.length > 0);

    const SearchInput = ({ isMobileView = false }: { isMobileView?: boolean }) => (
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
                ref={isMobileView ? null : inputRef}
                type="text"
                autoFocus={isMobileView}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('Search everything...')}
                className={cn(
                    "pl-10 pr-10 py-2 bg-slate-50 border-none rounded-full text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/20",
                    isMobileView ? "w-full text-base h-12 bg-slate-100" : "w-72"
                )}
            />
            {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
            )}
        </div>
    );
    const SearchResultsListing = () => (
        <div className={cn("p-2", isMobile && "px-0 pb-20")}>
            {/* Products */}
            {results.products && results.products.length > 0 && (
                <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>{t('Products')} ({results.products.length})</span>
                    </div>
                    {results.products.slice(0, 5).map((product, index) => {
                        const globalIndex = flatResults.findIndex((r) => r.type === 'product' && r.id === product.id);
                        return (
                            <button
                                key={product.id}
                                onClick={() => handleResultClick(product.url)}
                                className={cn(
                                    'w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left',
                                    globalIndex === selectedIndex && 'bg-primary/10'
                                )}
                            >
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    {product.image ? (
                                        <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <Package className="h-5 w-5 text-slate-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-900 truncate">{product.name}</p>
                                    <p className="text-xs text-slate-500">{product.sku}</p>
                                </div>
                                <div className="text-sm font-bold text-primary truncate">{formatCurrency(product.price)}</div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Orders */}
            {results.orders && results.orders.length > 0 && (
                <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {t('Orders')} ({results.orders.length})
                    </div>
                    {results.orders.slice(0, 5).map((order) => {
                        const globalIndex = flatResults.findIndex((r) => r.type === 'order' && r.id === order.id);
                        return (
                            <button
                                key={order.id}
                                onClick={() => handleResultClick(order.url)}
                                className={cn(
                                    'w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left',
                                    globalIndex === selectedIndex && 'bg-indigo-50'
                                )}
                            >
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-900">{order.order_number}</p>
                                    <p className="text-xs text-slate-500 truncate">{order.customer_name}</p>
                                </div>
                                <div className="text-sm font-bold text-slate-900">{formatCurrency(order.total)}</div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Customers */}
            {results.customers && results.customers.length > 0 && (
                <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {t('Customers')} ({results.customers.length})
                    </div>
                    {results.customers.slice(0, 5).map((customer) => {
                        const globalIndex = flatResults.findIndex((r) => r.type === 'customer' && r.id === customer.id);
                        return (
                            <button
                                key={customer.id}
                                onClick={() => handleResultClick(customer.url)}
                                className={cn(
                                    'w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left',
                                    globalIndex === selectedIndex && 'bg-primary/10'
                                )}
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-900 truncate">{customer.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{customer.email}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Categories */}
            {results.categories && results.categories.length > 0 && (
                <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {t('Categories')} ({results.categories.length})
                    </div>
                    {results.categories.slice(0, 5).map((category) => {
                        const globalIndex = flatResults.findIndex((r) => r.type === 'category' && r.id === category.id);
                        return (
                            <button
                                key={category.id}
                                onClick={() => handleResultClick(category.url)}
                                className={cn(
                                    'w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left',
                                    globalIndex === selectedIndex && 'bg-primary/10'
                                )}
                            >
                                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                                    <Folder className="h-5 w-5 text-amber-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-900 truncate">{category.name}</p>
                                    <p className="text-xs text-slate-500">/{category.slug}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Companies */}
            {results.companies && results.companies.length > 0 && (
                <div className="mb-2">
                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {t('Companies')} ({results.companies.length})
                    </div>
                    {results.companies.slice(0, 5).map((company) => {
                        const globalIndex = flatResults.findIndex((r) => r.type === 'company' && r.id === company.id);
                        return (
                            <button
                                key={company.id}
                                onClick={() => handleResultClick(company.url)}
                                className={cn(
                                    'w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left',
                                    globalIndex === selectedIndex && 'bg-primary/10'
                                )}
                            >
                                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-900 truncate">{company.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{company.email}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );

    return (
        <div ref={searchRef} className={cn('relative', className)}>
            {/* Desktop View */}
            <div className="hidden lg:block">
                <SearchInput />

                {isOpen && query.length >= 2 && (
                    <div className="absolute top-full mt-2 w-[500px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[600px] overflow-y-auto z-50">
                        {hasResults ? (
                            <SearchResultsListing />
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                <Search className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                                {t('No results found for')} "{query}"
                            </div>
                        )}
                        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl text-xs text-slate-500">
                            {t('Use ↑↓ to navigate, Enter to select, Esc to close')}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="nav-icon">
                            <Search size={20} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[90vh] rounded-t-[32px] p-0 overflow-hidden border-none shadow-2xl">
                        <SheetDescription className="sr-only">Search for products, orders, and more</SheetDescription>
                        <SheetTitle className="sr-only">{t('Search')}</SheetTitle>
                        <SheetHeader className="p-6 pb-2 border-b border-slate-50">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-slate-900">{t('Search')}</span>
                            </div>
                            <div className="mt-4">
                                <SearchInput isMobileView={true} />
                            </div>
                        </SheetHeader>
                        <div className="h-full overflow-y-auto p-4 bg-white">
                            {query.length >= 2 ? (
                                hasResults ? (
                                    <SearchResultsListing />
                                ) : !isLoading && (
                                    <div className="p-12 text-center text-slate-500">
                                        <Search className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                                        <p>{t('No results found for')} "{query}"</p>
                                    </div>
                                )
                            ) : (
                                <div className="p-12 text-center">
                                    <Search className="h-16 w-16 mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-400 text-sm">{t('Search for products, orders, customers...')}</p>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
