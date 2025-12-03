import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Layout, Type, Image, Users, BarChart3, Trash2, Plus } from 'lucide-react';
import MediaPicker from '@/components/MediaPicker';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';

export default function AboutSection({ data, setData, errors, handleInputChange, getSectionData, updateSectionData, updateSectionVisibility, t = (key) => key }) {
  const { themeColor, customColor } = useBrand();
  const brandColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
  
  // Helper function to convert full URL to relative path for database storage
  const convertToRelativePath = (url: string): string => {
    if (!url) return url;
    if (!url.startsWith('http')) return url;
    const storageIndex = url.indexOf('/storage/');
    return storageIndex !== -1 ? url.substring(storageIndex) : url;
  };
  
  // Helper function to convert relative path to full URL for display
  const getDisplayUrl = (path: string): string => {
    if (!path) return path;
    if (path.startsWith('http')) return path;
    return `${window.appSettings.baseUrl}${path}`;
  };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Layout className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{t("About Layout")}</h3>
              <p className="text-sm text-gray-500">{t("Configure about section layout and positioning")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm">{t("Enable Section")}</Label>
            <Switch
              checked={data.config_sections?.section_visibility?.about !== false}
              onCheckedChange={(checked) => updateSectionVisibility('about', checked)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label htmlFor="about_layout">{t("Layout Style")}</Label>
            <select
              id="about_layout"
              name="about_layout"
              value={getSectionData('about').layout || 'image-right'}
              onChange={(e) => updateSectionData('about', { layout: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="image-right">{t("Content Left, Image Right")}</option>
              <option value="image-left">{t("Image Left, Content Right")}</option>
              <option value="centered">{t("Centered Content")}</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="about_image_position">{t("Image Position")}</Label>
            <select
              id="about_image_position"
              name="about_image_position"
              value={getSectionData('about').image_position || 'right'}
              onChange={(e) => updateSectionData('about', { image_position: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="right">{t("Right Side")}</option>
              <option value="left">{t("Left Side")}</option>
              <option value="background">{t("Background")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Type className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t("About Content")}</h3>
            <p className="text-sm text-gray-500">{t("About section title, description and story")}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-3">
            <Label htmlFor="about_title">{t("About Title")}</Label>
            <Input
              id="about_title"
              name="about_title"
              value={getSectionData('about').title || ''}
              onChange={(e) => updateSectionData('about', { title: e.target.value })}
              placeholder={t("About section title")}
            />
            {errors.about_title && (
              <p className="text-red-600 text-sm">{errors.about_title}</p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="about_description">{t("About Description")}</Label>
            <Textarea
              id="about_description"
              name="about_description"
              value={getSectionData('about').description || ''}
              onChange={(e) => updateSectionData('about', { description: e.target.value })}
              placeholder={t("Tell visitors about your company")}
              rows={4}
            />
            {errors.about_description && (
              <p className="text-red-600 text-sm">{errors.about_description}</p>
            )}
          </div>
          

          <div className="space-y-3">
            <Label htmlFor="about_story_title">{t("Story Title")}</Label>
            <Input
              id="about_story_title"
              name="about_story_title"
              value={getSectionData('about').story_title || ''}
              onChange={(e) => updateSectionData('about', { story_title: e.target.value })}
              placeholder={t("Empowering Professional Connections Since 2020")}
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="about_story_content">{t("Story Content")}</Label>
            <Textarea
              id="about_story_content"
              name="about_story_content"
              value={getSectionData('about').story_content || ''}
              onChange={(e) => updateSectionData('about', { story_content: e.target.value })}
              placeholder={t("Founded by a team of networking enthusiasts...")}
              rows={4}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Image className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t("About Image & Style")}</h3>
            <p className="text-sm text-gray-500">{t("Images, colors and visual effects")}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <MediaPicker
              label={t("About Image")}
              value={getDisplayUrl(getSectionData('about').image || '')}
              onChange={(value) => {
                updateSectionData('about', { image: convertToRelativePath(value) });
              }}
              placeholder={t("Select about section image...")}
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="about_background_color">{t("Background Color")}</Label>
            <div className="flex gap-2">
              <Input
                id="about_background_color"
                name="about_background_color"
                type="color"
                value={getSectionData('about').background_color || '#f9fafb'}
                onChange={(e) => updateSectionData('about', { background_color: e.target.value })}
                className="w-16 h-10 p-1"
              />
              <Input
                value={getSectionData('about').background_color || '#f9fafb'}
                onChange={(e) => updateSectionData('about', { background_color: e.target.value })}
                placeholder="#f9fafb"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="about_parallax">{t("Parallax Effect")}</Label>
              <Switch
                id="about_parallax"
                name="about_parallax"
                checked={getSectionData('about').parallax || false}
                onCheckedChange={(checked) => updateSectionData('about', { parallax: checked })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Enable parallax scrolling effect")}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t("About Statistics")}</h3>
            <p className="text-sm text-gray-500">{t("Key metrics and achievements")}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {(getSectionData('about').stats || []).map((stat, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                  {t("Statistic")} {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => {
                    const newStats = (getSectionData('about').stats || []).filter((_, i) => i !== index);
                    updateSectionData('about', { stats: newStats });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-3">
                  <Label htmlFor={`about_stat_${index}_value`}>{t("Value")}</Label>
                  <Input
                    id={`about_stat_${index}_value`}
                    value={stat.value || ''}
                    onChange={(e) => {
                      const newStats = [...(getSectionData('about').stats || [])];
                      newStats[index] = { ...newStats[index], value: e.target.value };
                      updateSectionData('about', { stats: newStats });
                    }}
                    placeholder={t("4+ Years")}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor={`about_stat_${index}_label`}>{t("Label")}</Label>
                  <Input
                    id={`about_stat_${index}_label`}
                    value={stat.label || ''}
                    onChange={(e) => {
                      const newStats = [...(getSectionData('about').stats || [])];
                      newStats[index] = { ...newStats[index], label: e.target.value };
                      updateSectionData('about', { stats: newStats });
                    }}
                    placeholder={t("Experience")}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor={`about_stat_${index}_color`}>Color</Label>
                  <div className="flex gap-2">
                    <select
                      id={`about_stat_${index}_color`}
                      value={stat.color || 'blue'}
                      onChange={(e) => {
                        const newStats = [...(getSectionData('about').stats || [])];
                        newStats[index] = { ...newStats[index], color: e.target.value };
                        updateSectionData('about', { stats: newStats });
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                      <option value="red">Red</option>
                      <option value="yellow">Yellow</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            className="w-full border-2"
            style={{ color: brandColor, borderColor: brandColor }}
            onClick={() => {
              const newStats = [...(getSectionData('about').stats || []), { value: '', label: '', color: 'blue' }];
              updateSectionData('about', { stats: newStats });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('Add Statistic')}
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Users className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t("About Values")}</h3>
            <p className="text-sm text-gray-500">{t("Company values and mission statements")}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {(getSectionData('about').values || []).map((value, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                  {t("Value")} {index + 1}
                </h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={() => {
                    const newValues = (getSectionData('about').values || []).filter((_, i) => i !== index);
                    updateSectionData('about', { values: newValues });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <Label htmlFor={`about_value_${index}_title`}>{t("Title")}</Label>
                  <Input
                    id={`about_value_${index}_title`}
                    value={value.title || ''}
                    onChange={(e) => {
                      const newValues = [...(getSectionData('about').values || [])];
                      newValues[index] = { ...newValues[index], title: e.target.value };
                      updateSectionData('about', { values: newValues });
                    }}
                    placeholder="Our Mission"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor={`about_value_${index}_icon`}>{t("Icon")}</Label>
                  <select
                    id={`about_value_${index}_icon`}
                    value={value.icon || 'target'}
                    onChange={(e) => {
                      const newValues = [...(getSectionData('about').values || [])];
                      newValues[index] = { ...newValues[index], icon: e.target.value };
                      updateSectionData('about', { values: newValues });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="target">Target</option>
                    <option value="heart">Heart</option>
                    <option value="award">Award</option>
                    <option value="lightbulb">Lightbulb</option>
                    <option value="star">Star</option>
                    <option value="shield">Shield</option>
                    <option value="users">Users</option>
                    <option value="zap">Zap</option>
                  </select>
                </div>
                
                <div className="space-y-3 md:col-span-1">
                  <Label htmlFor={`about_value_${index}_description`}>{t("Description")}</Label>
                  <Textarea
                    id={`about_value_${index}_description`}
                    value={value.description || ''}
                    onChange={(e) => {
                      const newValues = [...(getSectionData('about').values || [])];
                      newValues[index] = { ...newValues[index], description: e.target.value };
                      updateSectionData('about', { values: newValues });
                    }}
                    placeholder="To revolutionize professional networking..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            className="w-full border-2"
            style={{ color: brandColor, borderColor: brandColor }}
            onClick={() => {
              const newValues = [...(getSectionData('about').values || []), { title: '', description: '', icon: 'target' }];
              updateSectionData('about', { values: newValues });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('Add Value')}
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Image className="h-5 w-5 text-pink-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t("Image Section")}</h3>
            <p className="text-sm text-gray-500">{t("Image overlay content and icons")}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <Label htmlFor="about_image_title">{t("Image Title")}</Label>
            <Input
              id="about_image_title"
              name="about_image_title"
              value={getSectionData('about').image_title || ''}
              onChange={(e) => updateSectionData('about', { image_title: e.target.value })}
              placeholder="Innovation Driven"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="about_image_subtitle">{t("Image Subtitle")}</Label>
            <Input
              id="about_image_subtitle"
              name="about_image_subtitle"
              value={getSectionData('about').image_subtitle || ''}
              onChange={(e) => updateSectionData('about', { image_subtitle: e.target.value })}
              placeholder="Building the future of networking"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="about_image_icon">{t("Image Icon")}</Label>
            <Input
              id="about_image_icon"
              name="about_image_icon"
              value={getSectionData('about').image_icon || ''}
              onChange={(e) => updateSectionData('about', { image_icon: e.target.value })}
              placeholder="🚀"
              maxLength={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}