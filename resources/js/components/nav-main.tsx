import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useSidebar } from './ui/sidebar';

export function NavMain({ items = [], position }: { items: NavItem[]; position: 'left' | 'right' }) {
    const page = usePage();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const { state, isMobile } = useSidebar();
    const isCollapsed = state === 'collapsed' && !isMobile;

    const toggleExpand = (title: string) => {
        setExpandedItems(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    const isActive = (href?: string) => {
        if (!href) return false;
        try {
            const hrefPath = href.startsWith('http') ? new URL(href).pathname : href;
            const currentPath = page.url;
            if (currentPath === hrefPath) return true;
            return currentPath.startsWith(hrefPath + '/');
        } catch (e) {
            console.error('Invalid URL in NavMain:', href);
            return false;
        }
    };

    const isParentActive = (item: NavItem) => {
        if (item.href && isActive(item.href)) return true;
        return item.children?.some(child =>
            (child.href && isActive(child.href)) ||
            (child.children?.some(c => c.href && isActive(c.href)))
        ) ?? false;
    };

    const renderItem = (item: NavItem, isSubItem = false) => {
        if (!item) return null;

        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.title) || isParentActive(item);

        return (
            <div key={item.title} className="flex flex-col gap-1 w-full">
                {hasChildren ? (
                    <div
                        onClick={() => toggleExpand(item.title)}
                        className={`ds-nav-item w-full cursor-pointer flex items-center justify-between group ${isParentActive(item) ? 'ds-nav-item-active' : ''} ${isSubItem ? 'pl-9 text-sm' : ''}`}
                    >
                        <div className="flex items-center gap-2">
                            {item.icon && <item.icon size={18} strokeWidth={isParentActive(item) ? 2 : 1.5} />}
                            {!isCollapsed && <span className={isSubItem ? 'font-medium' : ''}>{item.title}</span>}
                        </div>
                        {!isCollapsed && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                    </div>
                ) : (
                    <Link
                        href={item.href || '#'}
                        className={`${isSubItem ? 'ds-nav-item-sub py-1.5 px-3 rounded-lg text-sm ml-6 pl-4' : 'ds-nav-item w-full'} ${isActive(item.href) ? 'ds-nav-item-active font-bold bg-primary/10 text-primary' : (isSubItem ? 'text-slate-500 hover:text-primary hover:bg-slate-50' : '')}`}
                    >
                        {item.icon && !isSubItem && <item.icon size={18} strokeWidth={isActive(item.href) ? 2 : 1.5} />}
                        {!isCollapsed && <span>{item.title}</span>}
                        {isCollapsed && isSubItem && <span className="sr-only">{item.title}</span>}
                    </Link>
                )}

                {hasChildren && isExpanded && !isCollapsed && (
                    <div className={`flex flex-col gap-1 ${isSubItem ? 'ml-4 border-l border-slate-50' : 'ml-6 pl-4 border-l border-slate-100'}`}>
                        {item.children?.map((child) => renderItem(child, true))}
                    </div>
                )}
            </div>
        );
    };


    if (!items || !Array.isArray(items)) return null;

    return (
        <div className="flex flex-col gap-1 w-full">
            {items.map((item: NavItem) => {
                if (!item) return null;

                // Render section label if specified
                if (item.isLabel) {
                    if (isCollapsed) {
                        return (
                            <div key={item.title} className="my-4 px-2">
                                <div className="h-px bg-slate-200 w-full" />
                                {item.children && (
                                    <div className="flex flex-col gap-1 mt-4">
                                        {item.children.map((child) => renderItem(child))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <div key={item.title} className="mt-6 mb-2 px-3">
                            <div className="flex items-center gap-2 mb-3">
                                {item.icon && <item.icon size={14} className="text-slate-400" />}
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                                    {item.title}
                                </h3>
                            </div>
                            {item.children && (
                                <div className="flex flex-col gap-1">
                                    {item.children.map((child) => renderItem(child))}
                                </div>
                            )}
                        </div>
                    );
                }

                return renderItem(item);
            })}
        </div>
    );
}