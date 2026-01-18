import { ActionSheet, FloatingBubble } from 'antd-mobile';
import { Action } from 'antd-mobile/es/components/action-sheet';
import { AddOutline } from 'antd-mobile-icons';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface MobileFABProps {
    className?: string;
}

export function MobileFAB({ className }: MobileFABProps) {
    const { url } = usePage();
    const [visible, setVisible] = useState(false);

    // Determine available actions based on current page
    const getActions = (): Action[] => {
        const path = url.split('?')[0];

        if (path.startsWith('/products')) {
            return [
                {
                    text: 'Add New Product',
                    key: 'add-product',
                    onClick: () => {
                        router.visit('/products/create');
                        setVisible(false);
                    },
                },
                {
                    text: 'Import Products',
                    key: 'import-products',
                    onClick: () => {
                        router.visit('/products/import');
                        setVisible(false);
                    },
                },
                {
                    text: 'Scan Barcode',
                    key: 'scan-barcode',
                    onClick: () => {
                        // TODO: Implement barcode scanning
                        console.log('Scan barcode');
                        setVisible(false);
                    },
                },
            ];
        }

        if (path.startsWith('/orders')) {
            return [
                {
                    text: 'Create New Order',
                    key: 'create-order',
                    onClick: () => {
                        router.visit('/pos');
                        setVisible(false);
                    },
                },
                {
                    text: 'Quick Order',
                    key: 'quick-order',
                    onClick: () => {
                        // TODO: Implement quick order form
                        console.log('Quick order');
                        setVisible(false);
                    },
                },
            ];
        }

        if (path.startsWith('/customers')) {
            return [
                {
                    text: 'Add New Customer',
                    key: 'add-customer',
                    onClick: () => {
                        router.visit('/customers/create');
                        setVisible(false);
                    },
                },
                {
                    text: 'Import Customers',
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
                    text: 'Create Coupon',
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
                    text: 'New Blog Post',
                    key: 'create-post',
                    onClick: () => {
                        router.visit('/blog/create');
                        setVisible(false);
                    },
                },
            ];
        }

        // Default actions for dashboard or other pages
        return [
            {
                text: 'Add Product',
                key: 'add-product',
                onClick: () => {
                    router.visit('/products/create');
                    setVisible(false);
                },
            },
            {
                text: 'Create Order',
                key: 'create-order',
                onClick: () => {
                    router.visit('/pos');
                    setVisible(false);
                },
            },
            {
                text: 'Add Customer',
                key: 'add-customer',
                onClick: () => {
                    router.visit('/customers/create');
                    setVisible(false);
                },
            },
        ];
    };

    const actions = getActions();

    // Don't show FAB if there are no actions
    if (actions.length === 0) {
        return null;
    }

    return (
        <>
            <FloatingBubble
                className={className}
                style={{
                    '--initial-position-right': '16px',
                    '--initial-position-bottom': '80px',
                    '--edge-distance': '16px',
                    '--background': 'var(--theme-color, #1677ff)',
                }}
                onClick={() => setVisible(true)}
            >
                <AddOutline fontSize={32} color="white" />
            </FloatingBubble>

            <ActionSheet
                visible={visible}
                actions={actions}
                onClose={() => setVisible(false)}
                cancelText="Cancel"
            />
        </>
    );
}

export default MobileFAB;
