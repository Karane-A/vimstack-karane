import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { Save, DollarSign, Check, Info } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { formatCompanyCurrency } from '@/utils/helpers';

interface CurrencyProps {
    id: number;
    name: string;
    code: string;
    symbol: string;
    description?: string;
    is_default: boolean;
}

export default function CurrencySettings() {
    const { t } = useTranslation();
    const { currencies = [], systemSettings = {} } = usePage().props as any;

    // Currency Settings form state
    const [currencySettings, setCurrencySettings] = useState({
        decimalFormat: systemSettings.decimalFormat || '2',
        defaultCurrency: systemSettings.defaultCurrency || 'USD',
        decimalSeparator: systemSettings.decimalSeparator || '.',
        thousandsSeparator: systemSettings.thousandsSeparator || ',',
        floatNumber: systemSettings.floatNumber === '0' ? false : true,
        currencySymbolSpace: systemSettings.currencySymbolSpace === '1',
        currencySymbolPosition: systemSettings.currencySymbolPosition || 'before',
        currencyName: ''
    });

    // Preview amount
    const [previewAmount, setPreviewAmount] = useState(1234.56);

    // Set currency name based on selected currency
    useEffect(() => {
        if (currencies && currencies.length > 0) {
            const selectedCurrency = currencies.find((c: CurrencyProps) => c.code === currencySettings.defaultCurrency);
            if (selectedCurrency) {
                setCurrencySettings(prev => ({
                    ...prev,
                    currencyName: selectedCurrency.name
                }));
            }
        }
    }, [currencies, currencySettings.defaultCurrency]);

    // Handle currency settings form changes
    const handleCurrencySettingsChange = (field: string, value: string | boolean) => {
        setCurrencySettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle currency selection change
    const handleCurrencyChange = (value: string) => {
        const selectedCurrency = currencies.find((c: CurrencyProps) => c.code === value);

        setCurrencySettings(prev => ({
            ...prev,
            defaultCurrency: value,
            currencyName: selectedCurrency?.name || value
        }));
    };

    // Format the preview amount using the same helper function used throughout the app
    const formattedPreview = () => {
        try {
            let amount = previewAmount;
            
            // Handle float number setting
            if (!currencySettings.floatNumber) {
                amount = Math.floor(amount);
            }
            
            // Create mock page props with current settings for preview
            const mockPageProps = {
                settings: {
                    decimalFormat: currencySettings.decimalFormat,
                    decimalSeparator: currencySettings.decimalSeparator,
                    thousandsSeparator: currencySettings.thousandsSeparator,
                    currencySymbolSpace: currencySettings.currencySymbolSpace,
                    currencySymbolPosition: currencySettings.currencySymbolPosition
                },
                storeCurrency: {
                    symbol: currencies.find((c: CurrencyProps) => c.code === currencySettings.defaultCurrency)?.symbol || '$'
                }
            };
            
            return formatCompanyCurrency(amount, mockPageProps);
        } catch (error) {
            return 'Invalid format';
        }
    };

    // Handle currency settings form submission
    const submitCurrencySettings = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(route('settings.currency.update'), currencySettings, {
            preserveScroll: true,
            onError: (errors) => {
                const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to update currency settings');
                toast.error(errorMessage);
            }
        });
    };

    return (
        <SettingsSection
            title={t("Currency Settings")}
            description={t("Configure how currency values are displayed throughout the application")}
            action={
                <Button type="submit" form="currency-settings-form" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    {t("Save Changes")}
                </Button>
            }
        >
            <form id="currency-settings-form" onSubmit={submitCurrencySettings}>
                <div className="grid grid-cols-1 gap-6">
                    {/* Format Settings with Live Preview */}
                    <div>
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        <h3 className="text-base font-medium">{t("Format Options")}</h3>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Live Preview Section */}
                                    <div className="p-4 bg-muted/30 rounded-md border flex flex-col md:flex-row items-center justify-between">
                                        <div className="flex flex-col items-center md:items-start mb-3 md:mb-0">
                                            <div className="text-2xl font-semibold mb-1">
                                                {formattedPreview()}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {currencySettings.currencyName} ({currencySettings.defaultCurrency})
                                            </div>
                                        </div>
                                        <div className="w-full md:w-auto md:max-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    className="text-right h-8 text-sm"
                                                    value={previewAmount}
                                                    onChange={(e) => setPreviewAmount(parseFloat(e.target.value) || 0)}
                                                    placeholder="Test amount"
                                                />
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setPreviewAmount(1234.56)}
                                                    type="button"
                                                    size="sm"
                                                    className="h-8 text-xs"
                                                >
                                                    Reset
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Format Options */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="defaultCurrency" className="font-medium">{t("Default Currency")}</Label>
                                                <Badge variant="outline" className="font-mono">
                                                    {currencySettings.defaultCurrency}
                                                </Badge>
                                            </div>
                                            <Select
                                                value={currencySettings.defaultCurrency}
                                                onValueChange={handleCurrencyChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t("Select currency")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <div className="max-h-[300px] overflow-y-auto">
                                                        {currencies && currencies.length > 0 ? (
                                                            currencies.map((currency: CurrencyProps) => (
                                                                <SelectItem key={currency.id} value={currency.code}>
                                                                    <div className="flex items-center">
                                                                        <span className="w-8 text-center">{currency.symbol}</span>
                                                                        <span>{currency.code} - {currency.name}</span>
                                                                        {currency.is_default && (
                                                                            <span className="ml-2 text-xs text-primary">(Default)</span>
                                                                        )}
                                                                    </div>
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <div className="p-2 text-center text-muted-foreground">
                                                                {t("No currencies found")}
                                                            </div>
                                                        )}
                                                    </div>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="decimalFormat" className="font-medium">{t("Decimal Places")}</Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="h-4 w-4 text-muted-foreground" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{t("Number of digits after decimal point")}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Select
                                                value={currencySettings.decimalFormat}
                                                onValueChange={(value) => handleCurrencySettingsChange('decimalFormat', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select decimal format" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">0 (e.g., 1234)</SelectItem>
                                                    <SelectItem value="1">1 (e.g., 1234.5)</SelectItem>
                                                    <SelectItem value="2">2 (e.g., 1234.56)</SelectItem>
                                                    <SelectItem value="3">3 (e.g., 1234.567)</SelectItem>
                                                    <SelectItem value="4">4 (e.g., 1234.5678)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="currencySymbolPosition" className="font-medium">{t("Symbol Position")}</Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="h-4 w-4 text-muted-foreground" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{t("Where to place the currency symbol")}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    type="button"
                                                    variant={currencySettings.currencySymbolPosition === 'before' ? "default" : "outline"}
                                                    className="justify-center"
                                                    onClick={() => handleCurrencySettingsChange('currencySymbolPosition', 'before')}
                                                >
                                                    <span className="mr-2">$</span>100
                                                    {currencySettings.currencySymbolPosition === 'before' && (
                                                        <Check className="h-4 w-4 ml-2" />
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={currencySettings.currencySymbolPosition === 'after' ? "default" : "outline"}
                                                    className="justify-center"
                                                    onClick={() => handleCurrencySettingsChange('currencySymbolPosition', 'after')}
                                                >
                                                    100<span className="ml-2">$</span>
                                                    {currencySettings.currencySymbolPosition === 'after' && (
                                                        <Check className="h-4 w-4 ml-2" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="decimalSeparator" className="font-medium">{t("Decimal Separator")}</Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="h-4 w-4 text-muted-foreground" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{t("Character used to separate decimal places")}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    type="button"
                                                    variant={currencySettings.decimalSeparator === '.' ? "default" : "outline"}
                                                    className="justify-center"
                                                    onClick={() => handleCurrencySettingsChange('decimalSeparator', '.')}
                                                >
                                                    {t("Dot")} (123.45)
                                                    {currencySettings.decimalSeparator === '.' && (
                                                        <Check className="h-4 w-4 ml-2" />
                                                    )}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant={currencySettings.decimalSeparator === ',' ? "default" : "outline"}
                                                    className="justify-center"
                                                    onClick={() => handleCurrencySettingsChange('decimalSeparator', ',')}
                                                >
                                                    {t("Comma")} (123,45)
                                                    {currencySettings.decimalSeparator === ',' && (
                                                        <Check className="h-4 w-4 ml-2" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="thousandsSeparator" className="font-medium">{t("Thousands Separator")}</Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="h-4 w-4 text-muted-foreground" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{t("Character used to group thousands")}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Select
                                                value={currencySettings.thousandsSeparator}
                                                onValueChange={(value) => handleCurrencySettingsChange('thousandsSeparator', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t("Select thousands separator")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value=",">Comma (1,234.56)</SelectItem>
                                                    <SelectItem value=".">Dot (1.234,56)</SelectItem>
                                                    <SelectItem value=" ">Space (1 234.56)</SelectItem>
                                                    <SelectItem value="none">None (123456.78)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-3 border rounded-md p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="floatNumber" className="font-medium">{t("Show Decimals")}</Label>
                                                    <p className="text-xs text-muted-foreground mt-1">{t("Display decimal places in amounts")}</p>
                                                </div>
                                                <Switch
                                                    id="floatNumber"
                                                    checked={currencySettings.floatNumber}
                                                    onCheckedChange={(checked) => handleCurrencySettingsChange('floatNumber', checked)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 border rounded-md p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="currencySymbolSpace" className="font-medium">{t("Add Space")}</Label>
                                                    <p className="text-xs text-muted-foreground mt-1">{t("Space between amount and symbol")}</p>
                                                </div>
                                                <Switch
                                                    id="currencySymbolSpace"
                                                    checked={currencySettings.currencySymbolSpace}
                                                    onCheckedChange={(checked) => handleCurrencySettingsChange('currencySymbolSpace', checked)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </SettingsSection>
    );
}