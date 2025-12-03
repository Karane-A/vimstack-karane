import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Type, Image, Trash2, Plus, Search } from 'lucide-react';
import MediaPicker from '@/components/MediaPicker';
import TemplatePreviewCard from './components/TemplatePreviewCard';
import TemplateListItem from './components/TemplateListItem';
import { isSectionEnabled } from '@/utils/sectionHelpers';

interface TemplatesSectionProps {
  data: any;
  setData: any;
  errors: any;
  handleInputChange: any;
  getSectionData: (key: string) => any;
  updateSectionData: (key: string, updates: any) => void;
  updateSectionVisibility: (sectionKey: string, visible: boolean) => void;
  t: (key: string) => string;
}

// List of all available templates
const availableTemplates = [
  { name: 'freelancer', category: 'professional' },
  { name: 'doctor', category: 'medical' },
  { name: 'restaurant', category: 'food' },
  { name: 'realestate', category: 'business' },
  { name: 'fitness', category: 'health' },
  { name: 'photography', category: 'creative' },
  { name: 'lawfirm', category: 'professional' },
  { name: 'cafe', category: 'food' },
  { name: 'salon', category: 'beauty' },
  { name: 'construction', category: 'business' },
  { name: 'eventplanner', category: 'services' },
  { name: 'ecommerce', category: 'business' },
  { name: 'travel', category: 'leisure' },
  { name: 'gym', category: 'health' },
  { name: 'bakery', category: 'food' },
  { name: 'fitness-studio', category: 'health' },
  { name: 'tech-startup', category: 'technology' },
  { name: 'wedding-planner', category: 'services' },
  { name: 'music-artist', category: 'creative' },
  { name: 'pet-care', category: 'services' },
  { name: 'digital-marketing', category: 'business' },
  { name: 'automotive', category: 'business' },
  { name: 'beauty-cosmetics', category: 'beauty' },
  { name: 'food-delivery', category: 'food' },
  { name: 'home-services', category: 'services' },
  { name: 'personal-trainer', category: 'health' },
  { name: 'consulting', category: 'professional' },
  { name: 'graphic-design', category: 'creative' },
  { name: 'yoga-wellness', category: 'health' },
  { name: 'podcast-creator', category: 'creative' },
  { name: 'gaming-streamer', category: 'entertainment' },
  { name: 'life-coach', category: 'professional' },
  { name: 'veterinarian', category: 'medical' },
  { name: 'architect-designer', category: 'creative' }
];

export default function TemplatesSection({
  data,
  setData,
  errors,
  handleInputChange,
  getSectionData,
  updateSectionData,
  updateSectionVisibility,
  t
}: TemplatesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8); // Initially show 8 templates
  
  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    return availableTemplates.filter(template => 
      template && template.name &&
      (selectedCategory === 'all' || template.category === selectedCategory) &&
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedCategory, searchQuery]);
  
  // Get visible templates based on current count
  const visibleTemplates = useMemo(() => {
    return filteredTemplates.slice(0, visibleCount);
  }, [filteredTemplates, visibleCount]);
  
  // Load more templates
  const loadMoreTemplates = useCallback(() => {
    setVisibleCount(prev => prev + 8);
  }, []);
  
  // Get unique categories from available templates
  const categories = ['all', ...new Set(availableTemplates.map(template => template.category))];

  return (
    <div className="space-y-6" data-landing-page="true">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Type className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('Templates Section Content')}</h3>
              <p className="text-sm text-gray-500">{t('Section title and description')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">{t('Enable Section')}</Label>
            <Switch
              checked={isSectionEnabled(data.config_sections, 'templates')}
              onCheckedChange={(checked) => {
                updateSectionVisibility('templates', checked);
              }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-3">
            <Label htmlFor="templates_title">{t('Section Title')}</Label>
            <Input
              id="templates_title"
              value={getSectionData('templates').title || ''}
              onChange={(e) => updateSectionData('templates', { title: e.target.value })}
              placeholder={t("Explore Our Templates")}
              disabled={!isSectionEnabled(data.config_sections, 'templates')}
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="templates_subtitle">{t('Section Subtitle')}</Label>
            <Textarea
              id="templates_subtitle"
              value={getSectionData('templates').subtitle || ''}
              onChange={(e) => updateSectionData('templates', { subtitle: e.target.value })}
              placeholder={t("Choose from our professionally designed templates...")}
              rows={3}
              disabled={!isSectionEnabled(data.config_sections, 'templates')}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="templates_layout">{t('Layout Style')}</Label>
              <select
                id="templates_layout"
                value={getSectionData('templates').layout || 'grid'}
                onChange={(e) => updateSectionData('templates', { layout: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="grid">Grid</option>
                <option value="carousel">Carousel</option>
                <option value="list">List</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="templates_columns">{t('Number of Columns')}</Label>
              <select
                id="templates_columns"
                value={getSectionData('templates').columns || 3}
                onChange={(e) => updateSectionData('templates', { columns: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value={1}>1 Column</option>
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="templates_background_color">{t('Background Color')}</Label>
              <div className="flex gap-2">
                <Input
                  id="templates_background_color"
                  type="color"
                  value={getSectionData('templates').background_color || '#f8fafc'}
                  onChange={(e) => updateSectionData('templates', { background_color: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={getSectionData('templates').background_color || '#f8fafc'}
                  onChange={(e) => updateSectionData('templates', { background_color: e.target.value })}
                  placeholder="#f8fafc"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Image className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t('Template Selection')}</h3>
              <p className="text-sm text-gray-500">{t('Select templates to display in this section')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {t('Selected')}: {Array.isArray(getSectionData('templates').templates_list) ? getSectionData('templates').templates_list.length : 0}
            </span>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <Button 
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'text-white' : ''}
                style={selectedCategory === category ? { backgroundColor: '#10b981' } : {}}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("Search templates...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleTemplates.map(template => {
                const templatesList = Array.isArray(getSectionData('templates').templates_list) ? 
                  getSectionData('templates').templates_list : [];
                  
                const isSelected = templatesList.some(
                  (t: any) => t && t.name && template.name && t.name === template.name
                );
                
                return (
                  <TemplatePreviewCard
                    key={template.name}
                    template={template}
                    isSelected={isSelected}
                    previewButtonText={t('Preview')}
                    onClick={() => {
                      const templatesList = Array.isArray(getSectionData('templates').templates_list) ? 
                        getSectionData('templates').templates_list : [];
                      const currentTemplates = [...templatesList];
                      
                      if (isSelected) {
                        // Remove template if already selected
                        const newTemplates = currentTemplates.filter((t: any) => t.name !== template.name);
                        updateSectionData('templates', { templates_list: newTemplates });
                      } else {
                        // Add template if not selected
                        updateSectionData('templates', { 
                          templates_list: [...currentTemplates, { name: template.name, category: template.category }]
                        });
                      }
                    }}
                  />
                );
              })}
          </div>
          
          {/* Load More Button */}
          {filteredTemplates.length > visibleCount && (
            <div className="mt-4 text-center">
              <Button
                type="button"
                variant="outline"
                className="border-2"
                style={{ color: '#10b981', borderColor: '#10b981' }}
                onClick={loadMoreTemplates}
              >
                {t('Load More Templates')}
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-3">{t('Selected Templates')}</h4>
          <div className="space-y-2">
            {!Array.isArray(getSectionData('templates').templates_list) || getSectionData('templates').templates_list.length === 0 ? (
              <p className="text-sm text-gray-500">{t('No templates selected. Click on templates above to select them.')}</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {(Array.isArray(getSectionData('templates').templates_list) ? getSectionData('templates').templates_list : [])
                  .filter((template: any) => template && template.name)
                  .map((template: any, index: number) => (
                  <TemplateListItem
                    key={index}
                    template={template}
                    onRemove={() => {
                      const newTemplates = (getSectionData('templates').templates_list || []).filter((_: any, i: number) => i !== index);
                      updateSectionData('templates', { templates_list: newTemplates });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Type className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('Call to Action')}</h3>
            <p className="text-sm text-gray-500">{t('Add a call-to-action button to view all templates')}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label htmlFor="templates_cta_text">{t('CTA Button Text')}</Label>
            <Input
              id="templates_cta_text"
              value={getSectionData('templates').cta_text || ''}
              onChange={(e) => updateSectionData('templates', { cta_text: e.target.value })}
              placeholder={t("View All Templates")}
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="templates_cta_link">{t('CTA Button Link')}</Label>
            <Input
              id="templates_cta_link"
              value={getSectionData('templates').cta_link || ''}
              onChange={(e) => updateSectionData('templates', { cta_link: e.target.value })}
              placeholder="/templates"
            />
          </div>
        </div>
      </div>
    </div>
  );
}