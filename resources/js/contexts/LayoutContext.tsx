import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type LayoutPosition = 'left' | 'right';

type LayoutContextType = {
    position: LayoutPosition;
    updatePosition: (val: LayoutPosition) => void;
    adminViewMode: 'admin' | 'company';
    toggleAdminViewMode: () => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
    const [position, setPosition] = useState<LayoutPosition>('left');
    const [adminViewMode, setAdminViewMode] = useState<'admin' | 'company'>(() => {
        const stored = localStorage.getItem('admin_view_mode');
        return (stored === 'admin' || stored === 'company') ? stored : 'admin';
    });

    useEffect(() => {
        const storedPosition = localStorage.getItem('layoutPosition') as LayoutPosition;

        if (storedPosition === 'left' || storedPosition === 'right') {
            setPosition(storedPosition);
        }
    }, []);

    const updatePosition = (val: LayoutPosition) => {
        setPosition(val);
        localStorage.setItem('layoutPosition', val);
    };

    const toggleAdminViewMode = () => {
        const newMode = adminViewMode === 'admin' ? 'company' : 'admin';
        setAdminViewMode(newMode);
        localStorage.setItem('admin_view_mode', newMode);
    };

    return (
        <LayoutContext.Provider value={{ position, updatePosition, adminViewMode, toggleAdminViewMode }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) throw new Error('useLayout must be used within LayoutProvider');
    return context;
};
