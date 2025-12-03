import { useEffect, useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { usePage, router } from '@inertiajs/react';
import ReactCountryFlag from 'react-country-flag';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  name: string;
  countryCode?: string;
}

interface PageProps {
  languages: Language[];
  defaultLang: string;
  defaultData: Record<string, string>;
  [key: string]: any; // Fix for Inertia PageProps constraint
}

export default function ManageLanguagePage() {
  const { t } = useTranslation();
  const { languages, defaultLang, defaultData } = usePage<PageProps>().props;
  
  // Initialize selectedLang from props
  const [selectedLang, setSelectedLang] = useState(defaultLang);
  const [labels, setLabels] = useState<{ [key: string]: string }>(defaultData);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  
  // Update selectedLang when defaultLang changes (from Inertia navigation)
  useEffect(() => {
    setSelectedLang(defaultLang);
  }, [defaultLang]);

  // Load language data from backend when component mounts or language changes
  useEffect(() => {
    // If defaultData is already available for the current language, use it
    if (selectedLang === defaultLang && Object.keys(defaultData).length > 0) {
      setLabels(defaultData);
      return;
    }
    
    setLoading(true);
    fetch(`${route('language.load')}?lang=${selectedLang}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setLabels(res.data);
        } else {
          setLabels({});
        }
        setLoading(false);
      })
      .catch(() => {
        setLabels({});
        setLoading(false);
        toast.error(t('Failed to load language file'));
      });
  }, [selectedLang, defaultLang, defaultData, t]);

  const handleLabelChange = (key: string, value: string) => {
    setLabels((prev) => ({ ...prev, [key]: value }));
  };

  // Save language data to backend
  const handleSave = (e) => {
    // Prevent default form submission behavior
    if (e) e.preventDefault();
    
    setSaving(true);
    
    // Use fetch instead of Inertia to prevent page refresh
    fetch(route('language.save'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Add this to ensure Laravel detects AJAX request
      },
      body: JSON.stringify({ 
        _method: 'PATCH', // Laravel method spoofing for PATCH
        lang: selectedLang, 
        data: labels 
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        toast.success(data.success || t('Language updated successfully'));
      } else if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(t('Language updated successfully'));
      }
      setSaving(false);
    })
    .catch(error => {
      console.error('Save error:', error);
      toast.error(t('Failed to update language file'));
      setSaving(false);
    });
    
    // Return false to prevent any form submission
    return false;
  };

  return (
    <PageTemplate title={t('Manage Language')} url="/manage-language">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar: Language List */}
        <div className="md:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className="pr-4 space-y-1">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant="ghost"
                    className={cn('w-full justify-start', {
                      'bg-muted font-medium': selectedLang === lang.code,
                    })}
                    onClick={() => {
                      if (selectedLang !== lang.code) {
                        // Navigate to the language page using Inertia
                        router.get(route('manage-language', { lang: lang.code }));
                      }
                    }}
                  >
                    {lang.countryCode && (
                      <ReactCountryFlag
                        countryCode={lang.countryCode}
                        svg
                        style={{ width: '1.2em', height: '1.2em' }}
                      />
                    )}
                    {lang.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        {/* Main Content: Language Labels */}
        <div className="flex-1">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
              <h2 className="text-lg font-semibold">{t('Edit Labels for')} {languages.find(l => l.code === selectedLang)?.name}</h2>
              <Input
                placeholder={t('Search labels...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full md:w-72"
              />
            </div>
            {loading ? (
              <div>{t('Loading...')}</div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSave(e); return false; }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(labels)
                      .filter(([key, value]) =>
                        key.toLowerCase().includes(search.toLowerCase()) ||
                        value.toLowerCase().includes(search.toLowerCase())
                      )
                      .map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1">
                          <label className="text-xs text-muted-foreground truncate mb-1">{key}</label>
                          <Input
                            className="w-full"
                            value={value}
                            onChange={e => handleLabelChange(key, e.target.value)}
                          />
                        </div>
                      ))}
                  </div>
                  <div className="pt-6 text-right">
                    <Button 
                      type="submit" 
                      disabled={saving}
                    >
                      {saving ? (
                        <span className="flex items-center gap-2"><span className="animate-spin h-4 w-4 border-2 border-t-transparent border-primary rounded-full"></span>{t('Saving...')}</span>
                      ) : t('Save Changes')}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
} 