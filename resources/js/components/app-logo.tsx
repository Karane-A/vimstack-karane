export default function AppLogo({ position }: { position: 'left' | 'right' }) {
    const logoPath = '/storage/media/15/vimstack-logo.jpg';
    const appTitle = 'Vimstack';
    
    return (
        <div className={`w-full flex items-center gap-2 ${position === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
            <img 
                src={logoPath} 
                alt={appTitle} 
                className="h-8 w-8 object-contain rounded-md"
            />
            <div className={`grid flex-1 truncate text-sm leading-none font-semibold ${position === 'right' ? 'text-right' : 'text-left'}`}>
                {appTitle}
            </div>
        </div>
    );
}
