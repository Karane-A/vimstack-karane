export default function AppLogo({ position }: { position?: 'left' | 'right' }) {
    const logoPath = '/storage/media/15/vimstack-logo.jpg';
    const appTitle = 'Vimstack';

    return (
        <div className={`flex items-center ${position === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
            <img
                src={logoPath}
                alt={appTitle}
                className="h-2.5 w-auto md:h-5 object-contain"
            />
        </div>
    );
}
