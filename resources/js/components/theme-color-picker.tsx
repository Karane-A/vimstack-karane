import { ThemeColor, THEME_COLORS, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Check, Palette } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function ThemeColorPicker() {
    const { t } = useTranslation();
    const { themeColor, customColor, updateThemeColor, updateCustomColor } = useAppearance();
    const colorInputRef = useRef<HTMLInputElement>(null);
    
    const handleColorClick = (color: ThemeColor) => {
        updateThemeColor(color);
    };
    
    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateCustomColor(e.target.value);
    };
    
    const handleCustomColorClick = () => {
        colorInputRef.current?.click();
    };
    
    // Close color picker when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            // This is handled by the browser's color picker
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="space-y-4">
            <div className="text-sm font-medium">{t("Theme Color")}</div>
            <div className="flex flex-wrap gap-3">
                {Object.entries(THEME_COLORS).map(([name, hex]) => (
                    <button
                        key={name}
                        onClick={() => handleColorClick(name as ThemeColor)}
                        className={cn(
                            'relative h-8 w-8 rounded-full transition-all',
                            themeColor === name ? 'ring-2 ring-offset-2' : 'hover:scale-110'
                        )}
                        style={{ backgroundColor: hex }}
                        title={name.charAt(0).toUpperCase() + name.slice(1)}
                    >
                        {themeColor === name && (
                            <Check className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white" />
                        )}
                    </button>
                ))}
                
                {/* Custom color picker */}
                <button
                    onClick={handleCustomColorClick}
                    className={cn(
                        'relative h-8 w-8 rounded-full transition-all',
                        themeColor === 'custom' ? 'ring-2 ring-offset-2' : 'hover:scale-110'
                    )}
                    style={{ backgroundColor: customColor }}
                    title="Custom color"
                >
                    {themeColor === 'custom' ? (
                        <Check className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white" />
                    ) : (
                        <Palette className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-white" />
                    )}
                    <input
                        ref={colorInputRef}
                        type="color"
                        value={customColor}
                        onChange={handleCustomColorChange}
                        className="absolute h-0 w-0 opacity-0"
                    />
                </button>
            </div>
            
            {themeColor === 'custom' && (
                <div className="flex items-center gap-2">
                    <div className="text-sm">{t("Custom color")}:</div>
                    <div className="flex items-center rounded border px-2 py-1">
                        <div 
                            className="mr-2 h-4 w-4 rounded-full" 
                            style={{ backgroundColor: customColor }}
                        />
                        <span className="text-xs">{customColor}</span>
                    </div>
                    <button
                        onClick={handleCustomColorClick}
                        className="rounded bg-neutral-100 px-2 py-1 text-xs hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                    >
                        {t("Change")}
                    </button>
                </div>
            )}
        </div>
    );
}