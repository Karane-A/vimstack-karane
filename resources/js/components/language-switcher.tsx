import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { hasRole } from '@/utils/authorization';

interface Language {
    code: string;
    name: string;
    countryCode: string;
}

// Import languages from the JSON file
import languageData from '@/../../resources/lang/language.json';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const { auth } = usePage().props as any;
    const currentLanguage = React.useMemo(() => 
        languageData.find(lang => lang.code === i18n.language) || languageData[0],
        [i18n.language]
    );

    const isAuthenticated = auth?.user;
    const userRoles = auth?.user?.roles?.map((role: any) => role.name) || [];
    const isSuperAdmin = isAuthenticated && hasRole('superadmin', userRoles);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-8 rounded-md">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium hidden md:inline-block">
                        {currentLanguage.name}
                    </span>
                    <ReactCountryFlag
                        countryCode={currentLanguage.countryCode}
                        svg
                        style={{
                            width: '1.2em',
                            height: '1.2em',
                        }}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuGroup>
                    {languageData.map((language) => (
                        <DropdownMenuItem
                            key={language.code}
                            onClick={() => {
                                i18n.changeLanguage(language.code);
                                // Save language preference to database
                                if (isAuthenticated) {
                                    router.post(route('user.language.update'), {
                                        language: language.code
                                    }, {
                                        preserveScroll: true,
                                        preserveState: true
                                    });
                                }
                            }}
                            className="flex items-center gap-2"
                        >
                            <ReactCountryFlag
                                countryCode={language.countryCode}
                                svg
                                style={{
                                    width: '1.2em',
                                    height: '1.2em',
                                }}
                            />
                            <span>{language.name}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                {isSuperAdmin && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="justify-center text-primary font-semibold cursor-pointer">
                            <a href={route('manage-language')} rel="noopener noreferrer">
                                Manage Language
                            </a>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}; 