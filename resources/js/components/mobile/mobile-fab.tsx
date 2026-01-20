import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface MobileFABProps {
    className?: string;
}

interface FABAction {
    text: string;
    key: string;
    onClick: () => void;
    icon?: any;
}

export function MobileFAB({ className }: MobileFABProps) {
    const { t } = useTranslation();
    const { url } = usePage();
    const [visible, setVisible] = useState(false);

    // Determine available actions based on current page
    const getActions = (): FABAction[] => {
        const path = url.split('?')[0];

        if (path.startsWith('/products')) {
            return [
                {
                    text: t('Add New Product'),
                    key: 'add-product',
                    onClick: () => {
                        router.visit('/products/create');
                        setVisible(false);
                    },
                },
                {
                    text: t('Import Products'),
                    key: 'import-products',
                    onClick: () => {
                        router.visit('/products/import');
                        setVisible(false);
                    },
                },
                {
                    text: t('Scan Barcode'),
                    key: 'scan-barcode',
                    onClick: () => {
                        console.log('Scan barcode');
                        setVisible(false);
                    },
                },
            ];
        }

        if (path.startsWith('/orders')) {
            return [
                {
                    text: t('Create New Order'),
                    key: 'create-order',
                    onClick: () => {
                        router.visit('/pos');
                        setVisible(false);
                    },
                },
                {
                    text: t('Quick Order'),
                    key: 'quick-order',
                    onClick: () => {
                        console.log('Quick order');
                        setVisible(false);
                    },
                },
            ];
        }

        if (path.startsWith('/customers')) {
            return [
                {
                    text: t('Add New Customer'),
                    key: 'add-customer',
                    onClick: () => {
                        router.visit('/customers/create');
                        setVisible(false);
                    },
                },
                {
                    text: t('Import Customers'),
                    key: 'import-customers',
                    onClick: () => {
                        router.visit('/customers/import');
                        setVisible(false);
                    },
                },
            ];
        }

        if (path.startsWith('/coupons')) {
            return [
                {
                    text: t('Create Coupon'),
                    key: 'create-coupon',
                    onClick: () => {
                        router.visit('/coupons/create');
                        setVisible(false);
                    },
                },
            ];
        }

        if (path.startsWith('/blog')) {
            return [
                {
                    text: t('New Blog Post'),
                    key: 'create-post',
                    onClick: () => {
                        router.visit('/blog/create');
                        setVisible(false);
                    },
                },
            ];
        }

        // Default actions
        return [
            {
                text: t('Add Product'),
                key: 'add-product',
                onClick: () => {
                    router.visit('/products/create');
                    setVisible(false);
                },
            },
            {
                text: t('Create Order'),
                key: 'create-order',
                onClick: () => {
                    router.visit('/pos');
                    setVisible(false);
                },
            },
            {
                text: t('Add Customer'),
                key: 'add-customer',
                onClick: () => {
                    router.visit('/customers/create');
                    setVisible(false);
                },
            },
        ];
    };

    const actions = getActions();

    if (actions.length === 0) {
        return null;
    }

    return (
        <>
            {/* Custom Floating Button */}
            <button
                onClick={() => setVisible(true)}
                className={cn(
                    "fixed right-4 bottom-20 z-40 w-14 h-14 rounded-2xl bg-slate-900 text-white shadow-2xl shadow-slate-900/20 flex items-center justify-center transition-all active:scale-90 touch-manipulation",
                    className
                )}
            >
                <Plus size={32} strokeWidth={2.5} />
            </button>

            {/* Actions Sheet */}
            <Sheet open={visible} onOpenChange={setVisible}>
                <SheetContent side="bottom" className="rounded-t-[32px] p-0 border-none">
                    <div className="p-6 pb-4">
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6" />
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-black text-slate-900">{t('Quick Actions')}</h2>
                            <button
                                onClick={() => setVisible(false)}
                                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-2 pb-8">
                            {actions.map((action) => (
                                <button
                                    key={action.key}
                                    onClick={action.onClick}
                                    className="w-full p-5 rounded-2xl text-left font-bold text-slate-700 bg-slate-50 active:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-between"
                                >
                                    <span>{action.text}</span>
                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                        <Plus size={16} className="text-slate-400" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}

export default MobileFAB;
