import { LoaderCircle } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    processing?: boolean;
    tabIndex?: number;
    children: React.ReactNode;
}

export default function AuthButton({ 
    processing = false, 
    tabIndex, 
    children, 
    className = '', 
    disabled, 
    ...props 
}: AuthButtonProps) {
    const { themeColor, customColor } = useBrand();
    const primaryColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
    return (
        <button 
            {...props}
            type={props.type || 'submit'} 
            className={`w-full text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ${className}`}
            tabIndex={tabIndex} 
            disabled={processing || disabled}
            style={{ backgroundColor: primaryColor }}
        >
            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2 inline" />}
            {children}
        </button>
    );
}