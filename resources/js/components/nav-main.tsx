import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Store expanded menu state in localStorage
const STORAGE_KEY = 'nav_expanded_items';

export function NavMain({ items = [], position }: { items: NavItem[]; position: 'left' | 'right' }) {
    const page = usePage();
    const { state } = useSidebar();
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    
    // Reset and update expanded state when URL changes
    useEffect(() => {
        // Start with a clean slate - close all menus
        const newExpandedItems: Record<string, boolean> = {};
        
        // Only expand menus that contain the active page
        const expandActiveMenus = (menuItems: NavItem[], parentKey?: string) => {
            menuItems.forEach(item => {
                // If this is the active item or contains the active item
                const isItemActive = isActive(item.href);
                const hasActiveChild = item.children && isChildActive(item.children);
                
                // If this item or its children are active, expand it
                if (parentKey && (isItemActive || hasActiveChild)) {
                    newExpandedItems[parentKey] = true;
                }
                
                // If this item has children and is active, expand it
                if (item.children && (isItemActive || hasActiveChild)) {
                    newExpandedItems[item.title] = true;
                    
                    // Recursively check children
                    expandActiveMenus(item.children, item.title);
                }
                
                // Check nested children with their own keys
                if (item.children) {
                    checkNestedChildren(item.children, 1, newExpandedItems);
                }
            });
        };
        
        expandActiveMenus(items);
        
        // Update state and save to localStorage
        setExpandedItems(newExpandedItems);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpandedItems));
        } catch (e) {
            console.error('Error saving navigation state:', e);
        }
    }, [page.url]); // Re-run when URL changes
    
    // Helper function to check nested children for active items
    const checkNestedChildren = (
        children: NavItem[], 
        level: number, 
        newExpandedItems: Record<string, boolean>
    ) => {
        children.forEach(child => {
            const childKey = `${level}-${child.title}`;
            const isChildItemActive = isActive(child.href);
            const hasActiveChild = child.children && isChildActive(child.children);
            
            if (child.children && (isChildItemActive || hasActiveChild)) {
                newExpandedItems[childKey] = true;
                checkNestedChildren(child.children, level + 1, newExpandedItems);
            }
        });
    };
    
    const toggleExpand = (title: string) => {
        const newExpandedItems = {
            ...expandedItems,
            [title]: !expandedItems[title]
        };
        
        setExpandedItems(newExpandedItems);
        
        // Save to localStorage
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpandedItems));
        } catch (e) {
            console.error('Error saving navigation state:', e);
        }
    };
    
    const isActive = (href?: string) => {
        if (!href) return false;
        
        // Extract pathname from href if it's a full URL
        const hrefPath = href.startsWith('http') ? new URL(href).pathname : href;
        const currentPath = page.url;
        
        // Exact match
        if (currentPath === hrefPath) return true;
        
        // Special case: prevent /stores from being active when on /stores/content
        if (hrefPath.includes('/stores') && !hrefPath.includes('/stores/content') && currentPath.includes('/stores/content')) {
            return false;
        }
        
        // Check if current path starts with href path followed by a slash
        const active = currentPath.startsWith(hrefPath + '/');
        return active;
    };
    
    const isChildActive = (children?: NavItem[]) => {
        if (!children) return false;
        return children.some(child => isActive(child.href) || isChildActive(child.children));
    };
    
    const renderSubMenu = (children: NavItem[], level: number = 1) => {
        return (
            <SidebarMenuSub>
                {children.map(child => (
                    <div key={child.title}>
                        {child.children ? (
                            // Nested submenu item with children
                            <>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton 
                                        isActive={isChildActive(child.children)}
                                        onClick={() => toggleExpand(`${level}-${child.title}`)}
                                    >
                                        <div className={`flex items-center gap-2 ${position === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}>
                                            <span>{child.title}</span>
                                            {state !== "collapsed" && (
                                                expandedItems[`${level}-${child.title}`] ? 
                                                    <ChevronDown className="h-3 w-3 ml-auto" /> : 
                                                    <ChevronRight className="h-3 w-3 ml-auto" />
                                            )}
                                        </div>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                
                                {/* Render nested children */}
                                {expandedItems[`${level}-${child.title}`] && renderSubMenu(child.children, level + 1)}
                            </>
                        ) : (
                            // Regular submenu item
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild isActive={isActive(child.href)}>
                                    <Link
                                        href={child.href || '#'}
                                        prefetch
                                        target={child.target}
                                        className={`flex items-center gap-2 ${position === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}
                                    >
                                        <span>{child.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        )}
                    </div>
                ))}
            </SidebarMenuSub>
        );
    };
    
    return (
        <SidebarGroup className="px-1.5 py-0">
            <SidebarGroupLabel className={`flex w-full text-xs ${position === 'right' ? 'justify-end' : 'justify-start'}`}>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <div key={item.title}>
                        {item.children ? (
                            // Parent item with children
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        isActive={isChildActive(item.children)} 
                                        tooltip={{ children: item.title }}
                                        onClick={() => toggleExpand(item.title)}
                                    >
                                        <div className={`flex items-center gap-2 w-full ${position === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}>
                                            {position === 'right' ? (
                                                <>
                                                    <span>{state !== "collapsed" ? item.title : ""}</span>
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                    {state !== "collapsed" && (
                                                        expandedItems[item.title] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                    {state !== "collapsed" && <span>{item.title}</span>}
                                                    {state !== "collapsed" && (
                                                        expandedItems[item.title] ? <ChevronDown className="h-3 w-3 ml-auto" /> : <ChevronRight className="h-3 w-3 ml-auto" />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                
                                {/* Child items */}
                                {state !== "collapsed" && expandedItems[item.title] && renderSubMenu(item.children)}
                            </>
                        ) : (
                            // Regular item without children
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{ children: item.title }}>
                                    {item.target === '_blank' ? (
                                        <a
                                            href={item.href || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 ${position === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}
                                        >
                                            {position === 'right' ? (
                                                <>
                                                    {state !== "collapsed" && <span>{item.title}</span>}
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                </>
                                            ) : (
                                                <>
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                    {state !== "collapsed" && <span>{item.title}</span>}
                                                </>
                                            )}
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.href || '#'}
                                            prefetch
                                            className={`flex items-center gap-2 ${position === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}
                                        >
                                            {position === 'right' ? (
                                                <>
                                                    {state !== "collapsed" && <span>{item.title}</span>}
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                </>
                                            ) : (
                                                <>
                                                    {item.icon && <item.icon className="h-4 w-4" />}
                                                    {state !== "collapsed" && <span>{item.title}</span>}
                                                </>
                                            )}
                                        </Link>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </div>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}