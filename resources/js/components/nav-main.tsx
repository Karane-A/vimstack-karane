import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [], position }: { items: NavItem[]; position: 'left' | 'right' }) {
    const page = usePage();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpand = (title: string) => {
        setExpandedItems(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    const isActive = (href?: string) => {
        if (!href) return false;
        const hrefPath = href.startsWith('http') ? new URL(href).pathname : href;
        const currentPath = page.url;
        if (currentPath === hrefPath) return true;
        return currentPath.startsWith(hrefPath + '/');
    };

    const isParentActive = (item: NavItem) => {
        if (item.href && isActive(item.href)) return true;
        return item.children?.some(child => child.href && isActive(child.href));
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            {items.map((item: NavItem) => {
                if (item.isLabel) return null; // Remove categorization labels

                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItems.includes(item.title) || isParentActive(item);

                return (
                    <div key={item.title} className="flex flex-col gap-1">
                        {hasChildren ? (
                            <div
                                onClick={() => toggleExpand(item.title)}
                                className={`ds-nav-item w-full cursor-pointer flex items-center justify-between group ${isParentActive(item) ? 'ds-nav-item-active' : ''}`}
                            >
                                <div className="flex items-center gap-2">
                                    {item.icon && <item.icon size={18} strokeWidth={isParentActive(item) ? 2 : 1.5} />}
                                    <span>{item.title}</span>
                                </div>
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </div>
                        ) : (
                            <Link
                                href={item.href || '#'}
                                className={`ds-nav-item w-full ${isActive(item.href) ? 'ds-nav-item-active' : ''}`}
                            >
                                {item.icon && <item.icon size={18} strokeWidth={isActive(item.href) ? 2 : 1.5} />}
                                <span>{item.title}</span>
                            </Link>
                        )}

                        {hasChildren && isExpanded && (
                            <div className="flex flex-col gap-1 ml-6 pl-4 border-l border-slate-100">
                                {item.children?.map((child) => (
                                    <Link
                                        key={child.title}
                                        href={child.href || '#'}
                                        className={`ds-nav-item-sub w-full py-1.5 px-3 rounded-lg text-sm text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-all ${isActive(child.href) ? 'font-bold text-indigo-600 bg-indigo-50/50' : ''}`}
                                    >
                                        <span>{child.title}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}