import { LucideIcon } from 'lucide-react';

export interface SharedData {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    stores?: {
        id: string;
        name: string;
        slug: string;
        theme: string;
    }[];
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon;
    permission?: string;
    children?: NavItem[];
    target?: string;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface PageAction {
    label: string;
    icon: React.ReactNode;
    variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onClick: () => void;
}