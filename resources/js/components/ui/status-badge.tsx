import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'completed' | 'processing' | 'shipped' | 'cancelled' | 'pending' | 'approved' | 'failed' | 'active' | 'inactive';

interface StatusBadgeProps {
    status: string | StatusType;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase();

    const getStatusClass = () => {
        switch (normalizedStatus) {
            case 'completed':
            case 'approved':
            case 'active':
                return 'ds-badge-success';
            case 'processing':
            case 'pending':
            case 'shipped':
                return 'ds-badge-warning';
            case 'cancelled':
            case 'failed':
            case 'inactive':
                return 'ds-badge-danger';
            default:
                return 'ds-badge-info';
        }
    };

    return (
        <div className={cn('ds-badge', getStatusClass(), className)}>
            {status}
        </div>
    );
}
